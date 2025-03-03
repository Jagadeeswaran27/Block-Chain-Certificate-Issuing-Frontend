export interface VerificationResult {
  status: "idle" | "loading" | "success" | "error";
  message: string | null;
  documentUrl: string | null;
  issuerName: string | null;
}
