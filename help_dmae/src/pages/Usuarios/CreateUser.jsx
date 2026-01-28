import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, TextField, Button, Typography, Paper, Grid, Stack, MenuItem } from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function CreateUser() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nome: "",
        matricula: "",
        senha: "",
        cargo: "",
        ramal: "",
        setor: "",
        unidade: "",
        perfil_id: 1 // Padrão: Usuário Comum
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:5000/usuarios", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert("Usuário cadastrado com sucesso!");
                navigate("/usuarios");
            } else {
                const errorData = await response.json();
                alert("Erro ao cadastrar: " + errorData.error);
            }
        } catch (err) {
            alert("Erro de conexão com o servidor.");
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Button 
                startIcon={<ArrowBackIcon />} 
                onClick={() => navigate("/usuarios")} 
                sx={{ mb: 2, textTransform: 'none', color: '#1976d2' }}
            >
                Voltar para Lista
            </Button>

            <Paper sx={{ p: 4, borderRadius: 3 }}>
                <Typography variant="h5" sx={{ mb: 4, fontWeight: "bold", color: "#1976d2" }}>
                    Cadastrar Novo Usuário
                </Typography>

                <form onSubmit={handleSubmit}>
                    <Grid container spacing={4}>
                        
                        {/* COLUNA DA ESQUERDA - Identificação */}
                        <Grid item xs={12} md={6}>
                            <Stack spacing={3}>
                                <TextField
                                    fullWidth label="Nome Completo" name="nome"
                                    value={formData.nome} onChange={handleChange} required
                                />
                                <TextField
                                    fullWidth label="Matrícula" name="matricula"
                                    value={formData.matricula} onChange={handleChange} required
                                />
                                <TextField
                                    fullWidth label="Senha Inicial" name="senha" type="password"
                                    value={formData.senha} onChange={handleChange} required
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

                        {/* COLUNA DA DIREITA - Detalhes Organizacionais */}
                        <Grid item xs={12} md={6}>
                            <Stack spacing={3}>
                                <TextField
                                    fullWidth label="Cargo" name="cargo"
                                    value={formData.cargo} onChange={handleChange}
                                />
                                <TextField
                                    fullWidth label="Ramal" name="ramal"
                                    value={formData.ramal} onChange={handleChange}
                                />
                                <TextField
                                    fullWidth label="Setor" name="setor"
                                    value={formData.setor} onChange={handleChange}
                                />
                                <TextField
                                    fullWidth label="Unidade" name="unidade"
                                    value={formData.unidade} onChange={handleChange}
                                />
                            </Stack>
                        </Grid>

                    </Grid>

                    {/* BOTÃO FINALIZAR */}
                    <Stack direction="row" justifyContent="flex-end" sx={{ mt: 5 }}>
                        <Button
                            type="submit" 
                            variant="contained" 
                            startIcon={<PersonAddIcon />}
                            sx={{ 
                                px: 6, 
                                py: 1.5, 
                                borderRadius: '8px', 
                                textTransform: 'none', 
                                fontWeight: 'bold',
                                fontSize: '1rem',
                                backgroundColor: "#1976d2",
                                "&:hover": { backgroundColor: "#1565c0" }
                            }}
                        >
                            Finalizar Cadastro
                        </Button>
                    </Stack>
                </form>
            </Paper>
        </Box>
    );
}