"use strict";

module.exports = function(param) {

  const messages = require("../../../controller/messages");
  const mongoose = require("mongoose");
  const Schema = mongoose.Schema;

  const _object = [{
    provider: require("./object-objectId")({ name: "provider", index: true, required: true, schemaName: "Provider" }),
    phoneExtension: require("./field-number")({ name: "phoneExtension" }),
    email: require("./field-email")({ name: "email", required: true }),
    deadlineScheduleCancel: require("./field-number")({ name: "deadlineScheduleCancel", required: true, min: 0, max: 99 }),
    lockedCancel: require("./field-boolean")({ name: "lockedCancel", required: true, default: false }),
    alertCancel: require("./field-string")({ name: "msgCancelAlert" }),
    // lkdCanNoIntSched -> determina se é possível cancelar uma agenda quando
    // o prestador não possui agenda integrada ao docmob.
    lkdCanNoIntSched: require("./field-boolean")({ name: "lkdCanNoIntSched", required: true, default: false }),
    msgCanNoIntSched: require("./field-string")({ name: "msgCanNoIntSched" }),
    createdById: require("./field-createdById")({ name: "createdById", required: true, subDoc: "provider" }),
    updatedById: require("./field-updatedById")({ name: "updatedById", required: true, subDoc: "provider" }),
    createdAt: require("./field-date")({ name: "createdAt", required: true, subDoc: "provider" }),
    updatedAt: require("./field-date")({ name: "updatedAt", required: true, subDoc: "provider" }),
    _id: false
  }];

  return _object;

}
