import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Box, Grid, Paper, Typography, Chip, Divider,
    Stack, Button, TextField, Container, MenuItem,
    Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function DetalhesChamado() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [chamado, setChamado] = useState(null);
    const [comentarios, setComentarios] = useState([]);
    const [novoComentario, setNovoComentario] = useState("");
    const [tecnicos, setTecnicos] = useState([]);
    const [tecnicoSelecionado, setTecnicoSelecionado] = useState("");

    const [openModalSolucao, setOpenModalSolucao] = useState(false);
    const [textoSolucao, setTextoSolucao] = useState("");

    const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado") || "{}");
    const eAdminOuTecnico = usuarioLogado.perfil_id === 2 || usuarioLogado.perfil_id === 3;

    const buscarDadosChamado = useCallback(async () => {
        try {
            const resposta = await axios.get(`http://localhost:5000/chamados/${id}`);
            setChamado(resposta.data);
            if (resposta.data.tecnico_id) {
                setTecnicoSelecionado(resposta.data.tecnico_id);
            }
        } catch (error) {
            console.error("Erro ao buscar dados do chamado:", error);
        }
    }, [id]);

    const buscarComentarios = useCallback(async () => {
        try {
            const res = await axios.get(`http://localhost:5000/chamados/${id}/interacoes`);
            setComentarios(res.data);
        } catch (err) {
            console.error("Erro ao buscar histórico", err);
        }
    }, [id]);

    const buscarTecnicos = useCallback(async () => {
        try {
            const res = await axios.get('http://localhost:5000/usuarios/tecnicos');
            setTecnicos(res.data);
        } catch (err) {
            console.error("Erro ao buscar técnicos", err);
        }
    }, []);

    useEffect(() => {
        if (id) {
            buscarDadosChamado();
            buscarComentarios();
            buscarTecnicos();
        }
    }, [id, buscarDadosChamado, buscarComentarios, buscarTecnicos]);

    const handleConfirmarAtribuicao = async () => {
        if (!tecnicoSelecionado) return alert("Selecione um técnico");

        // 1. Pega o nome do técnico que foi selecionado no dropdown
        const tecnicoEscolhido = tecnicos.find(t => t.id === tecnicoSelecionado);
        const tecnicoNome = tecnicoEscolhido?.nome;

        // 2. Pega o nome de quem está logado e fazendo a ação
        const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado") || "{}");
        const nomeQuemAtribuiu = usuarioLogado.nome || "Administrador";

        try {
            await axios.put(`http://localhost:5000/chamados/${id}/atribuir`, {
                tecnico_id: tecnicoSelecionado,
                status_id: 2
            });

            // 3. Mensagem detalhada: "Peterson atribuiu o chamado para Cleiton"
            await axios.post(`http://localhost:5000/chamados/${id}/interacoes`, {
                mensagem: `SISTEMA: ${nomeQuemAtribuiu} atribuiu este chamado para o técnico ${tecnicoNome}.`,
                usuario_nome: "SISTEMA"
            });

            alert("Técnico atribuído com sucesso!");
            buscarDadosChamado();
            buscarComentarios();
        } catch (err) {
            alert("Erro ao atribuir técnico.");
        }
    };

    const handleFinalizarChamado = async () => {
        if (!tecnicoSelecionado && !chamado?.tecnico_id) {
            alert("Erro: Você deve atribuir um técnico antes de finalizar o chamado!");
            return;
        }
        if (!textoSolucao.trim()) return alert("Descreva a solução");

        const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado") || "{}");

        try {
            await axios.put(`http://localhost:5000/chamados/${id}/finalizar`, {
                solucao: textoSolucao,
                status_id: 3
            });

            await axios.post(`http://localhost:5000/chamados/${id}/interacoes`, {
                mensagem: `SISTEMA: Chamado solucionado por ${usuarioLogado.nome || "Técnico"}. Solução: ${textoSolucao}`,
                usuario_nome: usuarioLogado.nome || "Sistema"
            });

            alert("Chamado finalizado com sucesso!");
            setOpenModalSolucao(false);
            setTextoSolucao("");
            buscarDadosChamado();
            buscarComentarios();
        } catch (err) {
            alert("Erro ao finalizar.");
        }
    };

    const [openModalReabrir, setOpenModalReabrir] = useState(false);
    const [motivoReabertura, setMotivoReabertura] = useState("");

    const handleReabrirChamado = async () => {
        if (!motivoReabertura.trim()) return alert("Descreva o motivo da reabertura");

        try {
            // 1. Atualiza o status para 1 (Aberto) ou 2 (Em Atendimento)
            // Geralmente, ao reabrir, voltamos para "Em Atendimento" (2) pois já tem técnico
            await axios.put(`http://localhost:5000/chamados/${id}/reabrir`, {
                status_id: 2
            });

            // 2. Registra no histórico
            await axios.post(`http://localhost:5000/chamados/${id}/interacoes`, {
                mensagem: `SISTEMA: Chamado REABERTO por ${usuarioLogado.nome}. Motivo: ${motivoReabertura}`,
                usuario_nome: "SISTEMA"
            });

            alert("Chamado reaberto com sucesso!");
            setOpenModalReabrir(false);
            setMotivoReabertura("");
            buscarDadosChamado();
            buscarComentarios();
        } catch (err) {
            alert("Erro ao reabrir o chamado.");
        }
    };

    const handleEnviarComentario = async () => {
        if (!novoComentario.trim()) return;
        const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado") || "{}");
        try {
            await axios.post(`http://localhost:5000/chamados/${id}/interacoes`, {
                mensagem: novoComentario,
                usuario_nome: usuarioLogado.nome || "Usuário"
            });
            setNovoComentario("");
            buscarComentarios();
        } catch (err) {
            alert("Erro ao enviar comentário");
        }
    };

    if (!chamado) return <Typography sx={{ p: 5 }}>Carregando...</Typography>;

    return (
        <Box sx={{ backgroundColor: "#f1f5f9", minHeight: "100vh", py: 4 }}>
            <Container maxWidth="lg">
                <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mb: 2 }}>Voltar</Button>

                <Paper sx={{ borderRadius: 4, p: 4, mb: 3 }}>
                    <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems="center" spacing={2} sx={{ mb: 4 }}>
                        <Box>
                            <Typography variant="h4" fontWeight="bold" color="#1e293b">Chamado #{chamado.id}</Typography>
                            <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                                <Chip label={chamado.status_nome} sx={{ bgcolor: chamado.status_cor || '#1976d2', color: '#fff', fontWeight: 'bold' }} />
                                <Chip label={chamado.impacto} variant="outlined" />
                            </Stack>
                        </Box>
                        {!eAdminOuTecnico && chamado.tecnico_nome && (
                            <Box sx={{ textAlign: 'right' }}>
                                <Typography variant="subtitle2" color="textSecondary">Técnico Responsável:</Typography>
                                <Typography variant="body1" fontWeight="bold">{chamado.tecnico_nome}</Typography>
                            </Box>
                        )}
                        {eAdminOuTecnico && (
                            <Stack direction="row" spacing={2} alignItems="center">
                                <TextField
                                    select
                                    size="small"
                                    label="Técnico Responsável"
                                    value={tecnicoSelecionado}
                                    onChange={(e) => setTecnicoSelecionado(e.target.value)}
                                    sx={{ minWidth: 220 }}
                                    // TRAVA: Desabilita se já estiver finalizado OU se já tiver um técnico definido
                                    disabled={chamado.status_id === 3 || !!chamado.tecnico_id}
                                >
                                    <MenuItem value="" disabled>Selecione um técnico...</MenuItem>
                                    {tecnicos.map((t) => (
                                        <MenuItem key={t.id} value={t.id}>{t.nome}</MenuItem>
                                    ))}
                                </TextField>

                                <Button
                                    variant="outlined"
                                    startIcon={<AssignmentIndIcon />}
                                    onClick={handleConfirmarAtribuicao}
                                    // TRAVA: Desabilita o botão se já tiver um técnico
                                    disabled={chamado.status_id === 3 || !!chamado.tecnico_id}
                                >
                                    {chamado.tecnico_id ? "Já Atribuído" : "Atribuir"}
                                </Button>

                                {/* Substitua o botão de Solucionar por este bloco */}
                                {chamado.status_id === 3 ? (
                                    <Button
                                        variant="contained"
                                        color="warning"
                                        onClick={() => setOpenModalReabrir(true)}
                                    >
                                        Reabrir Chamado
                                    </Button>
                                ) : (
                                    <Button
                                        variant="contained"
                                        color="success"
                                        onClick={() => setOpenModalSolucao(true)}
                                        disabled={(!tecnicoSelecionado && !chamado.tecnico_id)}
                                    >
                                        Solucionar
                                    </Button>
                                )}
                            </Stack>
                        )}
                    </Stack>

                    <Divider sx={{ mb: 4 }} />

                    <Grid container spacing={4}>
                        <Grid item xs={12} md={8}>
                            <Typography variant="h5" fontWeight="bold" gutterBottom>{chamado.titulo}</Typography>
                            <Paper variant="outlined" sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 2 }}>
                                <Typography sx={{ whiteSpace: 'pre-line' }}>{chamado.descricao}</Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Typography variant="h6" fontWeight="bold">Solicitante</Typography>
                            <Typography variant="body1">{chamado.solicitante_nome}</Typography>
                            <Typography variant="body2" color="textSecondary">{chamado.solicitante_setor} - Ramal: {chamado.solicitante_ramal}</Typography>
                        </Grid>
                    </Grid>

                    <Box sx={{ mt: 6 }}>
                        <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>Histórico de Atividades</Typography>
                        <Stack spacing={2}>
                            {comentarios.map((item) => {
                                const isSistema = item.mensagem.startsWith("SISTEMA:");
                                return (
                                    <Box
                                        key={item.id}
                                        sx={{
                                            p: 2,
                                            bgcolor: isSistema ? '#f1f5f9' : '#ffffff',
                                            borderRadius: 2,
                                            borderLeft: isSistema ? '4px solid #64748b' : '4px solid #1976d2',
                                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                                        }}
                                    >
                                        <Typography variant="caption" color="textSecondary">
                                            {new Date(item.data_interacao).toLocaleString()}
                                        </Typography>
                                        <Typography variant="body2" fontWeight="bold">
                                            {isSistema ? "Notificação do Sistema" : item.usuario_nome}
                                        </Typography>
                                        <Typography variant="body2" sx={{ fontStyle: isSistema ? 'italic' : 'normal', mt: 0.5 }}>
                                            {item.mensagem}
                                        </Typography>
                                    </Box>
                                );
                            })}
                        </Stack>

                        {chamado.status_id !== 3 && (
                            <Box sx={{ display: 'flex', gap: 1, mt: 3 }}>
                                <TextField
                                    fullWidth multiline rows={2} placeholder="Digite um comentário..."
                                    value={novoComentario} onChange={(e) => setNovoComentario(e.target.value)}
                                />
                                <Button variant="contained" onClick={handleEnviarComentario} sx={{ height: '56px' }}>Enviar</Button>
                            </Box>
                        )}
                    </Box>
                </Paper>

                <Dialog open={openModalSolucao} onClose={() => setOpenModalSolucao(false)} fullWidth maxWidth="sm">
                    <DialogTitle>Finalizar Chamado</DialogTitle>
                    <DialogContent>
                        <TextField fullWidth multiline rows={4} label="Descrição da Solução" sx={{ mt: 1 }}
                            value={textoSolucao} onChange={(e) => setTextoSolucao(e.target.value)}
                        />
                    </DialogContent>
                    <DialogActions sx={{ p: 3 }}>
                        <Button onClick={() => setOpenModalSolucao(false)}>Cancelar</Button>
                        <Button variant="contained" color="success" onClick={handleFinalizarChamado}>Finalizar</Button>
                    </DialogActions>
                </Dialog>
            </Container>
            <Dialog open={openModalReabrir} onClose={() => setOpenModalReabrir(false)} fullWidth maxWidth="sm">
    <DialogTitle>Reabrir Chamado</DialogTitle>
    <DialogContent>
        <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
            Explique o motivo pelo qual o problema não foi resolvido ou voltou a ocorrer.
        </Typography>
        <TextField 
            fullWidth 
            multiline 
            rows={4} 
            label="Motivo da Reabertura" 
            value={motivoReabertura} 
            onChange={(e) => setMotivoReabertura(e.target.value)}
        />
    </DialogContent>
    <DialogActions sx={{ p: 3 }}>
        <Button onClick={() => setOpenModalReabrir(false)}>Cancelar</Button>
        <Button variant="contained" color="warning" onClick={handleReabrirChamado}>Confirmar Reabertura</Button>
    </DialogActions>
</Dialog>
        </Box>
    );
}