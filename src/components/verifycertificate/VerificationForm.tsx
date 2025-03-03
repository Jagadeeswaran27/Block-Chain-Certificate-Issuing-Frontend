interface VerificationFormProps {
  certificateHash: string;
  recipient: string;
  verification: {
    status: "idle" | "loading" | "success" | "error";
    message: string | null;
    documentUrl: string | null;
    issuerName: string | null;
  };
  handleCertificateHashChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRecipientChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleVerify: () => Promise<void>;
}

export default function VerificationForm({
  certificateHash,
  recipient,
  verification,
  handleCertificateHashChange,
  handleRecipientChange,
  handleVerify,
}: VerificationFormProps) {
  return (
    <div className="bg-neutral-850/80 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden border border-primary-900/30">
      <div className="bg-gradient-to-r from-primary-700 to-primary-600 py-6 px-8">
        <div className="flex items-center">
          <div className="bg-white/20 rounded-full p-3 mr-4">
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
          <div>
            <h2 className="text-lg font-semibold text-white">
              Certificate Verification
            </h2>
            <p className="text-sm text-white/70">
              Verify the authenticity of a certificate on the blockchain
            </p>
          </div>
        </div>
      </div>

      <div className="p-8 space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">
            Certificate Hash
          </label>
          <input
            type="text"
            value={certificateHash}
            onChange={handleCertificateHashChange}
            placeholder="Enter the certificate hash"
            className="w-full px-4 py-3 rounded-md bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <p className="mt-1 text-xs text-gray-400">
            The unique hash identifier provided with your certificate
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">
            Recipient Address
          </label>
          <input
            type="text"
            value={recipient}
            onChange={handleRecipientChange}
            placeholder="Enter the blockchain address of the recipient"
            className="w-full px-4 py-3 rounded-md bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <p className="mt-1 text-xs text-gray-400">
            The blockchain address to which the certificate was issued
          </p>
        </div>

        <button
          onClick={handleVerify}
          disabled={verification.status === "loading"}
          className="w-full flex justify-center items-center px-6 py-3 rounded-md bg-secondary-500 text-neutral-850 font-medium hover:bg-secondary-400 transition-colors focus:outline-none focus:ring-2 focus:ring-secondary-400 disabled:opacity-70"
        >
          {verification.status === "loading" ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-neutral-850"
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
              Verifying...
            </>
          ) : (
            "Verify Certificate"
          )}
        </button>

        {verification.message && (
          <div
            className={`p-4 rounded-md ${
              verification.status === "error"
                ? "bg-red-600/20 text-white border border-red-600/30"
                : verification.status === "success"
                ? "bg-green-600/20 text-white border border-green-600/30"
                : "bg-blue-600/20 text-white border border-blue-600/30"
            }`}
          >
            <p className="text-sm">{verification.message}</p>
          </div>
        )}
      </div>
    </div>
  );
}
