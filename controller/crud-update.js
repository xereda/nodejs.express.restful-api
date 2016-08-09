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

    let updateControle = true;

    // Adiciona validacao para sub documentos. Sub documentos não podem ser
    // manipulados diretamente na colllection pai. Apenas no controle específico
    // para sub documentos. Para manipular sub documentos, siga o padrão:
    // http://server:5000/resource/codigo/campoSubDocumento
    if (schemaDef.subDocs !== undefined) {

      Object.keys(schemaDef.subDocs).forEach(function (key, i) {

        if (docObject[schemaDef.subDocs[key].fieldName] !== undefined) {

          console.log("schemaDef.subDocs[key].fieldName: ", schemaDef.subDocs[key].fieldName);
          console.log("docObject[schemaDef.subDocs[key].fieldName]: ", docObject[schemaDef.subDocs[key].fieldName]);

          if (docObject[schemaDef.subDocs[key].fieldName].length > 0) {
            updateControle = false;
            callback({ error: messages.getMessage("error", 38).replace("%1", schemaDef.subDocs[key].fieldName) }, 400);
          }

        }

      });
    }

    if (updateControle === true) {

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

  }

  // Define o objeto encapsulador das funções de CRUD da api
  const docController = {
    update: _update // put
  };

  return docController;

}
