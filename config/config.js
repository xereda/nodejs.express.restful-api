// Módulo de parâmetros de configuração

"use strict";

module.exports = {
  database_host: "localhost", // host de coneção ao servidor de banco de dados
  database_name: "docmob", // nome da database no mongodb

  application_port: 5000, // porta tcp onde a applicação esterá disponível

  // define o _id de um usuário já existente (collection "users")
  // para que a API, no método POST, não mostre a mensagem de crítica
  // para o campo "updatedById" não informado.
  defaultCreatedById: "57a2bb75be785a529de5fb33",

  // define o máximo de documentos a serem retornados pela API quando não
  // informato o parâmetro "_limit" na query string (/?_limit=[número]).
  pagination_limit: 100,

};
