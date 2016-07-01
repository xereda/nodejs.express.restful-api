"use strict";

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
  return _userObject;
}

app.get("/", function(req, res) {

  res.json({ response: messages.getMessage("message", 1) });

});

app.get("/users", function(req, res) {

  userController.readAll(function(userlist) {
    res.json(userlist);
  });

});

app.get("/users/:_id", function(req, res) {

  const _id = validator.trim(validator.escape(req.params._id));

  userController.read(_id, function(user) {
    res.json(user);
  });

});

app.post("/users", function(req, res) {

  userController.create(_getUserObject(req), function(createdUser) {
      res.json(createdUser);
  });

});

app.put("/users", function(req, res) {

  const _id = validator.trim(validator.escape(req.body._id));

  userController.update(_id, _getUserObject(req), function(updatedUser) {
    res.json(updatedUser);
  });

});

app.delete("/users/:_id", function(req, res) {

  const _id = req.params._id;

  userController.delete(_id, function(deletedUser) {
    res.json(deletedUser);
  });

});
