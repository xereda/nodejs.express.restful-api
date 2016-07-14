"use strict";

module.exports = function(collection) {

  const mongoose = require("mongoose");
  const utils = require("../utils/utils");
  const conn =  require("../config/connection");
  const schemaDef = require("./" + collection  + "-schema-definition");
  const messages = require("../controller/messages");

  const _schema = mongoose.Schema(schemaDef.schema, schemaDef.schemaProperties);

  conn.once("open", function() {

    _schema.pre("save", function(next) {

      //console.log("pre save");
      if (this.isModified("password")) {
        //console.log("senha foi alterada!", this.password);
        this.password = utils.passwordCrypt(this.password);
      }

      next();

    });

    _schema.pre("save", function(next) {

      let _updatedFieldsObject = {};
      const _this = this;
      this.modifiedPaths().forEach(function(v) {
        _updatedFieldsObject[v] = _this[v];
      });
      this.updatedFields = _updatedFieldsObject;

      next();

    });

    _schema.path('createdById').validate(function (value, respond) {

      if (!this.isNew) respond(true);

        mongoose.models[collection].findOne({_id: value}, function (err, doc) {
            if (err || !doc) {
                respond(false);
            } else {
                respond(true);
            }
        });

    }, messages.getMessage("error", 9) );

    _schema.path('updatedById').validate(function (value, respond) {

        mongoose.models[collection].findOne({_id: value}, function (err, doc) {
            if (err || !doc) {
                respond(false);
            } else {
                respond(true);
            }
        });

    }, messages.getMessage("error", 12) );

  });

  const modelReturn = mongoose.model(collection, _schema);
  return modelReturn;

}
