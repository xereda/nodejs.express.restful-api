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

    let createControl = true;

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
            createControl = false;
            callback({ error: messages.getMessage("error", 38).replace("%1", schemaDef.subDocs[key].fieldName) }, 400);
          }

        }

      });
    }

    if (createControl === true) {
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

      });    }

  }


  // Define o objeto encapsulador das funções de CRUD da api
  const docController = {
    create: _create // post
  };

  return docController;

}
