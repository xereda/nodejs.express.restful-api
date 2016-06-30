"use strict";

const messages = require("./config/messages");
const service = require("./config/service")(messages);
const userController = require("./controller/user")(messages);
const validator = require("validator");


service.get("/", function(req, res) {

  res.json({ response: messages.getMessage(1) });

});

service.get("/users", function(req, res) {

  userController.list(function(userlist) {
    res.json(userlist);
  });
  
});

service.get("/users/:_id", function(req, res) {

  const _id = validator.trim(validator.escape(req.params._id));

  userController.user(_id, function(user) {
    res.json(user);
  });

});

service.post(["/users", "/users/:_id"], function(req, res) {

  const fullname = validator.trim(validator.escape(req.body.fullname));
  const email = validator.trim(validator.escape(req.body.email));

  userController.save(fullname, email, function(createdUser) {
      res.json(createdUser);
  });

});

service.put("/users", function(req, res) {

  const _id = validator.trim(validator.escape(req.body._id));

  const fullname = validator.trim(validator.escape(req.body.fullname));
  const email = validator.trim(validator.escape(req.body.email));

  userController.update(_id, fullname, email, function(updatedUser) {
    res.json(updatedUser);
  });

});

service.delete("/users/:_id", function(req, res) {

  const _id = req.params._id;

  userController.delete(_id, function(deletedUser) {
    res.json(deletedUser);
  });

});
