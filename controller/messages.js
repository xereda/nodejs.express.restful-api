"use strict";

// Importa os objetos de mensagens e de erros
const _messages = require("../config/messages");
const _errors = require("../config/errors");

// Controla o retorno para que não volte undefined para o script principal.
// Caso o índíce informado (indexMessage) não corresponder a uma
// mensagem na array de objetos, retorna mensagem padrão no lugar de undefined.
const _checkUndefined = function(type, object, indexMessage) {
  let literal;
  (type == "message") ? literal = "A mensagem" : literal = "O erro";
  if ((object) && (indexMessage > 0)) return object;
  return {code: 0, description: literal + " com índice " + indexMessage + " não foi cadastrada!"};
}

// Recupera o objeto inteiro da mensagem.
const _getObject = function(type, indexMessage) {
  return eval("_" + type + "s").find(function(e) {
    return e.code == indexMessage;
  });
}

// Recupera a mensagem no padrão "[999] Mensagem".
const _getMessage = function(type, indexMessage) {
  let _object = _checkUndefined(type, _getObject(type, indexMessage), indexMessage);
  return "[" + _object.code + "] " + _object.description;
}

// Recupera apenas a descrição da mensagem
const _getDescription = function(type, indexMessage) {
  let _object = _checkUndefined(type, _getObject(type, indexMessage), indexMessage);
  return _object.description;
}

// Objeto de interface para acesso as funções de recuperação de mensagens.
const messageObject = {
  getObject: _getObject,
  getMessage: _getMessage,
  getDescription: _getDescription
};

// Exporta o objeto de interface
module.exports = messageObject;
