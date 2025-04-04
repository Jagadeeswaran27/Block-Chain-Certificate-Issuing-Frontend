/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { ABI, ADDRESS } from "../utils/Connection";
import { Link, useSearchParams } from "react-router-dom";
import { Routes } from "../utils/Routes";

declare global {
  interface Window {
    ethereum: any;
  }
}

const CONTRACT_ADDRESS = ADDRESS;
const CONTRACT_ABI = ABI;

type VerificationStatus = "idle" | "loading" | "success" | "error";

interface VerificationState {
  status: VerificationStatus;
  message: string | null;
  documentUrl: string | null;
  issuerName: string | null;
}

export default function ScanToVerifyPage() {
  const [searchParams] = useSearchParams();
  const [verification, setVerification] = useState<VerificationState>({
    status: "idle",
    message: null,
    documentUrl: null,
    issuerName: null,
  });

  const certificateHash = searchParams.get("certhash");
  const recipientAddress = searchParams.get("recipient");

  const verifyFromQR = async (
    certHash: string,
    recipient: string
  ): Promise<void> => {
    try {
      setVerification({
        status: "loading",
        message: "Connecting to blockchain...",
        documentUrl: null,
        issuerName: null,
      });

      const provider = new ethers.providers.JsonRpcProvider(
        `https://eth-sepolia.g.alchemy.com/v2/${
          import.meta.env.VITE_SEPOLIA_API_KEY
        }`
      );

      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        provider
      );

      setVerification({
        ...verification,
        message: "Verifying certificate...",
      });

      const result = await contract.verifyCertificate(certHash, recipient);
      const [url, issuer] = result;

      setVerification({
        status: "success",
        message: "Certificate verified successfully!",
        documentUrl: url,
        issuerName: issuer,
      });
    } catch (error: any) {
      console.error("Error:", error);
      setVerification({
        status: "error",
        message: error.message.includes("Certificate does not exist")
          ? "Certificate not found or invalid. Please check the QR code and try again."
          : `Verification failed: ${error.message || "Unknown error"}`,
        documentUrl: null,
        issuerName: null,
      });
    }
  };

  useEffect(() => {
    // Automatically verify certificate when page loads if parameters exist
    if (certificateHash && recipientAddress) {
      verifyFromQR(certificateHash, recipientAddress);
    } else {
      setVerification({
        status: "error",
        message: "Missing certificate information in QR code",
        documentUrl: null,
        issuerName: null,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [certificateHash, recipientAddress]);
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20">
        <div className="relative mb-10 text-center">
          <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl mt-6 mb-2 text-white">
            Certificate Verification
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Scan-to-verify allows instant confirmation of certificate
            authenticity
          </p>
        </div>

        <div className="bg-neutral-850/80 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden border border-primary-900/30 max-w-2xl mx-auto">
          <div className="bg-gradient-to-r from-primary-700 to-primary-600 py-5 px-6">
            <div className="flex items-center">
              <div className="bg-white/20 rounded-full p-2 mr-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                  />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-white">
                QR Verification Result
              </h2>
            </div>
          </div>

          <div className="p-6 md:p-8">
            <div className="mb-6 space-y-6">
              {/* Certificate Info */}
              <div>
                <h3 className="text-sm uppercase text-gray-400 mb-2">
                  Certificate Details
                </h3>
                <div className="bg-neutral-800/70 rounded-lg p-4 border border-neutral-700">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <span className="block text-xs text-gray-400 mb-1">
                        Certificate Hash
                      </span>
                      <p className="text-sm font-mono text-gray-200 break-all">
                        {certificateHash || "Not available"}
                      </p>
                    </div>
                    <div>
                      <span className="block text-xs text-gray-400 mb-1">
                        Recipient Address
                      </span>
                      <p className="text-sm font-mono text-gray-200 break-all">
                        {recipientAddress || "Not available"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Verification Status */}
              <div>
                <h3 className="text-sm uppercase text-gray-400 mb-2">
                  Verification Status
                </h3>
                <div
                  className={`rounded-lg p-4 border ${
                    verification.status === "loading"
                      ? "bg-blue-900/20 border-blue-800"
                      : verification.status === "success"
                      ? "bg-green-900/20 border-green-800"
                      : verification.status === "error"
                      ? "bg-red-900/20 border-red-800"
                      : "bg-neutral-800/70 border-neutral-700"
                  }`}
                >
                  <div className="flex items-center mb-3">
                    {verification.status === "loading" && (
                      <div className="mr-3">
                        <svg
                          className="animate-spin h-5 w-5 text-blue-500"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                      </div>
                    )}
                    {verification.status === "success" && (
                      <div className="mr-3 bg-green-500 rounded-full p-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-white"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                    {verification.status === "error" && (
                      <div className="mr-3 bg-red-500 rounded-full p-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-white"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                    <h4 className="font-medium">
                      {verification.status === "loading"
                        ? "Verifying..."
                        : verification.status === "success"
                        ? "Verification Successful"
                        : verification.status === "error"
                        ? "Verification Failed"
                        : "Certificate Information"}
                    </h4>
                  </div>
                  <p className="text-sm text-gray-300">
                    {verification.message}
                  </p>

                  {verification.status === "success" && (
                    <div className="mt-4 pt-4 border-t border-green-800/30 space-y-3">
                      <div>
                        <span className="block text-xs text-gray-400 mb-1">
                          Issuer Name
                        </span>
                        <p className="text-sm font-medium text-white">
                          {verification.issuerName}
                        </p>
                      </div>

                      {verification.documentUrl && (
                        <div>
                          <a
                            href={verification.documentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-4 py-2 bg-secondary-500 text-neutral-850 text-sm font-medium rounded-md hover:bg-secondary-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500 focus:ring-offset-neutral-850 transition-colors mt-2"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 mr-2"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                            View Certificate
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to={Routes.verifyCertificate}
                className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 focus:ring-offset-neutral-850"
              >
                Verify Another Certificate
              </Link>
              <Link
                to={Routes.home}
                className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-primary-700 text-sm font-medium rounded-md text-primary-300 bg-transparent hover:bg-primary-900/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 focus:ring-offset-neutral-850"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
