module.exports = function(collection) {

// Faz o controle das funções de CRUD da restapi

// Importa o módulo de definação da collection de usuários do docmob
const model = require("../database/schema-model")(collection);
const messages = require("./messages");

// ** READ ALL - GET **
// Funcão que retorna a lista de todos os documentos da collection
// Recebe como parâmetro um callback contendo o response para
// o device chamador (navegador, aplicativo, etc...)
const _readAll = function(_pagination, _filters, _fields, _sort, callback) {

  // Parâmetros recebidos na função anônima:
  // * _pagination: objeto contendo as duas propriedades de paginação.
  // Propriedaedes do objeto _pagination: .limit e _pagination.sort
  // * _filters: objeto contendo os filtros informados na query string da
  // requisição (/users/?active=[boolean]&createdAt_start=[isodate]&name=/[parte do nome]/i)
  // * _fields: objeto contendo os campos da collection que serão retornados
  // pela API.
  // * _sort: objeto contendo os campos e orientação para ordenação.
  // (/users/?_sort=-name) -> ordenará de forma descrescente pelo campo nome
  // * callback: função de retorno para o express.

  // cria uma instância do model para realizar a query no banco.
  const modelDoc = model.find({}, _fields);

  // Percorre todos os filtros informados na query string.
  Object.keys(_filters).forEach(function(key,index) {

    // Caso o campo seja do tipo string
    if ((typeof _filters[key]) === "string") {

      // Caso o parâmetro de filtro termina com _start é porque ele deverá ser
      // a data inicial para um filtro de data, com isso aplicamos .where(campo)
      // e .gte(data) para o model do find(). Lembrando que gte significa
      // "igual ou maior que".
      if (key.indexOf("_start") > 0) {

        modelDoc.where(key.replace("_start", "")).gte(_filters[key]);

      } else if (key.indexOf("_end") > 0) {

        // O mesmo controle mencionado acima ("_start"), mas agora determina
        // que a data informado deve ser "igual ou menor que".
        modelDoc.where(key.replace("_end", "")).lte(_filters[key]);

      } else if ((_filters[key].indexOf("/i") > 0) || (_filters[key][0] == "/")) {

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

  // Determina a ordenação do resultado.
  modelDoc.sort(_sort);

  // Após todas as definçòes acima, executa a query.
  modelDoc.exec(function(err, docs) {

    if (err) {
      // Não foi possível retornar a lista de documentos
      callback({ error: messages.getMessage("error", 1), err }, 400);
    } else if (docs.length == 0) {

      // Caso não encontre documentos com os critérios informados, retorna
      // para o requisitante o HTTP code 204 (no content).
      callback(docs, 204);

    } else {

      // Caso encontre documentos através dos critérios informados,
      // retorna o objeto JSON para o requisitante.
      callback(docs, 200);
    }
  });

}

// ** READ - GET **
// Função que retorna um determinado documento da collection.
// Além do callback recebe também o id do usuário
const _read = function(_id, _fields, callback) {

  // FindById é função filtro do mongoose. Com ela, basta passar o _id
  // em formato string.
  // Recebe um callback, onde err recebe o objeto de um eventual erro ou
  // doc, caso encontre o documento na collection

  model.findOne({ _id: _id }, _fields, function(err, doc) {

    if (err) {
      // Nao foi possivel retornar o usuário
      callback({ error: messages.getMessage("error", 3), err }, 400);
    } else if (!doc) {
      // Usuário não localizado
      callback({ response: messages.getMessage("message", 3) }, 404);
    } else {
      // Encontrou o usuáio e retorna para o callback o objeto respectivo
      callback(doc, 200);
    }
  });

}

// ** CREATE POST **
// Função que cria novo docunento na collection especificada
const _create = function(docObject, callback) {

  // Cria um novo usuário com o objeto passado como parâmetro.
  new model(docObject).save(function(err, doc) {

    // Caso ocorra erro na criação do usuário
    if (err) {
      // Não foi possível criar o usuário
      callback({ error: messages.getMessage("error", 4), err }, 400);
    } else {
      // Cria o usuário e retorna um objecto com o documento recem criado
      callback(doc, 201);
    }
  });
}

// ** PUT UPDATE **
// Funcão que atualiza um usuário. Recebe como parâmetro o _id do usuário
// a ser alterado, o objeto aos campos a serem atualizados e por final,
// o callback de retorno para express.
const _update = function(_id, docObject, callback) {

  // Procura o usuário informado como parâmetro
  model.findOne({ _id: _id }, function(err, doc) {

    // Caso tenha algum problema na procura
    if (err) {

      // Erro - Não foi possível retornar o usuário
      callback({ error: messages.getMessage("error", 3), err }, 400);

    } else if (!doc) {

      // Não localizou o usuário informado como parâmetro
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

// ** DELETE **
// Tenta localizar um usuário passado como parâmetro e se encontrar
// remove seu documento da collection de usuários
const _delete = function(_id, callback) {

  // Pesquisa pelo usuário passado como parâmetro
  model.findById(_id, function(err, doc) {

    // Caso ocorra algum erro na pesquisa do usuário
    if (err) {
      // Não foi possível localizar o usuário
      callback({ error: messages.getMessage("error", 3), err}, 400);
    } else if (!doc) {
      // Usuário inexistente
      callback({ response: messages.getMessage("message", 3), err}, 404);
    } else {

      // Encontrou o usuário e irá remove-lo
      doc.remove(function(err) {

        // Documento na collection de usuários foi removido com sucesso
        if (!err) {
          // Usuário excluído com sucesso
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
  readAll:  _readAll, // get
  read:     _read,    // get
  create:   _create,  // post
  update:   _update,  // put
  delete:   _delete   // delete
};

return docController;

}
