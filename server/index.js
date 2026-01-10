const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Configuração da conexão com o PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// ROTA TESTE: Listar os chamados que você inseriu via SQL
app.get('/chamados', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        c.id, 
        c.titulo, 
        cat.nome AS categoria, 
        s.nome AS status, 
        s.cor_hex AS cor,
        TO_CHAR(c.data_abertura, 'DD/MM/YYYY') AS data -- Formata a data no SQL
      FROM chamados c
      JOIN categorias cat ON c.categoria_id = cat.id
      JOIN status_chamado s ON c.status_id = s.id
      ORDER BY c.data_abertura DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao buscar dados");
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});





// ROTA PARA CRIAR UM NOVO CHAMADO
app.post('/chamados', async (req, res) => {
  try {
    const { titulo, descricao, tipo, impacto, categoria_id, usuario_id } = req.body;

    const novoChamado = await pool.query(
      `INSERT INTO chamados (titulo, descricao, tipo, impacto, usuario_id, categoria_id, status_id) 
       VALUES ($1, $2, $3, $4, $5, $6, 1) -- 1 é o status 'Aberto' por padrão
       RETURNING *`,
      [titulo, descricao, tipo, impacto, usuario_id, categoria_id]
    );

    res.json(novoChamado.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erro ao salvar chamado");
  }
});