import "./NovoChamado.css";

export default function Login() {
  return (
    <div>
        <header className="header-novochamado">
            <h1>HelpDmae</h1>
        <menu className="menu-home">
            <a href="">option</a>
            <a href="">option</a>
            <a href="">option</a>
            <a href="">option</a>
            <a href="">option</a>
        </menu>
        </header>
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
                <div id="discricao-problema">
                    <p>Descreva aqui seu problema e solicitação</p>
                </div>
                <div id="fim-chamado">
                    <div id="datas">
                        <p><strong>Data Abertura: 12/08/2025 15:53</strong></p>
                        <p><strong>Data P/ Solução: 14/08/2025 17:00</strong></p>
                    </div>
                    <button id="button-abrirchamado">Abrir Chamado</button>
                </div>
            </div>
    </div>
        <footer className="footer-login">
            <p>DMAE © | Desenvolvido no Núcleo de Tecnologia e Informação por <br /> Peterson Honorato Freitas</p>
        </footer>
    </div>
  );
}