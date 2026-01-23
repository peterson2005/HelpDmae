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

// 1. ROTA DE LISTAGEM
app.get('/chamados', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT c.id, c.titulo, s.nome AS status, s.cor_hex AS cor,
      TO_CHAR(c.data_abertura, 'DD/MM/YYYY') AS data
      FROM chamados c
      JOIN status_chamado s ON c.status_id = s.id
      ORDER BY c.id DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. ROTA PARA CRIAR CHAMADO (ATUALIZADA)
app.post('/chamados', async (req, res) => {
  try {
    // 1. Desestruturamos TODOS os campos que o React está enviando agora
    const {
      titulo,
      descricao,
      tipo,
      impacto,
      usuario_id,
      categoria_id,
      solicitante_nome,    // Novo
      solicitante_cargo,   // Novo
      solicitante_setor,   // Novo
      solicitante_unidade, // Novo
      solicitante_ramal    // Novo
    } = req.body;

    // 2. Atualizamos o SQL para incluir as novas colunas
    const querySQL = `
      INSERT INTO chamados (
        titulo, descricao, tipo, impacto, usuario_id, categoria_id, 
        solicitante_nome, solicitante_cargo, solicitante_setor, 
        solicitante_unidade, solicitante_ramal, 
        status_id, data_abertura
      ) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 1, NOW()) 
      RETURNING *`;

    // 3. Mapeamos os valores na ordem correta dos cifrões ($1, $2...)
    const valores = [
      titulo,
      descricao,
      tipo,
      impacto,
      usuario_id,
      categoria_id,
      solicitante_nome,
      solicitante_cargo,
      solicitante_setor,
      solicitante_unidade,
      solicitante_ramal
    ];

    const result = await pool.query(querySQL, valores);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Erro no INSERT:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// 3. ROTA DE DETALHES (Ajustada para ler os dados gravados no chamado)
app.get('/chamados/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      SELECT 
        c.*, 
        s.nome AS status_nome, 
        cat.nome AS categoria_nome,
        -- Aqui pegamos os dados que foram salvos NO MOMENTO da abertura
        c.solicitante_nome,
        c.solicitante_setor,
        c.solicitante_cargo,
        c.solicitante_unidade,
        c.solicitante_ramal
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


app.post('/login', async (req, res) => {
  try {
    const { matricula, senha } = req.body;

    // 1. No SELECT, adicionamos: setor e ramal
    const result = await pool.query(
      'SELECT id, nome, senha, cargo, unidade, setor, ramal FROM usuarios WHERE matricula = $1',
      [matricula]
    );

    const usuario = result.rows[0];

    if (!usuario) {
      return res.status(401).json({ error: 'Matrícula ou senha inválidos' });
    }

    // const senhaValida = await bcrypt.compare(senha, usuario.senha);
    const senhaValida = (senha === usuario.senha);

    if (!senhaValida) {
      return res.status(401).json({ error: 'Matrícula ou senha inválidos' });
    }

    // 2. No retorno, incluímos todos os dados que o seu Frontend vai precisar
    res.json({
      message: 'Login realizado com sucesso!',
      user: {
        id: usuario.id,
        nome: usuario.nome,
        cargo: usuario.cargo,
        setor: usuario.setor,      // Adicionado
        unidade: usuario.unidade,
        ramal: usuario.ramal       // Adicionado
      }
    });

  } catch (err) {
    console.error("Erro no Login:", err.message);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
});



// --- ROTAS DE INTERAÇÕES (HISTÓRICO) ---

// 1. Rota para BUSCAR o histórico de um chamado específico
app.get('/chamados/:id/interacoes', async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await pool.query(
      'SELECT * FROM interacoes WHERE chamado_id = $1 ORDER BY data_interacao ASC',
      [id]
    );
    res.json(resultado.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erro ao buscar histórico");
  }
});

// 2. Rota para INSERIR um novo comentário/interação
app.post('/chamados/:id/interacoes', async (req, res) => {
  try {
    const { id } = req.params;
    const { usuario_nome, mensagem } = req.body;

    const novaInteracao = await pool.query(
      'INSERT INTO interacoes (chamado_id, usuario_nome, mensagem) VALUES ($1, $2, $3) RETURNING *',
      [id, usuario_nome, mensagem]
    );

    res.json(novaInteracao.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erro ao salvar comentário");
  }
});






// 4. LIGAR O SERVIDOR (Sempre a última coisa do arquivo)
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Servidor rodando na porta ${PORT}`);
});


