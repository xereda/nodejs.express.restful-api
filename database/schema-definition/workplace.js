// Definção do esquema da collection de locais de atendimento

"use strict";

module.exports.schema = {
  name: require("./fields/field-name")({ name: "name", required: true, index: true, minLength: 3 }),
  email: require("./fields/field-email")({ name: "email", required: true }),
  description: require("./fields/field-string")({ name: "description" }),
  active: require("./fields/field-boolean")({ name: "active" }),
  streetName: require("./fields/field-string")({ name: "streetName", minLength: 3, required: true, setUpper: true }),
  streetNumber: require("./fields/field-number")({ name: "streetNumber", min: 0, max: 9999999 }),
  addressComplement: require("./fields/field-string")({ name: "addressComplement" }),
  neighborhood: require("./fields/field-string")({ name: "neighborhood", required: true, setUpper: true }),
  zipCode: require("./fields/field-number")({ name: "zipCode", required: true, max: 99999999 }),
  city: require("./fields/field-string")({ name: "city", required: true, setUpper: true }),
  state: require("./fields/field-string")({ name: "state", required: true, setUpper: true, length: 2 }),
  country: require("./fields/field-string")({ name: "country", required: true, setUpper: true }),
  geoLocation: require("./fields/field-geolocation")({ name: "geoLocation", required: true }),
  phone: require("./fields/field-number")({ name: "phone", required: true, min: 1111111111, max: 99999999999 }),
  deadlineUserChoose: require("./fields/field-number")({ name: "deadlineUserChoose" }),
  cnes: require("./fields/field-number")({ name: "cnes" }), //  Cadastro Nacional de Estabelecimentos de Saúde
  providers: require("./fields/object-provider")({ name: "providers" }),
  createdById: require("./fields/field-createdById")({ name: "createdById", required: true }),
  updatedById: require("./fields/field-updatedById")({ name: "updatedById", required: true }),
  createdAt: require("./fields/field-date")({ name: "createdAt" }),
  updatedAt: require("./fields/field-date")({ name: "updatedAt" })
};

module.exports.schemaProperties = { timestamps: true };

// array contendo os campos referentes a subdocumentos.
module.exports.subDocs = [
  { fieldName: "providers", ref: "Provider", indexField: "provider"},
];
