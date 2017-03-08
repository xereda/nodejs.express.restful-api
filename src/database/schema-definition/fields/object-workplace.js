"use strict";

module.exports = function(param) {

  const messages = require("../../../controller/messages");
  const mongoose = require("mongoose");
  const Schema = mongoose.Schema;

  const _object = [{
    workplace: require("./object-objectId")({ name: "workplace", index: true, schemaName: "Workplace" }),
    createdById: require("./field-createdById")({ name: "createdById", required: true, subDoc: "workplace" }),
    updatedById: require("./field-updatedById")({ name: "updatedById", required: true, subDoc: "workplace" }),
    createdAt: require("./field-date")({ name: "createdAt", required: true, subDoc: "workplace" }),
    updatedAt: require("./field-date")({ name: "updatedAt", required: true, subDoc: "workplace" }),
    _id: false,
    id: false
  }];

  return _object;

}
