"use strict";

module.exports = function(param) {

  const messages = require("../../../controller/messages");
  const mongoose = require("mongoose");
  const Schema = mongoose.Schema;

  const _object = [{
    blockedLife: require("./object-objectId")({ name: "life", required: true, index: true, schemaName: "Life" }),
    startDate: require("./field-date")({ name: "startDate", required: true, subDoc: "blockedLives" }),
    endDate: require("./field-date")({ name: "endDate", subDoc: "blockedLives" }),
    notes: require("./field-string")({ name: "notes", subDoc: "blockedLives" }),
    createdById: require("./field-createdById")({ name: "createdById", required: true, subDoc: "blockedLives" }),
    updatedById: require("./field-updatedById")({ name: "updatedById", required: true, subDoc: "blockedLives" }),
    createdAt: require("./field-date")({ name: "createdAt", required: true, subDoc: "blockedLives" }),
    updatedAt: require("./field-date")({ name: "updatedAt", required: true, subDoc: "blockedLives" }),
    _id: false
  }];

  return _object;

}
