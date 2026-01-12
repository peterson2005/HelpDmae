import React from 'react';
import {
    Box, Grid, Paper, Typography, Chip, Divider,
    Stack, Avatar, Button, TextField, Container
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonIcon from '@mui/icons-material/Person';
import SendIcon from '@mui/icons-material/Send';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useNavigate } from 'react-router-dom';

export default function DetalhesChamado() {
    const navigate = useNavigate();

    return (
        <Box sx={{ backgroundColor: "#f0f2f5", minHeight: "100vh", py: 4 }}>
            <Container maxWidth="xl">

                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate(-1)}
                    sx={{ mb: 2, fontWeight: 'bold', color: '#637381' }}
                >
                    Voltar para a Lista
                </Button>

                <Paper elevation={4} sx={{ borderRadius: 4, overflow: 'hidden', minHeight: '85vh' }}>

                    {/* CABEÇALHO: Título e Data/Hora */}
                    <Box sx={{ p: 4, borderBottom: '1px solid #eee', bgcolor: '#fff' }}>
                        <Grid container justifyContent="space-between" alignItems="center">
                            <Grid item xs={12} md={8}>
                                <Typography variant="caption" color="primary" fontWeight="bold" sx={{ letterSpacing: 1 }}>
                                    CHAMADO #2024-0014
                                </Typography>
                                <Typography variant="h4" fontWeight="800" color="#1c252e" sx={{ my: 1 }}>
                                    Erro Crítico no Sistema ERP
                                </Typography>
                                <Stack direction="row" spacing={2} alignItems="center" color="text.secondary">
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <AccessTimeIcon fontSize="small" />
                                        <Typography variant="body2">Aberto em: <b>12/01/2026</b> às <b>14:30</b></Typography>
                                    </Box>
                                    <Chip label="EM ATENDIMENTO" size="small" sx={{ bgcolor: '#fff3e0', color: '#ff9800', fontWeight: 'bold' }} />
                                </Stack>
                            </Grid>
                        </Grid>
                    </Box>

                    <Grid container sx={{ minHeight: '70vh' }}>

                        {/* COLUNA DA ESQUERDA: Conteúdo e Comentários */}
                        <Grid item xs={12} md={8} sx={{ p: 4, bgcolor: '#fff', display: 'flex', flexDirection: 'column' }}>

                            <Box sx={{ flexGrow: 1 }}>
                                <Typography variant="h6" fontWeight="bold" gutterBottom>
                                    Descrição da Ocorrência
                                </Typography>
                                <Paper
                                    variant="outlined"
                                    sx={{
                                        p: 3,
                                        mb: 4,
                                        borderRadius: 3,
                                        bgcolor: '#f8fafd', // Um azul bem clarinho para destacar
                                        border: '1px solid #e3e8ef'
                                    }}
                                >
                                    <Typography variant="subtitle2" color="primary" fontWeight="bold" gutterBottom>
                                        DESCRIÇÃO DA OCORRÊNCIA
                                    </Typography>
                                    <Typography variant="body1" color="text.primary" sx={{ lineHeight: 1.8, fontWeight: 500 }}>
                                        Ao tentar gerar o relatório financeiro mensal, o sistema trava completamente e exibe uma mensagem de erro com códigos aleatórios. O problema persiste mesmo após reiniciar o computador e afeta todos os usuários do setor financeiro.
                                    </Typography>
                                </Paper>

                                <Divider sx={{ my: 4 }} />

                                <Divider sx={{ my: 4 }} />

                                
                            </Box>

                            {/* CAMPO DE COMENTÁRIO: Fica por último no conteúdo */}
                        </Grid>

                        {/* COLUNA DA DIREITA (LATERAL): Solicitante e Classificação */}
                        <Grid item xs={12} md={4} sx={{ p: 4, bgcolor: '#fcfcfc', borderLeft: '1px solid #eee' }}>

                            {/* SOLICITANTE */}

                            <Box sx={{ mb: 5 }}>
                                <Typography variant="overline" color="text.secondary" fontWeight="bold">SOLICITANTE</Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2, mb: 3 }}>
                                    <Avatar sx={{ width: 56, height: 56, bgcolor: '#e3f2fd', color: '#1976d2' }}>
                                        <PersonIcon fontSize="large" />
                                    </Avatar>
                                    <Box>
                                        <Typography variant="body1" fontWeight="bold">João Silva</Typography>
                                        <Typography variant="body2" color="textSecondary">Analista Financeiro</Typography>
                                    </Box>
                                </Box>
                                <Stack spacing={1.5}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography variant="body2" color="textSecondary">Setor:</Typography>
                                        <Typography variant="body2" fontWeight="500">Financeiro / Matriz</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography variant="body2" color="textSecondary">Ramal:</Typography>
                                        <Typography variant="body2" fontWeight="500">1234</Typography>
                                    </Box>
                                </Stack>
                            </Box>

                            <Divider sx={{ mb: 4 }} />

                            {/* CLASSIFICAÇÃO */}
                            <Box>
                                <Typography variant="overline" color="text.secondary" fontWeight="bold">DETALHES DA SOLICITAÇÃO</Typography>
                                <Stack spacing={2} sx={{ mt: 2 }}>
                                    <Box>
                                        <Typography variant="caption" sx={{ opacity: 0.7, display: 'block' }}>Tipo de Chamado</Typography>
                                        <Typography variant="body2" fontWeight="bold">Incidente de Software</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" sx={{ opacity: 0.7, display: 'block' }}>Categoria Principal</Typography>
                                        <Typography variant="body2" fontWeight="bold">Sistemas ERP</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" sx={{ opacity: 0.7, display: 'block' }}>Impacto</Typography>
                                        <Chip label="Setorial" size="small" color="error" sx={{ fontWeight: 'bold', mt: 0.5 }} />
                                    </Box>
                                </Stack>
                            </Box>

                            <Box sx={{ mt: 6, p: 3, bgcolor: '#1c252e', borderRadius: 4, color: '#fff' }}>
                                <Typography variant="caption" sx={{ opacity: 0.7 }}>Tempo Restante (SLA)</Typography>
                                <Typography variant="h5" fontWeight="bold">02:15:00</Typography>
                            </Box>

                            <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
                                    Histórico de Mensagens
                                </Typography>

                                {/* Exemplo de Comentário Existente */}
                                <Stack spacing={3} sx={{ mb: 4 }}>
                                    <Box sx={{ display: 'flex', gap: 2 }}>
                                        <Avatar sx={{ bgcolor: '#1976d2' }}>IT</Avatar>
                                        <Box sx={{ bgcolor: '#f8f9fa', p: 2, borderRadius: 3, flex: 1 }}>
                                            <Typography variant="subtitle2" fontWeight="bold">Suporte Nível 2 (Adriano)</Typography>
                                            <Typography variant="body2">Logs do sistema identificados. Estamos verificando a conexão com o banco de dados.</Typography>
                                            <Typography variant="caption" color="text.secondary">14:45</Typography>
                                        </Box>
                                    </Box>
                                </Stack>
                            <Box sx={{ pt: 2, borderTop: '1px solid #eee' }}>
                                <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>Adicionar Comentário</Typography>
                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        placeholder="Digite sua atualização ou dúvida aqui..."
                                        multiline
                                        rows={2}
                                        sx={{ bgcolor: '#fff' }}
                                    />
                                    <Button variant="contained" sx={{ px: 4, borderRadius: 2, height: '56px' }}>
                                        <SendIcon />
                                    </Button>
                                </Box>
                            </Box>
                        </Grid>

                    </Grid>
                </Paper>
            </Container>
        </Box>
    );
}