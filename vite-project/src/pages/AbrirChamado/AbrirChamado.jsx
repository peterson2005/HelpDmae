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

  const userData = [
    { label: "Nome", value: "João Silva" },
    { label: "Cargo", value: "Analista de Sistemas" },
    { label: "Setor", value: "TI" },
    { label: "Unidade", value: "Matriz" },
    { label: "Ramal", value: "1234" },
  ];

  return (
    <Box sx={{ 
      p: { xs: 2, md: 4 }, 
      backgroundColor: "#f4f6f8", 
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center", // Centraliza horizontalmente
      alignItems: "flex-start"   // Começa pelo topo mas centralizado
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
          <Grid item xs={12} md={6}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
               Informações do Solicitante
            </Typography>
            
            <List sx={{ 
              mb: 4, 
              bgcolor: '#fafafa', 
              borderRadius: 2, 
              border: '1px solid #e0e0e0',
              width: "100%" // Garante que use toda a largura da coluna
            }}>
              {userData.map((item, index) => (
                <Box key={item.label}>
                  <ListItem
                    secondaryAction={
                      <Tooltip title={`Editar ${item.label}`}>
                        <IconButton edge="end" size="small" color="primary">
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    }
                    sx={{ py: 1.5 }} // Aumentei o espaçamento interno
                  >
                    <Box sx={{ display: 'flex', width: '100%' }}>
                      <Typography variant="subtitle1" fontWeight="bold" sx={{ minWidth: 120 }}>
                        {item.label}:
                      </Typography>
                      <Typography variant="subtitle1" color="textPrimary">
                        {item.value}
                      </Typography>
                    </Box>
                  </ListItem>
                  {index < userData.length - 1 && <Divider />}
                </Box>
              ))}
            </List>

            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
              Descrição do Problema
            </Typography>
            <Stack spacing={3}>
              <TextField fullWidth label="Título do Chamado" placeholder="Ex: Erro ao acessar o sistema ERP" />
              <TextField fullWidth multiline rows={8} label="Descrição Detalhada" placeholder="Descreva aqui o que aconteceu..." />
            </Stack>
          </Grid>

          {/* COLUNA DIREITA: Agora com md={5} para não sobrar espaço branco */}
          <Grid item xs={12} md={5}>
            <Stack spacing={4}>
              <Box>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>Classificação e Impacto</Typography>
                <TextField select fullWidth label="Tipo de Solicitação" defaultValue="incidente" sx={{ mb: 3 }}>
                  <MenuItem value="solicitacao">Solicitação (Pedido de algo novo)</MenuItem>
                  <MenuItem value="incidente">Incidente (Algo parou de funcionar)</MenuItem>
                </TextField>

                <Typography variant="body2" fontWeight="600" sx={{ mb: 1 }}>Categoria Principal</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Card variant="outlined" sx={{ borderColor: 'primary.main', bgcolor: '#f0f7ff' }}>
                      <CardActionArea sx={{ p: 4, textAlign: 'center' }}>
                        <ComputerIcon color="primary" sx={{ fontSize: 40 }} />
                        <Typography variant="body1" fontWeight="bold">Hardware</Typography>
                      </CardActionArea>
                    </Card>
                  </Grid>
                  <Grid item xs={6}>
                    <Card variant="outlined">
                      <CardActionArea sx={{ p: 4, textAlign: 'center' }}>
                        <CodeIcon color="action" sx={{ fontSize: 40 }} />
                        <Typography variant="body1">Software</Typography>
                      </CardActionArea>
                    </Card>
                  </Grid>
                </Grid>
              </Box>

              <TextField select fullWidth label="Impacto no Trabalho" defaultValue="setor">
                <MenuItem value="eu">Apenas no meu computador</MenuItem>
                <MenuItem value="setor">Afeta todo o meu setor</MenuItem>
                <MenuItem value="empresa">Afeta a unidade inteira</MenuItem>
              </TextField>

              <Box>
                <Typography variant="body2" fontWeight="600" gutterBottom>Anexar Evidências (Prints/Docs)</Typography>
                <Box sx={{
                  border: '2px dashed #bdbdbd',
                  borderRadius: 3,
                  p: 6,
                  textAlign: 'center',
                  bgcolor: '#fafafa',
                  '&:hover': { bgcolor: '#f0f4f8', borderColor: 'primary.main', cursor: 'pointer' }
                }}>
                  <CloudUploadIcon sx={{ fontSize: 50, color: 'text.secondary', mb: 1 }} />
                  <Typography variant="body1" fontWeight="medium">Arraste arquivos ou clique para selecionar</Typography>
                </Box>
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
          >
            ENVIAR CHAMADO
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}