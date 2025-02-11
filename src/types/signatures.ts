import {
  Ed25519PublicKey,
  Ed25519Signature,
  HexInput,
  Signature,
} from "@aptos-labs/ts-sdk";
import { BytesLike } from "ethers";

export type PrivateKey = string;

type Awaitable<T> = T | Promise<T>;

export type ServiceSignatureProvider = {
  /**
   * Returns public key in compressed (compact) format used in Reclaim RPC calls
   * @param privateKey corresponding private key in raw o hex form
   */
  getPublicKey(privateKey: PrivateKey): Uint8Array | Ed25519PublicKey;
  /**
   * Returns address corresponding to the provided public key
   * @param publicKey raw o hex form, compressed or uncompressed
   */
  getAddress(publicKey: Uint8Array | Ed25519PublicKey | BytesLike): string;
  /**
   * Signs data with the provided private key
   * @param data raw data to be signed
   * @param privateKey private key in raw or hex format
   */
  sign(data: Uint8Array, privateKey: PrivateKey): Awaitable<Uint8Array>;
  /**
   * Verifies signature against provided data and an address
   * @param data raw data to be verified. Must be same as used in sign() call
   * @param signature signature bytes or string
   * @param addressBytes address corresponding to a public key
   */
  verify(
    data: Uint8Array | HexInput,
    signature: Uint8Array | string | Signature,
    addressBytes: Uint8Array | string | Ed25519PublicKey
  ): Awaitable<boolean>;
};
