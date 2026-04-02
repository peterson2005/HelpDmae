import React, { useState } from 'react';
import axios from 'axios';
import {
  Box, Container, Typography, Tabs, Tab, Paper,
  TextField, Button, Switch, FormControlLabel,
  Divider, Stack, Grid
} from '@mui/material';

import { useTheme } from '@mui/material/styles';
import { useColorMode } from '../../ThemeContext';

// Ícones
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import PaletteIcon from '@mui/icons-material/Palette';
import NotificationsIcon from '@mui/icons-material/Notifications';
import WorkIcon from '@mui/icons-material/Work';
import BusinessIcon from '@mui/icons-material/Business';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';

export default function Configuracao() {

  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado") || "{}");

  const [loading, setLoading] = useState(false);

  const [tabIndex, setTabIndex] = useState(0);

  const theme = useTheme();
  const { toggleColorMode } = useColorMode();

  const [senhas, setSenhas] = useState({
    atual: '',
    nova: '',
    confirmar: ''
  });

  const [userFields, setUserFields] = useState([
    { id: 'nome', label: 'Nome Completo', value: usuarioLogado.nome || '' },
    { id: 'matricula', label: 'Matrícula', value: usuarioLogado.matricula || '' },
    { id: 'cargo', label: 'Cargo', value: usuarioLogado.cargo || '' },
    { id: 'setor', label: 'Setor', value: usuarioLogado.setor || '' },
    { id: 'unidade', label: 'Unidade', value: usuarioLogado.unidade || '' },
    { id: 'ramal', label: 'Ramal', value: usuarioLogado.ramal || '' },
  ]);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const handleSalvarPerfil = async () => {
    try {
      setLoading(true);
      // Converte o array userFields em um objeto simples
      const dadosParaEnviar = userFields.reduce((acc, field) => {
        acc[field.id] = field.value;
        return acc;
      }, {});

      // Chamada para a API
      const response = await axios.put(
        `http://localhost:5000/usuarios/${usuarioLogado.id}/perfil`,
        dadosParaEnviar
      );

      if (response.status === 200) {
        // 1. Atualiza o localStorage com os novos dados vindos do banco
        const usuarioAtualizado = { ...usuarioLogado, ...response.data.usuario };
        localStorage.setItem("usuarioLogado", JSON.stringify(usuarioAtualizado));

        alert("Perfil atualizado com sucesso!");

        // Opcional: recarregar a página para atualizar o nome na Sidebar/Header
        // window.location.reload(); 
      }
    } catch (error) {
      console.error("Erro ao salvar perfil:", error);
      alert("Erro ao atualizar perfil. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleAlterarSenha = async () => {
    // Validações básicas
    if (!senhas.atual || !senhas.nova || !senhas.confirmar) {
      return alert("Preencha todos os campos de senha.");
    }
    if (senhas.nova !== senhas.confirmar) {
      return alert("A nova senha e a confirmação não coincidem.");
    }
    if (senhas.nova.length < 3) {
      return alert("A nova senha deve ter pelo menos 3 caracteres.");
    }

    try {
      const response = await axios.patch(`http://localhost:5000/usuarios/${usuarioLogado.id}/senha-config`, {
        senhaAtual: senhas.atual,
        novaSenha: senhas.nova
      });

      alert(response.data.message);
      setSenhas({ atual: '', nova: '', confirmar: '' }); // Limpa os campos
    } catch (error) {
      alert(error.response?.data?.error || "Erro ao trocar senha.");
    }
  };


  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 3 }}>
        Configurações
      </Typography>

      <Paper sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, minHeight: 400, borderRadius: 3 }}>
        {/* Menu Lateral de Abas */}
        <Tabs
          orientation="vertical"
          value={tabIndex}
          onChange={handleTabChange}
          sx={{
            borderRight: 1,
            borderColor: 'divider',
            minWidth: 200,
            '.MuiTab-root': { alignItems: 'flex-start', textAlign: 'left', pl: 3 }
          }}
        >
          <Tab icon={<PersonIcon />} iconPosition="start" label="Perfil" />
          <Tab icon={<LockIcon />} iconPosition="start" label="Segurança" />
          <Tab icon={<PaletteIcon />} iconPosition="start" label="Aparência" />
          <Tab icon={<NotificationsIcon />} iconPosition="start" label="Notificações" />
        </Tabs>

        {/* Conteúdo das Abas */}
        <Box sx={{ p: 4, flex: 1 }}>

          {/* ABA: PERFIL */}
          {tabIndex === 0 && (
            <Box>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Meu Perfil
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                Estas informações serão preenchidas automaticamente ao abrir um novo chamado.
              </Typography>

              <Grid container spacing={2}>
                {userFields.map((field) => (
                  <Grid item xs={12} md={6} key={field.id}>
                    <TextField
                      fullWidth
                      label={field.label}
                      value={field.value}
                      variant="outlined"
                      // BLOQUEIO: Não deixa editar matrícula nem nome
                      disabled={field.id === 'matricula' || field.id === 'nome'}
                      onChange={(e) => {
                        const newFields = userFields.map(f =>
                          f.id === field.id ? { ...f, value: e.target.value } : f
                        );
                        setUserFields(newFields);
                      }}
                      // Dica visual: Deixa o campo desabilitado com uma aparência levemente diferente
                      sx={{ "& .MuiInputBase-input.Mui-disabled": { WebkitTextFillColor: "#666" } }}
                    />
                  </Grid>
                ))}
              </Grid>

              <Button
                variant="contained"
                sx={{ mt: 4, px: 4 }}
                onClick={handleSalvarPerfil}
              >
                Salvar Alterações
              </Button>
            </Box>
          )}

          {/* ABA: SEGURANÇA (SENHA) */}
          {tabIndex === 1 && (
            <Box>
              <Typography variant="h6" fontWeight="bold" gutterBottom>Alterar Senha</Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                Para sua segurança, não compartilhe sua senha com terceiros.
              </Typography>

              <Stack spacing={3} sx={{ mt: 2, maxWidth: 400 }}>
                <TextField
                  label="Senha Atual"
                  type="password"
                  fullWidth
                  value={senhas.atual}
                  onChange={(e) => setSenhas({ ...senhas, atual: e.target.value })}
                />
                <TextField
                  label="Nova Senha"
                  type="password"
                  fullWidth
                  value={senhas.nova}
                  onChange={(e) => setSenhas({ ...senhas, nova: e.target.value })}
                />
                <TextField
                  label="Confirmar Nova Senha"
                  type="password"
                  fullWidth
                  value={senhas.confirmar}
                  onChange={(e) => setSenhas({ ...senhas, confirmar: e.target.value })}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAlterarSenha}
                  sx={{ width: 'fit-content' }}
                >
                  Atualizar Senha
                </Button>
              </Stack>
            </Box>
          )}

          {/* ABA: PERSONALIZAÇÃO (MODO NOTURNO) */}
          {tabIndex === 2 && (
            <Box>
              <Typography variant="h6" fontWeight="bold" gutterBottom>Personalização</Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                Ajuste a aparência do sistema para o seu conforto.
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <FormControlLabel
                control={
                  <Switch 
  checked={theme.palette.mode === 'dark'} 
  onChange={toggleColorMode} // Use a função desestruturada
  color="primary" 
/>
                }
                label={`Modo Noturno (${theme.palette.mode === 'dark' ? 'Ativado' : 'Desativado'})`}
              />
            </Box>
          )}

          {/* ABA: NOTIFICAÇÕES */}
          {tabIndex === 3 && (
            <Box>
              <Typography variant="h6" gutterBottom>Preferências de Notificação</Typography>
              <Stack spacing={1}>
                <FormControlLabel control={<Switch defaultChecked />} label="E-mail quando um chamado for atribuído" />
                <FormControlLabel control={<Switch defaultChecked />} label="Notificação de novos comentários" />
                <FormControlLabel control={<Switch />} label="Resumo semanal de chamados" />
              </Stack>
            </Box>
          )}

        </Box>
      </Paper>
    </Container>
  );
}