const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// ==========================================
//            ROTAS DE LOGIN
// ==========================================

app.post('/login', async (req, res) => {
  try {
    const { matricula, senha } = req.body;
    const result = await pool.query(
      'SELECT id, nome, senha, cargo, unidade, setor, ramal, perfil_id FROM usuarios WHERE matricula = $1',
      [matricula]
    );

    const usuario = result.rows[0];
    if (!usuario) return res.status(401).json({ error: 'Matrícula ou senha inválidos' });

    const senhaValida = (senha === usuario.senha);
    if (!senhaValida) return res.status(401).json({ error: 'Matrícula ou senha inválidos' });

    res.json({
      message: 'Login realizado com sucesso!',
      user: {
        id: usuario.id,
        nome: usuario.nome,
        perfil_id: usuario.perfil_id,
        setor: usuario.setor,
        unidade: usuario.unidade,
        cargo: usuario.cargo,
        ramal: usuario.ramal
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
});

// ==========================================
//            ROTAS DE USUÁRIOS
// ==========================================

// 1. LISTAR TÉCNICOS (Deve vir antes do :id para não confundir o Express)
app.get('/usuarios/tecnicos', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, nome FROM usuarios WHERE perfil_id IN (2, 3) ORDER BY nome ASC'
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar técnicos: " + err.message });
  }
});

// 2. LISTAR TODOS OS USUÁRIOS
app.get('/usuarios', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, matricula, nome, cargo, ramal, setor, unidade, perfil_id FROM usuarios ORDER BY nome ASC'
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar usuários: ' + err.message });
  }
});

