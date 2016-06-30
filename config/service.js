"use strict";

const bodyParser = require("body-parser");
const express = require("express");
const allowCors = require("./cors");
const service = express();

module.exports = function(messages) {


  service.listen(5000, function() {
    console.log(messages.getMessage(2) + " na porta 5000");
  });

  service.use(allowCors);

  service.use(bodyParser.json());
  service.use(bodyParser.urlencoded({ extended: true }));

  return service;

}
