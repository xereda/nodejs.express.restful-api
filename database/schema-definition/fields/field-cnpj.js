"use strict";

module.exports = function(param) {

  const messages = require("../../../controller/messages");
  const CNPJ = require("cpf_cnpj").CNPJ;

  (!param.index) ? param.index = false : null;
  (!param.required) ? param.required = false : null;

  const _validate = function(v) {
    if (CNPJ.isValid(v.replace("&#x2F;", ""))) {
      return true;
    }
    return false;
  }

  const _field = {
    type: String,
    validate: [ _validate, messages.getMessage("error", 28).replace("%1", param.name) ],
    required: [ param.required, messages.getMessage("error",  8).replace("%1", param.name) ],
    index: param.index
  }

  return _field;

}
