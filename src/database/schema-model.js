"use strict";

// Define middleware e o model para manipulação da collection

const _isRequeridRef = function(schema, fieldName) {
  if ((schema[fieldName].required !== undefined) && (schema[fieldName].required === true)) {
    return true;
  }
  return false;
}

const _isValue = function(field) {
  if ((field !== undefined) && (field !== null) && (field !== "")) {
    return true;
  }
  return false;
}

module.exports = function(collection) {

  const mongoose = require("mongoose");

    // Módulo contendo parâmetros de configurações gerais
  const config = require("../config/config");

  // Módulo contendo funções genéricas
  const utils = require("../utils/utils");

  // Conexão ao banco de dados MongoDB
  const conn =  require("../config/connection");

  // Definição do esquema da collection passada como parâmetro
  // Todos os esquemas deverão ficar localizados na pasta database,
  // com sua indentificação no singular, e no seguinte padrão:
  // "[nome da collection]-schema=definition.js".
  const schemaDef = require("./schema-definition/" + collection);

  // Módulo de controle de mensagens e erros do sistema
  const messages = require("../controller/messages");

  // Defina um mongoose esquema com base no esquema informado como parâmetro
  const _schema = mongoose.Schema(schemaDef.schema, schemaDef.schemaProperties);

  // quando a conexão com o banco de dados estiver aberta
  // conn.once("open", function() {

    // pre.save - define rotinas para serem executadas antes de salvar o
    // documento, tanto na criação (post, create), como na atualização
    // (put, update).
    _schema.pre("save", function(next) {

      // Verifica se é a collection "users" (usuários) e se a senha foi
      // foi alterada.
      if ((collection == "User") && (this.isModified("password"))) {
        // Altera a senha para a sua versão criptografada
        this.password = utils.passwordCrypt(this.password);
      }

      next();

    });

    // midlleware do pre.save para retornar um objeto contendo
    // apenas os campos alterados para método PUT.
    _schema.pre("save", function(next) {

      // define um novo objeto
      let _updatedFieldsObject = {};

      // cria uma instância do this para ser utilizada dentro do forEach()
      const _this = this;

      // percorre todos os campos que foram atulizados (modifiedPaths)
      this.modifiedPaths().forEach(function(v) {
        // adiciona o campo e o valor no objeto a ser retornado
        _updatedFieldsObject[v] = _this[v];

      });

      // Define uma nova propriedade no this. Lembrando que essa propriedade
      // será desconsiderada na atualização do documento no banco de dados, pois
      // não está definida como campo, no esquema do mongoose.
      // Serve apenas para que seja recuperada e retornada no método PUT.
      this.updatedFields = _updatedFieldsObject;

      next();

    });

    if (schemaDef.referencedFields !== undefined) {

      Object.keys(schemaDef.referencedFields).forEach(function (key, i) {

        // Adiciona uma característica de validação para os campos que fazem
        // referência a outras collections
        _schema.path(schemaDef.referencedFields[key].fieldName).validate(function (value, respond) {

          if (_isRequeridRef(schemaDef.schema, schemaDef.referencedFields[key].fieldName) || _isValue(value)) {

            mongoose.models[schemaDef.referencedFields[key].ref].findOne({_id: value}, function (err, doc) {

              if (err || !doc) {
                  respond(false); // documento informado nao tem referência em outra collection
              } else {
                  respond(true); // ok, não apresenta erro.
              }

            });

          } else {
            respond(true);
          }

        }, messages.getMessage("error", 36).replace("%1", schemaDef.referencedFields[key].fieldName).replace("%2", schemaDef.referencedFields[key].ref) );

      });
    }

    // adiciona uma caracteristica de validacao para campos array em sub documentos
    // determina que uma campo de tipo array e que seja interna a um subdoc
    // é obrigatorio.
    if (schemaDef.subDocsRequiredFields !== undefined) {

      Object.keys(schemaDef.subDocsRequiredFields).forEach(function (key, i) {

        _schema.path(schemaDef.subDocsRequiredFields[key].subDocName).schema.path(schemaDef.subDocsRequiredFields[key].field).validate(function (value, respond) {

          if (value.length > 0) {
            respond(true);
          } else {
            respond(false);
          }

        }, messages.getMessage("error", 8).replace("%1", schemaDef.subDocsRequiredFields[key].field) );

      });
    }


    // Adiciona uma característica de validação para o campo (path) "createdById".
    _schema.path("createdById").validate(function (value, respond) {

      // Validação é feita apenas quando for criação de um novo documento
      if (this.isNew) {

        // Verifica se usuário informado no campo "createdById" existe
        // na collection de usuários.
        mongoose.models["User"].findOne({_id: value}, function (err, doc) {
          if (err || !doc) {
              respond(false); // usuário informado não está pre-cadastrado
          } else {
              respond(true); // ok, não apresenta erro.
          }
        });
      } else { // está criando atulizando um documento, então ignora a validação do campo "createdById"
        respond(true); // ok, não apresenta erro. Callback para aplicação continuar.
      }

    }, messages.getMessage("error", 9) );

    // Adiciona uma característica de validação para o campo (path) "updatedById".
    _schema.path('updatedById').validate(function (value, respond) {

      // Somente valida o campo "updatedById" caso for uma atualização.
      if (!this.isNew) {

        // Verifica se usuário informado no campo "updatedById" existe
        // na collection de usuários.
        mongoose.models["User"].findOne({_id: value}, function (err, doc) {
            if (err || !doc) {
                respond(false); // usuário informado não está pre-cadastrado
            } else {
                respond(true); // ok, não apresenta erro.
            }
        });
      } else { // está criando um novo documento, então ignora validação do campo "updatedById"
        respond(true); // ok, não apresenta erro. Callback para aplicação continuar.
      }

    }, messages.getMessage("error", 12) );

  // }); -- fim do conn.once

  // Caso as propriedades sejam definidas no arquivo de esquema, cria um índice customizado
  if ((schemaDef.setIndexFields !== undefined) && (schemaDef.setIndexOptions !== undefined)) {
    _schema.index(schemaDef.setIndexFields, schemaDef.setIndexOptions);
  }

  (schemaDef.schema.geoLocation) ? _schema.index({ geoLocation : '2dsphere' }) : null;

  // Exporta o model com a definição do esquema e suas regras
  return mongoose.model(collection, _schema);


}
