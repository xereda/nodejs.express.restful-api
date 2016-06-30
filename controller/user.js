const model = require("../database/user-model");

module.exports = function(messages) {

  const userController = {

    list: function(callback) {

      model.User.find({}, function(err, users) {

        if (err) {
          callback({ error: "Não foi possível retonar a lista de usuários! " + err }); //
        } else {
          callback(users);
        }
      });

    },
    user: function(_id, callback) {

      model.User.findById(_id, function(err, user) {

        if (err) {
          callback({ error: "Não foi possível retornar o usuário! " + err });
        } else if (!user) {
          callback({ response: messages.getMessage(3) });
        } else {
          callback(user);
        }
      });

    },
    save: function(fullname, email, callback) {

      new model.User({
        name: fullname,
        email: email
      }).save(function(err, user) {

        if (err) {
          callback({ error: "Não foi possível salvar o usuário! " + err });
        } else {
          callback(user);
        }

      });


    },
    update: function(_id, fullname, email, callback) {

      model.User.findById(_id, function(err, user) {

        if (err) {
          callback({ error: "Não foi retornar o usuário" });
        } else if (!user) {
          callback({ response: messages.getMessage(3) });
        } else {
          user.name = fullname;
          user.email = email;

          user.save(function(err, user) {

            if (err) {
              callback({ error: "Não foi possível atualizar o usuário" });
            } else {
              callback(user);
            }

          });
        }

      });


    },
    delete: function(_id, callback) {

      model.User.findById(_id, function(err, user) {

        if ((err) || (!user)) {
          callback({ error: "Não foi possível retornar o usuário" });
        } else {

          user.remove(function(err) {

            if (!err) {
              callback({ response: "Usuário " + _id + " excluído com sucesso" });
            }

          });

        }
      });

    }

  };

  return userController;

}
