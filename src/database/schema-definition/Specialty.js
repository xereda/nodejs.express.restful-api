// Nome da collection: Specialty
// Finalidade: Especialidades - Ortopedista, Cardiologista, Dermatologista
// Pronúncia: espexialtí

"use strict";

module.exports.schema = {
  id: false,
  name: require("./fields/field-name")({ name: "name", required: true, index: true, unique: true, minLength: 3, setUpper: true, getUpper: true }),
  registrationCode: require("./fields/field-string")({ name: "registrationCode", setUpper: true, getUpper: true }),
  active: require("./fields/field-boolean")({ name: "active" }),
  professionalActivity: require("./fields/object-objectId")({ name: "professionalActivity", index: true, required: true, schemaName: "ProfessionalActivity" }),
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
  { fieldName: "professionalActivity", ref: "ProfessionalActivity"},
];
