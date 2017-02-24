"use strict";

module.exports = function(param) {

  const messages = require("../../../controller/messages");

  (!param.index) ? param.index = false : null;
  (param.unique === true) ? param.index = { unique: true, sparse: true } : null;
  (!param.required) ? param.required = false : null;

  const _set = v => {
    if (v !== undefined) {
      if (param.setUpper) return v.toUpperCase();
      if (param.setLower) return v.toLowerCase();
    }
    return v;
  }

  const _get = v => {
    if (v !== undefined) {
      if (param.getUpper) return v.toUpperCase();
      if (param.getLower) return v.toLowerCase();
    }
    return v;
  }

  const _validate = (v) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);

  const _field = {
    type: String,
    set: _set,
    get: _get,
    index: param.index,
    validate: [ _validate, messages.getMessage("error", 18) ],
    required: [ param.required, messages.getMessage("error", 8).replace("%1", param.name) ]
  }

  return _field;
}
