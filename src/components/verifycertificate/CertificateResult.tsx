interface CertificateResultProps {
  verification: {
    status: "idle" | "loading" | "success" | "error";
    message: string | null;
    documentUrl: string | null;
    issuerName: string | null;
  };
  recipient: string;
  certificateHash: string;
  isExpanded: boolean;
}

export default function CertificateResult({
  verification,
  recipient,
  certificateHash,
  isExpanded,
}: CertificateResultProps) {
  return (
    <div
      className={`bg-neutral-850/80 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden border ${
        verification.status === "success"
          ? "border-green-600/30"
          : "border-primary-900/30"
      } transition-all duration-300 ${
        isExpanded && verification.status === "success"
          ? "scale-100 opacity-100"
          : "scale-95 opacity-80"
      }`}
    >
      <div
        className={`py-6 px-8 ${
          verification.status === "success"
            ? "bg-gradient-to-r from-green-700 to-green-600"
            : "bg-gradient-to-r from-gray-700 to-gray-600"
        }`}
      >
        <div className="flex items-center">
          <div className="bg-white/20 rounded-full p-3 mr-4">
            {verification.status === "success" ? (
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
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
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
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            )}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">
              {verification.status === "success"
                ? "Certificate Verified"
                : "Certificate Details"}
            </h2>
            <p className="text-sm text-white/70">
              {verification.status === "success"
                ? "This certificate has been verified on blockchain"
                : "Details will appear once verified"}
            </p>
          </div>
        </div>
      </div>

      <div className="p-8">
        {verification.status === "success" && verification.issuerName ? (
          <div className="space-y-6">
            <div className="flex justify-center mb-6">
              <div className="bg-secondary-500 rounded-full p-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 text-neutral-850"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
            </div>

            <div className="space-y-4">
              <div className="border-b border-white/10 pb-4">
                <h3 className="text-sm font-medium text-gray-400 mb-1">
                  Issuer
                </h3>
                <p className="text-lg">{verification.issuerName}</p>
              </div>

              <div className="border-b border-white/10 pb-4">
                <h3 className="text-sm font-medium text-gray-400 mb-1">
                  Recipient Address
                </h3>
                <p className="text-sm text-white/90 font-mono break-all">
                  {recipient}
                </p>
              </div>

              <div className="border-b border-white/10 pb-4">
                <h3 className="text-sm font-medium text-gray-400 mb-1">
                  Certificate Hash
                </h3>
                <p className="text-sm text-white/90 font-mono break-all">
                  {certificateHash}
                </p>
              </div>

              <div className="pt-2">
                <h3 className="text-sm font-medium text-gray-400 mb-3">
                  Certificate Document
                </h3>
                {verification.documentUrl && (
                  <a
                    href={verification.documentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center px-4 py-2 bg-primary-600 hover:bg-primary-500 rounded text-white font-medium transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                    View Certificate
                  </a>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mb-4 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="text-center">
              Enter certificate details and click verify to see the certificate
              information
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
