import { useState } from "react";
import { ethers } from "ethers";
import { ABI, ADDRESS } from "../utils/Connection";
import VerificationForm from "../components/verifycertificate/VerificationForm";
import CertificateResult from "../components/verifycertificate/CertificateResult";
import HowItWorks from "../components/verifycertificate/HowItWorks";
import FAQs from "../components/verifycertificate/FAQs";
import { VerificationResult } from "../types/VerifyCertificate";

declare global {
  interface Window {
    ethereum: any;
  }
}

const CONTRACT_ADDRESS = ADDRESS;
const CONTRACT_ABI = ABI;

export default function VerifyCertificatePage() {
  const [recipient, setRecipient] = useState<string>("");
  const [certificateHash, setCertificateHash] = useState<string>("");
  const [verification, setVerification] = useState<VerificationResult>({
    status: "idle",
    message: null,
    documentUrl: null,
    issuerName: null,
  });
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const handleRecipientChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => setRecipient(e.target.value);

  const handleCertificateHashChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => setCertificateHash(e.target.value);

  const handleVerify = async (): Promise<void> => {
    if (!certificateHash || !recipient) {
      setVerification({
        status: "error",
        message: "Please enter both certificate hash and recipient address.",
        documentUrl: null,
        issuerName: null,
      });
      return;
    }

    setVerification({
      status: "loading",
      message: "Connecting to blockchain...",
      documentUrl: null,
      issuerName: null,
    });

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();

      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        signer
      );

      setVerification({
        ...verification,
        message: "Verifying certificate...",
      });

      const result = await contract.verifyCertificate(
        certificateHash,
        recipient
      );
      const [url, issuer] = result;

      setVerification({
        status: "success",
        message: "Certificate verified successfully!",
        documentUrl: url,
        issuerName: issuer,
      });

      setIsExpanded(true);
    } catch (error: any) {
      console.error("Error:", error);
      setVerification({
        status: "error",
        message: error.message.includes("Certificate does not exist")
          ? "Certificate not found or invalid. Please check your inputs and try again."
          : `Verification failed: ${error.message || "Unknown error"}`,
        documentUrl: null,
        issuerName: null,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-750 to-neutral-850 text-white">
      <div className="absolute top-0 inset-x-0 h-40 bg-primary-600/20 -z-10">
        <div
          className="w-full h-full"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,187,0,0.1) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        ></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20">
        <div className="relative mb-12">
          <h1 className="font-heading text-4xl md:text-5xl mt-6 mb-2 text-white">
            Verify Certificate
          </h1>
          <p className="text-gray-300 text-lg max-w-3xl">
            Instantly verify the authenticity of any blockchain certificate.
            Enter the certificate details below to confirm its validity.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <VerificationForm
            recipient={recipient}
            certificateHash={certificateHash}
            verification={verification}
            handleRecipientChange={handleRecipientChange}
            handleCertificateHashChange={handleCertificateHashChange}
            handleVerify={handleVerify}
          />

          <CertificateResult
            recipient={recipient}
            certificateHash={certificateHash}
            verification={verification}
            isExpanded={isExpanded}
          />
        </div>

        <HowItWorks />

        <FAQs />
      </div>
    </div>
  );
}
