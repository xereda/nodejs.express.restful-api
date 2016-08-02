module.exports = function(collection) {

  // Faz o controle das funções de CRUD da restapi

  // Importa o módulo de definação da collection de usuários do docmob
  const model = require("../database/schema-model")(collection);

  const _crud_readAll = require("./crud-readAll")(collection, model);
  const _crud_subDocReadAll = require("./crud-subDocReadAll")(collection, model);
  const _crud_read = require("./crud-read")(collection, model);
  const _crud_create = require("./crud-create")(collection, model);
  const _crud_subDocCreate = require("./crud-subDocCreate")(collection, model);
  const _crud_update = require("./crud-update")(collection, model);
  const _crud_subDocUpdate = require("./crud-subDocUpdate")(collection, model);
  const _crud_delete = require("./crud-delete")(collection, model);
  const _crud_subDocDelete = require("./crud-subDocDelete")(collection, model);

  // ** READ ALL - GET **
  // Funcão que retorna a lista de todos os documentos da collection
  // Recebe como parâmetro um callback contendo o response para
  // o device chamador (navegador, aplicativo, etc...)
  const _readAll = _crud_readAll.readAll;

  const _subDocReadAll = _crud_subDocReadAll.subDocReadAll;

  // ** READ - GET **
  // Função que retorna um determinado documento da collection.
  // Além do callback recebe também o id do usuário
  const _read = _crud_read.read;

  // ** CREATE POST **
  // Função que cria novo docunento na collection especificada
  const _create = _crud_create.create;

  const _subDocCreate = _crud_subDocCreate.subDocCreate;

  // ** PUT UPDATE **
  // Funcão que atualiza um documento. Recebe como parâmetro o _id do documento
  // a ser alterado, o objeto aos campos a serem atualizados e por final,
  // o callback de retorno para express.
  const _update = _crud_update.update;

  const _subDocUpdate = _crud_subDocUpdate.subDocUpdate;

  // ** DELETE **
  // Tenta localizar um documento passado como parâmetro e se encontrar, remove-o
  // de sua collection
  const _delete = _crud_delete.delete;

  const _subDocDelete = _crud_subDocDelete.subDocDelete;

  // Define o objeto encapsulador das funções de CRUD da api
  const docController = {
    readAll: _readAll, // get
    subDocReadAll: _subDocReadAll, // get para um subdocumento
    read: _read, // get
    create: _create, // post
    subDocCreate: _subDocCreate, // post subdocumento
    update: _update, // put
    subDocUpdate: _subDocUpdate, // put para um subdoc
    delete: _delete, // delete
    subDocDelete: _subDocDelete // delete
  };

  return docController;

}
