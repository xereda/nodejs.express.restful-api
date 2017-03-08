"use strict";

module.exports = function(param) {

  const messages = require("../../../controller/messages");
  const mongoose = require("mongoose");
  const Schema = mongoose.Schema;

  const _object = [{
    user: require("./object-objectId")({ name: "user", required: true, index: true, schemaName: "User" }),
    createdById: require("./field-createdById")({ name: "createdById", required: true, subDoc: "user" }),
    updatedById: require("./field-updatedById")({ name: "updatedById", required: true, subDoc: "user" }),
    createdAt: require("./field-date")({ name: "createdAt", required: true, subDoc: "user" }),
    updatedAt: require("./field-date")({ name: "updatedAt", required: true, subDoc: "user" }),
    _id: false,
    id: false
  }];

  return _object;

}
