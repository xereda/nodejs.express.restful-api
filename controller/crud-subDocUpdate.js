module.exports = function(collection, model) {

  // Faz o controle das funções de CRUD da restapi

  const mongoose = require("mongoose");
  // Módulo que define o esquema da collection informada como parâmetro
  const schemaDef  = require("../database/schema-definition/" + collection);
  const messages = require("./messages");
  const config = require("../config/config");

  const _subDocUpdate = function(_id, _field, _indexField, _subDoc_id, updateObject, callback) {

    let _subDocIdFilterField = {};
    _subDocIdFilterField[_field + "." + _indexField] = _subDoc_id;

    // remove o campo createdById caso tenha sido informado
    // este campo deve ser informado apenas na criação
    delete updateObject[_field + ".$.createdById"];

    mongoose.models["User"].findOne({ "_id": updateObject[_field + ".$.updatedById"] }, function (err, userExists) {

      // Caso tenha algum problema na pesquisa do subdocumento
      if (err) {

        // Erro - Não foi possível retornar o documento
        callback({ error: messages.getMessage("error", 3), err }, 400);

      } else if ((userExists === undefined) || (!userExists) || (userExists.length == 0)) {

        // Subdocumento informado não existem em sua collection principal
        callback({ error: messages.getMessage("error", 12) }, 404);

      } else { // subdocumento encontrado em sua collection principal

        // Procura o subdocumento informado como parâmetro
        model.findOneAndUpdate({ $and: [ { _id: _id }, _subDocIdFilterField ] }, updateObject, { new: true, runValidators: true }, function(err, updatedDoc) {

          // Caso tenha algum problema na procura
          if (err) {

            // Erro - Não foi possível atualizar o subdocumento
            callback({ error: messages.getMessage("error", 5), err }, 400);

          } else if (!updatedDoc) {

            // Subdocumento não localizado conforme critérios informados
            callback({ response: messages.getMessage("message", 5) }, 404);

          } else {

            // subdocumento atualizado
            callback(updatedDoc[_field].find(function(element) {
              if (element[_indexField] == _subDoc_id) return true;
              return false;
            }), 200);

          }
        });

      }

    });

  }

  // Define o objeto encapsulador das funções de CRUD da api
  const docController = {
    subDocUpdate: _subDocUpdate // put para um subdoc
  };

  return docController;

}
