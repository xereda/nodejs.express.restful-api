module.exports = function(collection, model) {

  // Faz o controle das funções de CRUD da restapi

  const mongoose = require("mongoose");
  // Módulo que define o esquema da collection informada como parâmetro
  const schemaDef  = require("../database/schema-definition/" + collection);
  const messages = require("./messages");
  const config = require("../config/config");


  // ** CREATE POST **
  // Função que cria novo docunento na collection especificada
  const _create = function(docObject, callback) {

    Object.keys(schemaDef.subDocs).forEach(function (key, i) {
      if ((docObject[schemaDef.subDocs[i].fieldName] !== undefined) && (docObject[schemaDef.subDocs[i].fieldName] !== null)) {
        Object.keys(docObject[schemaDef.subDocs[i].fieldName]).forEach(function (key2, i2) {
          docObject[schemaDef.subDocs[i].fieldName][i2].createdAt = new Date();
          docObject[schemaDef.subDocs[i].fieldName][i2].updatedAt = new Date();
        });
      }
    });

    // Cria um novo documento com o objeto passado como parâmetro.
    new model(docObject).save(function(err, doc) {

      // Caso ocorra erro na criação do documento
      if (err) {
        // Não foi possível criar o documento
        callback({ error: messages.getMessage("error", 4), err }, 400);
      } else {
        // Cria o documento e retorna um objecto com o documento recem criado
        callback(doc, 201);
      }
    });
  }

  // Define o objeto encapsulador das funções de CRUD da api
  const docController = {
    create: _create // post
  };

  return docController;

}
