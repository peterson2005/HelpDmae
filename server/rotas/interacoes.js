
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
