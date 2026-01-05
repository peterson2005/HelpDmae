import "./NovoChamado.css";  // importar o css 

import { useState } from "react"; // importa o useState do React para guardar o texto digitado e controlar se está editando ou não 

import BotaoVoltar from "../../Componentes/BotaoVoltar.jsx"; //importa o botão de voltar as páginas anteriores








export default function NovoChamado() {  // Aqui começa o componente da tela

    const [descricao, setDescricao] = useState(""); //Guarda o texto que o usuário digita no textarea
    const [editando, setEditando] = useState(false);  //false → mostra texto | true → mostra textarea



    



   function abrirChamado() {
  if (!descricao) {
    alert("Descreva o problema antes de abrir o chamado.");
    return;
  }

  const chamadosSalvos =
    JSON.parse(localStorage.getItem("chamados")) || [];

  const novoId = gerarProximoId(chamadosSalvos);

  const novoChamado = {
    id: novoId,
    titulo: "Novo Chamado",
    solicitante: "Peterson Honorato",
    setor: "T. Informação",
    data: new Date().toLocaleDateString(),
    hora: new Date().toLocaleTimeString().slice(0, 5),
    descricao,
    status: "aberto"
  };

  chamadosSalvos.push(novoChamado);

  localStorage.setItem(
    "chamados",
    JSON.stringify(chamadosSalvos)
  );

  alert(`Chamado ${novoId} criado com sucesso!`);
  setDescricao("");
  setEditando(false);
}

function gerarProximoId(chamados) {
  if (chamados.length === 0) {
    return "00001";
  }

  const ultimoChamado = chamados[chamados.length - 1];
  const ultimoIdNumero = Number(ultimoChamado.id);

  const proximoId = ultimoIdNumero + 1;

  return String(proximoId).padStart(5, "0");
}
  return (
    <div>
        <BotaoVoltar /> 
        <div id="container-novochamado">
            <div id="menu-chamado"> 
                <div className="conteudo-menuchamado">
                    <h3>N* Chamado: 0001</h3>
                    <h3>Data 22/12/2025</h3>
                </div>
                <div className="conteudo-menuchamado">
                    <h3>Horário: 13:46</h3>
                    <h3>Status: Não Solucionado</h3>
                </div>
            </div>
            <div id="descreva-chamado">
                <h2><strong>Descreva o Problema: </strong></h2>
                <p><strong>Nome: Peterson Honorato</strong></p>
                <p><strong>Cargo: Estagiario T.Informação</strong></p>
                <p><strong>Setor: T.Informação</strong></p>
                <p><strong>Ramal: 2763/2764</strong></p>
                <div
                    id="discricao-problema"
                    onClick={() => setEditando(true)}
                    >
                    {editando ? (
                        <textarea
                        placeholder="Descreva aqui seu problema..."
                        value={descricao}
                        onChange={(e) => setDescricao(e.target.value)}
                        />
                    ) : (
                        <p>Descreva aqui seu problema e solicitação</p>// se não estiver editando
                    )}
                </div>

                <div id="fim-chamado">
                    <div id="datas">
                        <p><strong>Data Abertura: 12/08/2025 15:53</strong></p>
                        <p><strong>Data p/ Solução: 14/08/2025 17:00</strong></p>
                    </div>
                    <button id="button-abrirchamado" onClick={abrirChamado}>Abrir Chamado</button>
                </div>
            </div>
    </div>
    </div>
  );
}