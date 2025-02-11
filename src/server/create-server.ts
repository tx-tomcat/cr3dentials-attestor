import { createServer as createHttpServer, IncomingMessage } from "http";
import serveStatic from "serve-static";
import { API_SERVER_PORT, BROWSER_RPC_PATHNAME, WS_PATHNAME } from "src/config";
import { AttestorServerSocket } from "src/server/socket";
import { getAttestorAddress } from "src/server/utils/generics";
import { addKeepAlive } from "src/server/utils/keep-alive";
import { logger as LOGGER } from "src/utils";
import { getEnvVariable } from "src/utils/env";
import { SelectedServiceSignatureType } from "src/utils/signatures";
import type { Duplex } from "stream";
import { WebSocket, WebSocketServer } from "ws";
import Fastify from "fastify";
import { proofRoutes } from "./api/routes";
const PORT = +(getEnvVariable("PORT") || API_SERVER_PORT);

/**
 * Creates the WebSocket API server,
 * creates a fileserver to serve the browser RPC client,
 * and listens on the given port.
 */
export async function createServer(port = PORT) {
  const fastify = Fastify({
    logger: true,
  });
  await fastify.register(proofRoutes, { prefix: "/api" });

  await fastify.ready();
  const http = createHttpServer((req, res) => {
    if (req.url?.startsWith(BROWSER_RPC_PATHNAME)) {
      req.url = req.url.slice(BROWSER_RPC_PATHNAME.length) || "/";
      serveBrowserRpc(req, res, (err) => {
        if (err) {
          LOGGER.error({ err, url: req.url }, "Failed to serve file");
          res.statusCode = err?.statusCode ?? 404;
          res.end(err?.message ?? "Not found");
        }
      });
    } else {
      fastify.server.emit("request", req, res);
    }
  });
  const serveBrowserRpc = serveStatic("browser", { index: ["index.html"] });

  const wss = new WebSocketServer({ noServer: true });
  http.on("upgrade", handleUpgrade.bind(wss));

  // wait for us to start listening
  http.listen(port);
  await new Promise<void>((resolve, reject) => {
    http.once("listening", () => resolve());
    http.once("error", reject);
  });

  wss.on("connection", handleNewClient);

  LOGGER.info(
    {
      port,
      apiPath: WS_PATHNAME,
      browserRpcPath: BROWSER_RPC_PATHNAME,
    },
    "WS server listening application"
  );

  const wssClose = wss.close.bind(wss);
  wss.close = (cb) => {
    wssClose(() => http.close(cb));
  };

  return wss;
}

async function handleNewClient(ws: WebSocket, req: IncomingMessage) {
  const client = await AttestorServerSocket.acceptConnection(ws, req, LOGGER);
  // if initialisation fails, don't store the client
  if (!client) {
    return;
  }

  ws.serverSocket = client;
  addKeepAlive(ws, LOGGER.child({ sessionId: client.sessionId }));
}

function handleUpgrade(
  this: WebSocketServer,
  request: IncomingMessage,
  socket: Duplex,
  head: Buffer
) {
  const { pathname } = new URL(request.url!, "wss://base.url");

  if (pathname === WS_PATHNAME) {
    this.handleUpgrade(request, socket, head, (ws) => {
      this.emit("connection", ws, request);
    });
    return;
  }

  socket.destroy();
}
