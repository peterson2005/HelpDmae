
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
      VALUES ($1, $2, crypt($3, gen_salt('bf')), $4, $5, $6, $7, $8) 
      RETURNING id, nome
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
    
    // Atualiza usando hash
    await pool.query(
      "UPDATE usuarios SET senha = crypt($1, gen_salt('bf')) WHERE id = $2", 
      [senha, id]
    );
    
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
    // 1. Verifica se a senha atual bate com o hash do banco
    const user = await pool.query(
      'SELECT id FROM usuarios WHERE id = $1 AND senha = crypt($2, senha)', 
      [id, senhaAtual]
    );
    
    if (user.rows.length === 0) {
      return res.status(401).json({ error: "A senha atual está incorreta." });
    }

    // 2. Atualiza para a nova senha gerando um novo HASH
    await pool.query(
      "UPDATE usuarios SET senha = crypt($1, gen_salt('bf')) WHERE id = $2", 
      [novaSenha, id]
    );
    
    res.json({ message: "Senha atualizada com sucesso!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao atualizar senha." });
  }
});