"use strict";

module.exports = function(param) {

  const messages = require("../../../controller/messages");
  const mongoose = require("mongoose");
  const Schema = mongoose.Schema;
  let _prefix = "";
  let _msgCode = 10;

  if ((param.subDoc !== undefined) && (param.subDoc !== "")) {
    _prefix = param.subDoc + ".";
    _msgCode = 29;
  }

  (!param.index) ? param.index = false : null;
  (!param.required) ? param.required = false : null;

  const _field = {
    type: Schema.Types.ObjectId,
    ref: "User",
    index: param.index,
    required: [ param.required, messages.getMessage("error", 8).replace("%1", _prefix + param.name) + " " + messages.getDescription("error", _msgCode) ]
  }

  return _field;

}
