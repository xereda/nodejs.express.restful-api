"use strict";

const bodyParser = require("body-parser");
const express = require("express");
const allowCors = require("./cors");
const app = express();

module.exports = function(messages, config) {


  app.listen(config.database_port, function() {
    console.log(messages.getMessage("message", 2) + " na porta " + config.database_port);
  });

  app.use(allowCors);

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  return app;

}
