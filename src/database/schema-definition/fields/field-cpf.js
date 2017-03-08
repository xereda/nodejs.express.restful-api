"use strict";

module.exports = function(param) {

  const messages = require("../../../controller/messages");
  const CPF = require("cpf_cnpj").CPF;

  (!param.index) ? param.index = false : null;
  (!param.unique) ? param.unique = false : null;
  (!param.sparse) ? param.sparse = false : null;
  (!param.required) ? param.required = false : null;

  const _validate = (v) => {
    if ((v === "") || (v === null)) {
      console.log("dentro da field-cpf.js: ", param.name, v)
      return true;
    }
    const _cleanedCPF = CPF.strip(decodeURI(v.replace(/&#{0,1}[a-z0-9]+;/ig, "")));
    if (CPF.isValid(_cleanedCPF)) {
      return true;
    }
    return false;
  }

  const _set = (v) => {
    if (v !== undefined && v !== null && v !== "") return CPF.strip(decodeURI(v.replace(/&#{0,1}[a-z0-9]+;/ig, "")));
  }

  const _get = (v) => {
    if (v !== undefined && v !== null && v !== "") return CPF.format(v);
  }

  const _field = {
    type: String,
    set: _set,
    get: _get,
    validate: [ _validate, messages.getMessage("error", 27).replace("%1", param.name) ],
    required: [ param.required, messages.getMessage("error",  8).replace("%1", param.name) ]
  }

  if (param.index) _field.index = true
  if (param.unique) _field.unique = true
  if (param.sparse) _field.sparse = true

  return _field;

}
