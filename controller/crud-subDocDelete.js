module.exports = function(collection, model) {

  // Faz o controle das funções de CRUD da restapi

  const mongoose = require("mongoose");
  // Módulo que define o esquema da collection informada como parâmetro
  const schemaDef  = require("../database/schema-definition/" + collection);
  const messages = require("./messages");
  const config = require("../config/config");

  const _subDocDelete = function(_id, _field, _indexField, _subDoc_id, callback) {

    let _subDocIdFilterField = {};
    _subDocIdFilterField[_field + "." + _indexField] = _subDoc_id;
    let _tempObject = {};
    let _tempObject2 = {};
    let _filterPull = {};
    let _temp = _subDoc_id;
    _tempObject[_indexField] = _temp;
    _tempObject2[_field] = _tempObject;
    _filterPull["$pull"] = _tempObject2;

    // console.log("------------------------------------")
    // console.log("_id: ", _id)
    // console.log("_subDocIdFilterField: ", _subDocIdFilterField)
    // console.log("_filterPull: ", _filterPull)
    // console.log("------------------------------------")

    // Pesquisa pelo documento passado como parâmetro
    model.update({ $and: [ { _id: _id }, _subDocIdFilterField ] }, _filterPull, function(err, doc) {

      // Caso ocorra algum erro na pesquisa
      if (err) {
        // Não foi possível localizar o documento
        callback({ error: messages.getMessage("error", 3), err}, 400);
      } else if (!doc) {
        // documento inexistente
        callback({ response: messages.getMessage("message", 3)}, 404);
      } else {

        if (doc.nModified > 0) {
          // Documento excluído com sucesso
          // Conforme material sobre boas práticas no desenvolvimento de
          // restful apis, adotamos o retorno 204, que determina um resultado
          // de sucesso, mas sem dados de retorno.
          // http://www.vinaysahni.com/best-practices-for-a-pragmatic-restful-api
          callback({ response: messages.getMessage("message", 7) }, 204);
        } else {
          callback({ error: messages.getMessage("message", 6), doc }, 404);
        }


      }
    });
  }

  // Define o objeto encapsulador das funções de CRUD da api
  const docController = {
    subDocDelete: _subDocDelete // delete
  };

  return docController;

}
