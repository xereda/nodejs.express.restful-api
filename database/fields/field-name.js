//const _get = (v) => v.toUpperCase();
//const _set = (v) => v.toLowerCase();
const _validate = (v) => v.length >= 3;

const _field = {
  type: String,
  validate: [ _validate, "Informe pelo menos 3 caracteres para o campo ({NAME})" ],
  required: true,
}


module.exports = _field;
