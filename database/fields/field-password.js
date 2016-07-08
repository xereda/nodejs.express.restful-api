// Regras para um campo tipo senha

const messages = require("../../controller/messages");

"use strict";

// String regex para aceitar apenas senhas com o mínimo de 8 casas,
// pelo menos um número, pelo menos uma letra e pelo menos
// um caractere especial
//const _validate = (v) => /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/.test(v);

const _validate = (v) => v.length >= 5;

const _field = {
  type: String,
  validate: [ _validate, messages.getMessage("error", 16) ],
  required: messages.getMessage("error", 8).replace("%1", "password")
}

module.exports = _field;
