import http from "node:http";
import { pathToFileURL } from "node:url";

const APEX_ORIGIN = "https://ludvik4.ru";

function redirectLocation(requestTarget) {
  const pathAndQuery =
    typeof requestTarget === "string" && requestTarget.startsWith("/")
      ? requestTarget
      : "/";

  return `${APEX_ORIGIN}${pathAndQuery}`;
}

export function createRedirectServer() {
  return http.createServer((request, response) => {
    response.writeHead(301, {
      "Cache-Control": "public, max-age=3600",
      Location: redirectLocation(request.url),
    });
    response.end();
  });
}

const isEntryPoint =
  process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isEntryPoint) {
  const port = Number.parseInt(process.env.PORT ?? "3000", 10);
  createRedirectServer().listen(port, "0.0.0.0");
}
