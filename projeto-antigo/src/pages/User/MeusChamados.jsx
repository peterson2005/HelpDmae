import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BotaoVoltar from "../../Componentes/BotaoVoltar.jsx";
import "./MeusChamados.css";

export default function MeusChamados() {
  const [chamados, setChamados] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const dados = JSON.parse(localStorage.getItem("chamados")) || [];
    setChamados(dados);
  }, []);

  const [filtro, setFiltro] = useState("aberto"); // criando i filtro dos chamados

  const chamadosFiltrados = chamados.filter(
  (chamado) => chamado.status === filtro
  );

  return (
    <div>
      <BotaoVoltar />

      <h1 id="title-meuschamados">Meus Chamados:</h1>

        <div className="filtros-chamados">
          <button
            className={filtro === "aberto" ? "ativo" : ""}
            onClick={() => setFiltro("aberto")}
          >
            Abertos
          </button>

          <button
            className={filtro === "fechado" ? "ativo" : ""}
            onClick={() => setFiltro("fechado")}
          >
            Fechados
          </button>
        </div>


      <div id="container-meuschamados">
        <ul>
          {chamadosFiltrados.length === 0 && (
          <p>Nenhum chamado encontrado</p>
        )}

          {chamadosFiltrados.map((chamado) => (
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
