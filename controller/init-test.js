"use strict";

const config = require("../config/config");
const mongoose = require("mongoose");

const _test = function(callback) {

  if ((config.defaultCreatedById === undefined) || (config.defaultCreatedById === null)) {

    callback(false);


  } else {

    // Pesquisa pelo usuario defino no arquivo de configuracao
    mongoose.models["User"].findById(config.defaultCreatedById).exec(function(err, doc) {

      // Caso ocorra algum erro na pesquisa ou // documento inexistente
      if ((err) || (!doc)) {

        console.log("deu merda");

        callback(false);

      } else {

        callback(true);

      }

    });


  }

}

// Objeto de interface para acesso as funções de recuperação de mensagens.
const objectInterface = {
  test: _test
};

// Exporta o objeto de interface
module.exports = objectInterface;
