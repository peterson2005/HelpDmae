import { useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { 
    Stack, Paper, Box, IconButton, InputBase, 
    Badge, Avatar, Typography, Divider, List, 
    ListItemButton, ListItemText 
} from "@mui/material";

// Ícones
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";

export default function Layout() {
    // 1. Estado para controlar se o menu está aberto
    const [open, setOpen] = useState(true);

    const toggleDrawer = () => {
        setOpen(!open);
    };

    const navigate = useNavigate();

    const menuStyle = {
        p: 0,
        width: "100%",
        maxWidth: 360,
        borderRadius: 4,
        border: "1px solid",
        borderColor: "divider",
        backgroundColor: "background.paper",
        // Esconde o menu se estiver fechado para evitar overflow visual
        display: open ? "block" : "none", 
    };

    return (
        <Box sx={{ display: "flex", gap: 2, minHeight: "100vh" }}>

            {/* SIDEBAR COM LARGURA DINÂMICA */}
            <Paper 
                sx={{ 
                    width: open ? 160 : 60, // Muda a largura
                    transition: "width 0.3s", // Animação suave
                    height: "100vh",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center"
                }}
            >
                {/* BOTÃO HAMBÚRGUER */}
                <Box sx={{ p: 1, width: "100%", display: "flex", justifyContent: open ? "flex-end" : "center" }}>
                    <IconButton onClick={toggleDrawer}>
                        <MenuIcon fontSize="large" />
                    </IconButton>
                </Box>

                <Box
                    sx={{
                        flex: 1,
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        // Se fechado, não mostra a lista
                        visibility: open ? "visible" : "hidden" 
                    }}
                >
                    <List sx={menuStyle} aria-label="menu">
                        <ListItemButton onClick={() => navigate("/Home")}>
                            <ListItemText primary="Home" />
                        </ListItemButton>
                        <Divider component="li" />
                        <ListItemButton onClick={() => navigate("/abrir-chamado")}>
                            <ListItemText primary="Abrir Chamado" />
                        </ListItemButton>
                        <Divider component="li" />
                        <ListItemButton onClick={() => navigate("/meus-chamados")}>
                            <ListItemText primary="Meus Chamados" />
                        </ListItemButton>
                        <Divider component="li" />
                        <ListItemButton onClick={() => navigate("/configuracao")}>
                            <ListItemText primary="Configurações" />
                        </ListItemButton>
                    </List>
                </Box>
            </Paper>

            {/* CONTEÚDO PRINCIPAL */}
            <Stack spacing={3} sx={{ flex: 1,}}>
                {/* BUSCA E USER */}
                <Paper 
                    elevation={0} 
                    sx={{ 
                        p: "8px 16px", 
                        display: "flex", 
                        alignItems: "center", 
                        justifyContent: "space-between",
                        borderRadius: 3, 
                        border: "1px solid",
                        borderColor: "divider"
                    }}
                >
                    {/* Barra de Busca */}
                    <Box sx={{ 
                        display: "flex", 
                        alignItems: "center", 
                        backgroundColor: "#f1f3f4", 
                        borderRadius: 2, 
                        px: 2, 
                        py: 0.5,
                        width: "300px" 
                    }}>
                        <SearchIcon sx={{ color: "text.secondary", fontSize: 20 }} />
                        <InputBase
                            placeholder="Search"
                            sx={{ ml: 1, flex: 1, fontSize: "0.875rem" }}
                        />
                    </Box>
                    {/* Notificações e Perfil */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <IconButton size="small">
                            <NotificationsNoneIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small">
                            <Badge variant="dot" color="error">
                                <NotificationsNoneIcon fontSize="small" />
                            </Badge>
                        </IconButton>
                        
                        <Divider orientation="vertical" flexItem sx={{ mx: 1, height: 24, alignSelf: "center" }} />

                        <Typography variant="body2" sx={{ mr: 1, fontWeight: 500, color: "text.secondary" }}>
                            Olá, João!
                        </Typography>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: "#007bff", fontSize: "0.85rem" }}>J</Avatar>
                    </Box>
                </Paper>

                {/* aqui muda conforme a rota */}
                <Outlet />
            </Stack>
        </Box>
    );
}