import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BotaoVoltar from "../../Componentes/BotaoVoltar.jsx";

export default function MeusChamados() {
  const [chamados, setChamados] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const dados = JSON.parse(localStorage.getItem("chamados")) || [];
    setChamados(dados);
  }, []);

  return (
    <div>
      <BotaoVoltar />

      <h1 id="title-meuschamados">Meus Chamados:</h1>

      <div id="container-meuschamados">
        <ul>
          {chamados.length === 0 && (
            <p>Nenhum chamado encontrado</p>
          )}

          {chamados.map((chamado) => (
            <li
              key={chamado.id}
              onClick={() => navigate(`/visualizar/${chamado.id}`)}
              style={{ cursor: "pointer" }}
            >
              <h3>Chamado {chamado.id}</h3>
              <p>
                {chamado.solicitante}, {chamado.setor}
              </p>
              <h2>
                {chamado.data} {chamado.hora}
              </h2>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
