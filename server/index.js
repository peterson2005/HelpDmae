const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
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

// --- ROTA DE LOGIN ---
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

    // AQUI É ONDE VOCÊ ADICIONA OS CAMPOS
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


  // --- ROTA DE ESTATÍSTICAS PARA O DASHBOARD ---
app.get('/dashboard/stats', async (req, res) => {
  try {
    const stats = await pool.query(`
      SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE status_id = 1) as abertos,
        COUNT(*) FILTER (WHERE status_id = 3) as finalizados
      FROM chamados
    `);
    res.json(stats.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- ROTA DE LISTAGEM  ---
app.get('/chamados', async (req, res) => {
  try {
    const { usuario_id, perfil_id } = req.query;

    let querySQL = `
      SELECT c.id, c.titulo, c.solicitante_nome, s.nome AS status, s.cor_hex AS cor,
      TO_CHAR(c.data_abertura, 'DD/MM/YYYY') AS data
      FROM chamados c
      JOIN status_chamado s ON c.status_id = s.id
    `;

    // Filtro: Se for perfil 1 (usuário comum), vê só os dele. 
    // Se for 2 (técnico) ou 3 (admin), não entra no IF e vê tudo.
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

// --- ROTA DE DETALHES ---
app.get('/chamados/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      SELECT c.*, s.nome AS status_nome, cat.nome AS categoria_nome
      FROM chamados c
      LEFT JOIN status_chamado s ON c.status_id = s.id
      LEFT JOIN categorias cat ON c.categoria_id = cat.id
      WHERE c.id = $1
    `, [id]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- ROTA PARA LISTAR TODOS OS USUÁRIOS (Usada na Tabela) ---
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

// --- ROTA PARA CADASTRAR NOVO USUÁRIO ---
app.post('/usuarios', async (req, res) => {
  try {
    const { matricula, nome, senha, cargo, ramal, setor, unidade, perfil_id } = req.body;
    
    const querySQL = `
      INSERT INTO usuarios (matricula, nome, senha, cargo, ramal, setor, unidade, perfil_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id, nome
    `;
    
    const valores = [matricula, nome, senha, cargo, ramal, setor, unidade, perfil_id];
    const result = await pool.query(querySQL, valores);
    
    res.status(201).json({ message: 'Usuário criado com sucesso!', user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar usuário: ' + err.message });
  }
});

// --- ROTA PARA DELETAR USUÁRIO ---
app.delete('/usuarios/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM usuarios WHERE id = $1', [id]);
    res.json({ message: 'Usuário removido com sucesso!' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao excluir usuário' });
  }
});




// --- ROTA DE CRIAÇÃO ---
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
        solicitante_unidade, solicitante_ramal, 
        status_id, data_abertura
      ) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 1, NOW()) 
      RETURNING *`;

    const valores = [titulo, descricao, tipo, impacto, usuario_id, categoria_id, solicitante_nome, solicitante_cargo, solicitante_setor, solicitante_unidade, solicitante_ramal];
    const result = await pool.query(querySQL, valores);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- ROTAS DE INTERAÇÕES (HISTÓRICO) ---
app.get('/chamados/:id/interacoes', async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await pool.query(
      'SELECT * FROM interacoes WHERE chamado_id = $1 ORDER BY data_interacao ASC',
      [id]
    );
    res.json(resultado.rows);
  } catch (err) {
    res.status(500).send("Erro ao buscar histórico");
  }
});

// ROTA PARA INSERIR COMENTÁRIO (CORRIGIDA)
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

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Servidor rodando na porta ${PORT}`);
});