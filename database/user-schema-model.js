"use strict";

const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const conn =  require("../config/connection");
const schemaDefUsers = require("./user-schema-definition");
const messages = require("../controller/messages");

const _passwordCrypt = function(v) {
  return bcrypt.hashSync(v, 10);
}

conn.once("open", function() {

  const _userSchema = mongoose.Schema(schemaDefUsers.schema, schemaDefUsers.schemaProperties);

  _userSchema.pre("save", function(next) {

    //console.log("pre save");
    if (this.isModified("password")) {
      //console.log("senha foi alterada!", this.password);
      this.password = _passwordCrypt(this.password);
    }
    next();

  });

  _userSchema.path('createdById').validate(function (value, respond) {

    if (!this.isNew) respond(true);

      mongoose.models["users"].findOne({_id: value}, function (err, doc) {
          if (err || !doc) {
              respond(false);
          } else {
              respond(true);
          }
      });

  }, messages.getMessage("error", 9) );

  _userSchema.path('updatedById').validate(function (value, respond) {

      mongoose.models["users"].findOne({_id: value}, function (err, doc) {
          if (err || !doc) {
              respond(false);
          } else {
              respond(true);
          }
      });

  }, messages.getMessage("error", 12) );

  const _userModel = mongoose.model("users", _userSchema);
  module.exports.User = _userModel;

});
