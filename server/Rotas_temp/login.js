

// ==========================================
//            ROTAS DE LOGIN
// ==========================================

app.post('/login', async (req, res) => {
  try {
    const { matricula, senha } = req.body;
    
    // Mudamos a consulta para verificar a senha usando a função crypt do Postgres
    const result = await pool.query(
      `SELECT id, nome, cargo, unidade, setor, ramal, perfil_id 
       FROM usuarios 
       WHERE matricula = $1 
       AND senha = crypt($2, senha)`, 
      [matricula, senha]
    );

    const usuario = result.rows[0];

    // Se o crypt não bater, o result.rows virá vazio
    if (!usuario) {
      return res.status(401).json({ error: 'Matrícula ou senha inválidos' });
    }

    res.json({
      message: 'Login realizado com sucesso!',
      user: usuario
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
});