import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";

import Login from "../pages/Login/Login";
import EsqueciSenha from "../pages/EsqueciSenha/EsqueciSenha";
import Inscrever from "../pages/Inscrever/Inscrever";
import Layout from '../Layout/Layout';
import Home from "../pages/Home/Home";
import AbrirChamado from "../pages/AbrirChamado/AbrirChamado";
import Configuracao from "../pages/Configuracao/Configuracao";
import Detalhes from "../pages/Detalhes/Detalhes";
import Chamados from "../pages/Chamados/Chamados";
import Usuarios from "../pages/Usuarios/Usuarios";
import CreateUser from "../pages/Usuarios/CreateUser";
import EditUser from "../pages/Usuarios/EditUser";

export default function AppRoutes() {
    return (
        <Routes>
            {/* Login e autenticação - Abertos */}
            <Route path="/login" element={<Login />} />
            <Route path="/esqueci-senha" element={<EsqueciSenha />} />
            <Route path="/inscrever" element={<Inscrever />} />

            {/* Redireciona a raiz "/" para o login ou home */}
            <Route path="/" element={<Navigate to="/home" replace />} />

            {/* Área logada com layout fixo */}
            <Route
                element={
                    <ProtectedRoute>
                        <Layout />
                    </ProtectedRoute>
                }
            >
                {/* 1. Rotas Comuns (Todos os perfis 1, 2 e 3) */}
                <Route path="home" element={<Home />} />
                <Route path="configuracao" element={<Configuracao />} />
                <Route path="detalhes/:id" element={<Detalhes />} />
                <Route path="abrir-chamado" element={<AbrirChamado />} />

                {/* 2. Rota de Chamados (Acesso Geral, mas o componente filtra internamente) */}
                <Route path="chamados" element={<Chamados />} />

                {/* 3. Rotas restritas a Administradores (Perfil 3) */}
                <Route
                    path="usuarios"
                    element={
                        <ProtectedRoute perfisPermitidos={[3]}>
                            <Usuarios />
                        </ProtectedRoute>
                    }
                />

                {/* ROTA PARA CRIAR USUÁRIO */}
                <Route
                    path="usuarios/novo"
                    element={
                        <ProtectedRoute perfisPermitidos={[3]}>
                            <CreateUser />
                        </ProtectedRoute>
                    }
                />

                {/* ROTA PARA EDITAR USUÁRIO (com ID dinâmico) */}
                <Route
                    path="usuarios/editar/:id"
                    element={
                        <ProtectedRoute perfisPermitidos={[3]}>
                            <EditUser />
                        </ProtectedRoute>
                    }
                />

            </Route>
        </Routes>
    );
}
