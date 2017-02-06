"use strict";

// Servidor Express que disponilizará a API.

const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");
const os = require("os");

// Mantém a conexão com o banco de dados
const conn = require("../config/connection");

// Módulo de mensagens da API. Provê algumas funções para retonar literais
// do catálogo de mensagem e de erros (config/mensagens e config/errors).
const messages = require("../controller/messages");

//  Módulo contendo os parâmetros gerais da API
const config = require("../config/config");

// Gera uma instância do Express
const app = express();

// verifica se o ambiente é local (desenvolvimento) ou é o ambiente de homologacao
let _domainAPI = config.application_domain_local
if (os.hostname() !== "macminixereda.home") {
  _domainAPI = config.application_domain;
}

// Executa o server que manterá a API online. Pra verificar porta e host,
// acesso o módulo de configurações (config/config.js)
app.listen(config.application_port, _domainAPI,  function() {
  console.log(messages.getMessage("message", 2) + " na porta " + config.application_port + " e no domínio '" + _domainAPI + "'");
});

// Executa o cabeçalho/head CORS
//app.use(allowCors
app.use(cors(config.corsOptions));

// Adiciona controles para emissão de JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Define um midlleware para verificar se o banco de dados está em execução.
// Caso não esteja disponáivel, a API retorna um erro para o requisitante.
app.use(function(req, res, next) {

  // Banco offline?
  if (conn.readyState === 0) {
    res.status(503).json({ error: messages.getMessage("error", 1) });
    return next(new Error(messages.getMessage("error", 1)));
  }
  next();

});

module.exports = app;
