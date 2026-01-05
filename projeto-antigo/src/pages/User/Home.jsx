import "./Home.css";

import { useNavigate } from "react-router-dom";

import BotaoVoltar from "../../Componentes/BotaoVoltar.jsx";



export default function Login() {

    const navigate = useNavigate();


  return (
    <div>
        <BotaoVoltar />


        <div className="home-container">
            <button onClick={() => navigate("/Novo-Chamado")}>NOVO CHAMADO</button>
            <button onClick={() => navigate("/Meus-Chamados")}>MEUS CHAMADOS</button>
        </div>
        
    </div>
  );
}