// 3. BUSCAR USUÁRIO POR ID (Genérica - sempre depois das fixas)
app.get('/usuarios/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT id, matricula, nome, cargo, ramal, setor, unidade, perfil_id FROM usuarios WHERE id = $1',
      [id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Usuário não encontrado" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. CADASTRAR USUÁRIO
app.post('/usuarios', async (req, res) => {
  try {
    const { matricula, nome, senha, cargo, ramal, setor, unidade, perfil_id } = req.body;
    const querySQL = `
      INSERT INTO usuarios (matricula, nome, senha, cargo, ramal, setor, unidade, perfil_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id, nome
    `;
    const result = await pool.query(querySQL, [matricula, nome, senha, cargo, ramal, setor, unidade, perfil_id]);
    res.status(201).json({ message: 'Usuário criado!', user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar usuário: ' + err.message });
  }
});

// 5. ATUALIZAR USUÁRIO
app.put('/usuarios/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, cargo, ramal, setor, unidade, perfil_id } = req.body;
    const querySQL = `
      UPDATE usuarios SET nome = $1, cargo = $2, ramal = $3, setor = $4, unidade = $5, perfil_id = $6
      WHERE id = $7
    `;
    await pool.query(querySQL, [nome, cargo, ramal, setor, unidade, perfil_id, id]);
    res.json({ message: 'Usuário atualizado com sucesso!' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar: ' + err.message });
  }
});

// 6. ATUALIZAR SENHA
app.patch('/usuarios/:id/senha', async (req, res) => {
  try {
    const { id } = req.params;
    const { senha } = req.body;
    await pool.query('UPDATE usuarios SET senha = $1 WHERE id = $2', [senha, id]);
    res.json({ message: "Senha atualizada!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 7. DELETAR USUÁRIO
app.delete('/usuarios/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM usuarios WHERE id = $1', [req.params.id]);
    res.json({ message: 'Usuário removido!' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao excluir usuário' });
  }
});


app.put('/usuarios/:id/perfil', async (req, res) => {
    const { id } = req.params;
    const { nome, cargo, setor, ramal, unidade } = req.body;

    try {
        const result = await pool.query(
            `UPDATE usuarios 
             SET nome = $1, cargo = $2, setor = $3, ramal = $4, unidade = $5 
             WHERE id = $6 RETURNING id, nome, matricula, cargo, setor, ramal, unidade, perfil_id`,
            [nome, cargo, setor, ramal, unidade, id]
        );

        res.json({ 
            message: "Perfil atualizado!", 
            usuario: result.rows[0] 
        });
    } catch (err) {
        res.status(500).json({ error: "Erro interno ao salvar" });
    }
});


app.patch('/usuarios/:id/senha-config', async (req, res) => {
  const { id } = req.params;
  const { senhaAtual, novaSenha } = req.body;

  try {
    // 1. Busca a senha atual no banco
    const user = await pool.query('SELECT senha FROM usuarios WHERE id = $1', [id]);
    
    if (user.rows[0].senha !== senhaAtual) {
      return res.status(401).json({ error: "A senha atual está incorreta." });
    }

    // 2. Atualiza para a nova senha
    await pool.query('UPDATE usuarios SET senha = $1 WHERE id = $2', [novaSenha, id]);
    
    res.json({ message: "Senha atualizada com sucesso!" });
  } catch (err) {
    res.status(500).json({ error: "Erro ao atualizar senha." });
  }
});

// ==========================================
//            ROTAS DE CHAMADOS
// ==========================================

// 1. ESTATÍSTICAS DASHBOARD
app.get('/dashboard/stats', async (req, res) => {
  try {
    const stats = await pool.query(`
      SELECT COUNT(*) as total,
      COUNT(*) FILTER (WHERE status_id = 1) as abertos,
      COUNT(*) FILTER (WHERE status_id = 3) as finalizados
      FROM chamados
    `);
    res.json(stats.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. LISTAGEM DE CHAMADOS (Com filtros)
app.get('/chamados', async (req, res) => {
  try {
    const { usuario_id, perfil_id } = req.query;
    let querySQL = `
      SELECT c.id, c.titulo, c.solicitante_nome, s.nome AS status, s.cor_hex AS cor,
      TO_CHAR(c.data_abertura, 'DD/MM/YYYY') AS data
      FROM chamados c
      JOIN status_chamado s ON c.status_id = s.id
    `;
    const valores = [];
    if (perfil_id == 1) {
      querySQL += ` WHERE c.usuario_id = $1`;
      valores.push(usuario_id);
    }
    querySQL += ` ORDER BY c.id DESC`;
    const result = await pool.query(querySQL, valores);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. DETALHES DO CHAMADO
app.get('/chamados/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      SELECT c.*, s.nome AS status_nome, cat.nome AS categoria_nome, u.nome AS tecnico_nome
      FROM chamados c
      LEFT JOIN status_chamado s ON c.status_id = s.id
      LEFT JOIN categorias cat ON c.categoria_id = cat.id
      LEFT JOIN usuarios u ON c.tecnico_id = u.id
      WHERE c.id = $1
    `, [id]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. CRIAÇÃO DE CHAMADO
app.post('/chamados', async (req, res) => {
  try {
    const {
      titulo, descricao, tipo, impacto, usuario_id, categoria_id,
      solicitante_nome, solicitante_cargo, solicitante_setor,
      solicitante_unidade, solicitante_ramal
    } = req.body;

    const querySQL = `
      INSERT INTO chamados (
        titulo, descricao, tipo, impacto, usuario_id, categoria_id, 
        solicitante_nome, solicitante_cargo, solicitante_setor, 
        solicitante_unidade, solicitante_ramal, status_id, data_abertura
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 1, NOW()) RETURNING *`;

    const valores = [titulo, descricao, tipo, impacto, usuario_id, categoria_id, solicitante_nome, solicitante_cargo, solicitante_setor, solicitante_unidade, solicitante_ramal];
    const result = await pool.query(querySQL, valores);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. ATRIBUIR TÉCNICO
app.put('/chamados/:id/atribuir', async (req, res) => {
  try {
    const { id } = req.params;
    const { tecnico_id, status_id } = req.body;
    await pool.query(
      'UPDATE chamados SET tecnico_id = $1, status_id = $2 WHERE id = $3',
      [tecnico_id, status_id, id]
    );
    res.json({ message: "Chamado atribuído com sucesso!" });
  } catch (err) {
    res.status(500).json({ error: "Erro ao atribuir: " + err.message });
  }
});

// 6. FINALIZAR CHAMADO
app.put('/chamados/:id/finalizar', async (req, res) => {
  try {
    const { id } = req.params;
    const { solucao, status_id } = req.body;

    const check = await pool.query('SELECT tecnico_id FROM chamados WHERE id = $1', [id]);
    if (!check.rows[0].tecnico_id) {
      return res.status(400).json({ error: "Atribua um técnico antes de finalizar." });
    }

    await pool.query(
      'UPDATE chamados SET solucao = $1, status_id = $2, data_fechamento = NOW() WHERE id = $3',
      [solucao, status_id, id]
    );
    res.json({ message: "Chamado finalizado!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 7. REABRIR CHAMADO
app.put('/chamados/:id/reabrir', async (req, res) => {
  try {
    const { id } = req.params;
    const { status_id } = req.body; // Recebe o novo status (geralmente 2 - Em Atendimento)

    await pool.query(
      'UPDATE chamados SET status_id = $1, data_fechamento = NULL WHERE id = $2',
      [status_id, id]
    );
    
    res.json({ message: "Chamado reaberto com sucesso!" });
  } catch (err) {
    res.status(500).json({ error: "Erro ao reabrir: " + err.message });
  }
});

// ==========================================
//            ROTAS DE INTERAÇÕES
// ==========================================

app.get('/chamados/:id/interacoes', async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await pool.query(
      'SELECT * FROM interacoes WHERE chamado_id = $1 ORDER BY data_interacao DESC', // Alterado para DESC
      [id]
    );
    res.json(resultado.rows);
  } catch (err) {
    res.status(500).send("Erro ao buscar histórico");
  }
});

app.post('/chamados/:id/interacoes', async (req, res) => {
  try {
    const { id } = req.params;
    const { usuario_nome, mensagem } = req.body;
    const result = await pool.query(
      'INSERT INTO interacoes (chamado_id, usuario_nome, mensagem) VALUES ($1, $2, $3) RETURNING *',
      [id, usuario_nome, mensagem]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send("Erro ao salvar comentário");
  }
});

// ==========================================
//            INICIALIZAÇÃO
// ==========================================

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Servidor rodando na porta ${PORT}`);
});