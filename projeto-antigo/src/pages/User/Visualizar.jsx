import { useParams } from "react-router-dom";

const chamados = [
  {
    id: "00001",
    titulo: "Impressora não imprime",
    solicitante: "Claudilene",
    setor: "Procuradoria",
    data: "12/08",
    hora: "15:00",
    descricao: "A impressora do setor não está imprimindo nenhum documento."
  },
  {
    id: "00002",
    titulo: "Computador não liga",
    solicitante: "Carlos",
    setor: "Financeiro",
    data: "13/08",
    hora: "09:30",
    descricao: "Ao apertar o botão de ligar, o computador não dá sinal."
  }
];

export default function Visualizar() {
  const { id } = useParams();

  const chamados =
    JSON.parse(localStorage.getItem("chamados")) || [];

  const chamado = chamados.find(c => c.id === id);

  if (!chamado) return <h2>Chamado não encontrado</h2>;

  return (
    <div>
      <h1>Chamado {chamado.id}</h1>
      <p><strong>Status:</strong> {chamado.status}</p>
      <p><strong>Solicitante:</strong> {chamado.solicitante}</p>
      <p><strong>Setor:</strong> {chamado.setor}</p>
      <p><strong>Descrição:</strong> {chamado.descricao}</p>
    </div>
  );
}
