// Controler users.js
// Faz o controle das funções de CRUD da restapi

// Importa o módulo de definação da collection de usuários do docmob
const model = require("../database/user-schema-model");


// Define a função que será exportada como módulo
// Recebe como parâmetro o controller de mensagens do sistema
module.exports = function(messages) {

  // ** READ ALL - GET **
  // Funcão que retorna a lista de todos os usuários da collection users
  // Recebe como parâmetro um callback contendo o response para
  // o device chamador (navegador, aplicativo, etc...)
  const _readAll = function(_fields, callback) {

    model.User.find({}, _fields, function(err, users) {

      if (err) {
        // Não foi possível retornar a lista de usuários
        callback({ error: messages.getMessage("error", 1), err }, 400);
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

    console.log(_fields);

    model.User.findById(_id, _fields, function(err, user) {

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
    new model.User(userObject).save(function(err, user) {

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
    model.User.findById(_id, function(err, user) {

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

        // (userObject.name) ? user.name = userObject.name : null;
        // (userObject.email) ? user.email = userObject.email : null;
        // (userObject.password) ? user.password = userObject.password : null;
        // (userObject.admin) ? user.admin = userObject.admin : null;
        // (userObject.active) ? user.active = userObject.active : null;
        // (userObject.createdById) ? user.createdById = userObject.createdById : null;
        // (userObject.updatedById) ? user.updatedById = userObject.updatedById : null;

        if (!userObject.updatedById) {
          callback({ error: messages.getMessage("error", 13).replace("%1", "updatedById") }, 400);
        } else {

          user.save(function(err, user) {
            // Erro - Não foi possível atualizar o usuário
            if (err) {
              callback({ error: messages.getMessage("error", 5), err }, 400);
            } else {
              // Atualiza e retorna para o callback o objeto do usuário
              // atualizado referente ao documento da collection
              callback(user, 200);
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
    model.User.findById(_id, function(err, user) {

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
