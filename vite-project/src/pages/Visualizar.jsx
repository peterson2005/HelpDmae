import "./Visualizar.css";

export default function Login() {
  return (
    <div>
        <header className="header-visualizar">
            <h1>HelpDmae</h1>
        <menu className="menu-home">
            <a href="">option</a>
            <a href="">option</a>
            <a href="">option</a>
            <a href="">option</a>
            <a href="">option</a>
        </menu>

        </header>

        <main>
            <h1 id="visualizar-meuschamados">Meus Chamados: Chamado 0001 </h1>
            <div id="chamado">
                <div id="up-visualizar">
                    <div id="descreva-chamado-visualizar1">
                        <h2><strong>Descreva o Problema: </strong></h2>
                        <p><strong>Nome: Peterson Honorato</strong></p>
                        <p><strong>Cargo: Estagiario T.Informação</strong></p>
                        <p><strong>Setor: T.Informação</strong></p>
                        <p><strong>Ramal: 2763/2764</strong></p>
                    </div>
                    <div id="descreva-chamado-visualizar2">
                        <h2>STATUS: NÃO SOLUCIONADO</h2>
                        <h2>Data Solução: 14/08/2025 17:00</h2>
                        <h2>Técnico Atribuído: Peterson H</h2>
                    </div>
                </div>
                <div id="donw-visualizar">
                    <p>Venho por meio deste, solicitar a criação de um Sistema Web para o gerenciamento e organização dos Chamados realizados pela Equipe de T.I Dmae, desde Já agradeço. <br />
                    Segue contato e Ramal. A disposição!</p>
                    <div id="button-visualizar">
                        <button>Adicionar Comentário</button>
                        <button>Verificar Comentários/Solução</button>
                    </div>
                </div>

                

            </div>
        </main>

        <footer className="footer-login">
            <p>DMAE © | Desenvolvido no Núcleo de Tecnologia e Informação por <br /> Peterson Honorato Freitas</p>
        </footer>
    </div>
  );
}