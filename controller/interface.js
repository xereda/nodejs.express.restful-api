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

    // Verifica se o parâmetro lean foi informado. Caso sim, repassa como true
    // para que o find() retorne apenas um objeto javascript simples, melhorando
    // assim a performance das querys no método GET.
    const _lean = utils.getLeanParam(req.query._lean);

    let _populate = [];
    if (req.query._populate) {
      _populate = req.query._populate.split(",");
    }

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
    controllerCRUD.readAll(_populate, _lean, _pagination, _filters, _fields, _sort, function(objectList, status) {
      res.status(status).json(objectList);
    });

  }

  // Usada no HTTP GET - retorna uma lista de documentos.
  const _subDocList = function(req, res, next) {

    // Verifica se o parâmetro lean foi informado. Caso sim, repassa como true
    // para que o find() retorne apenas um objeto javascript simples, melhorando
    // assim a performance das querys no método GET.
    const _lean = utils.getLeanParam(req.query._lean);

    let _populate = [];
    if (req.query._populate) {
      _populate = req.query._populate.split(",");
    }

    let _populatedFields = "";
    if (req.query._populatedFields) {
      _populatedFields = utils.validate(req.query._populatedFields);
    }

    // Limpa o campo informado como parâmetro. (trim e escape)
    const _id = utils.validate(req.params._id);

    const _field = utils.validate(req.params._field);

    const _objSubDoc = schemaDef.subDocs.find(function(element) {
      return element.fieldName === _field;
    });

    const _subDocSchema  = require("../database/schema-definition/fields/object-" + _objSubDoc.indexField)({});
    const _subDocSchemaPopulated  = require("../database/schema-definition/" + _objSubDoc.ref);

    //console.log("_subDocSchema: ", _subDocSchema);

    // Retorna em um objeto JSON a lista de campos da collection que devem
    // ser considerados na montagem do objeto de retorno.
    const _fields = utils.toJSObject("fields", req.query._fields);

    // Retorna um objeto JSON contendo a regra para ordenação dos resultados.
    const _sort = utils.toJSObject("sort", req.query._sort);

    // Retorna um objeto Javascript contendo os filtros repassados na url
    // da requisição.
    const _filters = utils.toFiltersObject(req, _subDocSchema[0]);
    const _populatedFilters = utils.toPopulatedFiltersObject(req, _subDocSchemaPopulated.schema);

    //console.log("_filters: ", _filters);

    // Retorna um objeto Javascript contendo os parâmetros para paginação.
    // _limit: define o número máximo de documento que serào retornados.
    // Obdecendo máximo permitido e informado nas configurações gerais
    // (config/config.js).
    // _pag: Define qual a página de documentos a ser retornada.
    const _pagination = utils.toPaginationObject(req);


    console.log("vai chamar a crud");
    // Lista todos os documentos.
    controllerCRUD.subDocReadAll(_id, _field, _populate, _populatedFields, _lean, _pagination, _filters, _populatedFilters, _fields, _sort, function(objectList, status) {
      res.status(status).json(objectList);
    });

  }

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
    list: _list,
    subDocList: _subDocList,
    get: _get,
    post: _post,
    put: _put,
    delete: _delete
  };

  return controller;

}
