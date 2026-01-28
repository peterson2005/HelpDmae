import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Typography, Button, Stack, IconButton, Chip, 
  TextField, InputAdornment, Menu, MenuItem, ListItemIcon, ListItemText,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions 
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import LockResetIcon from "@mui/icons-material/LockReset";

export default function Usuarios() {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [open, setOpen] = useState(false);
  const [busca, setBusca] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);
  const [openSenha, setOpenSenha] = useState(false); // Controla o Modal
  const [novaSenha, setNovaSenha] = useState(""); // Guarda a nova senha

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Busca os usuários no Back-end
  useEffect(() => {
    fetch("http://localhost:5000/usuarios")
      .then((res) => res.json())
      .then((data) => setUsuarios(data))
      .catch((err) => console.error("Erro ao buscar usuários:", err));
  }, []);

  const handleOpenMenu = (event, user) => {
    setAnchorEl(event.currentTarget);
    setUsuarioSelecionado(user);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setUsuarioSelecionado(null);
  };

  const handleExcluir = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este usuário?")) {
      try {
        await fetch(`http://localhost:5000/usuarios/${id}`, { method: 'DELETE' });
        setUsuarios(usuarios.filter(u => u.id !== id));
      } catch (err) {
        alert("Erro ao excluir usuário");
      }
    }
  };

  const usuariosFiltrados = usuarios.filter((user) => {
    const termo = busca.toLowerCase();


    return (
      user.nome?.toLowerCase().includes(termo) ||
      user.matricula?.toString().includes(termo) ||
      user.cargo?.toLowerCase().includes(termo) ||
      user.setor?.toLowerCase().includes(termo) ||
      user.unidade?.toLowerCase().includes(termo) ||
      user.ramal?.toString().includes(termo)
    );
  });

  const getPerfilLabel = (id) => {
    const perfis = {
      1: { label: "Usuário", color: "default" },
      2: { label: "Técnico", color: "primary" },
      3: { label: "Admin", color: "secondary" },
    };


    return perfis[id] || { label: "Comum", color: "default" };
  };

  const handleAlterarSenha = async () => {
    if (!novaSenha) return alert("Digite uma nova senha");

    try {
      const response = await fetch(`http://localhost:5000/usuarios/${usuarioSelecionado.id}/senha`, {
        method: 'PATCH', // Usamos PATCH para atualizações parciais
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senha: novaSenha })
      });

      if (response.ok) {
        alert("Senha alterada com sucesso!");
        setOpenSenha(false);
        setNovaSenha("");
      }
    } catch (err) {
      alert("Erro ao alterar senha");
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Cabeçalho */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold", color: "#333" }}>
          Gerenciamento de Usuários
        </Typography>


        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate("/usuarios/novo")}
          sx={{
            backgroundColor: "#007bff",
            borderRadius: "8px",
            textTransform: "none",
            fontWeight: "bold",
            "&:hover": { backgroundColor: "#0056b3" },
          }}
        >
          Criar Novo Usuário
        </Button>
      </Stack>

      {/* --- CAMPO DE PESQUISA --- */}
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Pesquisar por nome, matrícula, setor, ramal..."
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        sx={{ mb: 3, backgroundColor: "#fff" }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
        }}
      />

      {/* Tabela de Usuários */}
      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: "0px 4px 20px rgba(0,0,0,0.05)" }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ backgroundColor: "#f8f9fa" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Matrícula</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Nome</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Cargo</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Ramal</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Setor</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Unidade</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Perfil</TableCell>
              <TableCell sx={{ fontWeight: "bold" }} align="center">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {usuariosFiltrados.map((user) => (
              <TableRow
                key={user.id}
                hover
                onClick={() => console.log("Abrir edição do usuário:", user)}
                sx={{ cursor: 'pointer' }}
              >
                {/* Colunas de Dados reais */}
                <TableCell>{user.matricula}</TableCell>
                <TableCell sx={{ fontWeight: 500 }}>{user.nome}</TableCell>
                <TableCell>{user.cargo || "-"}</TableCell>
                <TableCell>{user.ramal || "-"}</TableCell>
                <TableCell>{user.setor || "-"}</TableCell>
                <TableCell>{user.unidade || "-"}</TableCell>
                <TableCell>
                  <Chip
                    label={getPerfilLabel(user.perfil_id).label}
                    color={getPerfilLabel(user.perfil_id).color}
                    size="small"
                  />
                </TableCell>

                {/* Coluna de Ações (Menu) */}
                <TableCell align="center" onClick={(e) => e.stopPropagation()}>
                  <IconButton onClick={(e) => handleOpenMenu(e, user)}>
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}

          </TableBody>
        </Table>
      </TableContainer>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        <MenuItem onClick={() => {
          navigate(`/usuarios/editar/${usuarioSelecionado.id}`);
          handleCloseMenu();
        }}>
          <ListItemIcon><EditIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Editar Usuário</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => {
          setOpenSenha(true); // Abre o modal
          setAnchorEl(null);  // Fecha o menu de bolinhas, mas NÃO limpa o usuarioSelecionado ainda
        }}>
          <ListItemIcon><LockResetIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Alterar Senha</ListItemText>
        </MenuItem>

        <MenuItem onClick={() => { handleExcluir(usuarioSelecionado.id); handleCloseMenu(); }} sx={{ color: 'error.main' }}>
          <ListItemIcon><DeleteIcon fontSize="small" color="error" /></ListItemIcon>
          <ListItemText>Excluir Usuário</ListItemText>
        </MenuItem>
      </Menu>
      {/* Modal de Alterar Senha */}
      <Dialog open={openSenha} onClose={() => setOpenSenha(false)}>
        <DialogTitle sx={{ fontWeight: 'bold', color: '#1976d2' }}>
          Alterar Senha
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
          Usuário: <strong>{usuarioSelecionado?.nome}</strong>
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Nova Senha"
            type="password"
            fullWidth
            variant="outlined"
            value={novaSenha}
            onChange={(e) => setNovaSenha(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenSenha(false)} color="inherit">Cancelar</Button>
          <Button
            onClick={handleAlterarSenha}
            variant="contained"
            startIcon={<LockResetIcon />}
          >
            SALVAR
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}