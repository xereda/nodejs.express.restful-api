// Definção do esquema da collection de usuários

"use strict";

module.exports.schema = {
  email: require("./fields/field-email"),
  name: require("./fields/field-name"),
  password: require("./fields/field-password"),
};
