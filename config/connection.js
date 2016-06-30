"use strict";

const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/docmob");
const conn = mongoose.connection;
module.exports = conn;
