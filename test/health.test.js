import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { ready } from "../src/controllers/health.controller.js";

function createResponse() {
  return {
    statusCode: null,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    },
  };
}

describe("health ready", () => {
  it("responde 503 cuando no hay conexión a MongoDB", () => {
    const res = createResponse();
    ready({}, res);

    assert.equal(res.statusCode, 503);
    assert.deepEqual(res.body, {
      status: "error",
      message: "Base de datos no disponible",
    });
  });
});
