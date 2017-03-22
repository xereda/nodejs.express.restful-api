"use strict";

module.exports = function(param) {

  const messages = require("../../../controller/messages");
  const mongoose = require("mongoose");
  const Schema = mongoose.Schema;

  const _object = [{
    agreement: require("./object-objectId")({ name: "agreement", required: true, index: true, schemaName: "Agreement" }),
    createdById: require("./field-createdById")({ name: "createdById", required: true, subDoc: "allowedAgreements" }),
    updatedById: require("./field-updatedById")({ name: "updatedById", required: true, subDoc: "allowedAgreements" }),
    createdAt: require("./field-date")({ name: "createdAt", required: true, subDoc: "allowedAgreements" }),
    updatedAt: require("./field-date")({ name: "updatedAt", required: true, subDoc: "allowedAgreements" }),
    _id: false,
    id: false
  }];

  return _object;

}
