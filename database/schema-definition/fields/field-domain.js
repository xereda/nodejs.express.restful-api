"use strict";

module.exports = function(param) {

  const messages = require("../../../controller/messages");

  (!param.index) ? param.index = false : null;
  (!param.subDoc) ? param.subDoc = "" : param.subDoc + ".";
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
    } else if (param.valueType === "number") {
      return parseInt(v);
    } else if (param.valueType === "float") {
      return parseFloat(v);
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

    if (param.valueType === "number") {
      v = parseInt(v);
    } else if (param.valueType === "float") {
      v = parseFloat(v);
    }

    if ((param.valueType === "string") && (_changedDomain.includes(v.toUpperCase()))) {
      console.log(1);
      return true;
    } else if (_changedDomain.includes(v)) {
      console.log(2);
      return true;
    }
    console.log(3);
    console.log("_changedDomain: ", _changedDomain);
    console.log("_changedDomain.includes(v): ", _changedDomain.includes(v));
    console.log("typeof v: ", typeof v);
    return false;
  }

  const _field = {
    type: String,
    set: _set,
    get: _get,
    validate: [ _validate, messages.getMessage("error", 22).replace("%1", param.domain).replace("%2", param.name) ],
    required: [ param.required, messages.getMessage("error", 22).replace("%1", param.domain).replace("%2", param.subDoc + param.name) ]
  }

  return _field;

}
