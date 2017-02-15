// Nome da collection: Holiday Exception,
// Pronúncia: Róulidei Ecsépxon
// Finalidade: Determina os feriados que devem ser descondiserados para um
// prestador dentro de um local de atendimento. É um feriado, mas sua agenda
// estará disponível (ele irá trabalhar).

"use strict";

module.exports.schema = {
  workplace: require("./fields/object-objectId")({ name: "workplace", index: true, required: true, schemaName: "Workplace" }),
  provider: require("./fields/object-objectId")({ name: "provider", index: true, required: true, schemaName: "Provider" }),
  holiday: require("./fields/object-objectId")({ name: "holiday", index: true, required: true, schemaName: "Holiday" }),
  createdById: require("./fields/field-createdById")({ name: "createdById", required: true }),
  updatedById: require("./fields/field-updatedById")({ name: "updatedById", required: true }),
  createdAt: require("./fields/field-date")({ name: "createdAt" }),
  updatedAt: require("./fields/field-date")({ name: "updatedAt" })
};

module.exports.schemaProperties = { timestamps: true };

module.exports.referencedFields = [
  { fieldName: "workplace", ref: "Workplace" },
  { fieldName: "provider", ref: "Provider" },
  { fieldName: "holiday", ref: "Holiday" },
];

module.exports.setIndexFields = { workplace: 1, provider: 1, holiday: 1 };
module.exports.setIndexOptions = { unique: true };
