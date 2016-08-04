module.exports = function(collection, model) {

  // Faz o controle das funções de CRUD da restapi

  const mongoose = require("mongoose");
  // Módulo que define o esquema da collection informada como parâmetro
  const schemaDef  = require("../database/schema-definition/" + collection);
  const messages = require("./messages");
  const config = require("../config/config");

  // ** PUT UPDATE **
  // Funcão que atualiza um documento. Recebe como parâmetro o _id do documento
  // a ser alterado, o objeto aos campos a serem atualizados e por final,
  // o callback de retorno para express.
  const _update = function(_id, docObject, callback) {

    console.log("docObject: ", docObject);

    if (schemaDef.subDocs !== undefined) {
      Object.keys(schemaDef.subDocs).forEach(function (key, i) {
        if ((docObject[schemaDef.subDocs[i].fieldName] !== undefined) && (docObject[schemaDef.subDocs[i].fieldName] !== null)) {
          Object.keys(docObject[schemaDef.subDocs[i].fieldName]).forEach(function (key2, i2) {
            docObject[schemaDef.subDocs[i].fieldName][i2].createdAt = new Date();
            docObject[schemaDef.subDocs[i].fieldName][i2].updatedAt = new Date();
          });
        }
      });
    }

    if (schemaDef.referencedFields !== undefined) {
      Object.keys(schemaDef.referencedFields).forEach(function (key, i) {
        if ((docObject[schemaDef.referencedFields[key].fieldName] !== undefined) &&
            (docObject[schemaDef.referencedFields[key].fieldName] !== null) &&
            (docObject[schemaDef.referencedFields[key].fieldName] !== "")) {

          console.log("o campo possui algum valor");
          console.log("docObject[schemaDef.referencedFields[key].fieldName]", docObject[schemaDef.referencedFields[key].fieldName]);

          _referencedValidation(schemaDef.referencedFields[key], _id, docObject, callback);

        } else {

//          _docUpdate(_id, docObject, callback);
          // documento referenciado não existem em sua collection principal
          callback({ error: messages.getMessage("error", 8).replace("%1", schemaDef.referencedFields[key].fieldName) }, 404);

        }
      });
    }

  }

  const _referencedValidation = function(referencedFields, _id, docObject, callback) {

    console.log("entrou na _referencedValidation");

    mongoose.models[referencedFields.ref].findOne({ "_id": docObject[referencedFields.fieldName] }, function (err, refDocExists) {

      // Caso tenha algum problema na pesquisa do subdocumento
      if (err) {

        // Erro - Não foi possível retornar o documento
        callback({ error: messages.getMessage("error", 3), err }, 400);

      } else if ((refDocExists === undefined) || (!refDocExists) || (refDocExists.length == 0)) {

        // documento referenciado não existem em sua collection principal
        callback({ error: messages.getMessage("error", 36).replace("%1", referencedFields.fieldName).replace("%2", referencedFields.ref) }, 404);

      } else { // documento referenciado encontrado em sua collection principal

        _docUpdate(_id, docObject, callback);

      }

    });

  }

  const _docUpdate = function(_id, docObject, callback) {

    // Procura o documento informado como parâmetro
    model.findOne({ _id: _id }, function(err, doc) {

      // Caso tenha algum problema na procura
      if (err) {

        // Erro - Não foi possível retornar o documento
        callback({ error: messages.getMessage("error", 5), err }, 400);

      } else if (!doc) {

        // Não localizou o documento informado como parâmetro
        callback({ response: messages.getMessage("message", 3) }, 404);

      } else {

        // Encontrou o usuário e vai atualizar os dados do documento
        // na collection do mongodb

        Object.keys(docObject).forEach(function (key) {

          // Tratativa para os campos de geoposicionamento
          if ((typeof docObject[key]) === "object") {

            if ((key == "geoLocation") && (typeof docObject[key].coordinates === "object")) {

              if ((docObject[key].coordinates[0] != doc[key].coordinates[0]) || (docObject[key].coordinates[1] != doc[key].coordinates[1])) {

                doc[key].coordinates = [];
                doc[key].coordinates[0] = parseFloat(docObject[key].coordinates[0]);
                doc[key].coordinates[1] = parseFloat(docObject[key].coordinates[1]);
              }
            } else {
              (docObject[key]) ? doc[key] = docObject[key] : null;
            }
          } else { // para todos os demais campos
            (docObject[key]) ? doc[key] = docObject[key] : null;
          }

        });

        if (!docObject.updatedById) {
          callback({ error: messages.getMessage("error", 13).replace("%1", "updatedById") }, 400);
        } else {

          doc.save(function(err, docUpdated) {

            // Erro - Não foi possível atualizar o usuário
            if (err) {
              callback({ error: messages.getMessage("error", 5), err }, 400);
            } else if (Object.keys(docUpdated.updatedFields).length === 0 && docUpdated.updatedFields.constructor === Object) {
              // nenhum campo da collection foi atualizado
              callback({}, 204);
            } else {
              // Campos foram atualizado
              // Retorna somente num objeto somente os campos alterados
              callback(docUpdated.updatedFields, 200);
            }
          });

        }
      }

    });

  }

  // Define o objeto encapsulador das funções de CRUD da api
  const docController = {
    update: _update // put
  };

  return docController;

}
