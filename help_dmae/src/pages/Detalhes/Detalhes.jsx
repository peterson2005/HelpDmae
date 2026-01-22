import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Box, Grid, Paper, Typography, Chip, Divider,
    Stack, Avatar, Button, TextField, Container, IconButton
} from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import SendIcon from '@mui/icons-material/Send';


export default function DetalhesChamado() {
    const { id } = useParams();
    const [chamado, setChamado] = useState(null);

    useEffect(() => {
        const buscarNoBanco = async () => {
            try {
                const resposta = await axios.get(`http://localhost:5000/chamados/${id}`);
                setChamado(resposta.data);
            } catch (error) {
                console.error("Erro ao buscar dados:", error);
            }
        };
        if (id) buscarNoBanco();
    }, [id]);

    if (!chamado) {
        return <Box sx={{ p: 4 }}><Typography>Carregando...</Typography></Box>;
    }

    return (
        <Box sx={{ backgroundColor: "#eef2f6", minHeight: "100vh", py: 6 }}>
        <Container maxWidth="lg">
            <Paper sx={{ borderRadius: 8, p: 4, boxShadow: '0px 10px 30px rgba(0,0,0,0.05)' }}>
                {/* Cabeçalho com ID e Status Dinâmico */}
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                    <Typography variant="h4" fontWeight="800" color="#1e293b">
                        Chamado #{chamado.id}
                    </Typography>
                    <Chip 
                        label={chamado.status_nome} 
                        sx={{ 
                            backgroundColor: chamado.status_cor || "#1976d2", 
                            color: "#fff", 
                            fontWeight: "bold",
                            fontSize: "1rem" 
                        }} 
                    />
                </Stack>

                <Divider sx={{ mb: 3 }} />

                {/* Título do Chamado */}
                <Typography variant="h5" fontWeight="700" color="#334155" gutterBottom>
                    {chamado.titulo}
                </Typography>

                {/* Descrição em um Paper cinza para destacar */}
                <Box sx={{ bgcolor: "#f8fafc", p: 3, borderRadius: 4, mt: 2 }}>
                    <Typography variant="subtitle2" color="#64748b" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <DescriptionIcon fontSize="small" /> Descrição:
                    </Typography>
                    <Typography variant="body1" color="#1e293b" sx={{ lineHeight: 1.8 }}>
                        {chamado.descricao || "Nenhuma descrição fornecida."}
                    </Typography>
                </Box>
            </Paper>
        </Container>
    </Box>
    );
}