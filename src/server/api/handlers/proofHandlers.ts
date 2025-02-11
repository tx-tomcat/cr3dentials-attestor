import { FastifyReply, FastifyRequest } from "fastify";
import { logger as LOGGER, makeDefaultZkOperator } from "src/utils";
import { ProofRequest } from "../types/proof";
import { generateProof } from "@reclaimprotocol/zk-symmetric-crypto";

export class ProofHandlers {
  async generateProof(
    request: FastifyRequest<{ Body: ProofRequest }>,
    reply: FastifyReply
  ) {
    try {
      const { algorithm, privateInput, publicInput, zkEngine } =
        request.body.data;
      const operator = await makeDefaultZkOperator(algorithm, zkEngine, LOGGER);

      const proof = await generateProof({
        algorithm,
        privateInput: {
          key: new Uint8Array(Buffer.from(privateInput.key, "base64")),
        },
        publicInput: {
          ciphertext: new Uint8Array(
            Buffer.from(publicInput.ciphertext, "base64")
          ),
          iv: new Uint8Array(Buffer.from(publicInput.iv, "base64")),
          offset: publicInput.offset,
        },
        operator,
        logger: LOGGER,
      });
      return {
        success: true,
        proof: {
          ...proof,
          proofJson: JSON.parse(proof.proofJson),
          plaintext: Buffer.from(proof.plaintext).toString("base64"),
        },
      };
    } catch (err) {
      console.log(err.stack);
      // LOGGER.error({ err }, "Failed to generate proof");
      return reply.status(500).send({
        success: false,
        error: err.message,
      });
    }
  }
}
