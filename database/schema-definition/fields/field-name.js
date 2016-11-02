"use strict";

module.exports = function(param) {

  const messages = require("../../../controller/messages");

  (!param.index) ? param.index = false : null;
  (param.unique === true) ? param.index = { unique: true, sparse: true } : null;
  (!param.minLength) ? param.minLength = 0 : null;
  (!param.required) ? param.required = false : null;

  const _set = function(v) {
    if (param.setUpper) return v.toUpperCase();
    if (param.setLower) return v.toLowerCase();
    return v;
  }

  const _get = function(v) {
    if (param.getUpper) return v.toUpperCase();
    if (param.getLower) return v.toLowerCase();
    return v;
  }
  
  const _validate = (v) => v.length >= param.minLength;

  const _field = {
    type: String,
    set: _set,
    get: _get,
    index: param.index,
    validate: [ _validate, messages.getMessage("error", 17).replace("%2", param.minLength).replace("%1", param.name) ],
    required: [ param.required, messages.getMessage("error", 8).replace("%1", param.name) ]
  }

  return _field;

}
