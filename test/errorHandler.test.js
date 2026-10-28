import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { errorHandler } from "../src/middlewares/errorHandler.js";

function createResponse() {
  return {
    headersSent: false,
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

describe("errorHandler", () => {
  it("oculta el mensaje interno en errores 500", () => {
    const res = createResponse();
    errorHandler(new Error("detalle sensible"), {}, res, () => {});

    assert.equal(res.statusCode, 500);
    assert.deepEqual(res.body, {
      status: "error",
      message: "Error interno del servidor",
    });
  });

  it("no filtra mensajes desconocidos de errores 4xx", () => {
    const res = createResponse();
    const err = Object.assign(new Error("detalle interno"), { status: 418 });
    errorHandler(err, {}, res, () => {});

    assert.equal(res.statusCode, 418);
    assert.equal(res.body.message, "Error en la petición");
  });

  it("delega en Express si la respuesta ya fue enviada", () => {
    const res = { ...createResponse(), headersSent: true };
    let delegated = null;
    errorHandler(new Error("x"), {}, res, (err) => {
      delegated = err;
    });

    assert.ok(delegated instanceof Error);
  });

  it("traduce un ValidationError de Mongoose a 400", () => {
    const res = createResponse();
    const err = Object.assign(new Error("email inválido"), {
      name: "ValidationError",
    });
    errorHandler(err, {}, res, () => {});

    assert.equal(res.statusCode, 400);
    assert.deepEqual(res.body, {
      status: "error",
      message: "Datos inválidos",
    });
  });

  it("traduce un CastError de Mongoose a 400", () => {
    const res = createResponse();
    const err = Object.assign(new Error("cast fallido"), {
      name: "CastError",
    });
    errorHandler(err, {}, res, () => {});

    assert.equal(res.statusCode, 400);
    assert.deepEqual(res.body, {
      status: "error",
      message: "Datos inválidos",
    });
  });
});
