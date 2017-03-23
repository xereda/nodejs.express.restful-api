module.exports = function(collection, model) {

  // Faz o controle das funções de CRUD da restapi
  const mongoose = require("mongoose");
  // Módulo que define o esquema da collection informada como parâmetro
  const schemaDef  = require("../database/schema-definition/" + collection);
  const messages = require("./messages");
  const config = require("../config/config");

  const sleep = require("sleep");

  // ** READ - GET **
  // Função que retorna um determinado documento da collection.
  // Além do callback recebe também o id do usuário
  const _read = function(_populate, _id, _fields, callback) {

    // Função que pesquisa por um determinado documento.
    // Recebe um callback, onde err recebe o objeto de um eventual erro ou
    // doc, caso encontre o documento na collection

    const modelDoc = model.findOne({ _id: _id }, _fields);

    _populate.forEach(function(v) {
      modelDoc.populate(v);
    });

    // modelDoc.populate({
    //        path: "providers.provider",
    //        model: "Provider",
    //        populate: {
    //          path: "workplaces.workplace",
    //          model: "Workplace"
    //        }});

    modelDoc.exec(function(err, doc) {

      // sleep.sleep(2);

      if (err) {
        // Nao foi possivel retornar o documento
        callback({ error: messages.getMessage("error", 3), err }, 400);
      } else if (!doc) {
        // documento não localizado
        callback({ response: messages.getMessage("message", 3) }, 404);
      } else {
        // Encontrou o documento e retorna para o callback o objeto respectivo
        callback(doc, 200);
      }
    });

  }

  // Define o objeto encapsulador das funções de CRUD da api
  const docController = {
    read: _read // get
  };

  return docController;

}
