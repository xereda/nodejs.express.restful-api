"use strict";

module.exports = function(param) {

  const messages = require("../../../controller/messages");
  const mongoose = require("mongoose");
  const Schema = mongoose.Schema;

  (!param.index) ? param.index = false : null;
  (!param.required) ? param.required = false : null;


  const _object = [{
    provider: require("./object-ObjectId")({ name: "provider", index: true, schemaName: "Provider" }),
    phoneExtension: require("./field-number")({ name: "phoneExtension", required: true }),
    email: require("./field-email")({ name: "email", required: true }),
    _id: false
  }];

  return _object;

}
