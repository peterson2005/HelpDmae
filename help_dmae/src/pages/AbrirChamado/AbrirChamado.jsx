import axios from 'axios';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import {
  Stack, Grid, Paper, Typography, Box, TextField,
  Button, MenuItem, Card, CardActionArea, List, ListItem,
  IconButton, Tooltip, Divider
} from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ComputerIcon from '@mui/icons-material/Computer';
import CodeIcon from '@mui/icons-material/Code';
import EditIcon from '@mui/icons-material/Edit';

export default function AbrirChamado() {
  const navigate = useNavigate();

  const [userFields, setUserFields] = useState([
    { id: 'nome', label: "Nome", value: "", isEditing: false },
  { id: 'cargo', label: "Cargo", value: "", isEditing: false },
  { id: 'setor', label: "Setor", value: "", isEditing: false },
  { id: 'unidade', label: "Unidade", value: "", isEditing: false },
  { id: 'ramal', label: "Ramal", value: "", isEditing: false },
  ]);
  

  // Função para alternar entre texto e input
  const handleEditToggle = (id) => {
    setUserFields(prev => prev.map(field =>
      field.id === id ? { ...field, isEditing: !field.isEditing } : field
    ));
  };

  // Função para atualizar o valor enquanto digita
  const handleUserChange = (id, newValue) => {
    setUserFields(prev => prev.map(field =>
      field.id === id ? { ...field, value: newValue } : field
    ));
  };

  const [formData, setFormData] = useState({
  titulo: '',
  descricao: '',
  tipo: 'incidente',
  impacto: 'eu',
  categoria_id: 1,
  usuario_id: null // Começa nulo porque ainda não sabemos quem logou
});

  useEffect(() => {
  // 1. Pega a string do crachá
  const usuarioGuardado = localStorage.getItem("usuarioLogado");

  if (usuarioGuardado) {
    // 2. Transforma em objeto JS
    const user = JSON.parse(usuarioGuardado);

    // 3. Atualiza os campos visuais da esquerda
    setUserFields([
      { id: 'nome', label: "Nome", value: user.nome || "", isEditing: false },
      { id: 'cargo', label: "Cargo", value: user.cargo || "", isEditing: false },
      { id: 'setor', label: "Setor", value: user.setor || "", isEditing: false },
      { id: 'unidade', label: "Unidade", value: user.unidade || "", isEditing: false },
      { id: 'ramal', label: "Ramal", value: user.ramal || "", isEditing: false },
    ]);

    // 4. Salva o ID do usuário no formulário para o banco saber de quem é o chamado
    setFormData(prev => ({ ...prev, usuario_id: user.id }));
    
  } else {
    // Se alguém tentar entrar sem logar, expulsa para o login
    navigate("/login");
  }
}, [navigate]);

  const handleSubmit = async (e) => {
  e.preventDefault();

  // 1. Validação: Impedir campos vazios
  if (!formData.titulo.trim() || !formData.descricao.trim()) {
    alert("Por favor, preencha o título e a descrição do problema.");
    return; // Interrompe a função aqui
  }

  // 2. Validação: Garantir que o ID do usuário existe
  if (!formData.usuario_id) {
    alert("Erro de autenticação. Por favor, faça login novamente.");
    navigate("/login");
    return;
  }

  // Criamos o objeto unificado
  const dadosCompletos = {
    ...formData,
    solicitante_nome: userFields.find(f => f.id === 'nome').value,
    solicitante_cargo: userFields.find(f => f.id === 'cargo').value,
    solicitante_setor: userFields.find(f => f.id === 'setor').value,
    solicitante_unidade: userFields.find(f => f.id === 'unidade').value,
    solicitante_ramal: userFields.find(f => f.id === 'ramal').value,
  };

  try {
    await axios.post('http://localhost:5000/chamados', dadosCompletos);
    alert("Chamado aberto com sucesso!");
    navigate('/chamados');
  } catch (error) {
    console.error("Erro ao enviar:", error);
    alert("Erro ao abrir chamado. Verifique a conexão com o servidor.");
  }
};


  const [arquivos, setArquivos] = useState([]);
  const fileInputRef = useRef(null); 

  const handleFileClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const novosArquivos = Array.from(e.target.files);
    setArquivos((prev) => [...prev, ...novosArquivos]); 
  };

  return (
    <Box sx={{
      p: { xs: 2, md: 4 },
      backgroundColor: "#f4f6f8",
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center", 
      alignItems: "flex-start"   
    }}>
      {/* Aumentei o maxWidth para 1400px para ocupar mais a tela cheia */}
      <Paper elevation={3} sx={{ p: 5, borderRadius: 3, width: "100%", maxWidth: 1400 }}>

        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography variant="h4" fontWeight="bold" sx={{ color: '#1c252e' }}>
            Abrir Chamado
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Preencha as informações detalhadas para que nossa equipe técnica possa lhe auxiliar.
          </Typography>
        </Box>

        <Grid container spacing={6} justifyContent="center">

          {/* COLUNA ESQUERDA: Agora com md={6} para ficar equilibrado */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              Informações do Solicitante
            </Typography>

            <List sx={{
              mb: 4,
              bgcolor: '#fafafa',
              borderRadius: 2,
              border: '1px solid #e0e0e0',
              width: "100%"
            }}>

              {/* --- AQUI COMEÇA A SUBSTITUIÇÃO PELA PARTE 3 --- */}
              {userFields.map((item, index) => (
                <Box key={item.id}>
                  <ListItem
                    secondaryAction={
                      <Tooltip title={item.isEditing ? "Salvar" : `Editar ${item.label}`}>
                        <IconButton
                          edge="end"
                          size="small"
                          color={item.isEditing ? "success" : "primary"}
                          onClick={() => handleEditToggle(item.id)}
                        >
                          {/* Ícone muda se estiver editando */}
                          {item.isEditing ? <CloudUploadIcon fontSize="small" /> : <EditIcon fontSize="small" />}
                        </IconButton>
                      </Tooltip>
                    }
                    sx={{ py: 1.5 }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                      <Typography variant="subtitle1" fontWeight="bold" sx={{ minWidth: 120 }}>
                        {item.label}:
                      </Typography>

                      {item.isEditing ? (
                        <TextField
                          variant="standard"
                          fullWidth
                          value={item.value}
                          onChange={(e) => handleUserChange(item.id, e.target.value)}
                          sx={{ mr: 2 }}
                          autoFocus
                        />
                      ) : (
                        <Typography variant="subtitle1" color="textPrimary">
                          {item.value}
                        </Typography>
                      )}
                    </Box>
                  </ListItem>
                  {index < userFields.length - 1 && <Divider />}
                </Box>
              ))}
              {/* --- AQUI TERMINA A SUBSTITUIÇÃO --- */}

            </List>

            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
              Descrição do Problema
            </Typography>
            <Stack spacing={3}>
              <TextField fullWidth label="Título do Chamado"
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })} placeholder="Ex: Erro ao acessar o sistema ERP" />
              <TextField fullWidth multiline rows={8} label="Descrição Detalhada" value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })} placeholder="Descreva aqui o que aconteceu..." />
            </Stack>
          </Grid>

          {/* COLUNA DIREITA: */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack spacing={4}>
              <Box>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>Classificação e Impacto</Typography>
                <TextField select fullWidth label="Tipo de Solicitação" value={formData.tipo}
                  onChange={(e) => setFormData({ ...formData, tipo: e.target.value })} defaultValue="incidente" sx={{ mb: 3 }}>
                  <MenuItem value="solicitacao">Solicitação (Pedido de algo novo)</MenuItem>
                  <MenuItem value="incidente">Incidente (Algo parou de funcionar)</MenuItem>
                </TextField>

                <Typography variant="body2" fontWeight="600" sx={{ mb: 1 }}>Categoria Principal</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Card
                      variant="outlined"
                      onClick={() => setFormData({ ...formData, categoria_id: 1 })} // ID 1 = Hardware
                      sx={{
                        cursor: 'pointer',
                        borderColor: formData.categoria_id === 1 ? 'primary.main' : 'divider',
                        bgcolor: formData.categoria_id === 1 ? '#f0f7ff' : 'inherit'
                      }}
                    >
                      <CardActionArea sx={{ p: 4, textAlign: 'center' }}>
                        <ComputerIcon color={formData.categoria_id === 1 ? "primary" : "action"} sx={{ fontSize: 40 }} />
                        <Typography variant="body1" fontWeight={formData.categoria_id === 1 ? "bold" : "normal"}>Hardware</Typography>
                      </CardActionArea>
                    </Card>
                  </Grid>
                  <Grid item xs={6}>
                    <Card
                      variant="outlined"
                      onClick={() => setFormData({ ...formData, categoria_id: 2 })} // ID 2 = Software
                      sx={{
                        cursor: 'pointer',
                        borderColor: formData.categoria_id === 2 ? 'primary.main' : 'divider',
                        bgcolor: formData.categoria_id === 2 ? '#f0f7ff' : 'inherit'
                      }}
                    >
                      <CardActionArea sx={{ p: 4, textAlign: 'center' }}>
                        <CodeIcon color={formData.categoria_id === 2 ? "primary" : "action"} sx={{ fontSize: 40 }} />
                        <Typography variant="body1" fontWeight={formData.categoria_id === 2 ? "bold" : "normal"}>Software</Typography>
                      </CardActionArea>
                    </Card>
                  </Grid>
                </Grid>
              </Box>

              <TextField select fullWidth label="Impacto no Trabalho" value={formData.impacto}
                onChange={(e) => setFormData({ ...formData, impacto: e.target.value })} defaultValue="setor">
                <MenuItem value="eu">Apenas no meu computador</MenuItem>
                <MenuItem value="setor">Afeta todo o meu setor</MenuItem>
                <MenuItem value="empresa">Afeta a unidade inteira</MenuItem>
              </TextField>

              <Box>
                <Typography variant="body2" fontWeight="600" gutterBottom>Anexar Evidências (Prints/Docs)</Typography>

                {/* Input HTML real, mas escondido */}
                <input
                  type="file"
                  multiple
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />

                <Box
                  onClick={handleFileClick} // Gatilho de clique
                  sx={{
                    border: '2px dashed #bdbdbd',
                    borderRadius: 3,
                    p: 4,
                    textAlign: 'center',
                    bgcolor: arquivos.length > 0 ? '#f0f9ff' : '#fafafa',
                    borderColor: arquivos.length > 0 ? 'primary.main' : '#bdbdbd',
                    '&:hover': { bgcolor: '#f0f4f8', borderColor: 'primary.main', cursor: 'pointer' }
                  }}
                >
                  <CloudUploadIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                  <Typography variant="body1" fontWeight="medium">
                    {arquivos.length > 0 ? `${arquivos.length} arquivo(s) selecionado(s)` : "Clique para selecionar arquivos"}
                  </Typography>
                </Box>

                {/* Lista de arquivos selecionados para o usuário ver o que anexou */}
                <Stack spacing={1} sx={{ mt: 2 }}>
                  {arquivos.map((file, index) => (
                    <Typography key={index} variant="caption" display="block" sx={{ bgcolor: '#eee', p: 0.5, borderRadius: 1 }}>
                      {file.name} ({(file.size / 1024).toFixed(1)} KB)
                    </Typography>
                  ))}
                </Stack>
              </Box>
            </Stack>
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 8 }}>
          <Button
            variant="outlined"
            size="large"
            sx={{ px: 8, py: 1.5, fontWeight: 'bold' }}
            onClick={() => navigate(-1)}
          >
            CANCELAR
          </Button>
          <Button
  variant="contained"
  size="large"
  sx={{ px: 10, py: 1.5, fontWeight: 'bold', boxShadow: 4 }}
  onClick={handleSubmit}
  // Se o título ou descrição estiverem vazios, o botão trava
  disabled={!formData.titulo.trim() || !formData.descricao.trim()}
>
  ABRIR CHAMADO
</Button>
        </Box>
      </Paper>
    </Box>
  );
}