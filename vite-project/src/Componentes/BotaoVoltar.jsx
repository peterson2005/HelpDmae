import { useNavigate } from "react-router-dom";
import "./BotaoVoltar.css";

function BotaoVoltar() {
  const navigate = useNavigate();

  return (
    <div>
      <button id="botao-voltar" onClick={() => navigate(-1)}>
        Voltar
      </button>
    </div>
  );
}

export default BotaoVoltar;
