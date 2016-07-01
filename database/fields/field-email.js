const _set = (v) => v.toLowerCase();
const _validate = (v) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);

const _field = {
  type: String,
  set: _set,
  validate: [ _validate, "E-mail ({VALUE}) inválido!" ],
  required: "E-mail é obrigatório"
}

module.exports = _field;
