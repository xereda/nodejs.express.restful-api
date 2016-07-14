module.exports = function(collection) {

// Faz o controle das funções de CRUD da restapi

// Importa o módulo de definação da collection de usuários do docmob
const model = require("../database/schema-model")(collection);
const messages = require("./messages");

// ** READ ALL - GET **
// Funcão que retorna a lista de todos os usuários da collection users
// Recebe como parâmetro um callback contendo o response para
// o device chamador (navegador, aplicativo, etc...)
const _readAll = function(_pagination, _filters, _fields, _sort, callback) {

  const modelDoc = model.find({}, _fields);

  Object.keys(_filters).forEach(function(key,index) {

    if ((typeof _filters[key]) === "string") {

      if (key.indexOf("_start") > 0) {

        modelDoc.where(key.replace("_start", "")).gte(_filters[key]);

      } else if (key.indexOf("_end") > 0) {
        modelDoc.where(key.replace("_end", "")).lte(_filters[key]);
      } else if ((_filters[key].indexOf("/i") > 0) || (_filters[key][0] == "/")) {
        modelDoc.where(key).regex(eval(_filters[key]));
      } else {
        modelDoc.where(key).equals(_filters[key]);
      }
    } else {
        modelDoc.where(key).equals(_filters[key]);
    }

  });
  modelDoc.limit(_pagination.limit).skip(_pagination.limit * (_pagination.pag - 1));
  modelDoc.sort(_sort);
  modelDoc.exec(function(err, users) {

    if (err) {
      // Não foi possível retornar a lista de usuários
      callback({ error: messages.getMessage("error", 1), err }, 400);
    } else if (users.length == 0) {
      callback(users, 204);
    } else {
      callback(users, 200);
    }
  });

}

// ** READ - GET **
// Função que retorna um determinado usuário da collection users
// Além do callback recebe também o id do usuário
const _read = function(_id, _fields, callback) {

  // FindById é função filtro do mongoose. Com ela, basta passar o _id
  // em formato string.
  // Recebe um callback, onde err recebe o objeto de um eventual erro ou
  // user, caso encontre o usuário na collection de usuários

  model.findById(_id, _fields, function(err, user) {

    if (err) {
      // Nao foi possivel retornar o usuário
      callback({ error: messages.getMessage("error", 3), err }, 400);
    } else if (!user) {
      // Usuário não localizado
      callback({ response: messages.getMessage("message", 3) }, 404);
    } else {
      // Encontrou o usuáio e retorna para o callback o objeto respectivo
      callback(user, 200);
    }
  });

}

// ** CREATE POST **
// Função que cria novo usuário na collection de usuários
const _create = function(userObject, callback) {

  // Cria um novo usuário na colletion de usuários com o objeto
  // passado como parâmetro.
  new model(userObject).save(function(err, user) {

    // Caso ocorra erro na criação do usuário
    if (err) {
      // Não foi possível criar o usuário
      callback({ error: messages.getMessage("error", 4), err }, 400);
    } else {
      // Cria o usuário e retorna um objecto com o documento recem criado
      callback(user, 201);
    }
  });
}

// ** PUT UPDATE **
// Funcão que atualiza um usuário. Recebe como parâmetro o _id do usuário
// a ser alterado, o objeto aos campos a serem atualizados e por final,
// o callback de retorno para express.
const _update = function(_id, userObject, callback) {

  // Procura o usuário informado como parâmetro
  model.findById(_id, function(err, user) {

    // Caso tenha algum problema na procura
    if (err) {

      // Erro - Não foi possível retornar o usuário
      callback({ error: messages.getMessage("error", 3), err }, 400);

    } else if (!user) {

      // Não localizou o usuário informado como parâmetro
      callback({ response: messages.getMessage("message", 3) }, 404);

    } else {

      // Encontrou o usuário e vai atualizar os dados do documento
      // na collection users do mongodb

      Object.keys(userObject).forEach(function (key) {
        // exemplo apos parser do eval :
        // (userObject.name) ? user.name = userObject.name : null;
        eval("(userObject." + key + ") ? user." + key + " = userObject." + key + " : null;");
      });

      if (!userObject.updatedById) {
        callback({ error: messages.getMessage("error", 13).replace("%1", "updatedById") }, 400);
      } else {

        user.save(function(err, user) {
          // Erro - Não foi possível atualizar o usuário
          if (err) {
            callback({ error: messages.getMessage("error", 5), err }, 400);
          } else if (Object.keys(user.updatedFields).length === 0 && user.updatedFields.constructor === Object) {
            // nenhum campo da collection foi atualizado
            callback({}, 204);
          } else {
            // Campos foram atualizado
            // Retorna somente num objeto somente os campos alterados
            callback(user.updatedFields, 200);
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
  model.findById(_id, function(err, user) {

    // Caso ocorra algum erro na pesquisa do usuário
    if (err) {
      // Não foi possível localizar o usuário
      callback({ error: messages.getMessage("error", 3), err}, 400);
    } else if (!user) {
      // Usuário inexistente
      callback({ response: messages.getMessage("message", 3), err}, 404);
    } else {

      // Encontrou o usuário e irá remove-lo
      user.remove(function(err) {

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
const userController = {
  readAll:  _readAll, // get
  read:     _read,    // get
  create:   _create,  // post
  update:   _update,  // put
  delete:   _delete   // delete
};

return userController;

}
