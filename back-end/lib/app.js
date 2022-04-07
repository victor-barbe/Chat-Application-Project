const db = require("./db");
const express = require("express");
const cors = require("cors");
const authenticator = require("./authenticator");


const app = express();
const authenticate = authenticator({
  test_payload_email: process.env["TEST_PAYLOAD_EMAIL"],
  jwks_uri: "http://127.0.0.1:5556/dex/keys",
});

app.use(require("body-parser").json());
app.use(cors());

app.get("/", (req, res) => {
  res.send(["<h1>ECE WebTech Chat</h1>"].join(""));
});

// Channels

app.get("/channels/connexion/:name", async (req, res) => {
  // find each channels in which the user is a member
  const channels = await db.channels.list(req.params.name);
  res.json(channels);
});

app.post("/channels", async (req, res) => {
  // create a new channel
  const channel = await db.channels.create(req.body);
  res.status(201).json(channel);
});

app.get("/channels/:id", async (req, res) => {
  // find a channel thanks to its ID
  const channel = await db.channels.get(req.params.id);
  res.json(channel);
});

app.put("/channels/:id", async (req, res) => {
  // update a channel / add a member
  const channel = await db.channels.update(req.params.id, req.body); // inside the channel (recognized with its ID) we put req.body which is the new array of members
  res.json(channel);
});

app.delete("/channels/:id", async (req, res) => {
  // route to delete a channel
  const channel = await db.channels.delete(req.params.id);
  res.json(channel);
});

// Messages

app.get("/channels/:id/messages", async (req, res) => {
  // find every messages inside a specific channel
  try {
    const channel = await db.channels.get(req.params.id);
  } catch (err) {
    return res.status(404).send("Channel does not exist.");
  }
  const messages = await db.messages.list(req.params.id);
  res.json(messages);
});

app.post("/channels/:id/messages", async (req, res) => {
  // add a new message inside a channel
  const message = await db.messages.create(req.params.id, req.body);
  res.status(201).json(message);
});

/* delete a message */

app.delete("/channels/:id/messages/:idmessage", async (req, res) => {
  const message = await db.messages.delete(req.params.id, req.params.idmessage); // route to delete the message in params from the database
  res.status(202).json(message);
});

/* modify a message */

app.put("/channels/:id/messages/:idmessage", async (req, res) => {
  const message = await db.messages.update(
    // we update a message thanks to the channel id, the message id and its content
    req.params.id,
    req.params.idmessage,
    req
  );
  res.status(203).json(message);
});

// Users

app.get("/users", async (req, res) => {
  // find every users of the app
  const users = await db.users.list();
  res.json(users);
});

app.post("/users", async (req, res) => {
  // Add a new user
  const user = await db.users.create(req.body);
  res.status(201).json(user);
});

app.get("/users/:id", async (req, res) => {
  // find a specific user thanks to its ID
  const user = await db.users.get(req.params.id);
  res.json(user);
});

app.put("/users/:id", async (req, res) => {
  // update a user
  const user = await db.users.update(req.body);
  res.json(user);
});

module.exports = app;
