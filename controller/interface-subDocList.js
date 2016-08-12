"use strict"

// Módulo que implementa uma interface de abstração análoga ao métodos HTTP
// (GET, PUT, POST, DELETE). Para cada método, invoca uma funcão respectiva
// no módulo de CRUD (create, retrive, update e delete).

module.exports = function(collection, schemaDef, controllerCRUD) {

  // Módulo contendo funções geréricas.
  const utils           = require("../utils/utils");

  // Módulo de controle de mensagens
  const messages        = require("../controller/messages");

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

    let _filters = {};
    let _populatedFilters = {};

    if ((_objSubDoc !== undefined) && (_objSubDoc !== null)) {

      console.log("_objSubDoc: ", _objSubDoc);

      // if (_objSubDoc.simple === true) {
      //   console.log("---> schemaDef.schema[_objSubDoc.fieldName][0]: ", schemaDef.schema[_objSubDoc.fieldName][0]);
      //   const _subDocSchema  = schemaDef.schema[_objSubDoc.fieldName];
      //   console.log("_subDocSchema[0]: ", _subDocSchema[0]);
      // } else {
      //   const _subDocSchema  = require("../database/schema-definition/fields/object-" + _objSubDoc.indexField)({});
      // }

      let _subDocSchema;

      if (_objSubDoc.simple === true) {
        _subDocSchema  = schemaDef.schema[_objSubDoc.fieldName];
      } else {
        _subDocSchema  = require("../database/schema-definition/fields/object-" + _objSubDoc.indexField)({});
      }

      const _subDocSchemaPopulated  = require("../database/schema-definition/" + _objSubDoc.ref);

      // Retorna um objeto Javascript contendo os filtros repassados na url
      // da requisição.
      //_filters = utils.toFiltersObject(req, _subDocSchema[0]);
      _filters = utils.toFiltersObject(req, _subDocSchema[0]);

      _populatedFilters = utils.toPopulatedFiltersObject(req, _subDocSchemaPopulated.schema);
    }

    // Retorna em um objeto JSON a lista de campos da collection que devem
    // ser considerados na montagem do objeto de retorno.
    const _fields = utils.toJSObject("fields", req.query._fields);

    // Retorna um objeto JSON contendo a regra para ordenação dos resultados.
    const _sort = utils.toJSObject("sort", req.query._sort);

    // Retorna um objeto Javascript contendo os parâmetros para paginação.
    // _limit: define o número máximo de documento que serào retornados.
    // Obdecendo máximo permitido e informado nas configurações gerais
    // (config/config.js).
    // _pag: Define qual a página de documentos a ser retornada.
    const _pagination = utils.toPaginationObject(req);

    // Lista todos os documentos.
    controllerCRUD.subDocReadAll(_id, _field, _populate, _populatedFields, _lean, _pagination, _filters, _populatedFilters, _fields, _sort, function(objectList, status) {
      res.status(status).json(objectList);
    });

  }

  // Implementação da interface encapsuladora das funções. Determina as funções
  // que ficarão expostas quando o módulo for exportado.
  const controller = {
    subDocList: _subDocList
  };

  return controller;

}
