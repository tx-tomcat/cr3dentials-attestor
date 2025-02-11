import {
  EncryptionAlgorithm,
  ZKEngine,
} from "@reclaimprotocol/zk-symmetric-crypto";

export interface ProofGenerationParams {
  algorithm: EncryptionAlgorithm;
  privateInput: any;
  publicInput: any;
  zkEngine: ZKEngine;
}

export interface ProofRequest {
  data: ProofGenerationParams;
}
