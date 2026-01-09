import { useNavigate, Outlet } from "react-router-dom";
import { Stack, Grid, Paper, Typography, Box } from "@mui/material";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";


export default function Layout() {
    const style = {
        p: 0,
        width: "100%",
        maxWidth: 360,
        borderRadius: 2,
        border: "1px solid",
        borderColor: "divider",
        backgroundColor: "background.paper",
    };

    const navigate = useNavigate();


    return (
        <Box sx={{ display: "flex", gap: 2 }}>

            {/* SIDEBAR */}
            <Paper style={{ width: 240, height: "100vh" }}>
                <Box
                    sx={{
                        height: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                >
                    <List sx={style} aria-label="menu">

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
            <Stack spacing={3} sx={{ flex: 1 }}>

                {/* BUSCA E USER */}
                <Paper style={{ padding: 16 }}>
                    BUSCAR
                </Paper>


                {/* aqui muda conforme a rota */}
                <Outlet />


            </Stack>
        </Box>
    );
}
