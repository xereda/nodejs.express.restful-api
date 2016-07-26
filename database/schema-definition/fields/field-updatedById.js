"use strict";

module.exports = function(param) {

  const messages = require("../../../controller/messages");
  const mongoose = require("mongoose");
  const Schema = mongoose.Schema;

  (!param.index) ? param.index = false : null;
  (!param.required) ? param.required = false : null;

  const _field = {
    type: Schema.Types.ObjectId,
    ref: "User",
    index: param.index,
    required: [ param.required, messages.getMessage("error", 8).replace("%1", param.name) + messages.getDescription("error", 11) ]
  }

  return _field;

}
