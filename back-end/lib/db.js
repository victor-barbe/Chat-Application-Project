const { v4: uuid } = require("uuid");
const { clone, merge } = require("mixme");
const microtime = require("microtime");
const level = require("level");
const db = level(__dirname + "/../db");

module.exports = {
  channels: {
    create: async (channel) => {
      // create a new channel
      if (!channel.name) throw Error("Invalid channel");
      const id = uuid();
      channel.members.push(channel.admin);
      await db.put(`channels:${id}`, JSON.stringify(channel));
      return merge(channel, { id: id });
    },
    get: async (id) => {
      // get a specific channel thanks to its ID
      if (!id) throw Error("Invalid id");
      const data = await db.get(`channels:${id}`);
      const channel = JSON.parse(data);
      return merge(channel, { id: id });
    },
    list: async (name) => {
      // list every channels where user is a member
      return new Promise((resolve, reject) => {
        const channels = [];
        db.createReadStream({
          gt: "channels:",
          lte: "channels" + String.fromCharCode(":".charCodeAt(0) + 1),
        })
          .on("data", ({ key, value }) => {
            channel = JSON.parse(value);
            channel.id = key.split(":")[1];
            let bool = false;
            channel.members &&
              channel.members.map((member) => {
                if (name === member) bool = true;
              });
            bool && channels.push(channel);
          })
          .on("error", (err) => {
            reject(err);
          })
          .on("end", () => {
            resolve(channels);
          });
      });
    },
    update: (id, channel) => {
      // update a channel
      db.put(`channels:${id}`, JSON.stringify(channel));
      return merge(channel, { id: id });
    },
    delete: async (id, channel) => {
      // delete a channel
      await db.del(`channels:${id}`);
    },
  },
  messages: {
    create: async (channelId, message) => {
      // create a new message
      if (!channelId) throw Error("Invalid channel");
      if (!message.author) throw Error("Invalid message");
      if (!message.content) throw Error("Invalid message");
      creation = microtime.now();
      await db.put(
        `messages:${channelId}:${creation}`,
        JSON.stringify({
          author: message.author,
          content: message.content,
        })
      );
      return merge(message, { channelId: channelId, creation: creation });
    },
    list: async (channelId) => {
      // list every message in a specific channel
      return new Promise((resolve, reject) => {
        const messages = [];
        db.createReadStream({
          gt: `messages:${channelId}:`,
          lte:
            `messages:${channelId}` +
            String.fromCharCode(":".charCodeAt(0) + 1),
        })
          .on("data", ({ key, value }) => {
            message = JSON.parse(value);
            const [, channelId, creation] = key.split(":");
            message.channelId = channelId;
            message.creation = creation;
            messages.push(message);
          })
          .on("error", (err) => {
            reject(err);
          })
          .on("end", () => {
            resolve(messages);
          });
      });
    },
    delete: async (channelId, creation) => {
      // delete a message in a specific channel
      if (!channelId) throw Error("No channel");
      if (!creation) throw Error("No creation");
      await db.del(`messages:${channelId}:${creation}`);
    },

    update: async (channelId, creation, req) => {
      // update a message in a specific channel
      if (!channelId) throw Error("No channel");
      if (!creation) throw Error("No creation");
      const modifiedMessage = req.body.content;
      const data = await db.get(`messages:${channelId}:${creation}`);
      let message = JSON.parse(data); // parse JSON string and translate it into JS
      message.content = modifiedMessage;
      await db.put(
        `messages:${channelId}:${creation}`,
        JSON.stringify(message) // stringify converts JS value into JSON string
      );
      return message;
    },
  },
  users: {
    create: async (user) => {
      // create a user thanks to his ID
      if (!user.username) throw Error("Invalid user");
      const id = uuid();
      await db.put(`users:${id}`, JSON.stringify(user));
      return merge(user, { id: id });
    },
    get: async (id) => {
      // get a specific user thanks to his ID
      if (!id) throw Error("Invalid id");
      const data = await db.get(`users:${id}`);
      const user = JSON.parse(data);
      return merge(user, { id: id });
    },
    list: async () => {
      // list all users
      return new Promise((resolve, reject) => {
        const users = [];
        db.createReadStream({
          gt: "users:",
          lte: "users" + String.fromCharCode(":".charCodeAt(0) + 1),
        })
          .on("data", ({ key, value }) => {
            user = JSON.parse(value);
            user.id = key.split(":")[1];
            users.push(user);
          })
          .on("error", (err) => {
            reject(err);
          })
          .on("end", () => {
            resolve(users);
          });
      });
    },
    update: (id, user) => {
      // update a user thanks to his ID
      const original = store.users[id];
      if (!original) throw Error("Unregistered user id");
      store.users[id] = merge(original, user);
    },
    delete: (id, user) => {
      // delete a user thanks to his ID
      const original = store.users[id];
      if (!original) throw Error("Unregistered user id");
      delete store.users[id];
    },
  },
  admin: {
    clear: async () => {
      await db.clear();
    },
  },
};
