import { FastifyInstance } from "fastify";
import { ProofHandlers } from "./handlers/proofHandlers";
import { ProofRequest } from "./types/proof";

export async function proofRoutes(fastify: FastifyInstance) {
  const handlers = new ProofHandlers();

  fastify.log.info("Registering proof routes");

  fastify.post<{ Body: ProofRequest }>("/proofs/generate", {
    schema: {
      body: {
        type: "object",
        required: ["data"],

        properties: {
          data: {
            type: "object",
            required: ["algorithm", "privateInput", "publicInput", "zkEngine"],
            properties: {
              algorithm: { type: "string" },
              privateInput: { type: "object" },
              publicInput: { type: "object" },
              zkEngine: { type: "string" },
            },
          },
        },
      },
    },
    handler: async (request, reply) => {
      fastify.log.info("Received proof generation request");
      return handlers.generateProof(request, reply);
    },
    config: {
      rawBody: true,
    },
  });

  // Add a test route to verify registration
  fastify.get("/health", async () => {
    return { status: "ok" };
  });
}
