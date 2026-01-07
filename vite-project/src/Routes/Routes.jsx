import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/Login/Login";
import EsqueciSenha from "../pages/EsqueciSenha/EsqueciSenha";
import Inscrever from "../pages/Inscrever/Inscrever";
import Home from "../pages/Home/Home";
import MeusChamados from "../pages/MeusChamados/MeusChamados";
import AbrirChamado from "../pages/AbrirChamado/AbrirChamado";
import Configuracao from "../pages/Configuracao/Configuracao";

export default function AppRoutes() {
    return (
        
            <Routes>

                {/* Login e autenticação */}
                <Route path="/login" element={<Login />} />
                <Route path="/esqueci-senha" element={<EsqueciSenha />} />
                <Route path="/inscrever" element={<Inscrever />} />

                {/* Área logada */}
                <Route path="/home" element={<Home />} />
                <Route path="/meus-chamados" element={<MeusChamados />} />
                <Route path="/abrir-chamado" element={<AbrirChamado />} />
                <Route path="/configuracao" element={<Configuracao />} />

            </Routes>
        
    );
}
