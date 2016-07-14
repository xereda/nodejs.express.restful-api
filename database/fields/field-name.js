//const _get = (v) => v.toUpperCase();
const _set = (v) => v.toUpperCase();
const _validate = (v) => v.length >= 3;

const _field = {
  type: String,
  set: _set,
  validate: [ _validate, "Informe pelo menos 3 caracteres para o campo ({NAME})" ],
  required: "Campo nome é obrigatório",
  index: true
}


module.exports = _field;
