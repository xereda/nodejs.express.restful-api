// ********
// Este resource foi desligado em 20/03/2017. A relação de convênios ficará dentro de worklplaces, subdoc providers.
// HealthInsurance tambem mudou para Agreement
// ********

// Nome da collection: WorlplaceProviderHI, onde HI = Health Insurance (Seguro de Saúde / Plano de Sáude)
// (Health Insurance - Pronúncia: rélfi enxúrence)
// Finalidade: Determinar os planos de saúde (HI) liberados para um prestador (provider) dentro de um local de trabalho (workplace)

"use strict";

module.exports.schema = {
  id: false,
  workplace: require("./fields/object-objectId")({ name: "workplace", index: true, required: true, schemaName: "Workplace" }),
  provider: require("./fields/object-objectId")({ name: "provider", index: true, required: true, schemaName: "Provider" }),
  healthInsurance: require("./fields/object-objectId")({ name: "healthInsurance", index: true, required: true, schemaName: "HealthInsurance" }),
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

module.exports.referencedFields = [
  { fieldName: "workplace", ref: "Workplace" },
  { fieldName: "provider", ref: "Provider" },
  { fieldName: "healthInsurance", ref: "HealthInsurance" },
];

module.exports.setIndexFields = { workplace: 1, provider: 1, healthInsurance: 1 };
module.exports.setIndexOptions = { unique: true };
