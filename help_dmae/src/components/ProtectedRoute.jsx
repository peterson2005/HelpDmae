import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, perfisPermitidos }) {
  const usuarioJson = localStorage.getItem("usuarioLogado");

  if (!usuarioJson) {
    return <Navigate to="/login" replace />;
  }

  const usuario = JSON.parse(usuarioJson);

  if (perfisPermitidos && !perfisPermitidos.map(String).includes(String(usuario.perfil_id))) {
    

    return <Navigate to="/home" replace />;
  }

  return children;
}