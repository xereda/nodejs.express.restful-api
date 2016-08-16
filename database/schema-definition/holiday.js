// scheduledAbsence - Ausencias agendadas

"use strict";

module.exports.schema = {
  date: require("./fields/field-date")({ name: "date", required: true, index: true }),
  name: require("./fields/field-name")({ name: "name", required: true, index: true }),
  recurrent: require("./fields/field-boolean")({ name: "recurrent", required: true }),
  regional: require("./fields/field-boolean")({ name: "regional", required: true }),
  city: require("./fields/object-objectId")({ name: "city", index: true, required: true, schemaName: "City" }),
  createdById: require("./fields/field-createdById")({ name: "createdById", required: true }),
  updatedById: require("./fields/field-updatedById")({ name: "updatedById", required: true }),
  createdAt: require("./fields/field-date")({ name: "createdAt" }),
  updatedAt: require("./fields/field-date")({ name: "updatedAt" })
};

module.exports.schemaProperties = { timestamps: true };

// array contendo os campos referentes a subdocumentos.
// module.exports.subDocs = [
//   { fieldName: "allowedHIs", ref: "HealthInsurance", indexField: "allowedHI" },
// ];

module.exports.referencedFields = [
  { fieldName: "city", ref: "City"},
];

module.exports.setIndexFields = { date: 1, city: 1 };
module.exports.setIndexOptions = { unique: true };
