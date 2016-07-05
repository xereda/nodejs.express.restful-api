"use strict";

const bodyParser = require("body-parser");
const express = require("express");
const allowCors = require("./cors");
const mongoose = require("mongoose");
const app = express();

module.exports = function(messages, config) {


  app.listen(config.application_port, function() {
    console.log(messages.getMessage("message", 2) + " na porta " + config.application_port);
  });

  app.use(allowCors);

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use(function(req, res, next) {

    mongoose.connect("mongodb://" + config.database_host + "/" + config.database_name, function(err) {

      if ((err) && (mongoose.connection.readyState === 0)) {
        res.status(500).json({ error: "Banco de dados desconectado", err });
        return next(err);
      }

      next();

    });

  });

  return app;

}
