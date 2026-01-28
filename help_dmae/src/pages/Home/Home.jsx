import { useEffect, useState } from "react";
import { 
  Stack, Grid, Paper, Typography, Box, Avatar, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip 
} from "@mui/material";
import SettingsIcon from '@mui/icons-material/Settings';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import axios from "axios"; // Certifique-se de ter o axios instalado

export default function Home() {
  const [stats, setStats] = useState({ total: 0, abertos: 0, finalizados: 0 });
  const [chamados, setChamados] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/dashboard/stats")
      .then(res => setStats(res.data))
      .catch(err => console.error(err));

    axios.get("http://localhost:5000/chamados")
      .then(res => setChamados(res.data.slice(0, 5))) 
      .catch(err => console.error(err));
  }, []);

  return (
    <Box sx={{ display: "flex", p: 4, backgroundColor: "#f5f7fa", minHeight: "100vh" }}>
      <Stack spacing={4} sx={{ flex: 1 }}>
        
        {/* CARDS DASHBOARD */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper elevation={0} sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2, borderRadius: 3, borderBottom: '4px solid #1976d2' }}>
              <Avatar sx={{ bgcolor: '#e3f2fd', color: '#1976d2', width: 50, height: 50 }}><SettingsIcon /></Avatar>
              <Box>
                <Typography variant="h4" fontWeight="bold">{stats.total}</Typography>
                <Typography variant="body2" color="textSecondary">Total de chamados</Typography>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper elevation={0} sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2, borderRadius: 3, borderBottom: '4px solid #ed6c02' }}>
              <Avatar sx={{ bgcolor: '#fff3e0', color: '#ed6c02', width: 50, height: 50 }}><PriorityHighIcon /></Avatar>
              <Box>
                <Typography variant="h4" fontWeight="bold">{stats.abertos}</Typography>
                <Typography variant="body2" color="textSecondary">Chamados abertos</Typography>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper elevation={0} sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2, borderRadius: 3, borderBottom: '4px solid #2e7d32' }}>
              <Avatar sx={{ bgcolor: '#e8f5e9', color: '#2e7d32', width: 50, height: 50 }}><CheckCircleIcon /></Avatar>
              <Box>
                <Typography variant="h4" fontWeight="bold">{stats.finalizados}</Typography>
                <Typography variant="body2" color="textSecondary">Finalizados</Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* TABELA DE CHAMADOS RECENTES */}
        <Paper elevation={0} sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>Chamados Recentes</Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Título</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Solicitante</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Data</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {chamados.map((chamado) => (
                  <TableRow key={chamado.id} hover>
                    <TableCell>#{chamado.id}</TableCell>
                    <TableCell>{chamado.titulo}</TableCell>
                    <TableCell>
                      <Chip 
                        label={chamado.status} 
                        size="small" 
                        sx={{ bgcolor: chamado.cor, color: '#fff', fontWeight: 'bold' }} 
                      />
                    </TableCell>
                    <TableCell>{chamado.solicitante_nome || "N/A"}</TableCell>
                    <TableCell>{chamado.data}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

      </Stack>
    </Box>
  );
}