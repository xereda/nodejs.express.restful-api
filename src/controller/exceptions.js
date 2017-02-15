"use strict";

// Define as rotas de excessão para a API.

// Importa o módulo de mensages da API.
const messages = require("./messages");

// Função que determina um erro de resposta quando não encontrar
// a rota informada.
const _error404 = function(req, res, next) {
  res.status(404).json({
    error: messages.getMessage("error", 14).replace("%1", req.url),
    path: req.url,
    method: req.method
  });
}

// Função que determina um erro de resposta quando ocorrer alguma inconsistência
// no servidor.
const _error500 = function(err, req, res, next) {
  res.status(500).json({
    error: messages.getMessage("error", 15),
    path: req.url,
    method: req.method,
    body: req.body,
    err: err
  });
}

// Interface oara as funções internas.
const controller = {
  error404: _error404,
  error500: _error500
};

module.exports = controller;
