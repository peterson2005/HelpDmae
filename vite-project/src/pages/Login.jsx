import "./Login.css";

export default function Login() {
  return (
    <div>
        <div className="login-container">
            <h1 className="title-login">HelpDmae</h1>

            <input type="text" placeholder="Usuário" /> 
            <input type="password" placeholder="Senha" /> 

            <button>LOGIN</button>
                <a href="">Esqueci a Senha...</a>
            <button>Cadastrar</button>
        </div>
        <footer className="footer-login">
            <p>DMAE © | Desenvolvido no Núcleo de Tecnologia e Informação por <br /> Peterson Honorato Freitas</p>
        </footer>
    </div>
  );
}