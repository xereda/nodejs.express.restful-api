// Person - Definição do esquema da collection de usuários do aplicativo mobile.

"use strict";

module.exports.schema = {
  name: require("./fields/field-name")({ name: "name", required: true, minLength: 3, index: true }),
  email: require("./fields/field-email")({ name: "email", required: true, index: true, unique: true }),
  password: require("./fields/field-password")({ name: "password", required: true, minLength: 5 }),
  active: require("./fields/field-boolean")({ name: "active" }),
  phone: require("./fields/field-number")({ name: "phone", required: true, min: 1111111111, max: 99999999999 }),
  devices: require("./fields/object-device")({ name: "devices" }),
  createdById: require("./fields/field-createdById")({ name: "createdById", required: true }),
  updatedById: require("./fields/field-updatedById")({ name: "updatedById", required: true }),
  createdAt: require("./fields/field-date")({ name: "createdAt" }),
  updatedAt: require("./fields/field-date")({ name: "updatedAt" })
};

module.exports.schemaProperties = { timestamps: true };

// array contendo os campos referentes a subdocumentos.
module.exports.subDocs = [
  { fieldName: "devices", ref: "Person", indexField: "_id", simple: true }, // simple === true -> subDoc eh apenas uma array de objetos e seu _id de identificacao nao tem relacao com outra collection
];
