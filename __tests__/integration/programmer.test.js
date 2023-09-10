const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

const app = require("../../src/app");

describe("Programmer", () => {
  let mongoServer;
  beforeAll(async () => {
    mongoServer = new MongoMemoryServer();
    const URI = await mongoServer.getUri();

    mongoose.connect(URI, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async (done) => {
    mongoose.disconnect(done);
    await mongoServer.stop();
  });

  afterEach(async () => {
    const collections = await mongoose.connection.db.collections();

    for (let collection of collections) {
      await collection.deleteMany();
    }
  });

  it("should be able to create a new programmer", async () => {
    const response = await request(app)
      .post("/programmers")
      .send({
        firstName: "John",
        lastName: "Doe",
        age: 30,
        programmingLanguages: ["JavaScript", "Python"],
      });

    expect(response.status).toBe(200);
  });

  it("should not create a new programmer if it has already been defined or created", async () => {
    await request(app)
      .post("/programmers")
      .send({
        firstName: "John",
        lastName: "Doe",
        age: 30,
        programmingLanguages: ["JavaScript", "Python"],
      });

    const response = await request(app)
      .post("/programmers")
      .send({
        firstName: "John",
        lastName: "Doe",
        age: 30,
        programmingLanguages: ["JavaScript", "Python"],
      });

    expect(response.body).toMatchObject({ error: "Duplicated programmer!!!" });
  });

  it("should be able to list all programmers", async () => {
    const response = await request(app).get("/programmers");

    expect(response.status).toBe(200);
  });

  it("should not show programmer with unknown id", async () => {
    const response = await request(app).get("/programmers/1");
    expect(response.status).toBe(500);
  });

  it("should be able to update a programmer", async () => {
    // First, create a programmer
    const createResponse = await request(app)
      .post("/programmers")
      .send({
        firstName: "John",
        lastName: "Doe",
        age: 30,
        programmingLanguages: ["JavaScript", "Python"],
      });

    const programmerId = createResponse.body._id;

    // Then, update the programmer
    const updateResponse = await request(app)
      .put(`/programmers/${programmerId}`)
      .send({
        firstName: "John",
        lastName: "Cena",
        age: 30,
        programmingLanguages: ["JavaScript", "Golang"],
      });

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body).toMatchObject({
      firstName: "John",
      lastName: "Cena",
      age: 30,
      programmingLanguages: ["JavaScript", "Golang"],
    });
  });

  it("should be able to delete a programmer", async () => {
    // First, create a programmer
    const createResponse = await request(app).post("/programmers").send({
        firstName: "John",
        lastName: "Doe",
        age: 30,
        programmingLanguages: ["JavaScript", "Python"],
    });

    const programmerId = createResponse.body._id;

    // Then, delete the programmer
    const deleteResponse = await request(app).delete(`/programmers/${programmerId}`);

    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body).toMatchObject({
      message: "Programmer data has been deleted successfully",
    });
  });
});
