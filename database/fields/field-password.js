// Regras para um campo tipo senha
"use strict";

const bcrypt = require("bcrypt");

const _set = function(v) {
  return bcrypt.hashSync(v, 10);
}

// String regex para aceitar apenas senhas com o mínimo de 8 casas,
// pelo menos um número, pelo menos uma letra e pelo menos
// um caractere especial
//const _validate = (v) => /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/.test(v);

const _validate = function(v) {
  console.log("senha informada: " + v);
  if (v.length > 5) return true;
}

const _field = {
  type: String,
  validate: [ _validate, "Senha inválida. Informe pelo menos 5 caracteres" ],
  required: "Senha é obrigatória",
  set: _set,
}

module.exports = _field;
