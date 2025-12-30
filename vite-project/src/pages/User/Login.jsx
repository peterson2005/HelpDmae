import "./Login.css";

import { useNavigate } from "react-router-dom";


export default function Login() {

  const navigate = useNavigate();



  return (
    <div>
        <div className="login-container">
            <h1 className="title-login">HelpDmae</h1>

            <input type="text" placeholder="Usuário" /> 
            <input type="password" placeholder="Senha" /> 

            <button onClick={() => navigate("/Home")}>LOGIN</button>
                <a onClick={() => navigate("/EsqueciSenha")}>Esqueci a Senha...</a>
            <button onClick={() => navigate("/Cadastro")}>Cadastrar</button>
        </div>
        <footer className="footer-login">
            <p>DMAE © | Desenvolvido no Núcleo de Tecnologia e Informação por <br /> Peterson Honorato Freitas</p>
        </footer>
    </div>
  );
}