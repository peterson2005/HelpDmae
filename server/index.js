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

// 2. ROTA PARA CRIAR CHAMADO (O POST QUE ESTAVA DANDO 404)
app.post('/chamados', async (req, res) => {
  try {
    const { titulo, descricao, tipo, impacto, categoria_id, usuario_id } = req.body;
    
    // Inserindo com os nomes de colunas do seu backup SQL
    const result = await pool.query(
      `INSERT INTO chamados (titulo, descricao, tipo, impacto, usuario_id, categoria_id, status_id, data_abertura) 
       VALUES ($1, $2, $3, $4, $5, $6, 1, NOW()) RETURNING *`,
      [titulo, descricao, tipo, impacto, usuario_id, categoria_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Erro no INSERT:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// 3. ROTA DE DETALHES
app.get('/chamados/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      SELECT c.*, s.nome AS status_nome, u.nome AS solicitante_nome, cat.nome AS categoria_nome
      FROM chamados c
      LEFT JOIN status_chamado s ON c.status_id = s.id
      LEFT JOIN usuarios u ON c.usuario_id = u.id
      LEFT JOIN categorias cat ON c.categoria_id = cat.id
      WHERE c.id = $1
    `, [id]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. LIGAR O SERVIDOR (Sempre a última coisa do arquivo)
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Servidor rodando na porta ${PORT}`);
});