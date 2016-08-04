"use strict";

module.exports = function(param) {

  const messages = require("../../../controller/messages");
  const mongoose = require("mongoose");
  const Schema = mongoose.Schema;

  (!param.index) ? param.index = false : null;
  (param.unique === true) ? param.index = { unique: true } : null;
  (!param.required) ? param.required = false : null;


  const _object = [{
    provider: require("./object-objectId")({ name: "provider", index: true, unique: true, required: true, schemaName: "Provider" }),
    phoneExtension: require("./field-number")({ name: "phoneExtension" }),
    email: require("./field-email")({ name: "email", required: true }),
    createdById: require("./field-createdById")({ name: "createdById", required: true, subDoc: "provider" }),
    updatedById: require("./field-updatedById")({ name: "updatedById", required: true, subDoc: "provider" }),
    createdAt: require("./field-date")({ name: "createdAt", required: true, subDoc: "provider" }),
    updatedAt: require("./field-date")({ name: "updatedAt", required: true, subDoc: "provider" }),
    _id: false
  }];

  return _object;

}
