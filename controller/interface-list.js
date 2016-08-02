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

  // Implementação da interface encapsuladora das funções. Determina as funções
  // que ficarão expostas quando o módulo for exportado.
  const controller = {
    list: _list
  };

  return controller;

}
