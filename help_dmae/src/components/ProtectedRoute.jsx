import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const usuarioLogado = localStorage.getItem("usuarioLogado");

  if (!usuarioLogado) {
    // Se não houver nada no localStorage, manda para o login
    return <Navigate to="/login" replace />;
  }

  // Se estiver logado, permite ver a tela (children)
  return children;
}