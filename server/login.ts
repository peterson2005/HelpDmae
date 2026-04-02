
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});


const login = async (matricula: string, senha: string) =>{

 try {
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
}
