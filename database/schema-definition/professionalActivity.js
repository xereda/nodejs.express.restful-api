// RAMOS DE ATIVIDADE - MEDICINE, ODONTOLOGIA, FISIOTERAPIA

"use strict";

module.exports.schema = {
  name: require("./fields/field-name")({ name: "name", required: true, index: true, unique: true, minLength: 3 }),
  regionalCouncilAcronym: require("./fields/field-string")({ name: "regionalCouncilAcronym", index: true, unique: true }),
  active: require("./fields/field-boolean")({ name: "active" }),
  createdById: require("./fields/field-createdById")({ name: "createdById", required: true }),
  updatedById: require("./fields/field-updatedById")({ name: "updatedById", required: true }),
  createdAt: require("./fields/field-date")({ name: "createdAt" }),
  updatedAt: require("./fields/field-date")({ name: "updatedAt" })
};

module.exports.schemaProperties = { timestamps: true };
