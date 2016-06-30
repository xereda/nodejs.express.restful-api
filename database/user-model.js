"use strict";

const mongoose = require("mongoose");
const conn =  require("../config/connection");
const schemaModuleUsers = require("./user-schema");

conn.on("error", console.error.bind(console, "Erro ao conectar no banco"));

conn.once("open", function() {

  const _userSchema = mongoose.Schema(schemaModuleUsers.schema);

  module.exports.User = mongoose.model("users", _userSchema);

});
