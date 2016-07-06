"use strict";

const bodyParser = require("body-parser");
const express = require("express");
const allowCors = require("./cors");
const conn = require("../config/connection");
const app = express();

module.exports = function(messages, config) {


  app.listen(config.application_port, function() {
    console.log(messages.getMessage("message", 2) + " na porta " + config.application_port);
  });

  app.use(allowCors);

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use(function(req, res, next) {

    if (conn.readyState === 0) {
      res.status(503).json({ error: "Erro com o banco de dados" });
      return next(new Error("Erro com o banco de dados"));
    }
    next();

  });

  return app;

}
