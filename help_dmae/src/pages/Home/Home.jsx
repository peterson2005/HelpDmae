import { useEffect, useState } from "react";
import {
  Stack, Grid, Paper, Typography, Box, Avatar,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip
} from "@mui/material";
import { LineChart, PieChart, BarChart } from '@mui/x-charts';
import SettingsIcon from '@mui/icons-material/Settings';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import EngineeringIcon from '@mui/icons-material/Engineering';
import axios from "axios";

export default function Home() {
  const [stats, setStats] = useState({ total: 0, abertos: 0, finalizados: 0 });
  const [chamados, setChamados] = useState([]);
  const [dadosSemanais, setDadosSemanais] = useState({ dias: [], valores: [] });
  const [topTecnicos, setTopTecnicos] = useState([]);
useEffect(() => {
    // 1. Estatísticas dos Cards
    axios.get("http://localhost:5000/dashboard/stats")
      .then(res => setStats(res.data))
      .catch(err => console.error("Erro stats:", err));

    // 2. Volume Semanal (Formata o gráfico de linha)
    axios.get("http://localhost:5000/dashboard/semanal")
      .then(res => {
        const dias = res.data.map(item => item.dia);
        const valores = res.data.map(item => parseInt(item.quantidade));
        setDadosSemanais({ dias, valores });
      })
      .catch(err => console.error("Erro semanal:", err));

    // 3. Ranking de Técnicos
    axios.get("http://localhost:5000/dashboard/top-tecnicos")
      .then(res => setTopTecnicos(res.data))
      .catch(err => console.error("Erro técnicos:", err));

    // 4. Chamados Recentes
    axios.get("http://localhost:5000/chamados")
      .then(res => setChamados(res.data.slice(0, 5)))
      .catch(err => console.error("Erro chamados:", err));
  }, []);

  const emAtendimento = stats.total - (stats.abertos + stats.finalizados);
  return (
    <Box sx={{ p: 4, backgroundColor: "#f5f7fa", minHeight: "100vh" }}>
      <Stack spacing={4}>
        <Box>
          <Typography variant="h4" fontWeight="bold" color="#1c252e">Dashboard</Typography>
          <Typography variant="body1" color="textSecondary">Bem-vindo ao sistema HelpDmae.</Typography>
        </Box>

        {/* 1. CARDS */}
        <Grid container spacing={3}>
          {/* Card Total */}
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={0} sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2, borderRadius: 3, borderBottom: '4px solid #1976d2' }}>
              <Avatar sx={{ bgcolor: '#e3f2fd', color: '#1976d2' }}><SettingsIcon /></Avatar>
              <Box>
                <Typography variant="h4" fontWeight="bold">{stats.total}</Typography>
                <Typography variant="body2" color="textSecondary">Total</Typography>
              </Box>
            </Paper>
          </Grid>
          {/* Card Abertos */}
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={0} sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2, borderRadius: 3, borderBottom: '4px solid #ed6c02' }}>
              <Avatar sx={{ bgcolor: '#fff3e0', color: '#ed6c02' }}><PriorityHighIcon /></Avatar>
              <Box>
                <Typography variant="h4" fontWeight="bold">{stats.abertos}</Typography>
                <Typography variant="body2" color="textSecondary">Abertos</Typography>
              </Box>
            </Paper>
          </Grid>
          {/* Card Em Atendimento */}
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={0} sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2, borderRadius: 3, borderBottom: '4px solid #0288d1' }}>
              <Avatar sx={{ bgcolor: '#e1f5fe', color: '#0288d1' }}><EngineeringIcon /></Avatar>
              <Box>
                <Typography variant="h4" fontWeight="bold">{emAtendimento > 0 ? emAtendimento : 0}</Typography>
                <Typography variant="body2" color="textSecondary">Em Atendimento</Typography>
              </Box>
            </Paper>
          </Grid>
          {/* Card Finalizados */}
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={0} sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2, borderRadius: 3, borderBottom: '4px solid #2e7d32' }}>
              <Avatar sx={{ bgcolor: '#e8f5e9', color: '#2e7d32' }}><CheckCircleIcon /></Avatar>
              <Box>
                <Typography variant="h4" fontWeight="bold">{stats.finalizados}</Typography>
                <Typography variant="body2" color="textSecondary">Finalizados</Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* 2. SEÇÃO DE GRÁFICOS */}
        <Grid container spacing={3}>
          {/* Ranking Técnicos */}
          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 4, height: 450 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>Top Técnicos do Mês</Typography>
              <BarChart
                dataset={topTecnicos} // AGORA USA O ESTADO REAL
                yAxis={[{ scaleType: 'band', dataKey: 'nome' }]}
                series={[{ dataKey: 'finalizados', label: 'Concluídos', color: '#2e7d32' }]}
                layout="horizontal"
                height={350}
                margin={{ left: 100 }}
              />
            </Paper>
          </Grid>

          {/* Gráfico de Distribuição */}
          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 4, height: 450 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 4 }}>Distribuição de Status</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <PieChart
                  series={[{
                    data: [
                      { id: 0, value: stats.abertos, label: 'Abertos', color: '#ed6c02' },
                      { id: 1, value: stats.finalizados, label: 'Concluídos', color: '#2e7d32' },
                      { id: 2, value: emAtendimento > 0 ? emAtendimento : 0, label: 'Em Atendimento', color: '#1976d2' },
                    ],
                    innerRadius: 70, outerRadius: 100, paddingAngle: 5,
                  }]}
                  width={350} height={300}
                />
              </Box>
            </Paper>
          </Grid>

          {/* Gráfico Semanal (Volume) */}
          <Grid item xs={12}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 4 }}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
                <TrendingUpIcon color="primary" />
                <Typography variant="h6" fontWeight="bold">Volume de Chamados (Semanal)</Typography>
              </Stack>
              <LineChart
                xAxis={[{ 
                  data: dadosSemanais.dias.length > 0 ? dadosSemanais.dias : ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'], 
                  scaleType: 'point' 
                }]}
                series={[{ 
                  data: dadosSemanais.valores.length > 0 ? dadosSemanais.valores : [0, 0, 0, 0, 0, 0, 0], 
                  area: true, color: '#1976d2' 
                }]}
                height={300}
              />
            </Paper>
          </Grid>
        </Grid>

        {/* 3. TABELA DE CHAMADOS RECENTES */}
        <Paper elevation={0} sx={{ p: 3, borderRadius: 4, overflow: 'hidden' }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
            <Typography variant="h6" fontWeight="bold">Últimos Chamados</Typography>
            <Chip label="Ver todos" onClick={() => { }} component="button" sx={{ cursor: 'pointer' }} />
          </Stack>

          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: "#f8f9fa" }}>
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
                  <TableRow key={chamado.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell sx={{ fontWeight: 'bold', color: '#1976d2' }}>#{chamado.id}</TableCell>
                    <TableCell>{chamado.titulo}</TableCell>
                    <TableCell>
                      <Chip
                        label={chamado.status}
                        size="small"
                        sx={{
                          bgcolor: chamado.cor || '#ccc',
                          color: '#fff',
                          fontWeight: 'bold',
                          minWidth: 90
                        }}
                      />
                    </TableCell>
                    <TableCell>{chamado.solicitante_nome || "Sistema"}</TableCell>
                    <TableCell>{chamado.data}</TableCell>
                  </TableRow>
                ))}
                {chamados.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                      Nenhum chamado encontrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

      </Stack>
    </Box>
  );
}