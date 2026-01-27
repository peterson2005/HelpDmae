import React, { useState, useEffect, useCallback } from 'react'; 
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Box, Grid, Paper, Typography, Chip, Divider,
    Stack, Button, TextField, Container, IconButton, Tooltip
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import DescriptionIcon from '@mui/icons-material/Description';

export default function DetalhesChamado() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [chamado, setChamado] = useState(null);
    const [comentarios, setComentarios] = useState([]);
    const [novoComentario, setNovoComentario] = useState("");
    const [tecnicos, setTecnicos] = useState([]); 
    const [tecnicoAtribuido, setTecnicoAtribuido] = useState(""); 
    const buscarDadosChamado = useCallback(async () => {
        try {
            const resposta = await axios.get(`http://localhost:5000/chamados/${id}`);
            setChamado(resposta.data);
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

    useEffect(() => {

        if (id) {
            buscarDadosChamado();
            buscarComentarios();
        }
    }, [id, buscarDadosChamado, buscarComentarios]);

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
    const handleAtribuirChamado = async (tecnicoId) => {
        if (!tecnicoId) return;

        try {
            await axios.put(`http://localhost:5000/chamados/${id}/atribuir`, {
                tecnico_id: tecnicoId,
                status_id: 2 
            });

            alert("Chamado atribuído e status atualizado!");
            buscarDadosChamado();
            buscarComentarios();
        } catch (err) {
            console.error(err);
            alert("Erro ao atribuir chamado.");
        }
    };
    const handleEnviarComentario = async () => {
        if (!novoComentario.trim()) return;

        const usuarioGuardado = localStorage.getItem("usuarioLogado");
        if (!usuarioGuardado) {
            alert("Sessão expirada. Faça login novamente.");
            return;
        }

        const usuarioLogado = JSON.parse(usuarioGuardado);

        try {
            await axios.post(`http://localhost:5000/chamados/${id}/interacoes`, {
                mensagem: novoComentario,
                usuario_nome: usuarioLogado.nome
            });

            setNovoComentario(""); 
            buscarComentarios(); 
        } catch (err) {
            alert("Erro ao enviar comentário");
        }
    };

    if (!chamado) {
        return <Typography sx={{ p: 5 }}>Carregando detalhes do chamado...</Typography>;
    }


    return (
        <Box sx={{ backgroundColor: "#eef2f6", minHeight: "100vh", py: 6 }}>
            <Container maxWidth="lg">
                <Paper elevation={0} sx={{ borderRadius: 8, p: 4, bgcolor: '#fff', boxShadow: '0px 10px 30px rgba(0,0,0,0.05)' }}>

                    {/* CABEÇALHO DINÂMICO */}
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h4" fontWeight="800" color="#1e293b" gutterBottom>
                            Chamado #{chamado.id}
                        </Typography>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Chip
                                label={chamado.status_nome}
                                sx={{ bgcolor: chamado.status_cor || '#10b981', color: '#fff', fontWeight: 'bold' }}
                            />
                            <Chip
                                label={`Impacto: ${chamado.impacto}`}
                                sx={{ border: '1px solid #1e293b', color: '#1e293b', fontWeight: 'bold' }}
                            />

                            <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

                            <TextField
                                select
                                size="small"
                                label="Atribuir Técnico"
                                value={chamado.tecnico_id || ""}
                                onChange={(e) => handleAtribuirChamado(e.target.value)}
                                SelectProps={{ native: true }}
                                sx={{
                                    minWidth: 220,
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 3,
                                        bgcolor: '#f8fafc',
                                        '& fieldset': { borderColor: '#e2e8f0' }
                                    }
                                }}
                            >
                                <option value="" disabled>Selecione um técnico...</option>
                                {tecnicos.map((t) => (
                                    <option key={t.id} value={t.id}>
                                        {t.nome}
                                    </option>
                                ))}
                            </TextField>
                        </Stack>
                    </Box>

                    <Grid container spacing={4}>
                        <Grid item xs={12} md={7}>
                            <Box sx={{
                                bgcolor: '#dfeaf5',
                                p: 4,
                                borderRadius: 6,
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column'
                            }}>
                                <Typography variant="h5" fontWeight="700" color="#1e293b" sx={{ mb: 2 }}>
                                    {chamado.titulo}
                                </Typography>
                                <Typography variant="subtitle1" fontWeight="bold" color="#64748b" sx={{ mb: 1 }}>
                                    Descrição Detalhada
                                </Typography>
                                <Typography variant="body1" color="#334155" sx={{ whiteSpace: 'pre-line' }}>
                                    {chamado.descricao}
                                </Typography>
                            </Box>
                        </Grid>

                        <Grid item xs={12} md={5}>
                            <Stack spacing={3}>
                                <Box>
                                    <Typography variant="h6" fontWeight="bold" color="#1e293b">
                                        Informações de Solicitante
                                    </Typography>
                                    <Typography variant="body2" color="#64748b" sx={{ mt: 1, lineHeight: 2 }}>
                                        <b>Nome:</b> {chamado.solicitante_nome} <br />
                                        <b>Cargo:</b> {chamado.solicitante_cargo} <br />
                                        <b>Setor:</b> {chamado.solicitante_setor} <br />
                                        <b>Unidade:</b> {chamado.solicitante_unidade} <br />
                                        <b>Ramal:</b> {chamado.solicitante_ramal || "N/A"}
                                    </Typography>
                                </Box>
                                <Divider />
                                <Box>
                                    <Typography variant="h6" fontWeight="bold" color="#1e293b">
                                        Classificação
                                    </Typography>
                                    <Typography variant="body2" color="#64748b" sx={{ mt: 1 }}>
                                        <b>Tipo:</b> {chamado.tipo} <br />
                                        <b>Categoria:</b> {chamado.categoria_nome || "Geral"}
                                    </Typography>
                                </Box>
                            </Stack>
                        </Grid>
                    </Grid>

                    <Box sx={{ mt: 6 }}>
                        <Typography variant="h6" fontWeight="bold" color="#1e293b" sx={{ mb: 3 }}>
                            Histórico de Atividades
                        </Typography>

                        <Stack spacing={3} sx={{ mb: 4, maxHeight: '400px', overflowY: 'auto', pr: 2 }}>
                            {/* Abertura do Chamado */}
                            <Box sx={{ display: 'flex', gap: 2, pl: 1, borderLeft: '2px solid #e2e8f0' }}>
                                <Typography variant="caption" sx={{ color: '#64748b', minWidth: '130px' }}>
                                    {new Date(chamado.data_criacao).toLocaleString('pt-BR')}
                                </Typography>
                                <Typography variant="body2" color="#334155">
                                     <b>{chamado.solicitante_nome}</b> abriu o chamado.
                                </Typography>
                            </Box>

                            {/* Comentários Dinâmicos */}
                            {comentarios.map((item) => (
                                <Box key={item.id} sx={{ display: 'flex', gap: 2, pl: 1, borderLeft: '2px solid #0085db' }}>
                                    <Typography variant="caption" sx={{ color: '#64748b', minWidth: '130px' }}>
                                        {new Date(item.data_interacao).toLocaleString('pt-BR')}
                                    </Typography>
                                    <Box sx={{ flex: 1 }}>
                                        <Typography variant="body2" fontWeight="bold" color="#1e293b">
                                            {item.usuario_nome}
                                        </Typography>
                                        <Typography variant="body2" color="#334155" sx={{ mt: 0.5, bgcolor: '#f8fafc', p: 1.5, borderRadius: 2, border: '1px solid #f1f5f9' }}>
                                            {item.mensagem}
                                        </Typography>
                                    </Box>
                                </Box>
                            ))}
                        </Stack>

                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start', mt: 4 }}>
                            <TextField
                                fullWidth
                                multiline
                                rows={2}
                                placeholder="Digite sua atualização ou resposta..."
                                value={novoComentario}
                                onChange={(e) => setNovoComentario(e.target.value)}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: '#fdfdfd' } }}
                            />
                            <Button
                                variant="contained"
                                disabled={!novoComentario.trim()}
                                onClick={handleEnviarComentario}
                                sx={{ bgcolor: '#0085db', px: 4, borderRadius: 2, height: '56px', fontWeight: 'bold' }}
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