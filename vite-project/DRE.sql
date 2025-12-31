// Use DBML to define your database structure
// Docs: https://dbml.dbdiagram.io/docs



Table usuarios {
  id integer [primary key]
  username varchar
  password varchar
  nome varchar
  imagem varchar
  cargo_id integer
  setor_id integer
  unidade_id integer
  email varchar
  telefone varchar
  ramal varchar
  perfil varchar
  created_at timestamp
}

Table cargos {
  id integer
  nome varchar
  descricao varchar
}

Table unidades {
  id integer
  nome varchar
  descricao varchar
  endereco varchar
  
}

Table setores {
  id varchar
  nome varchar
  descricao varchar
}

Table chamados {
  id integer
  status_id integer
  titulo varchar
  descricao varchar
  tipo varchar
  categoria_id integer
  solicitante intenger
  tecnico intenger

  data_criacao timestamp
  ultima_atualizacao timestamp
  data_solucao timestamp
  criado_por integer
  atualizado_por interger
  solucionado_por integer
  
}

Table acompanhamentos{
  id integer
  chamado_id integer
  usuario_id integer
  descricao varchar

}

Table categorias {
  id integer
  parent_id integer
  nome varchar
  descricao varchar
}

Table anexos {
  id integer
  usuario_id integer
  acompanhamento_id integer
  chamado_id integer
  descricao varchar
  caminho varchar
}

Table status {
  id intenger
  nome varchar
  descricao varchar
}


Ref: "cargos"."id" < "usuarios"."cargo_id"

Ref: "unidades"."id" < "usuarios"."unidade_id"

Ref: "setores"."id" < "usuarios"."setor_id"

Ref: "categorias"."id" < "chamados"."categoria_id"

Ref: "chamados"."id" < "anexos"."chamado_id"

Ref: "status"."id" < "chamados"."status_id"

Ref: "chamados"."id" < "acompanhamentos"."chamado_id"

Ref: "usuarios"."id" < "acompanhamentos"."usuario_id"

Ref: "usuarios"."id" < "chamados"."solicitante"

Ref: "usuarios"."id" < "chamados"."tecnico"

Ref: "acompanhamentos"."id" < "anexos"."acompanhamento_id"


Ref: "usuarios"."id" < "anexos"."usuario_id"