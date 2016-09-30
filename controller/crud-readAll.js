module.exports = function(collection, model) {

  // Faz o controle das funções de CRUD da restapi

  const mongoose = require("mongoose");
  // Módulo que define o esquema da collection informada como parâmetro
  const schemaDef  = require("../database/schema-definition/" + collection);
  const messages = require("./messages");
  const config = require("../config/config");
  const initTest = require("./init-test");

  const sleep = require("sleep");



  let _testControl;
  const _testInit = function(returnTest) {
    _testControl = returnTest;
  }


  // ** READ ALL - GET **
  // Funcão que retorna a lista de todos os documentos da collection
  // Recebe como parâmetro um callback contendo o response para
  // o device chamador (navegador, aplicativo, etc...)
  const _readAll = function(_populate, _lean, _pagination, _filters, _fields, _sort, _qFilter, callback) {

    initTest.test(function(returnTest) {
      _testInit(returnTest);
    });

    // sleep.sleep(2);

    // Parâmetros recebidos na função anônima:
    // * _lean: determina se a consulta irá retornar um objeto mongoose ou apenas
    // objeto javascript simples. O uso do lean() melhora e muito a performance
    // das querys.
    // * _pagination: objeto contendo as duas propriedades de paginação.
    // Propriedaedes do objeto _pagination: .limit e _pagination.sort
    // * _filters: objeto contendo os filtros informados na query string da
    // requisição (/users/?active=[boolean]&createdAt_gte=[isodate]&name=/[parte do nome]/i)
    // * _fields: objeto contendo os campos da collection que serão retornados
    // pela API.
    // * _sort: objeto contendo os campos e orientação para ordenação.
    // (/users/?_sort=-name) -> ordenará de forma descrescente pelo campo nome
    // * callback: função de retorno para o express.

    if (_testControl === false) {

      callback({ response: messages.getMessage("message", 8) }, 404);

    } else {

      console.log("vai filtrar por: ", _qFilter );

      // cria uma instância do model para realizar a query no banco.
      //const modelDoc = model.find(eval("{ " + _qFilter + " }"), _fields);
      const modelDoc = model.find(_qFilter, _fields);

      // Percorre todos os filtros informados na query string.
      Object.keys(_filters).forEach(function(key,index) {

        // Caso o parâmetro de filtro termina com _gte é porque ele deverá ser
        // a data inicial para um filtro de data, com isso aplicamos .where(campo)
        // e .gte(data) para o model do find(). Lembrando que gte significa
        // "igual ou maior que".
        if (key.indexOf("_gte") > 0) {

          console.log("dentro de start", key.replace("_gte", ""), _filters[key], typeof _filters[key]);

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

      // Determina o limite e paginação. A função skip() determina quantos
      // documentos devem ser pulados. Como o valor informado como filtro na API é
      // referente ao número da página, para que consigamos chegar no valor exato de
      // documentos a serem "pulados", subtraímos 1 do valor informato e o
      // multiplacamos pela quantidade de documento que podem ser rornados por página.
      modelDoc.limit(_pagination.limit).skip(_pagination.limit * (_pagination.pag - 1));


      // Se (_lean = true) retorna um objeto javascript simples e não um
      // documento mongoose. A aplicação de lean() melhora e muito as querys e
      // retorno de listas.
      modelDoc.lean(_lean);

      _populate.forEach(function(v) {
        modelDoc.populate(v);
      });

      modelDoc.sort(_sort);

      // Após todas as definçòes acima, executa a query.
      modelDoc.exec(function(err, docs) {

        if (err) {
          // Não foi possível retornar a lista de documentos
          callback({ error: messages.getMessage("error", 1), err }, 400);
        } else if ((docs) && (docs.length == 0)) {

          // Caso não encontre documentos com os critérios informados, retorna
          // para o requisitante um array de objetos vazio
          callback([{}], 200);

        } else if (!docs) {

          // Caso não encontre documentos com os critérios informados, retorna
          // para o requisitante um array de objetos vazio
          callback([{}], 404);

        } else {

          // Caso encontre documentos através dos critérios informados,
          // retorna o objeto JSON para o requisitante.
          callback(docs, 200);
        }
      });

    }

  }

  // Define o objeto encapsulador das funções de CRUD da api
  const docController = {
    readAll: _readAll // get
  };

  return docController;

}
