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
    const navigate = useNavigate();

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

        if (id) {
            buscarNoBanco();
        }
    }, [id]);

    return (
        <Box sx={{ backgroundColor: "#eef2f6", minHeight: "100vh", py: 6 }}>
            <Container maxWidth="lg">
                <Paper elevation={0} sx={{ borderRadius: 8, p: 4, bgcolor: '#fff', boxShadow: '0px 10px 30px rgba(0,0,0,0.05)' }}>

                    {/* CABEÇALHO COM STATUS E PRIORIDADE */}
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h4" fontWeight="800" color="#1e293b" gutterBottom>
                            Chamado #2023-0014
                        </Typography>
                        <Stack direction="row" spacing={1}>
                            <Chip label="Status: Concluido" sx={{ bgcolor: '#10b981', color: '#fff', fontWeight: 'bold' }} />
                            <Chip label="Prioridade: Alta" sx={{ bgcolor: '#991b1b', color: '#fff', fontWeight: 'bold' }} />
                        </Stack>
                    </Box>

                    <Grid container spacing={4} alignItems="stretch">
                        {/* COLUNA ESQUERDA: DESCRIÇÃO PRINCIPAL */}
                        <Grid container spacing={4} alignItems="stretch">

                            {/* COLUNA ESQUERDA */}
                            <Grid item xs={12} md={7}>
                                <Box sx={{
                                    bgcolor: '#dfeaf5',
                                    p: 4,
                                    borderRadius: 6,
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column'
                                }}>

                                    {/* 🔹 TÍTULO AO LADO DA COLUNA DIREITA */}
                                    <Typography variant="h5" fontWeight="700" color="#1e293b" sx={{ mb: 2 }}>
                                        Erro Crítico no Sistema ERP
                                    </Typography>

                                    <Typography variant="subtitle1" fontWeight="bold" color="#64748b" sx={{ mb: 1 }}>
                                        Descrição Detalhada
                                    </Typography>

                                    <Typography variant="body1" color="#334155">
                                        Erro Crítico no sistema de gestão. Ao tentar gerar relatórios, o sistema apresenta instabilidade e impede a conclusão dos processos financeiros, afetando a operação da matriz.
                                    </Typography>
                                </Box>
                            </Grid>

                            {/* COLUNA DIREITA */}
                            <Grid item xs={12} md={5}>
                                <Stack spacing={3} sx={{ height: '100%' }}>

                                    <Box>
                                        <Typography variant="h6" fontWeight="bold" color="#1e293b">
                                            Informações de Solicitante
                                        </Typography>

                                        <Typography variant="body2" color="#64748b" sx={{ mt: 1 }}>
                                            <b>Nome:</b> João Silva <br />
                                            <b>Cargo:</b> Analista de Sistemas <br />
                                            <b>Setor:</b> TI <br />
                                            <b>Ramal:</b> 1234
                                        </Typography>
                                    </Box>

                                    <Divider />

                                    <Box>
                                        <Typography variant="h6" fontWeight="bold" color="#1e293b">
                                            Classificação e Impacto
                                        </Typography>

                                        <Typography variant="body2" color="#64748b" sx={{ mt: 1 }}>
                                            <b>Tipo:</b> Incidente <br />
                                            <b>Impacto:</b> Setor
                                        </Typography>
                                    </Box>

                                    <Divider />

                                    <Box>
                                        <Typography variant="h6" fontWeight="bold" color="#1e293b" sx={{ mb: 1 }}>
                                            Anexos
                                        </Typography>

                                        <Stack direction="row" spacing={1} flexWrap="wrap">
                                            <Button startIcon={<DescriptionIcon />} variant="contained" size="small">
                                                log_error1.png
                                            </Button>
                                            <Button startIcon={<DescriptionIcon />} variant="contained" size="small">
                                                screenshot.jpg
                                            </Button>
                                        </Stack>
                                    </Box>

                                </Stack>
                            </Grid>

                        </Grid>

                    </Grid>

                    {/* HISTÓRICO DE ATIVIDADES (PARTE INFERIOR) */}
                    <Box sx={{ mt: 6 }}>
                        <Typography variant="h6" fontWeight="bold" color="#1e293b" sx={{ mb: 3 }}>
                            Histórico de Atividades
                        </Typography>

                        <Stack spacing={2} sx={{ mb: 4 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Typography variant="body2" color="#64748b">🕒 15/05/2024 09:30 - Chamado aberto por João Silva</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Typography variant="body2" color="#64748b">🕒 15/05/2024 10:00 - Atribuído ao Pedro Souza: "Correção aplicada."</Typography>
                            </Box>
                        </Stack>

                        {/* INPUT DE COMENTÁRIO ESTILO IMAGEM */}
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                            <TextField
                                fullWidth
                                size="small"
                                placeholder="Adicionar Comentário"
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                            />
                            <Button
                                variant="contained"
                                sx={{ bgcolor: '#0085db', px: 4, borderRadius: 2, height: '40px', fontWeight: 'bold' }}
                            >
                                Enviar
                            </Button>
                        </Box>
                    </Box>

                </Paper>
            </Container>
        </Box>
    );
}