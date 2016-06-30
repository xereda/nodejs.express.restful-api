"use strict";

const allowCors = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', 'localhost:5000');
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
}

module.exports = allowCors;
