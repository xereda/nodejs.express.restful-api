"use strict";

const mongoose = require("mongoose");
const config = require("./config/config");
const messages = require("./controller/messages");
const app = require("./config/listener")(messages, config);
const userController = require("./controller/user")(messages);
const validator = require("validator");

const _validate = function(parameter) {
  return validator.trim(validator.escape(parameter));
}

const _getUserObject = function(req) {
  const _userObject = {};
  (req.body.name) ? _userObject.name = _validate(req.body.name) : null;
  (req.body.email) ? _userObject.email = _validate(req.body.email) : null;
  (req.body.password) ? _userObject.password = _validate(req.body.password) : null;
  (req.body.admin) ? _userObject.admin = _validate(req.body.admin) : null;
  (req.body.active) ? _userObject.active = _validate(req.body.active) : null;
  (req.body.createdById) ? _userObject.createdById = _validate(req.body.createdById) : null;
  (req.body.updatedById) ? _userObject.updatedById = _validate(req.body.updatedById) : null;
  return _userObject;
}


app.get("/", function(req, res, next) {

  res.json({ response: messages.getMessage("message", 1) });

});

app.get("/users", function(req, res, next) {

  userController.readAll(function(userlist, status) {
    res.status(status).json(userlist);
  });

});

app.get("/users/:_id", function(req, res, next) {

  const _id = _validate(req.params._id);

  userController.read(_id, function(user, status) {
    res.status(status).json(user);
  });

});

app.post("/users", function(req, res, next) {

  userController.create(_getUserObject(req), function(createdUser, status) {
    res.status(status).json(createdUser);
  });

});

app.put("/users", function(req, res, next) {

  if (!req.body._id) {
    res.status(400).json({ error: messages.getMessage("error", 6) });
    next(new Error(messages.getMessage("error", 6)));
  }
  const _id = _validate(req.body._id);

  userController.update(_id, _getUserObject(req), function(updatedUser, status) {
    res.status(status).json(updatedUser);
  });

});

app.delete("/users/:_id", function(req, res, next) {

  const _id = _validate(req.params._id);

  userController.delete(_id, function(deletedUser, status) {
    res.status(status).json(deletedUser);
  });

});
