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
  const _put = function(req, res, next) {

    // Caso não seja informado o "_id" do documento a ser alterado, retorna
    // um erro de bad request (400) para o requisitante.
    if (!req.body._id) {
      res.status(400).json({ error: messages.getMessage("error", 6) });
    } else {

      // Limpa o campo informado como parâmetro. (trim e escape)
      const _id = utils.validate(req.body._id);

      // Atualiza do documento com os campos informado no corpo da requisição.
      // A API retornará apenas os campos alterados.
      controllerCRUD.update(_id, utils.getObjectBody(req, schemaDef.schema), function(updatedObject, status) {
        res.status(status).json(updatedObject);
      });

    }
  }


  // Implementação da interface encapsuladora das funções. Determina as funções
  // que ficarão expostas quando o módulo for exportado.
  const controller = {
    put: _put
  };

  return controller;

}
