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

export default function Chamados() {

  const navigate = useNavigate();
  // Dados fictícios baseados nas suas imagens
  const [chamados, setChamados] = useState([]); // Começa com lista vazia

  const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
  // Função que busca os dados no seu servidor Node.js
  const carregarChamados = async () => {
    try {
      // 1. Pegamos o usuário logado para saber quem ele é
      const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

      if (!usuarioLogado) {
        navigate("/login");
        return;
      }

      // 2. Enviamos o usuario_id e o perfil_id para o servidor
      const resposta = await axios.get('http://localhost:5000/chamados', {
        params: {
          usuario_id: usuarioLogado.id,
          perfil_id: usuarioLogado.perfil_id
        }
      });

      // 3. O servidor já deve retornar os dados filtrados
      setChamados(resposta.data);
    } catch (error) {
      console.error("Erro ao buscar chamados:", error);
    }
  };

  // Executa a busca assim que a tela abre
  useEffect(() => {
    carregarChamados();
  }, []);

  const [termoBusca, setTermoBusca] = useState("");
  const [statusFiltro, setStatusFiltro] = useState("Todos");
  const chamadosFiltrados = chamados.filter((chamado) => {
    const matchesBusca = chamado.titulo.toLowerCase().includes(termoBusca.toLowerCase()) ||
      chamado.id.toString().includes(termoBusca) ||
      (chamado.solicitante_nome?.toLowerCase().includes(termoBusca.toLowerCase()));

    const matchesStatus = statusFiltro === "Todos" || chamado.status === statusFiltro;

    return matchesBusca && matchesStatus;
  });
  return (
    <Box sx={{ p: 4, bgcolor: "#f4f6f8", minHeight: "100vh" }}>
      {/* Título da Página */}
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 4, color: "#1c252e" }}>
        {usuario?.perfil_id === 1 ? "Minhas Solicitações" : "Fila de Atendimento"}
      </Typography>

      {/* Cards de Resumo (Contadores no topo) */}
      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        <Chip
          label={`Todos (${chamados.length})`}
          color={statusFiltro === "Todos" ? "primary" : "default"}
          onClick={() => setStatusFiltro("Todos")}
        />
        <Chip
          label={`Abertos (${chamados.filter(c => c.status === "Aberto").length})`}
          variant={statusFiltro === "Aberto" ? "filled" : "outlined"}
          color="primary"
          onClick={() => setStatusFiltro("Aberto")}
        />
        <Chip
          label={`Em Atendimento (${chamados.filter(c => c.status === "Em Atendimento").length})`}
          variant={statusFiltro === "Em Atendimento" ? "filled" : "outlined"}
          color="primary"
          onClick={() => setStatusFiltro("Em Atendimento")}
        />
        <Chip
          label={`Concluídos (${chamados.filter(c => c.status === "Concluído").length})`}
          variant={statusFiltro === "Concluído" ? "filled" : "outlined"}
          color="primary"
          onClick={() => setStatusFiltro("Concluído")}
        />
      </Stack>

      <Paper elevation={0} sx={{ borderRadius: 3, border: "1px solid", borderColor: "divider", overflow: "hidden" }}>

        {/* BARRA DE FILTROS (Igual à imagem) */}
        <Box sx={{ p: 2, display: 'flex', gap: 2, alignItems: 'center', bgcolor: "#fff" }}>
          <TextField
            size="small"
            placeholder="Pesquisar por ID, título ou nome..."
            value={termoBusca}
            onChange={(e) => setTermoBusca(e.target.value)}
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
                <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Título</TableCell>

                {/* SEGUNDA PARTE EXPLICADA: */}
                {/* Se o perfil NÃO FOR 1 (ou seja, for técnico), mostre a coluna Solicitante */}
                {usuario?.perfil_id !== 1 && (
                  <TableCell sx={{ fontWeight: 'bold' }}>Solicitante</TableCell>
                )}
                <TableCell sx={{ fontWeight: 'bold' }}>Categoria</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Data</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {chamadosFiltrados.map((chamado) => (
                <TableRow
                  key={chamado.id}
                  onClick={() => navigate(`/detalhes/${chamado.id}`)}
                  sx={{
                    cursor: 'pointer',
                    '&:hover': {
                      bgcolor: 'rgba(0, 0, 0, 0.04) !important',
                    },
                    transition: 'background-color 0.2s ease'
                  }}
                >
                  <TableCell sx={{ fontWeight: 'bold' }}>#{chamado.id}</TableCell>
                  <TableCell>{chamado.titulo}</TableCell>
                  {/* CÉLULA CONDICIONAL: Deve seguir a mesma lógica do cabeçalho */}
                  {usuario?.perfil_id !== 1 && (
                    <TableCell>{chamado.solicitante_nome || "N/A"}</TableCell>
                  )}

                  <TableCell>{chamado.categoria_nome || chamado.categoria}</TableCell>
                  <TableCell>{chamado.data}</TableCell>
                  <TableCell>
                    <Chip
                      label={chamado.status || "Sem Status"}
                      size="small"
                      sx={{
                        bgcolor: chamado.cor || '#ccc',
                        color: '#fff',
                        borderRadius: 1.5,
                        fontWeight: 'bold',
                        minWidth: 100
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