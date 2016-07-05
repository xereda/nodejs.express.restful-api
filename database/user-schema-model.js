"use strict";

const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const conn =  require("../config/connection");
const schemaModuleUsers = require("./user-schema-definition");
const messages = require("../controller/messages");

const _passwordCrypt = function(v) {
  return bcrypt.hashSync(v, 10);
}

conn.on("disconnected", function() {
  console.log("banco de dados disconnected");
});

conn.on("error", console.error.bind(console, messages.getMessage("error", 1)));

conn.once("open", function() {

  const _userSchema = mongoose.Schema(schemaModuleUsers.schema);


  _userSchema.pre("save", function(next) {

    //console.log("pre save");
    if (this.isModified("password")) {
      //console.log("senha foi alterada!", this.password);
      this.password = _passwordCrypt(this.password);
    }
    next();

  });

  module.exports.User = mongoose.model("users", _userSchema);

});
