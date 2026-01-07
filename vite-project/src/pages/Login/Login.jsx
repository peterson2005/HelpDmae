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
  const [email, setEmail] = useState("");  // armazena o valor do email
  const [password, setPassword] = useState("");  // armazena o valor da senha
  const [showPassword, setShowPassword] = useState(false); // Para esconder e mostrar a senha


  const navigate = useNavigate();  // rotas navegacao


  function handleSubmit(e) {
    e.preventDefault(); // Impede o reload da página
    console.log({ email, password }); 
    navigate("/home"); 
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />


          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
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
