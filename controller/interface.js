"use strict"

// Módulo que implementa uma interface de abstração análoga ao métodos HTTP
// (GET, PUT, POST, DELETE). Para cada método, invoca uma funcão respectiva
// no módulo de CRUD (create, retrive, update e delete).

module.exports = function(collection) {

  // Módulo contendo funções geréricas.
  const utils           = require("../utils/utils");

  // Módulo que define o esquema da collection informada como parâmetro
  const schemaDef  = require("../database/schema-definition/" + collection);

  // Módulo que implementa as funções de CRUD dinamicamente, conforme
  // collection informada parâmetro.
  const controllerCRUD  = require("../controller/crud")(collection);

  // Módulo de controle de mensagens
  const messages        = require("../controller/messages");

  // Usada no HTTP GET - retorna uma lista de documentos.
  const _list = function(req, res, next) {

    // Retorna em um objeto JSON a lista de campos da collection que devem
    // ser considerados na montagem do objeto de retorno.
    const _fields = utils.toJSObject("fields", req.query._fields);

    // Retorna um objeto JSON contendo a regra para ordenação dos resultados.
    const _sort = utils.toJSObject("sort", req.query._sort);

    // Retorna um objeto Javascript contendo os filtros repassados na url
    // da requisição.
    const _filters = utils.toFiltersObject(req, schemaDef.schema);

    // Retorna um objeto Javascript contendo os parâmetros para paginação.
    // _limit: define o número máximo de documento que serào retornados.
    // Obdecendo máximo permitido e informado nas configurações gerais
    // (config/config.js).
    // _pag: Define qual a página de documentos a ser retornada.
    const _pagination = utils.toPaginationObject(req);

    // Lista todos os documentos.
    controllerCRUD.readAll(_pagination, _filters, _fields, _sort, function(objectList, status) {
      res.status(status).json(objectList);
    });

  }

  // Retorna apenas um documento informado para parâmetro na rota
  // /resource/:_id
  const _get = function(req, res, next) {

    // Limpa o campo informado como parâmetro. (trim e escape)
    const _id = utils.validate(req.params._id);

    // Recupera a lista de campos da collection que serão retornadas pelo API
    const _fields = utils.toJSObject("fields", req.query._fields);

    // Lista o documento.
    controllerCRUD.read(_id, _fields, function(object, status) {
      res.status(status).json(object);
    });

  }

  // Cria um novo documento na collection.
  const _post = function(req, res, next) {

    controllerCRUD.create(utils.getObjectBody(req, schemaDef.schema), function(createdObject, status) {
      res.status(status).json(createdObject);
    });

  }

  // Atualiza um documento existente
  const _put = function(req, res, next) {

    // Caso não seja informado o "_id" do documento a ser alterado, retorna
    // um erro de bad request (400) para o requisitante.
    if (!req.body._id) {
      res.status(400).json({ error: messages.getMessage("error", 6) });
      next(new Error(messages.getMessage("error", 6)));
    }

    // Limpa o campo informado como parâmetro. (trim e escape)
    const _id = utils.validate(req.body._id);

    // Atualiza do documento com os campos informado no corpo da requisição.
    // A API retornará apenas os campos alterados.
    controllerCRUD.update(_id, utils.getObjectBody(req, schemaDef.schema), function(updatedObject, status) {
      res.status(status).json(updatedObject);
    });

  }

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
    list:   _list,
    get:    _get,
    post:   _post,
    put:    _put,
    delete: _delete
  };

  return controller;

}
