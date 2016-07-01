"use strict";

const mongoose = require("mongoose");
const conn =  require("../config/connection");
const schemaModuleUsers = require("./user-schema");
const messages = require("../controller/messages");

conn.on("error", console.error.bind(console, messages.getMessage("error", 1)));

conn.once("open", function() {

  const _userSchema = mongoose.Schema(schemaModuleUsers.schema);

  module.exports.User = mongoose.model("users", _userSchema);

});
