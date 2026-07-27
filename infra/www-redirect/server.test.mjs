import assert from "node:assert/strict";
import { after, before, test } from "node:test";

import { createRedirectServer } from "./server.mjs";

let baseUrl;
let server;

before(async () => {
  server = createRedirectServer();
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));

  const address = server.address();
  baseUrl = `http://127.0.0.1:${address.port}`;
});

after(async () => {
  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
});

test("redirects to the apex while preserving path and query", async () => {
  const response = await fetch(`${baseUrl}/portfolio/item?utm_source=vk&x=1`, {
    redirect: "manual",
  });

  assert.equal(response.status, 301);
  assert.equal(
    response.headers.get("location"),
    "https://ludvik4.ru/portfolio/item?utm_source=vk&x=1",
  );
});

test("redirects the root URL", async () => {
  const response = await fetch(`${baseUrl}/`, { redirect: "manual" });

  assert.equal(response.status, 301);
  assert.equal(response.headers.get("location"), "https://ludvik4.ru/");
});

test("returns no response body for HEAD requests", async () => {
  const response = await fetch(`${baseUrl}/privacy?from=www`, {
    method: "HEAD",
    redirect: "manual",
  });

  assert.equal(response.status, 301);
  assert.equal(
    response.headers.get("location"),
    "https://ludvik4.ru/privacy?from=www",
  );
  assert.equal(await response.text(), "");
});
