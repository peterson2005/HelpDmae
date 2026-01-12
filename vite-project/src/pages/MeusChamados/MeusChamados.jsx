import { useState, useEffect } from 'react';
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
  // Dados fictícios baseados nas suas imagens
  const [chamados, setChamados] = useState([]); // Começa com lista vazia

  // Função que busca os dados no seu servidor Node.js
  const carregarChamados = async () => {
    try {
      const resposta = await axios.get('http://localhost:5000/chamados');
      setChamados(resposta.data); // Coloca os dados do banco no estado do React
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
                <TableCell sx={{ fontWeight: 'bold', color: 'text.secondary' }} align="center">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {chamados.map((chamado) => (
                <TableRow key={chamado.id} hover>
                  <TableCell sx={{ fontWeight: 'bold' }}>#{chamado.id}</TableCell>
                  <TableCell>{chamado.titulo}</TableCell>
                  <TableCell>{chamado.categoria}</TableCell> {/* Antes era chamado.categoria_id */}
                  <TableCell>{chamado.data_abertura || chamado.data}</TableCell>     {/* Antes era chamado.data_abertura */}
                  <TableCell>
                    <Chip
                      label={chamado.status || "Sem Status"}
                      size="small"
                      sx={{
                        // Se chamado.cor existir, usa ela. Se não, usa cinza (#ccc)
                        bgcolor: chamado.cor || '#ccc',
                        color: '#fff',
                        borderRadius: 1.5,
                        fontWeight: 'bold',
                        minWidth: 100
                      }}
                    />
                  </TableCell>
                  {/* ... botões de ação */}
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                      
                      <Button
                        size="small"
                        variant="outlined"
                        sx={{ textTransform: 'none', fontSize: '12px' }}
                      >
                        Ações
                      </Button>
                    </Box>
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