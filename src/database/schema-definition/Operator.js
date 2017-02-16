// Nome da collection: Operator - operadores
// Finalidade: Operadores de plano de saúde. Exemplo: Unimed Joinville, Unimed Blumenau, etc...


"use strict";

module.exports.schema = {
  name: require("./fields/field-name")({ name: "name", required: true, index: true, unique: true, minLength: 3, setUpper: true }),
  healthInsurance: require("./fields/object-objectId")({ name: "healthInsurance", index: true, required: true, schemaName: "HealthInsurance" }),
  webService: require("./fields/object-webService")({ name: "webService" }),
  ANSCode: require("./fields/field-string")({ name: "ANSCode", setUpper: true }),
  internalCode: require("./fields/field-string")({ name: "InternalCode", setUpper: true }),
  active: require("./fields/field-boolean")({ name: "active" }),
  createdById: require("./fields/field-createdById")({ name: "createdById", required: true }),
  updatedById: require("./fields/field-updatedById")({ name: "updatedById", required: true }),
  createdAt: require("./fields/field-date")({ name: "createdAt" }),
  updatedAt: require("./fields/field-date")({ name: "updatedAt" })
};

module.exports.schemaProperties = { timestamps: true };

module.exports.referencedFields = [
  { fieldName: "healthInsurance", ref: "HealthInsurance"},
];
