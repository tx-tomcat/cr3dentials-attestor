import {
  EncryptionAlgorithm,
  ZKEngine,
  ZKOperator,
} from "@reclaimprotocol/zk-symmetric-crypto";

export type ZKOperators = { [E in EncryptionAlgorithm]?: ZKOperator };
export type PrepareZKProofsBaseOpts = {
  /** get ZK operator for specified algorithm */
  zkOperators?: ZKOperators;
  /**
   * max number of ZK proofs to generate concurrently
   * @default 1
   */
  zkProofConcurrency?: number;
  maxZkChunks?: number;
  zkEngine?: ZKEngine;
};
