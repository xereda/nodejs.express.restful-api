// Schedule - Determina as instâncias de agendamento.
// É o coração do controle de agendas. Tanto o portal web como o
// aplicativo irão se basear nesta collection.
// Pronúncia: Iskédiou


"use strict";

module.exports.schema = {
  life: require("./fields/object-objectId")({ name: "life", index: true, required: true, schemaName: "Life" }),
  specialty: require("./fields/object-objectId")({ name: "specialty", schemaName: "Specialty" }),
  workplace: require("./fields/object-objectId")({ name: "workplace", schemaName: "Workplace" }),
  provider: require("./fields/object-objectId")({ name: "provider", schemaName: "Provider" }),
  healthInsurance: require("./fields/object-objectId")({ name: "healthInsurance", schemaName: "HealthInsurance" }),
  parentSchedule: require("./fields/object-objectId")({ name: "parentSchedule", schemaName: "Schedule" }),
  date: require("./fields/field-date")({ name: "date", requireStartDate: true }),
  autoApproved: require("./fields/field-boolean")({ name: "autoApproved", required: true }),  // auto "apprillved"
  approvalDate: require("./fields/field-date")({ name: "approvalDate" }), // appríval date
  approvalUser: require("./fields/object-objectId")({ name: "approvalUser", schemaName: "User" }), // appríval user
  confirmationDate: require("./fields/field-date")({ name: "confirmationDate" }),
  originCancellation: require("./fields/field-domain")({ name: "originCancellation", domain: ["app", "portal"] }),
  cancellationDate: require("./fields/field-date")({ name: "cancellationDate" }),
  cancellationUser: require("./fields/object-objectId")({ name: "cancellationUser", schemaName: "User" }),
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
  { fieldName: "life", ref: "Life"},
  { fieldName: "specialty", ref: "Specialty"},
  { fieldName: "workplace", ref: "Workplace"},
  { fieldName: "provider", ref: "Provider"},
  { fieldName: "healthInsurance", ref: "HealthInsurance"},
  { fieldName: "parentSchedule", ref: "Schedule"},
  { fieldName: "approvalUser", ref: "User"},
];

module.exports.setIndexFields = { life: 1, specialty: 1, workplace: 1, provider: 1, healthInsurance: 1, parentSchedule: 1, date: 1 };
module.exports.setIndexOptions = { unique: true };
