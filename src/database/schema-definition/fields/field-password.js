"use strict";

// Regras para um campo tipo senha

module.exports = function(param) {

  const messages = require("../../../controller/messages");

  (!param.index) ? param.index = false : null;
  (!param.minLength) ? param.minLength = 0 : null;
  (!param.required) ? param.required = false : null;

  // String regex para aceitar apenas senhas com o mínimo de 8 casas,
  // pelo menos um número, pelo menos uma letra e pelo menos
  // um caractere especial
  //const _validate = (v) => /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/.test(v);

  const _validate = (v) => v.length >= param.minLength;

  const _field = {
    type: String,
    index: param.index,
    validate: [ _validate, messages.getMessage("error", 16) ],
    required: messages.getMessage("error", 8).replace("%1", param.name)
  }

  return _field;

}
