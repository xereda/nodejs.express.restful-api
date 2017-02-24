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
    // Verifica se o campo informado faz parte do esquema atual.
    if (schema[key]) {
      // Verifica se o campo informado é do tipo string e caso verdade
      // limpa o valor informado com trim e escape. (segurança)
      if ((typeof req.body[key]) === "string") {
        _objectBody[key] = _validate(req.body[key])
      } else if ((typeof req.body[key]) === "object") { // quando for um objeto
        _objectBody[key] = req.body[key];
      // } else if ((typeof req.body[key]) === "boolean") { // quando for um BOOLEAN
      //   _objectBody[key] = req.body[key].toString();
      } else { // caso nao seja string, apenas atribui o mesmo campo/valor para o objeto de retorno da função
        _objectBody[key] = req.body[key];
      }
    }

  });
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

    // o filtro informado na query string é um objeto interno da collection
    if (key.indexOf(".") > 0) {

      const _qObject = key.split(".")[0];
      const _qPropertie = key.split(".")[1];

      // Remove as strings finais dos filtros do tipo data ("_gte" e "_lte") e
      // adiciona em um novo objeto. Isso é necessário, pois o campo precisa
      // existir no esquema da colletion.
      const _qCleanKey = _qPropertie.replace("_gte", "").replace("_lte", "");

      // O parametro informado na url é um campo do schema?
      // Se sim, então determina-o como um filtro no find
      if (schema[_qObject].hasOwnProperty(_qCleanKey)) {

        switch (schema[_qObject][_qCleanKey].type) {
          case Number:
            if (parseInt(req.query[key])) {
              _obj[key] = parseInt(req.query[key]);
            }
            break;
          case Boolean:
            ((req.query[key].toLowerCase() == "true") || (req.query[key].toLowerCase() == "yes")) ? _obj[key] = true : _obj[key] = false;
            break;
          default:
            if (req.query[key] != "") {
              _obj[key] = req.query[key];
            }
        }
      }

    } else {

      // Remove as strings finais dos filtros do tipo data ("_start" e "_lte") e
      // adiciona em um novo objeto. Isso é necessário, pois o campo precisa
      // existir no esquema da colletion.
      const _cleanKey = key.replace("_gte", "").replace("_lte", "");

      // O parametro informado na url é um campo do schema?
      // Se sim, então determina-o como um filtro no find
      if (schema.hasOwnProperty(_cleanKey)) {

        switch (schema[_cleanKey].type) {
          case Number:
            if (parseInt(req.query[key])) {
              _obj[key] = parseInt(req.query[key]);
            }
            break;
          case Boolean:
            ((req.query[key].toLowerCase() == "true") || (req.query[key].toLowerCase() == "yes")) ? _obj[key] = true : _obj[key] = false;
            break;
          default:
            if (req.query[key] != "") {
              _obj[key] = req.query[key];
            }
        }
      }

    }

  });

  return _obj;

}

// Função para criar um objeto de filtros para a query (find)
const _toPopulatedFiltersObject = function(req, schema) {

  let _obj = {};

  // Percorre todos os parametros encaminhados via query string (pela url).
  Object.keys(req.query).forEach(function(key,index) {

    let _prefix = key.substr(0, key.indexOf(".") + 1);

    if (!_prefix) {
      return;
    }

    // Remove as strings finais dos filtros do tipo data ("_gte" e "_lte") e
    // adiciona em um novo objeto. Isso é necessário, pois o campo precisa
    // existir no esquema da colletion.
    const _cleanKey = key.replace("_gte", "").replace("_lte", "").replace(_prefix, "");

    // O parametro informado na url é um campo do schema?
    // Se sim, então determina-o como um filtro no find
    if (schema.hasOwnProperty(_cleanKey)) {
      switch (schema[_cleanKey].type) {
        case Number:
          if (parseInt(req.query[key])) {
            _obj[key] = parseInt(req.query[key]);
          }
          break;
        case Boolean:
          ((req.query[key].toLowerCase() == "true") || (req.query[key].toLowerCase() == "yes")) ? _obj[key] = true : _obj[key] = false;
          break;
        default:
          if (req.query[key] != "") {
            _obj[key] = req.query[key];
          }
      }
    }
  });

  return _obj;
}

// Determina um objeto de paginação. Caso o _limit não seja informado, ou ainda,
// seja maior que o definido nas configurações gerais (config/config.js),
// determina como padrão o próprio parâmetro que está nas configurações gerais.
// Isso serve para limitar a quantidade de documentos a serem retornados
//  pela API, forçando com que o programador frontend crie paginação de
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

const _toSubDocUpdateObject = function(_field, _object) {

  let _returnObject = {};

  Object.keys(_object).forEach(function(key,index) {

    if (key !== "_id") {
      _returnObject[_field + ".$." + key] = _object[key];
    }

  });

  // adiciona data de atualização
  _returnObject[_field + ".$." + "updatedAt"] = (new Date()).toISOString();

  return _returnObject;

}

const _qFilter = function(_q, _schema) {

  let _orQuery = "({ $or: [ ";

  Object.keys(_schema).forEach(function(key,index) {

    if ((_schema[key].type === String) || (_schema[key].type === Number)) {

      if (key !== "password") {
        _orQuery += " { " + key + ": /" + _q + "/i }, "
      }
    }

  });

  _orQuery += " ] })";

  return eval(_orQuery);

}


// Define a interface encapsuladora das funções aqui existentes.
const controller = {
  qFilter: _qFilter,
  toPaginationObject: _toPaginationObject,
  toFiltersObject: _toFiltersObject,
  toPopulatedFiltersObject: _toPopulatedFiltersObject,
  toSubDocUpdateObject: _toSubDocUpdateObject,
  toJSObject: _toJSObject,
  getObjectBody: _getObjectBody,
  validate: _validate,
  passwordCrypt: _passwordCrypt,
  getLeanParam: _getLeanParam
};

module.exports = controller;
