"use strict";

const _messages = [
  { code: 1, description: "Servidor PRONTO!"},
  { code: 2, description: "Servidor sendo executado"},
  { code: 3, description: "Usuário não localizado"},
];

const _getObject = function(indexError) {
  return _messages.find(function(e) {
    return e.code == indexError;
  });
}

const _getMessage = function(indexError) {
  const _object = _getObject(indexError);
  return "[" + _object.code + "] " + _object.description;
}

const _getDescription = function(indexError) {
  const _object = _getObject(indexError);
  return _object.description;
}

const messageObject = {
  getObject: _getObject,
  getMessage: _getMessage,
  getDescription: _getDescription
};


module.exports = messageObject;

//console.log(messageObject.getObject(2));
