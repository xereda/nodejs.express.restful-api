module.exports = function(collection, model) {

  // Faz o controle das funções de CRUD da restapi

  const mongoose = require("mongoose");
  // Módulo que define o esquema da collection informada como parâmetro
  const schemaDef  = require("../database/schema-definition/" + collection);
  const messages = require("./messages");
  const config = require("../config/config");

  const _count = function(_filters, _qFilter, callback) {

    // cria uma instância do model para realizar a query no banco.
    const modelDoc = model.find(_qFilter);

    // Percorre todos os filtros informados na query string.
    Object.keys(_filters).forEach(function(key,index) {

      // Caso o parâmetro de filtro termina com _gte é porque ele deverá ser
      // a data inicial para um filtro de data, com isso aplicamos .where(campo)
      // e .gte(data) para o model do find(). Lembrando que gte significa
      // "igual ou maior que".
      if (key.indexOf("_gte") > 0) {

        modelDoc.where(key.replace("_gte", "")).gte(_filters[key]);

      } else if (key.indexOf("_lte") > 0) {

        // O mesmo controle mencionado acima ("_gte"), mas agora determina
        // que a data informado deve ser "igual ou menor que".
        modelDoc.where(key.replace("_lte", "")).lte(_filters[key]);

      // Caso o campo seja do tipo string
      } else if ((typeof _filters[key]) === "string") {

        if ((_filters[key].indexOf("/i") > 0) || (_filters[key][0] == "/")) {

          // Caso o filtro seja string e tenha sido informado uma regex simples,
          // usamos o where com função regex() para filtrar pela expressão regular.
          modelDoc.where(key).regex(eval(_filters[key]));

        } else {

          // Caso seja um parâmetro simples (não é data ou expressão regular),
          // verifica apenas se existem documentos com o campo com valor igual ao
          // informado.
          modelDoc.where(key).equals(_filters[key]);
        }
      } else {
        // Caso seja um parâmetro simples (não é data ou expressão regular),
        // verifica apenas se existem documentos com o campo com valor igual ao
        // informado.
        modelDoc.where(key).equals(_filters[key]);
      }

    });

    modelDoc.count(function(err, count) {

      if (count) {
        callback(count);
      }

    });


  }

  // Define o objeto encapsulador das funções de CRUD da api
  const docController = {
    count: _count // get
  };

  return docController;

}
