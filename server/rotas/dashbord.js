const express = require('express');
const router = express.Router();
const pool = require('../config/db'); // Ajuste o caminho conforme sua conexão com o banco

// Rota para os cards e o gráfico de Pizza (Status)
router.get('/stats', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                COUNT(*) as total,
                COUNT(*) FILTER (WHERE status = 'Aberto') as abertos,
                COUNT(*) FILTER (WHERE status = 'Finalizado') as finalizados
            FROM chamados
        `);
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Rota para o gráfico de Linha (Volume Semanal)
router.get('/semanal', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                TO_CHAR(data_abertura, 'DD/MM') as dia, 
                COUNT(*) as quantidade
            FROM chamados
            WHERE data_abertura > NOW() - INTERVAL '7 days'
            GROUP BY dia, data_abertura
            ORDER BY data_abertura ASC
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Rota para o gráfico de Barras (Top Técnicos)
router.get('/top-tecnicos', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT u.nome, COUNT(c.id) as finalizados
            FROM chamados c
            JOIN usuarios u ON c.tecnico_id = u.id
            WHERE c.status = 'Finalizado'
            AND c.data_fechamento >= date_trunc('month', CURRENT_DATE)
            GROUP BY u.nome
            ORDER BY finalizados DESC
            LIMIT 5
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;