"use strict"

// Módulo que implementa uma interface de abstração análoga ao métodos HTTP
// (GET, PUT, POST, DELETE). Para cada método, invoca uma funcão respectiva
// no módulo de CRUD (create, retrive, update e delete).

module.exports = function(collection, schemaDef, controllerCRUD) {

  // Módulo contendo funções geréricas.
  const utils           = require("../utils/utils");

  // Módulo de controle de mensagens
  const messages        = require("../controller/messages");

  // Retorna apenas um documento informado para parâmetro na rota
  // /resource/:_id
  const _get = function(req, res, next) {

    let _populate = [];
    if (req.query._populate) {
      _populate = req.query._populate.split(",");
    }
        // Limpa o campo informado como parâmetro. (trim e escape)
    const _id = utils.validate(req.params._id);

    // Recupera a lista de campos da collection que serão retornadas pelo API
    const _fields = utils.toJSObject("fields", req.query._fields);

    // Lista o documento.
    controllerCRUD.read(_populate, _id, _fields, function(object, status) {
      res.status(status).json(object);
    });

  }

  // Implementação da interface encapsuladora das funções. Determina as funções
  // que ficarão expostas quando o módulo for exportado.
  const controller = {
    get: _get
  };

  return controller;

}
