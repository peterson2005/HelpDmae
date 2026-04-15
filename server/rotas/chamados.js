
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
