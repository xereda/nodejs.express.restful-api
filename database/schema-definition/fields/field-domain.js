"use strict";

module.exports = function(param) {

  const messages = require("../../../controller/messages");

  (!param.index) ? param.index = false : null;
  (!param.required) ? param.required = false : null;
  (!param.valueType) ? param.valueType = "string" : null;

  let _changedDomain = [];

  if (param.valueType === "string") {
    param.domain.forEach(function(element, index) {
      _changedDomain[index] = element.toUpperCase();
    });
  } else {
    _changedDomain = param.domain;
  }

  const _set = function(v) {
    if (param.valueType === "string") {
      if (param.setUpper) return v.toUpperCase();
      if (param.setLower) return v.toLowerCase();
    }
    return v;
  }

  const _get = function(v) {
    if (param.valueType === "string") {
      if (param.getUpper) return v.toUpperCase();
      if (param.getLower) return v.toLowerCase();
    }
    return v;
  }


  const _validate = function(v) {
    if (param.required === false) {
      return true;
    } else if (_changedDomain.includes(v.toUpperCase())) {
      return true;
    }
    return false;
  }

  const _field = {
    type: String,
    set: _set,
    get: _get,
    validate: [ _validate, messages.getMessage("error", 22).replace("%1", param.domain).replace("%2", param.name) ],
    required: [ param.required, messages.getMessage("error", 22).replace("%1", param.domain).replace("%2", param.name) ]
  }

  return _field;

}
