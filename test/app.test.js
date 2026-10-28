import { after, before, beforeEach, describe, it } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import app from "../src/app.js";
import {
  clearDatabase,
  startTestDB,
  stopTestDB,
} from "../test-utils/mongo.js";

let mongo;

before(async () => {
  mongo = await startTestDB();
});

after(async () => {
  await stopTestDB(mongo);
});

beforeEach(async () => {
  await clearDatabase();
});

describe("API", () => {
  it("GET /api/health responde 200", async () => {
    const res = await request(app).get("/api/health");
    assert.equal(res.status, 200);
    assert.deepEqual(res.body, { status: "ok", message: "Servidor activo" });
  });

  it("no expone el header X-Powered-By", async () => {
    const res = await request(app).get("/api/health");
    assert.equal(res.headers["x-powered-by"], undefined);
  });

  it("GET /api/health/ready responde 200 con la base conectada", async () => {
    const res = await request(app).get("/api/health/ready");
    assert.equal(res.status, 200);
    assert.deepEqual(res.body, {
      status: "ok",
      message: "Base de datos conectada",
    });
  });

  it("GET /api/events responde lista vacía", async () => {
    const res = await request(app).get("/api/events");
    assert.equal(res.status, 200);
    assert.deepEqual(res.body, { status: "success", payload: [] });
  });

  it("una ruta inexistente responde 404 en JSON", async () => {
    const res = await request(app).get("/api/no-existe");
    assert.equal(res.status, 404);
    assert.equal(res.body.status, "error");
    assert.ok(res.body.message);
  });

  it("un JSON inválido responde 400 en JSON", async () => {
    const res = await request(app)
      .post("/api/events")
      .set("Content-Type", "application/json")
      .send('{"roto"');
    assert.equal(res.status, 400);
    assert.equal(res.body.status, "error");
    assert.equal(res.body.message, "JSON inválido");
  });

  it("un método no soportado responde 405 con Allow", async () => {
    const res = await request(app).post("/api/events").send({});
    assert.equal(res.status, 405);
    assert.equal(res.headers.allow, "GET, HEAD");
    assert.equal(res.body.status, "error");
  });

  it("OPTIONS responde 204 con Allow", async () => {
    const res = await request(app).options("/api/events");
    assert.equal(res.status, 204);
    assert.equal(res.headers.allow, "GET, HEAD");
  });

  it("un cuerpo demasiado grande responde 413 en español", async () => {
    const res = await request(app)
      .post("/api/events")
      .set("Content-Type", "application/json")
      .send({ data: "a".repeat(150000) });
    assert.equal(res.status, 413);
    assert.equal(res.body.status, "error");
    assert.equal(res.body.message, "Cuerpo de la petición demasiado grande");
  });
});
