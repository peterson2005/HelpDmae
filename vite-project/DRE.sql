Table usuarios {
  id_usuarios integer [pk, increment] 
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
  id_cargos integer [pk, increment]
  nome varchar
  descricao varchar
}

Table unidades {
  id_unidades integer [pk, increment]
  nome varchar
  descricao varchar
  endereco varchar
}

Table setores {
  id_setores integer [pk, increment]
  nome varchar
  descricao varchar
}

Table chamados {
  id_chamados integer [pk, increment]
  status_id integer
  titulo varchar
  descricao varchar
  tipo varchar
  categoria_id integer
  solicitante integer
  tecnico integer

  data_criacao timestamp
  ultima_atualizacao timestamp
  data_solucao timestamp
  criado_por integer
  atualizado_por integer
  solucionado_por integer
}

Table acompanhamentos {
  id_acompanhamentos integer [pk, increment]
  chamado_id integer
  usuario_id integer
  descricao varchar
}

Table categorias {
  id_categorias integer [pk, increment]
  parent_id integer
  nome varchar
  descricao varchar
}

Table anexos {
  id_anexos integer [pk, increment]
  usuario_id integer
  acompanhamento_id integer
  chamado_id integer
  descricao varchar
  caminho varchar
}

Table status {
  id_status integer [pk, increment]
  nome varchar
  descricao varchar
}

Ref: cargos.id_cargos < usuarios.cargo_id
Ref: unidades.id_unidades < usuarios.unidade_id
Ref: setores.id_setores < usuarios.setor_id

Ref: status.id_status < chamados.status_id
Ref: categorias.id_categorias < chamados.categoria_id

Ref: usuarios.id_usuarios < chamados.solicitante
Ref: usuarios.id_usuarios < chamados.tecnico
Ref: usuarios.id_usuarios < chamados.criado_por
Ref: usuarios.id_usuarios < chamados.atualizado_por
Ref: usuarios.id_usuarios < chamados.solucionado_por

Ref: chamados.id_chamados < acompanhamentos.chamado_id
Ref: usuarios.id_usuarios < acompanhamentos.usuario_id

Ref: chamados.id_chamados < anexos.chamado_id
Ref: acompanhamentos.id_acompanhamentos < anexos.acompanhamento_id
Ref: usuarios.id_usuarios < anexos.usuario_id

Ref: categorias.id_categorias < categorias.parent_id
