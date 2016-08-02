"use strict";

module.exports = function(param) {

  const messages = require("../../../controller/messages");
  const mongoose = require("mongoose");
  const Schema = mongoose.Schema;

  (!param.index) ? param.index = false : null;
  (!param.required) ? param.required = false : null;

  const _object = {
    type: Schema.Types.ObjectId,
    ref: param.schemaName,
    requerid: [ param.required, messages.getMessage("error", 8).replace("%1", param.name) ],
    index: { unique: param.index } 
  };

  return _object;

}
