import request from "supertest";
import { app } from "../../app";
jest.mock("../../nats-wrapper");

it("has a route handler listening to  /api/tickets for post requests", async () => {
  const response = await request(app).post("/api/tickets").send({});
  expect(response.status).not.toEqual(404);
});
it("can only be accessed if the user is signed in", async () => {
  await request(app).post("/api/tickets").send({}).expect(401);
});

it("returns a status other than 401 if the user is signedin", async () => {
  const response = await request(app).post("/api/tickets").send({});
  expect(response.status).not.toEqual(401);
});
it("return an error if an invalid title is provided", async () => {});
it("return an error if an invalid price is provided", async () => {});
it("create ticket with valid input", async () => {});
