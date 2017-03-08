"use strict";

module.exports = function(param) {

  const messages = require("../../../controller/messages");
  const CNPJ = require("cpf_cnpj").CNPJ;

  (!param.index) ? param.index = false : null;
  (!param.unique) ? param.unique = false : null;
  (!param.sparse) ? param.sparse = false : null;
  (!param.required) ? param.required = false : null;



  const _validate = function(v) {
    if ((v === "") || (v === null)) {
      return true;
    }
    const _cleanedCNPJ = CNPJ.strip(v.replace(/&#{0,1}[a-z0-9]+;/ig, ""));
    if (CNPJ.isValid(_cleanedCNPJ)) {
      return true;
    }
    return false;
  }

  const _set = function(v) {
    if (v !== undefined && v !== null && v !== "") return CNPJ.strip(v.replace(/&#{0,1}[a-z0-9]+;/ig, ""));
  }

  const _get = function(v) {
    if (v !== undefined && v !== null && v !== "") return CNPJ.format(v);
  }

  const _field = {
    type: String,
    set: _set,
    get: _get,
    validate: [ _validate, messages.getMessage("error", 28).replace("%1", param.name) ],
    required: [ param.required, messages.getMessage("error",  8).replace("%1", param.name) ]
  }

  if (param.index) _field.index = true
  if (param.unique) _field.unique = true
  if (param.sparse) _field.sparse = true

  return _field;

}
