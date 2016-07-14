const bcrypt = require("bcrypt");
const validator = require("validator");
const config = require("../config/config");

const _validate = function(parameter) {
  return validator.trim(validator.escape(parameter));
}

const _getUserObject = function(req, schema) {
  const _userObject = {};

  if (req.method == "POST") {
    if (req.body.createdById) {
      req.body.updatedById = req.body.createdById;
    } else {
      req.body.updatedById = config.defaultCreatedById;
    }
  }

  Object.keys(schema).forEach(function (key) {
    // exemplo apos parser do eval :
    // (req.body.name) ? _userObject.name = _validate(req.body.name) : null;
    eval("(req.body." + key + ") ? _userObject." + key + " = _validate(req.body." + key + ") : null;");
  });

  return _userObject;
}

const _toJSObject = function(type, param) {
  const _obj = {};
  if (param) {
    _validate(param.replace(/[^A-Za-z0-9,-_]/g, '')).split(",").forEach(function(v) {

      if (v) {

        if (v == "-_id") {
          (type == "fields") ? _obj["_id"] = 0 : null;
        } else if (v[0] == "-") {
          (type == "fields") ? _obj[v.substring(1)] = 1 : _obj[v.substring(1)] = -1;
        } else {
          _obj[v] = 1;
        }
      }

    });
  }
  return _obj;
}

const _toFiltersObject = function(req, schema) {

  let _obj = {};

  Object.keys(req.query).forEach(function(key,index) {

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

const _toPaginationObject = function(req) {
  const _obj = {};

  ((_obj.limit = parseInt(req.query["_limit"])) && (_obj.limit <= config.pagination_limit)) ? null : _obj.limit = config.pagination_limit;
  (_obj.pag = parseInt(req.query["_pag"])) ? null : _obj.pag = 1;

  return _obj;
}

const _passwordCrypt = function(v) {
  return bcrypt.hashSync(v, 10);
}

const controller = {
  toPaginationObject: _toPaginationObject,
  toFiltersObject:    _toFiltersObject,
  toJSObject:         _toJSObject,
  getUserObject:      _getUserObject,
  validate:           _validate,
  passwordCrypt:      _passwordCrypt
};

module.exports = controller;
