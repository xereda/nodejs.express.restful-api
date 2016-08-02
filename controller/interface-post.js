"use strict"

// Módulo que implementa uma interface de abstração análoga ao métodos HTTP
// (GET, PUT, POST, DELETE). Para cada método, invoca uma funcão respectiva
// no módulo de CRUD (create, retrive, update e delete).

module.exports = function(collection, schemaDef, controllerCRUD) {

  // Módulo contendo funções geréricas.
  const utils           = require("../utils/utils");
  
  // Módulo de controle de mensagens
  const messages        = require("../controller/messages");

  // Cria um novo documento na collection.
  const _post = function(req, res, next) {

    controllerCRUD.create(utils.getObjectBody(req, schemaDef.schema), function(createdObject, status) {
      res.status(status).json(createdObject);
    });

  }

  // Implementação da interface encapsuladora das funções. Determina as funções
  // que ficarão expostas quando o módulo for exportado.
  const controller = {
    post: _post
  };

  return controller;

}
