// scheduledAbsence - Ausencias agendadas
// Pronúncia: Iskédiold Ébsense

"use strict";

module.exports.schema = {
  id: false,
  workplace: require("./fields/object-objectId")({ name: "workplace", index: true, required: true, schemaName: "Workplace" }),
  provider: require("./fields/object-objectId")({ name: "provider", index: true, required: true, schemaName: "Provider" }),
  startDate: require("./fields/field-date")({ name: "startDate",
                                              endValueValidator: true,
                                              endFieldValidator: "endDate",
                                              // requiredStartDate -> determina a data mínima a ser informada - default: 1900-01-01
                                              requireStartDate: true,
                                              setHours: { hour: 0, min: 0, sec: 0, millisec: 0 } }),
  endDate: require("./fields/field-date")({ name: "endDate", required: true }),
  startHour: require("./fields/field-hhmm")({ name: "startHour", endValueValidator: true, endFieldValidator: "endHour" }),
  endHour: require("./fields/field-hhmm")({ name: "endHour" }),
  createdById: require("./fields/field-createdById")({ name: "createdById", required: true }),
  updatedById: require("./fields/field-updatedById")({ name: "updatedById", required: true }),
  createdAt: require("./fields/field-date")({ name: "createdAt" }),
  updatedAt: require("./fields/field-date")({ name: "updatedAt" })
};

module.exports.schemaProperties = {
  timestamps: true,
  toJSON: {
    getters: true
  }
};

// array contendo os campos referentes a subdocumentos.
// module.exports.subDocs = [
//   { fieldName: "allowedHIs", ref: "HealthInsurance", indexField: "allowedHI" },
// ];

module.exports.referencedFields = [
  { fieldName: "workplace", ref: "Workplace"},
  { fieldName: "provider", ref: "Provider"},
];

module.exports.setIndexFields = { workplace: 1, provider: 1, startDate: 1, startHour: 1 };
module.exports.setIndexOptions = { unique: true };
