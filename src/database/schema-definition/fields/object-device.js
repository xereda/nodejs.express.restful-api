"use strict";

module.exports = function(param) {

  const messages = require("../../../controller/messages");
  const mongoose = require("mongoose");
  const Schema = mongoose.Schema;

  const _object = [{
    tokenPush: require("./field-string")({ name: "tokenPush", required: true }),
    name: require("./field-string")({ name: "name", required: true }),
    os: require("./field-string")({ name: "os", required: true }),
    createdById: require("./field-createdById")({ name: "createdById", required: true, subDoc: "devices" }),
    updatedById: require("./field-updatedById")({ name: "updatedById", required: true, subDoc: "devices" }),
    createdAt: require("./field-date")({ name: "createdAt", required: true, subDoc: "devices" }),
    updatedAt: require("./field-date")({ name: "updatedAt", required: true, subDoc: "devices" })
  }];

  return _object;

}
