import "./Principal.css";
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
        <div id="links">
            <ul>
                <li><a target="blank" href="./src/pages/MeusChamados">Novo Chamado</a></li>
                <li><a target="blank" href="./src/pages/MeusChamados">Novo Chamado</a></li>
                <li><a target="blank" href="./src/pages/MeusChamados">Novo Chamado</a></li>
                <li><a target="blank" href="./src/pages/MeusChamados">Novo Chamado</a></li>
                <li><a target="blank" href="./src/pages/MeusChamados">Novo Chamado</a></li>
            </ul>
        </div>
        <footer className="footer-login">
            <p>DMAE © | Desenvolvido no Núcleo de Tecnologia e Informação por <br /> Peterson Honorato Freitas</p>
        </footer>
    </div>
  );
}