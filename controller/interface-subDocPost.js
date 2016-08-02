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
  const _subDocPost = function(req, res, next) {

    // Limpa o campo informado como parâmetro. (trim e escape)
    const _id = utils.validate(req.params._id);
    const _field = utils.validate(req.params._field);
    controllerCRUD.subDocCreate(_id, _field, utils.getObjectBody(req, schemaDef.schema[_field][0]), function(createdObject, status) {
      res.status(status).json(createdObject);
    });

  }


  // Implementação da interface encapsuladora das funções. Determina as funções
  // que ficarão expostas quando o módulo for exportado.
  const controller = {
    subDocPost: _subDocPost
  };

  return controller;

}
