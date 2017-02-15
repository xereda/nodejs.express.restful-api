"use strict"

// Módulo que implementa uma interface de abstração análoga ao métodos HTTP
// (GET, PUT, POST, DELETE). Para cada método, invoca uma funcão respectiva
// no módulo de CRUD (create, retrive, update e delete).

module.exports = function(collection, schemaDef, controllerCRUD) {

  // Módulo contendo funções geréricas.
  const utils           = require("../utils/utils");

  // Módulo de controle de mensagens
  const messages        = require("../controller/messages");

  // Remove um documento informado como parâmetro.
  const _delete = function(req, res, next) {

    // Limpa o campo informado como parâmetro. (trim e escape)
    const _id = utils.validate(req.params._id);

    // Remove o documento.
    controllerCRUD.delete(_id, function(deletedObject, status) {
      res.status(status).json(deletedObject);
    });

  }

  // Implementação da interface encapsuladora das funções. Determina as funções
  // que ficarão expostas quando o módulo for exportado.
  const controller = {
    delete: _delete
  };

  return controller;

}
