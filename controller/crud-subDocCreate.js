module.exports = function(collection, model) {

  // Faz o controle das funções de CRUD da restapi

  const mongoose = require("mongoose");
  // Módulo que define o esquema da collection informada como parâmetro
  const schemaDef  = require("../database/schema-definition/" + collection);
  const messages = require("./messages");
  const config = require("../config/config");

  const _subDocCreate = function(_id, _field, docObject, callback) {

    // remove o campo updatedById caso tenha sido informado
    // este campo deve ser informado apenas na atualizacao
    delete docObject["updatedById"];

    const _objSubDoc = schemaDef.subDocs.find(function(element) {
      return element.fieldName === _field;
    });

    if ((_objSubDoc.fieldName === undefined) || (_objSubDoc.fieldName === null)) {

      // collection principal não possui sub documentos.
      callback({ error: messages.getMessage("error", 31).replace("%1", _field).replace("%2", collection), err }, 404);

    } else { // o parametro _field está relacionado como um subdocumento na collection informada

      // verifica se o subdocumento informado existe
      mongoose.models[_objSubDoc.ref].findOne({ "_id": docObject[_objSubDoc.indexField] }, function (err, subDocExists) {

        // Caso tenha algum problema na pesquisa do subdocumento
        if (err) {

          // Erro - Não foi possível retornar o documento
          callback({ error: messages.getMessage("error", 3), err }, 400);

        } else if ((subDocExists === undefined) || (!subDocExists) || (subDocExists.length == 0)) {

          // Subdocumento informado não existem em sua collection principal
          callback({ error: messages.getMessage("error", 33).replace("%1", _objSubDoc.ref) }, 404);

        } else { // subdocumento encontrado em sua collection principal

          _userValidation();

        }

      });

      const _userValidation = function() {

        mongoose.models["User"].findOne({ "_id": docObject["createdById"] }, function (err, userExists) {

          // Caso tenha algum problema na pesquisa do subdocumento
          if (err) {

            // Erro - Não foi possível retornar o documento
            callback({ error: messages.getMessage("error", 3), err }, 400);

          } else if ((userExists === undefined) || (!userExists) || (userExists.length == 0)) {

            // Subdocumento informado não existem em sua collection principal
            callback({ error: messages.getMessage("error", 9) }, 404);

          } else { // subdocumento encontrado em sua collection principal

            _mainSubDocLocated();

          }

        });

      }


      // o subdocumento informado existe em sua collection principal
      const _mainSubDocLocated = function() {

        // Procura o documento informado como parâmetro
        model.findOne({ _id: _id }, function(err, doc) {

          // Caso tenha algum problema na procura
          if (err) {

            // Erro - Não foi possível retornar o documento
            callback({ error: messages.getMessage("error", 3), err }, 400);

          } else if (!doc) {

            // Não localizou o documento informado como parâmetro
            callback({ response: messages.getMessage("message", 3) }, 404);

          } else {

            // existe o documento que receberá o push do subdocumento
            _docLocated(doc);

          }

        });

      }

      // existe o documento principal onde será adicionado um novo subdocumento
      const _docLocated = function(doc) {

        const _objectFilter = {};
        _objectFilter["_id"] = _id;
        _objectFilter[_objSubDoc.fieldName + "." + _objSubDoc.indexField] = docObject[_objSubDoc.indexField];

        model.find(_objectFilter, function(err, subDocLocated) {

          // Caso tenha algum problema na pesquisa do subdocumento
          if (err) {

            // Erro - Não foi possível retornar o documento
            callback({ error: messages.getMessage("error", 3), err }, 400);

          } else if (subDocLocated.length > 0) {

            // Subdocumento já está vinculado ao documento principal
            callback({ error: messages.getMessage("error", 32) }, 406);

          } else { // sub documento ainda não está vinculado, portanto, será adicionado na array de subdocs

            _pushCall(doc);

          } // fim - sub documento ainda não está vinculado, portanto, será adicionado na array de subdocs

        });
      }

      // vai criar um novo subdocumento (push no array de subdocs)
      const _pushCall = function(doc) {

        // determina a data atual para os campos createdAt e updatedAt
        docObject.createdAt = (new Date()).toISOString();
        docObject.updatedAt = (new Date()).toISOString();

        docObject.updatedById = docObject.createdById;

        doc[_field].push(docObject);

        doc.save(function(err, docUpdated) {

          // Erro - Não foi possível atualizar o usuário
          if (err) {
            callback({ error: messages.getMessage("error", 5), err }, 400);
          } else if (Object.keys(docUpdated.updatedFields).length === 0 && docUpdated.updatedFields.constructor === Object) {
            // nenhum campo da collection foi atualizado
            callback({}, 204);
          } else {
            // push realizado com sucesso
            callback(docObject, 201);
          }
        });

      }

    }
  }

  // Define o objeto encapsulador das funções de CRUD da api
  const docController = {
    subDocCreate: _subDocCreate // post subdocumento
  };

  return docController;

}
