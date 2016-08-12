// ScheduleDefinition - Definicao de agenda de um prestador

"use strict";

module.exports.schema = {
  workplace: require("./fields/object-objectId")({ name: "workplace", index: true, required: true, schemaName: "Workplace" }),
  provider: require("./fields/object-objectId")({ name: "provider", index: true, required: true, schemaName: "Provider" }),
  active: require("./fields/field-boolean")({ name: "active" }),
  weekDay: require("./fields/field-domain")({ name: "weekDay", required: true, domain: ["SEG", "TER", "QUA", "QUI", "SEX", "SAB", "DOM"] }),
  durationMinutes: require("./fields/field-number")({ name: "durationMinutes", required: true, min: 15, max: 120 }),
  startHour: require("./fields/field-hhmm")({ name: "startHour", required: true, endValueValidator: true, endFieldValidator: "endHour" }),
  endHour: require("./fields/field-hhmm")({ name: "endHour", required: true }),
  startDate: require("./fields/field-date")({ name: "startDate", required: true, endValueValidator: true, endFieldValidator: "endDate" }),
  endDate: require("./fields/field-date")({ name: "endDate" }),
  createdById: require("./fields/field-createdById")({ name: "createdById", required: true }),
  updatedById: require("./fields/field-updatedById")({ name: "updatedById", required: true }),
  createdAt: require("./fields/field-date")({ name: "createdAt" }),
  updatedAt: require("./fields/field-date")({ name: "updatedAt" })
};

module.exports.schemaProperties = { timestamps: true };

// array contendo os campos referentes a subdocumentos.
// module.exports.subDocs = [
//   { fieldName: "healthInsurances", ref: "HealthInsurance", indexField: "healthInsurance" },
// ];

module.exports.referencedFields = [
  { fieldName: "workplace", ref: "Workplace"},
  { fieldName: "provider", ref: "Provider"},
];

// module.exports.setIndexFields = { name: 1, person: 1 };
// module.exports.setIndexOptions = { unique: true };
