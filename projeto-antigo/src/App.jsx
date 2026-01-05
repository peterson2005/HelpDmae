import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/User/Login.jsx";
import Home from "./pages/User/Home.jsx";
import NovoChamado from "./pages/User/NovoChamado.jsx";
import MeusChamados from "./pages/User/MeusChamados.jsx";
import Cadastro from "./pages/User/Cadastro.jsx";
import EsqueciSenha from "./pages/User/EsqueciSenha.jsx";
import Visualizar from "./pages/User/Visualizar.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/novo-chamado" element={<NovoChamado />} />
        <Route path="/meus-chamados" element={<MeusChamados />} />
        <Route path="/visualizar" element={<Visualizar />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/esqueci-senha" element={<EsqueciSenha />} />
        <Route path="/visualizar/:id" element={<Visualizar />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;