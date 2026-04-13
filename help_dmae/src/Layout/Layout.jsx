import { useState } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import {
    Stack, Paper, Box, IconButton, InputBase,
    Badge, Avatar, Typography, Divider, List,
    ListItemButton, ListItemText, Menu,
    MenuItem, Tooltip,
    ListItemIcon, Switch
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DarkModeIcon from '@mui/icons-material/DarkMode';
import SearchIcon from "@mui/icons-material/Search";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import Logout from '@mui/icons-material/Logout';
import HomeIcon from '@mui/icons-material/Home';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';



export default function Layout() {
    const [open, setOpen] = useState(true);

    const dadosUsuario = JSON.parse(localStorage.getItem("usuarioLogado"));
    const nomeCompleto = dadosUsuario?.nome || "Usuário";
    const primeiroNome = nomeCompleto.split(" ")[0];
    const inicial = primeiroNome.charAt(0).toUpperCase();

    const isAdmin = String(dadosUsuario?.perfil_id) === "3";

    const location = useLocation();
    const isActive = (path) => location.pathname === path;

    const toggleDrawer = () => {
        setOpen(!open);
    };

    const navigate = useNavigate();

    const menuStyle = {
        p: 0,
        width: "100%",
        borderRadius: 0,
        backgroundColor: "transparent",
        display: "block",
        overflow: "hidden",
        gap: 1.5
    };
    const [anchorEl, setAnchorEl] = useState(null);
    const openMenu = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        localStorage.removeItem("usuarioLogado");
        navigate("/login");
    };

    return (
        <Box sx={{
            display: "flex",
            gap: 2,
            minHeight: "100vh",
            bgcolor: "#f4f6f8",
            p: 1
        }}>

            {/* SIDEBAR COM LARGURA DINÂMICA */}
            <Paper
                sx={{
                    width: open ? 180 : 60,
                    transition: "width 0.3s",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    position: "sticky",
                    top: 16,
                    height: "calc(100vh - 32px)",
                    overflowX: "hidden",
                    overflowY: "auto"

                }}
            >
                {/* BOTÃO HAMBÚRGUER */}

                <Box sx={{
                    p: 1, width: "100%", justifyContent: open, position: "sticky", top: 0,
                    bgcolor: "inherit", justifyContent: "center",
                    zIndex: 10
                }}>
                    <Tooltip title={!open ? "Menu" : ""} placement="right">
                        <IconButton onClick={toggleDrawer}>
                            <MenuIcon fontSize="large" />
                        </IconButton>
                    </Tooltip>
                </Box>

                <Box
                    sx={{
                        flex: 1,
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "flex-start",
                        alignItems: "center",
                        pt: 2,
                    }}
                >
                    <List sx={menuStyle} aria-label="menu">
                        {[
                            { text: "Home", icon: <HomeIcon />, path: "/Home" },
                            { text: "Chamados", icon: <AssignmentIcon />, path: "/chamados" },
                            { text: "Abrir Chamado", icon: <AddCircleIcon />, path: "/abrir-chamado" },
                            ...(isAdmin ? [{ text: "Usuários", icon: <PeopleIcon />, path: "/usuarios" }] : []),
                            { text: "Configurações", icon: <SettingsIcon />, path: "/configuracao" },
                        ].map((item) => (
                            <Tooltip key={item.text} title={!open ? item.text : ""} placement="right">
                                <ListItemButton
                                    onClick={() => navigate(item.path)}
                                    selected={isActive(item.path)}
                                    sx={{
                                        justifyContent: open ? "initial" : "center",
                                        px: 1.0,
                                        py: 1.5,
                                        backgroundColor: "transparent",
                                        borderLeft: "4px solid transparent",
                                        "&.Mui-selected": {
                                            backgroundColor: "rgba(0, 123, 255, 0.08)",
                                            borderLeft: "4px solid #007bff",
                                            "& .MuiListItemIcon-root": {
                                                color: "primary.main",
                                            },
                                            "& .MuiListItemText-primary": {
                                                color: "primary.main",
                                                fontWeight: "bold",
                                            },
                                        },
                                        "&:hover": {
                                            backgroundColor: "rgba(0, 0, 0, 0.07)",
                                        },
                                    }}
                                >
                                    <ListItemIcon
                                        sx={{
                                            minWidth: 0,
                                            mr: open ? 2 : "auto",
                                            justifyContent: "center",
                                            color: isActive(item.path) ? "primary.main" : "inherit",
                                        }}
                                    >
                                        {item.icon}
                                    </ListItemIcon>
                                    {open && <ListItemText primary={item.text} />}
                                </ListItemButton>
                            </Tooltip>
                        ))}

                    </List>
                </Box>

                {/* FIM DA SIDEBAR: MODO NOTURNO E SAIR */}
                <Box sx={{ width: "100%", mt: "auto", pb: 2 }}>
                    <Divider sx={{ mb: 1 }} />

                    {/* SWITCH MODO NOTURNO */}
                    <Tooltip title={!open ? "Alternar Tema" : ""} placement="right">
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: open ? "space-between" : "center",
                                px: open ? 2.5 : 0,
                                py: 1,
                                minHeight: 48
                            }}
                        >
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                <ListItemIcon sx={{ minWidth: 0, mr: open ? 2 : 0, justifyContent: "center" }}>
                                    <SettingsIcon color="action" />
                                </ListItemIcon>
                                {open && <ListItemText primary="Tema" />}
                            </Box>

                            {open && (
                                <Switch
                                    size="small"
                                    onChange={(e) => console.log("Escuro:", e.target.checked)}
                                />
                            )}
                        </Box>
                    </Tooltip>

                    {/* BOTÃO SAIR */}
                    <Tooltip title={!open ? "Sair" : ""} placement="right">
                        <ListItemButton
                            onClick={handleLogout}
                            sx={{
                                justifyContent: open ? "initial" : "center",
                                px: 2.5,
                                color: "error.main",
                                "&:hover": { bgcolor: "error.light", color: "white", "& .MuiListItemIcon-root": { color: "white" } }
                            }}
                        >
                            <ListItemIcon sx={{ minWidth: 0, mr: open ? 2 : "auto", justifyContent: "center", color: "inherit" }}>
                                <Logout />
                            </ListItemIcon>
                            {open && <ListItemText primary="Sair" />}
                        </ListItemButton>
                    </Tooltip>
                </Box>
            </Paper>

            {/* CONTEÚDO PRINCIPAL */}
            <Stack spacing={3} sx={{ flex: 1, }}>
                {/*USER */}
                <Paper
                    elevation={0}
                    sx={{
                        p: "8px 16px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        borderRadius: 3,
                        border: "1px solid",
                        borderColor: "divider",
                        position: "sticky",
                        top: 16,
                        zIndex: 1000,
                        bgcolor: "rgba(255, 255, 255, 0.9)",
                        backdropFilter: "blur(4px)"
                    }}
                >

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>

                        <Typography
                            variant="h6"
                            component="h1"
                            sx={{
                                fontWeight: 700,
                                color: "primary.main",
                                letterSpacing: "-0.5px",
                                fontFamily: "'Poppins', sans-serif" // Se tiver essa fonte, fica excelente
                            }}
                        >
                            HelpDmae
                        </Typography>
                    </Box>


                    {/* Notificações e Perfil */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Tooltip title="Noticações" placement="right">
                            <IconButton size="small">
                                <NotificationsNoneIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>


                        <Divider orientation="vertical" flexItem sx={{ mx: 1, height: 24, alignSelf: "center" }} />

                        <Typography variant="body2" sx={{ mr: 1, fontWeight: 500, color: "text.secondary" }}>
                            Olá, {primeiroNome}!
                        </Typography>
                        <Tooltip title={!open ? "Perfil" : ""} placement="right">
                            <IconButton
                                onClick={handleClick}
                                size="small"
                                sx={{ ml: 1 }}
                                aria-controls={openMenu ? 'account-menu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={openMenu ? 'true' : undefined}
                            >
                                <Avatar sx={{ width: 32, height: 32, bgcolor: "#007bff", fontSize: "0.85rem" }}>
                                    {inicial}
                                </Avatar>
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Paper>

                {/* aqui muda conforme a rota */}
                <Outlet />
            </Stack>
            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={openMenu}
                onClose={handleClose}
                onClick={handleClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                PaperProps={{
                    elevation: 3,
                    sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                        '& .MuiAvatar-root': { width: 32, height: 32, ml: -0.5, mr: 1 },
                        '&::before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                        },
                    },
                }}
            >
                <MenuItem onClick={() => navigate("/configuracao")}>
                    Meu Perfil
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                    <ListItemIcon>
                        <Logout fontSize="small" color="error" />
                    </ListItemIcon>
                    Sair
                </MenuItem>
            </Menu>
        </Box>
    );
}