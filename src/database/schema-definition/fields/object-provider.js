"use strict";

module.exports = function(param) {

  const messages = require("../../../controller/messages");
  const mongoose = require("mongoose");
  const Schema = mongoose.Schema;

  const _object = [{
    provider: require("./object-objectId")({ name: "provider", index: true, required: true, schemaName: "Provider" }),
    specialties: [ { specialty: require("./object-objectId")({ name: "specialty", index: true, required: true, schemaName: "Specialty" }),
                     name: require("./field-name")({ name: "name", required: true }),
                     _id: false } ],
    agreements: [ { agreement: require("./object-objectId")({ name: "agreements", index: true, required: true, schemaName: "Agreement" }),
                    name: require("./field-name")({ name: "name", required: true }),
                    _id: false } ],
    phoneExtension: require("./field-number")({ name: "phoneExtension" }),
    email: require("./field-email")({ name: "email" }),
    deadlineScheduleCancel: require("./field-number")({ name: "deadlineScheduleCancel", required: true, min: 0, max: 99 }), // dédlaine iskédjul kêncil
    lockedCancel: require("./field-boolean")({ name: "lockedCancel", required: true, default: false }),
    alertCancel: require("./field-string")({ name: "alertCancel" }),
    // lkdCanNoIntSched (locked Cancel Without Integrated Schedule)
    // Determina se é possível cancelar uma agenda quando o  prestador não
    // possui agenda integrada ao docmob. Yes => "Não permite cancelar"
    lkdCanNoIntSched: require("./field-boolean")({ name: "lkdCanNoIntSched", required: true, default: false }),
    msgCanNoIntSched: require("./field-string")({ name: "msgCanNoIntSched" }),
    createdById: require("./field-createdById")({ name: "createdById", required: true, subDoc: "provider" }),
    updatedById: require("./field-updatedById")({ name: "updatedById", required: true, subDoc: "provider" }),
    createdAt: require("./field-date")({ name: "createdAt", required: true, subDoc: "provider" }),
    updatedAt: require("./field-date")({ name: "updatedAt", required: true, subDoc: "provider" }),
    _id: false,
    id: false
  }];

  return _object;

}
