"use strict"

// Módulo que implementa uma interface de abstração análoga ao métodos HTTP
// (GET, PUT, POST, DELETE). Para cada método, invoca uma funcão respectiva
// no módulo de CRUD (create, retrieve, update e delete).

module.exports = function(collection) {

  // Módulo que define o esquema da collection informada como parâmetro
  const schemaDef  = require("../database/schema-definition/" + collection);

  // Módulo que implementa as funções de CRUD dinamicamente, conforme
  // collection informada parâmetro.
  const controllerCRUD  = require("../controller/crud")(collection);

  const _interface_list = require("./interface-list")(collection, schemaDef, controllerCRUD);
  const _interface_subDocList = require("./interface-subDocList")(collection, schemaDef, controllerCRUD);
  const _interface_get = require("./interface-get")(collection, schemaDef, controllerCRUD);
  const _interface_post = require("./interface-post")(collection, schemaDef, controllerCRUD);
  const _interface_subDocPost = require("./interface-subDocPost")(collection, schemaDef, controllerCRUD);
  const _interface_put = require("./interface-put")(collection, schemaDef, controllerCRUD);
  const _interface_subDocPut = require("./interface-subDocPut")(collection, schemaDef, controllerCRUD);
  const _interface_delete = require("./interface-delete")(collection, schemaDef, controllerCRUD);
  const _interface_subDocDelete = require("./interface-subDocDelete")(collection, schemaDef, controllerCRUD);

  // Usada no HTTP GET - retorna uma lista de documentos.
  const _list = _interface_list.list;

  // Usada no HTTP GET - retorna uma lista de documentos.
  const _subDocList = _interface_subDocList.subDocList;

  // Retorna apenas um documento informado para parâmetro na rota
  // /resource/:_id
  const _get = _interface_get.get;

  // Cria um novo documento na collection.
  const _post = _interface_post.post;

  // Cria um novo documento na collection.
  const _subDocPost = _interface_subDocPost.subDocPost;

  // Atualiza um documento existente
  const _put = _interface_put.put;

  // Atualiza um documento existente
  const _subDocPut = _interface_subDocPut.subDocPut;

  // Remove um documento informado como parâmetro.
  const _delete = _interface_delete.delete;

  // Remove um documento informado como parâmetro.
  const _subDocDelete = _interface_subDocDelete.subDocDelete;

  // Implementação da interface encapsuladora das funções. Determina as funções
  // que ficarão expostas quando o módulo for exportado.
  const controller = {
    list: _list,
    subDocList: _subDocList,
    get: _get,
    post: _post,
    subDocPost: _subDocPost,
    put: _put,
    subDocPut: _subDocPut,
    delete: _delete,
    subDocDelete: _subDocDelete
  };

  return controller;

}
