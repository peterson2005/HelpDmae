import "./Cadastro.css";
import BotaoVoltar from "../../Componentes/BotaoVoltar.jsx";

export default function Cadastro() {
  return (
    <div>
      <BotaoVoltar />
        <div className="cadastro-container">
            <form action="" className="form-cadastro">

                <p className="p-cadastro">Nome Completo</p>
                <input type="text" placeholder="Nome Completo" /> 

                <p className="p-cadastro">E-mail (resete de senha)</p>
                <input type="email" placeholder="E-mail (resete de senha)" /> 

                <p className="p-cadastro">Setor</p>
                <input type="text" placeholder="Setor" /> 

                <p className="p-cadastro">Cargo</p>
                <input type="text" placeholder="Cargo" /> 

                <p className="p-cadastro">Contato / Telefone</p>
                <input type="tel" placeholder="Contato / Telefone" />

                <p className="p-cadastro">Ramal</p>
                <input type="number" placeholder="Ramal" />  

                <p className="p-cadastro">Matricula / Usuário</p>
                <input type="number" placeholder="Matricula / Usuário" /> 

                <p className="p-cadastro">Senha</p>
                <input type="password" placeholder="Digite sua Senha" /> 

                <p className="p-cadastro">Confirme sua Senha</p>
                <input type="password" placeholder="Digite sua Senha novamente" />
                
            </form>  
            <button>Criar Perfil</button>
        </div>







        <footer className="footer-cadastro">
            <p>DMAE © | Desenvolvido no Núcleo de Tecnologia e Informação por <br /> Peterson Honorato Freitas</p>
        </footer>
    </div>
  );
}