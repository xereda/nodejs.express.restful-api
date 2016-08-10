"use strict";

module.exports = function(param) {

  const messages = require("../../../controller/messages");
  const mongoose = require("mongoose");
  const Schema = mongoose.Schema;

  const _object = {
    type: Schema.Types.ObjectId,
    ref: param.schemaName,
    required: [ param.required, messages.getMessage("error", 8).replace("%1", param.name) ],
    //required: [ true, messages.getMessage("error", 8).replace("%1", param.name) ],
    index: param.index
  };

  return _object;

}
