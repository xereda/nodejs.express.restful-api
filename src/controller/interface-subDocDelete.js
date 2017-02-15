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
  const _subDocDelete = function(req, res, next) {


    // Limpa o campo informado como parâmetro. (trim e escape)
    const _id = utils.validate(req.params._id);
    const _field = utils.validate(req.params._field);

    const _objSubDoc = schemaDef.subDocs.find(function(element) {
      return element.fieldName === _field;
    });

    if ((_objSubDoc.fieldName === undefined) || (_objSubDoc.fieldName === null)) {

      // Subdocumento informado não está definido na collection pai
      const _message = messages.getMessage("error", 34).replace("%1", _field).replace("%2", collection);
      res.status(404).json({ error: _message });

    } else {

      const _subDoc_id = utils.validate(req.params._subDoc_id);

      // Remove o documento.
      controllerCRUD.subDocDelete(_id, _field, _objSubDoc.indexField, _subDoc_id, function(deletedObject, status) {
        res.status(status).json(deletedObject);
      });

    }

  }

  // Implementação da interface encapsuladora das funções. Determina as funções
  // que ficarão expostas quando o módulo for exportado.
  const controller = {
    subDocDelete: _subDocDelete
  };

  return controller;

}
