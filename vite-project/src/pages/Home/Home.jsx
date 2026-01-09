import { useNavigate } from "react-router-dom";
import { Stack, Grid, Paper, Typography, Box } from "@mui/material";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";


export default function Home() {
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

      

      {/* CONTEÚDO PRINCIPAL */}
      <Stack spacing={3} sx={{ flex: 1 }}>


        {/* CARDS DASHBOARD */}
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Paper style={{ padding: 16 }}>DASHBOARD CARD 1</Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper style={{ padding: 16 }}>DASHBOARD CARD 2</Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper style={{ padding: 16 }}>DASHBOARD CARD 3</Paper>
          </Grid>
        </Grid>

        {/* CHAMADOS RECENTES */}
        <Paper style={{ padding: 16 }}>
          CHAMADOS RECENTES
        </Paper>

      </Stack>
    </Box>
  );
}
