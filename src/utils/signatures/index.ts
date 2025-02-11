import { ServiceSignatureType } from "src/proto/api";
import { ServiceSignatureProvider } from "src/types";
import { ETH_SIGNATURE_PROVIDER } from "src/utils/signatures/eth";
import { APTOS_SIGNATURE_PROVIDER } from "src/utils/signatures/aptos";

export const SIGNATURES = {
  [ServiceSignatureType.SERVICE_SIGNATURE_TYPE_ETH]: ETH_SIGNATURE_PROVIDER,
  [ServiceSignatureType.SERVICE_SIGNATURE_TYPE_APTOS]: APTOS_SIGNATURE_PROVIDER,
} as { [key in ServiceSignatureType]: ServiceSignatureProvider };

export const SelectedServiceSignatureType =
  ServiceSignatureType.SERVICE_SIGNATURE_TYPE_APTOS;

export const SelectedServiceSignature =
  SIGNATURES[SelectedServiceSignatureType];
