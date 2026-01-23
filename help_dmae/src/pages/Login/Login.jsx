import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Link,
  Alert,
  IconButton,
  InputAdornment,
} from "@mui/material";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

export default function Login() {
  const [matricula, setMatricula] = useState("");  // armazena o valor do email
  const [senha, setSenha] = useState("");  // armazena o valor da senha
  const [showSenha, setShowSenha] = useState(false); // Para esconder e mostrar a senha


  const navigate = useNavigate();  // rotas navegacao


  async function handleSubmit(e) {
    e.preventDefault(); // Passo 1: Impede que a página recarregue

    // Passo 2: Criar o objeto com o que foi digitado
    const dadosLogin = {
  matricula: matricula, // agora usa o nome correto
  senha: senha
};

    console.log("Tentando logar com:", dadosLogin);

    try {
      const resposta = await fetch("http://localhost:5000/login", {
        method: "POST", // Tipo de envio
        headers: {
          "Content-Type": "application/json", // Avisa que estamos enviando JSON
        },
        body: JSON.stringify(dadosLogin), // Transforma o objeto em texto para a rede
      });

      const resultado = await resposta.json(); // Espera a resposta do Node

      if (resposta.ok) {
        console.log("Sucesso!", resultado);

        // PASSO A: Salvar os dados do usuário no "pendrive" do navegador
        // resultado.user contém (nome, cargo, setor, ramal, id) que seu node enviou
        localStorage.setItem("usuarioLogado", JSON.stringify(resultado.user));

        // PASSO B: Navegar para a tela principal
        navigate("/");
      }
    } catch (erro) {
      console.error("Erro ao conectar com a API:", erro);
    }
  }



  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundImage: "url(/src/assets/bg-login.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Overlay escuro */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.4)",
        }}
      />

      {/* Card */}
      <Paper
        elevation={6}
        sx={{
          position: "relative",
          zIndex: 1,
          width: 380,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Logue para acessar a sua conta.
        </Typography>

        <Typography variant="body2" sx={{ mb: 2 }}>
          Não possuí uma conta?{" "}
          <Link href="#" underline="hover">
            Inscrever-se
          </Link>
        </Typography>

        <Alert severity="info" sx={{ mb: 2 }}>
          Utilize sua <b>Matrícula</b> e sua <b>Senha</b> para entrar.
        </Alert>

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
  label="Matrícula"
  fullWidth
  margin="normal"
  value={matricula}
  onChange={(e) => setMatricula(e.target.value)}
/>


          <TextField
            label="senha"
            type={showSenha ? "text" : "senha"}
            fullWidth
            margin="normal"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowSenha(!showSenha)}
                    edge="end"
                  >
                    {showSenha ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Link href="#" variant="body2" sx={{ mt: 2 }} >
              Esqueceu a senha ?
            </Link>
          </Box>

          <Button
            type="submit" // Este tipo já avisa ao formulário para executar o handleSubmit
            fullWidth
            size="large"
            variant="contained"
            sx={{
              mt: 3,
              py: 1.5,
              backgroundColor: "#1c252e",
              "&:hover": {
                backgroundColor: "#111827",
              },
            }}
          >
            Entrar
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
