import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import {
  Box, Typography, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip, IconButton,
  TextField, InputAdornment, Stack, Button, Tooltip
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FilterListIcon from '@mui/icons-material/FilterList';
import AddIcon from '@mui/icons-material/Add';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

export default function MeusChamados() {

  const navigate = useNavigate();
  // Dados fictícios baseados nas suas imagens
  const [chamados, setChamados] = useState([]); // Começa com lista vazia

  // Função que busca os dados no seu servidor Node.js
  const carregarChamados = async () => {
  try {
    const resposta = await axios.get('http://localhost:5000/chamados');
    
    // Ordena por ID de forma decrescente (do mais novo para o mais antigo)
    // Se quiser do menor para o maior, inverta b.id - a.id para a.id - b.id
    const dadosOrdenados = resposta.data.sort((a, b) => b.id - a.id);
    
    setChamados(dadosOrdenados); 
  } catch (error) {
    console.error("Erro ao buscar chamados:", error);
  }
};

  // Executa a busca assim que a tela abre
  useEffect(() => {
    carregarChamados();
  }, []);
  return (
    <Box sx={{ p: 4, bgcolor: "#f4f6f8", minHeight: "100vh" }}>
      {/* Título da Página */}
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 4, color: "#1c252e" }}>
        Meus Chamados
      </Typography>

      {/* Cards de Resumo (Contadores no topo) */}
      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        <Chip label="Todos (50)" color="primary" sx={{ fontWeight: 'bold' }} onClick={() => { }} />
        <Chip label="Abertos (10)" variant="outlined" onClick={() => { }} />
        <Chip label="Em Atendimento (5)" variant="outlined" onClick={() => { }} />
        <Chip label="Concluídos (0)" variant="outlined" onClick={() => { }} />
        <Chip label="Cancelados (0)" variant="outlined" onClick={() => { }} />
      </Stack>

      <Paper elevation={0} sx={{ borderRadius: 3, border: "1px solid", borderColor: "divider", overflow: "hidden" }}>

        {/* BARRA DE FILTROS (Igual à imagem) */}
        <Box sx={{ p: 2, display: 'flex', gap: 2, alignItems: 'center', bgcolor: "#fff" }}>
          <TextField
            size="small"
            placeholder="Pesquisar chamado..."
            sx={{ width: 300 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />

          <Button variant="contained" startIcon={<FilterListIcon />} sx={{ bgcolor: "#1976d2", textTransform: 'none' }}>
            Status
          </Button>

          <Button variant="outlined" startIcon={<CalendarTodayIcon />} sx={{ textTransform: 'none', color: 'text.secondary', borderColor: 'divider' }}>
            Data
          </Button>

          <Box sx={{ flexGrow: 1 }} /> {/* Empurra o botão de adicionar para o fim */}

          <Button variant="contained" startIcon={<AddIcon />} color="primary" sx={{ borderRadius: 2 }}>
            Adicionar Filtro
          </Button>
        </Box>

        {/* TABELA DE DADOS */}
        <TableContainer>
          <Table sx={{ minWidth: 800 }}>
            <TableHead sx={{ bgcolor: "#f8f9fa" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', color: 'text.secondary' }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'text.secondary' }}>Título</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'text.secondary' }}>Categoria</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'text.secondary' }}>Data</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'text.secondary' }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
  {chamados.map((chamado) => (
    <TableRow 
      key={chamado.id} 
      onClick={() => navigate(`/detalhes/${chamado.id}`)} // Navega ao clicar em qualquer lugar da linha
      sx={{ 
        cursor: 'pointer', // Faz o mouse virar a "mãozinha" de link
        '&:hover': {
          bgcolor: 'rgba(0, 0, 0, 0.04) !important', // Escurece um pouco mais que o padrão
        },
        transition: 'background-color 0.2s ease' // Suaviza a mudança de cor
      }}
    >
      <TableCell sx={{ fontWeight: 'bold' }}>#{chamado.id}</TableCell>
      <TableCell>{chamado.titulo}</TableCell>
      <TableCell>{chamado.categoria}</TableCell>
      <TableCell>{chamado.data_abertura || chamado.data}</TableCell>
      <TableCell>
        <Chip
          label={chamado.status || "Sem Status"}
          size="small"
          sx={{
            bgcolor: chamado.cor || '#ccc',
            color: '#fff',
            borderRadius: 1.5,
            fontWeight: 'bold',
            minWidth: 100,
            cursor: 'pointer' // Mantém o cursor correto sobre o chip
          }}
        />
      </TableCell>
    </TableRow>
  ))}
</TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}