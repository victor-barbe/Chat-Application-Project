const supertest = require("supertest");
const app = require("../lib/app");
const db = require("../lib/db");

describe("channels", () => {
  beforeEach(async () => {
    await db.admin.clear();
  });

  describe("list", () => {
    it("list empty", async () => {
      // Return an empty channel list by default
      const { body: channels } = await supertest(app)
        .get("/channels")
        .expect(404);
      channels.should.eql({});
    });

    it("list one element", async () => {
      // Create a channel
      await supertest(app)
        .post("/channels")
        .send({
          name: "channel 1",
          admin: "victorbarbe",
          members: ["victorbarbe"],
        });
      // Ensure we list the channels correctly
      const { body: channels } = await supertest(app)
        .get("/channels")
        .expect(404);
      channels.should.match({});
    });
  });

  it("create one element", async () => {
    // Create a channel
    const { body: channel } = await supertest(app)
      .post("/channels")
      .send({
        name: "channel 1",
        admin: "victorbarbe",
        members: ["victorbarbe"],
      })
      .expect(201);
    // Check its return value
    channel.should.match({
      id: /^\w+-\w+-\w+-\w+-\w+$/,
      name: "channel 1",
      members: ["victorbarbe"],
      admin: "victorbarbe",
    });
    // Check it was correctly inserted
    const { body: channels } = await supertest(app).get(
      "/channels/connexion/victorbarbe"
    );
    channels.length.should.eql(1);
  });

  it("get channel", async () => {
    // Create a channel
    const { body: channel1 } = await supertest(app)
      .post("/channels")
      .send({
        name: "channel 1",
        admin: "victorbarbe",
        members: ["victorbarbe"],
      });
    // Check it was correctly inserted
    const { body: channel } = await supertest(app)
      .get(`/channels/${channel1.id}`)
      .expect(200);
    channel.name.should.eql("channel 1");
  });
});
