"use strict";

// Funçòes geréricas da API.

// Módulo usado na hash da senha.
const bcrypt = require("bcrypt");

// Módulo para limpar os campos informados.
const validator = require("validator");

// Módulo que define as configurações gerais da API.
const config = require("../config/config");

const _getLeanParam = function(param) {

  if (param) {
    if ((param.toLowerCase() == "false") || (param.toLowerCase() == "no")) {
      return false;
    }
  }
  return true;

}

// Executa um trim e um escape no parâmetro informado.
const _validate = function(param) {
  return validator.trim(validator.escape(param));
}

// Monta um objeto contendo os campos que foram informados no corpo da
// requisição para inclusão (POST) de um novo documento ou para
// atualização (PUT) de um documento já existente.
const _getObjectBody = function(req, schema) {
  const _objectBody = {};

  // Controle para não ficar monstrando, na inclusão de um novo documento,
  // mensagem de crítica para o campo "updatedById" não informado.
  // O campo "updatedById" é obrigatório apenas na atualização de um documento.
  if (req.method == "POST") {
    if (req.body.createdById) {
      req.body.updatedById = req.body.createdById;
    } else {
      req.body.updatedById = config.defaultCreatedById;
    }
  }

  // Percorre todos os campos informados no corpo da requisição.
  Object.keys(req.body).forEach(function (key) {

    //console.log(key, req.body[key], typeof req.body[key], (typeof req.body[key]) === "string");

    // Verifica se o campo informado faz parte do esquema atual.
    if (schema[key]) {

      // Verifica se o campo informado é do tipo string e caso verdade
      // limpa o valor informado com trim e escape. (segurança)

      if ((typeof req.body[key]) === "string") {
        _objectBody[key] = _validate(req.body[key])
      } else if ((typeof req.body[key]) === "object") { // quando for um objeto
        _objectBody[key] = req.body[key];
      } else { // caso nao seja string, apenas atribui o mesmo campo/valor para o objeto de retorno da função
        _objectBody[key] = req.body[key];
      }
    }

  });

  console.log("_objectBody: ", _objectBody);
  return _objectBody;

}

// Retorna um objeto contendo os campos informados no param.
// Caso o type seja "fields", o prefixo "-" funcionará apenas para a chave da
// collection (_id). Caso o type seja "sort", quando o prefixo for "-",
// determinará que o campo deve ser ordenado de forma decrescente.
const _toJSObject = function(type, param) {

  // cria o objeto que será retornado
  const _obj = {};
  if (param) {
    // Para os nomes dos campos, considera apenas letras, números e os
    // caracteres "-" e "_".
    // Percorre todos os campos informados no "_field" e "_sort".
    _validate(param.replace(/[^A-Za-z0-9,-_]/g, '')).split(",").forEach(function(v) {

      // campo ok
      if (v) {

        // Campo _id informado com hífen (-_id) determina que o código do
        // documento não deve apresentado, adicionado na lista de objetos a
        // serem retornados, mas no caso seu valor será zero.
        if (v == "-_id") {
          (type == "fields") ? _obj["_id"] = 0 : null;
        // caso o campo tenha sido informado com hífen no início
        } else if (v[0] == "-") {
          // Caso a função esteja sendo usada para campos (fields) e por ventura
          // tenha sido informado com hífen no início, adiciona na lista
          // a ser retornada, mas sem o hífen. Como _id sempre é apresentado
          // resultados, apenas ele pode receber parâmetros para ser desligado.
          // Senão, se a função está sendo usada para determinar os campos de
          // ordenação (_sort) e o campo informado iniciar com hífen, ele é
          // adicionado no objeto de retorno, mas com o valor negativo -1.
          (type == "fields") ? _obj[v.substring(1)] = 1 : _obj[v.substring(1)] = -1;
        } else {
          // Caso o campo não começe com hifen, apenas adiciona o campo no
          // objeto de retorno com o valor 1, ou seja, caso seja para campos de
          // retorno, ele retorna e caso seja para ordenação (_sort) ele
          // ordenará decrescentemente.
          _obj[v] = 1;
        }
      }

    });
  }
  return _obj;
}

// Função para criar um objeto de filtros para a query (find)
const _toFiltersObject = function(req, schema) {

  let _obj = {};

  // Percorre todos os parametros encaminhados via query string (pela url).
  Object.keys(req.query).forEach(function(key,index) {

    // Remove as strings finais dos filtros do tipo data ("_start" e "_end") e
    // adiciona em um novo objeto. Isso é necessário, pois o campo precisa
    // existir no esquema da colletion.
    const _cleanKey = key.replace("_start", "").replace("_end", "");

    // O parametro informado na url é um campo do schema?
    // Se sim, então determina-o como um filtro no find
    if (schema.hasOwnProperty(_cleanKey)) {
      switch (schema[_cleanKey].type) {
        case Number:
          _obj[key] = parseInt(req.query[key]);
          break;
        case Boolean:
          ((req.query[key].toLowerCase() == "true") || (req.query[key].toLowerCase() == "yes")) ? _obj[key] = true : _obj[key] = false;
          break;
        default:
          _obj[key] = req.query[key];
      }
    }
  });
  return _obj;
}

// Determina um objeto de paginação. Caso o _limit não seja informado, ou ainda,
// seja maior que o definido nas configurações gerais (config/config.js),
// determina como padrão o próprio parâmetro que está nas configurações gerais.
// Isso serve para limitar a quantidade de documentos a serem retornados
//  pela API, forçando com que o programador frondend crie paginação de
// resultados.
const _toPaginationObject = function(req) {
  const _obj = {};

  ((_obj.limit = parseInt(req.query["_limit"])) && (_obj.limit <= config.pagination_limit)) ? null : _obj.limit = config.pagination_limit;
  (_obj.pag = parseInt(req.query["_pag"])) ? null : _obj.pag = 1;

  return _obj;
}

// Determna o hash da senha informada, usando o módulo bcrypt.
const _passwordCrypt = function(v) {
  return bcrypt.hashSync(v, 10);
}


// Define a interface encapsuladora das funções aqui existentes.
const controller = {
  toPaginationObject: _toPaginationObject,
  toFiltersObject: _toFiltersObject,
  toJSObject: _toJSObject,
  getObjectBody: _getObjectBody,
  validate: _validate,
  passwordCrypt: _passwordCrypt,
  getLeanParam: _getLeanParam
};

module.exports = controller;
