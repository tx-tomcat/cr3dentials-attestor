import { ServiceSignatureProvider } from "src/types";
import {
  Account,
  Signature,
  Ed25519PrivateKey,
  Ed25519PublicKey,
  HexInput,
} from "@aptos-labs/ts-sdk";
 
export const APTOS_SIGNATURE_PROVIDER: ServiceSignatureProvider = {
  getPublicKey(privateKeyBytes) {
    const privateKey = new Ed25519PrivateKey(privateKeyBytes);
    const account = Account.fromPrivateKey({ privateKey });
    return account.publicKey;
  },
  getAddress(publicKey: Ed25519PublicKey) {
    return publicKey.authKey().data.toString();
  },
  async sign(data, privateKeyBytes) {
    const privateKey = new Ed25519PrivateKey(privateKeyBytes);

    const account = Account.fromPrivateKey({ privateKey });
    const signature = await account.sign(data);
    return signature.toUint8Array();
  },
  async verify(
    message: HexInput,
    signature: Signature,
    publicKey: Ed25519PublicKey
  ) {
    return publicKey.verifySignature({ message, signature });
  },
};
