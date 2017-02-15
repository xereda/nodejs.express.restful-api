"use strict"

// Módulo que implementa uma interface de abstração análoga ao métodos HTTP
// (GET, PUT, POST, DELETE). Para cada método, invoca uma funcão respectiva
// no módulo de CRUD (create, retrive, update e delete).

module.exports = function(collection, schemaDef, controllerCRUD) {

  // Módulo contendo funções geréricas.
  const utils           = require("../utils/utils");

  // Módulo de controle de mensagens
  const messages        = require("../controller/messages");

  // Atualiza um documento existente
  const _subDocPut = function(req, res, next) {

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

      const _updateObject = utils.toSubDocUpdateObject(_field, utils.getObjectBody(req, schemaDef.schema[_field][0]));

      const _message = messages.getMessage("error", 35);

      if (Object.keys(_updateObject).length === 0) {

        res.status(400).json({ error: _message });

      } else if ((req.body.updatedById === undefined) || (!req.body.updatedById)) {

        res.status(400).json({ error: messages.getMessage("error", 8).replace("%1", "updatedById") });

      } else {

        // Atualiza do documento com os campos informado no corpo da requisição.
        // A API retornará apenas os campos alterados.
        controllerCRUD.subDocUpdate(_id, _field, _objSubDoc.indexField, _subDoc_id, _updateObject, function(updatedObject, status) {

          res.status(status).json(updatedObject);

        });

      }
    }

  }

  // Implementação da interface encapsuladora das funções. Determina as funções
  // que ficarão expostas quando o módulo for exportado.
  const controller = {
    subDocPut: _subDocPut
  };

  return controller;

}
