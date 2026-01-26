import { Navigate } from "react-router-dom";

// Adicionamos 'perfisPermitidos' como parâmetro
export default function ProtectedRoute({ children, perfisPermitidos }) {
  const usuarioJson = localStorage.getItem("usuarioLogado");

  if (!usuarioJson) {
    return <Navigate to="/login" replace />;
  }

  const usuario = JSON.parse(usuarioJson);

  // Se a rota for restrita a certos perfis e o usuário não tiver esse perfil
  if (perfisPermitidos && !perfisPermitidos.includes(usuario.perfil_id)) {
    // Redireciona para a Home dele caso ele tente acessar algo proibido
    return <Navigate to={usuario.perfil_id === 1 ? "/Home" : "/fila-chamados"} replace />;
  }

  return children;
}