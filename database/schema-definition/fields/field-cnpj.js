"use strict";

module.exports = function(param) {

  const messages = require("../../../controller/messages");
  const CNPJ = require("cpf_cnpj").CNPJ;

  (!param.index) ? param.index = false : null;
  (param.unique === true) ? param.index = { unique: true } : null;
  (!param.required) ? param.required = false : null;



  const _validate = function(v) {
    const _cleanedCNPJ = CNPJ.strip(v.replace(/&#{0,1}[a-z0-9]+;/ig, ""));
    if (CNPJ.isValid(_cleanedCNPJ)) {
      return true;
    }
    return false;
  }

  const _set = function(v) {
    return CNPJ.strip(v.replace(/&#{0,1}[a-z0-9]+;/ig, ""));
  }

  const _field = {
    type: String,
    set: _set,
    validate: [ _validate, messages.getMessage("error", 28).replace("%1", param.name) ],
    required: [ param.required, messages.getMessage("error",  8).replace("%1", param.name) ],
    index: param.index
  }

  return _field;

}
