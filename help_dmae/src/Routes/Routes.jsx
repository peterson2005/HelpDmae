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
                {/* 1. Rotas Comuns (Qualquer perfil logado acessa) */}
                <Route path="home" element={<Home />} />
                <Route path="configuracao" element={<Configuracao />} />
                <Route path="detalhes/:id" element={<Detalhes />} />

                {/* 2. Rotas de Usuário Comum (Perfil 1) */}
                <Route path="chamados" element={<Chamados />} />
                <Route path="abrir-chamado" element={<AbrirChamado />} />

                {/* 3. Rotas de Técnico/Admin (Perfil 2 e 3) */}
                <Route
                    path="chamados"
                    element={
                        <ProtectedRoute perfisPermitidos={[2, 3]}>
                            {/* <FilaChamados /> */} <div>Tela de Fila</div>
                        </ProtectedRoute>
                    }
                />

                {/* 4. Rotas de Admin (Perfil 3) */}
                <Route
                    path="usuarios"
                    element={
                        <ProtectedRoute perfisPermitidos={[3]}>
                            {/* <GestaoUsuarios /> */} <div>Tela de Usuários</div>
                        </ProtectedRoute>
                    }
                />
            </Route>
        </Routes>

    );
}
