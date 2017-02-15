module.exports = function(collection, model) {

  // Faz o controle das funções de CRUD da restapi

  const mongoose = require("mongoose");
  const ObjectId = require("mongoose").Types.ObjectId;
  // Módulo que define o esquema da collection informada como parâmetro
  const schemaDef  = require("../database/schema-definition/" + collection);
  const messages = require("./messages");
  const config = require("../config/config");

  // ** DELETE **
  // Tenta localizar um documento passado como parâmetro e se encontrar, remove-o
  // de sua collection
  const _delete = function(_id, callback) {

    if ((schemaDef.refIdentityCollections !== undefined) && (schemaDef.refIdentityCollections.length > 0)) {

      let _collectionList = [];

      schemaDef.refIdentityCollections.forEach(function (element, index, array) {

        const _field = element["field"];
        const _filter = Object.assign({}, { [_field]: _id });
        // _filter[_field] = new ObjectId(_id);
        // _filter[_field] = _id;

        mongoose.models[element["collection"]].count(_filter, function (err, count) {

          if (count > 0) {
            _collectionList.push({ collection: element["collection"], field: element["field"] })
          }

          if (index === array.length - 1) { // ultimo
            if (_collectionList.length > 0) {
              const _translatedList = messages.translateCollections(_collectionList.map((a) => { return a.collection }).filter((element, index, array) => { return array.indexOf(element) === index })).join(", ");
              callback({ error: messages.getMessage("error", 43).replace("%1", _translatedList) }, 400);
            } else {
              _modelRemove(_id, callback)
            }
          }

        });

      });
    } else {
      _modelRemove(_id, callback)
    }

  }

  const _modelRemove = function(_id, callback) {
    // Pesquisa pelo documento passado como parâmetro
    model.findById(_id, function(err, doc) {

      // Caso ocorra algum erro na pesquisa
      if (err) {
        // Não foi possível localizar o documento
        callback({ error: messages.getMessage("error", 3), err}, 400);
      } else if (!doc) {
        // documento inexistente
        callback({ response: messages.getMessage("message", 3), err}, 404);
      } else {

        // Encontrou o documento e irá remove-lo
        doc.remove(function(err) {

          // Documento foi removido com sucesso
          if (!err) {
            // Documento excluído com sucesso
            // Conforme material sobre boas práticas no desenvolvimento de
            // restful apis, adotamos o retorno 204, que determina um resultado
            // de sucesso, mas sem dados de retorno.
            // http://www.vinaysahni.com/best-practices-for-a-pragmatic-restful-api
            callback({ response: messages.getMessage("message", 4) }, 204);
          }

        });
      }
    });
  }

  // Define o objeto encapsulador das funções de CRUD da api
  const docController = {
    delete: _delete
  };

  return docController;

}
