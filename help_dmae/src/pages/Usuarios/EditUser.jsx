import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, TextField, Button, Typography, Paper, Grid, Stack, MenuItem } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function EditUser() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nome: "", matricula: "", cargo: "", ramal: "", setor: "", unidade: "", perfil_id: ""
    });

    // --- BUSCA OS DADOS (Apenas um useEffect) ---
    useEffect(() => {
        const carregarUsuario = async () => {
            try {
                // Usando a rota padrão que criamos no server.js
                const response = await fetch(`http://localhost:5000/usuarios/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setFormData(data);
                }
            } catch (err) {
                console.error("Erro ao carregar usuário:", err);
            }
        };
        carregarUsuario();
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:5000/usuarios/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert("Usuário atualizado com sucesso!");
                navigate("/usuarios");
            }
        } catch (err) {
            alert("Erro ao atualizar usuário");
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/usuarios")} sx={{ mb: 2 }}>
                Voltar
            </Button>

            <Paper sx={{ p: 4, borderRadius: 3 }}>
                <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold" }}>
                    Editar Usuário: {formData.nome}
                </Typography>

                <form onSubmit={handleSubmit}>
                    <Grid container spacing={4}>

                        {/* COLUNA DA ESQUERDA */}
                        <Grid item xs={12} md={6}>
                            <Stack spacing={3}>
                                <TextField
                                    fullWidth label="Nome Completo" name="nome"
                                    value={formData.nome} onChange={handleChange} required
                                />
                                <TextField
                                    fullWidth label="Cargo" name="cargo"
                                    value={formData.cargo} onChange={handleChange}
                                />
                                <TextField
                                    fullWidth label="Setor" name="setor"
                                    value={formData.setor} onChange={handleChange}
                                />
                                <TextField
                                    select fullWidth label="Perfil de Acesso" name="perfil_id"
                                    value={formData.perfil_id} onChange={handleChange}
                                >
                                    <MenuItem value={1}>Usuário Comum</MenuItem>
                                    <MenuItem value={2}>Técnico</MenuItem>
                                    <MenuItem value={3}>Administrador</MenuItem>
                                </TextField>
                            </Stack>
                        </Grid>

                        {/* COLUNA DA DIREITA */}
                        <Grid item xs={12} md={6}>
                            <Stack spacing={3}>
                                <TextField
                                    fullWidth label="Matrícula" name="matricula"
                                    value={formData.matricula} disabled
                                />
                                <TextField
                                    fullWidth label="Ramal" name="ramal"
                                    value={formData.ramal} onChange={handleChange}
                                />
                                <TextField
                                    fullWidth label="Unidade" name="unidade"
                                    value={formData.unidade} onChange={handleChange}
                                />
                            </Stack>
                        </Grid>

                    </Grid>

                    {/* BOTÃO SALVAR */}
                    <Stack direction="row" justifyContent="flex-end" sx={{ mt: 4 }}>
                        <Button
                            type="submit" variant="contained" startIcon={<SaveIcon />}
                            sx={{ px: 6, py: 1.5, borderRadius: '8px', textTransform: 'none', fontWeight: 'bold' }}
                        >
                            Salvar Alterações
                        </Button>
                    </Stack>
                </form>
            </Paper>
        </Box>
    );
}