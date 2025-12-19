import "./Home.css";

export default function Login() {
  return (
    <div>
        <header className="header-home">
            <h1>HelpDmae</h1>
        <menu className="menu-home">
            <a href="">option</a>
            <a href="">option</a>
            <a href="">option</a>
            <a href="">option</a>
            <a href="">option</a>
        </menu>
        </header>


        <div className="home-container">
            <button>NOVO CHAMADO</button>
            <button>MEUS CHAMADOS</button>
        </div>
        <footer className="footer-home">
            <p>DMAE © | Desenvolvido no Núcleo de Tecnologia e Informação por <br /> Peterson Honorato Freitas</p>
        </footer>
    </div>
  );
}