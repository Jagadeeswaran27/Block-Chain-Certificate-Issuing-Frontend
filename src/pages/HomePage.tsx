import { useState } from "react";
import { ethers } from "ethers";
import { ABI } from "../utils/ABI";

declare global {
  interface Window {
    ethereum: any;
  }
}

const CONTRACT_ADDRESS = "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853";
const CONTRACT_ABI = ABI;

const HomePage = () => {
  const [recipient, setRecipient] = useState<string>("");
  const [certificateHash, setCertificateHash] = useState<string>("");
  const [verificationResult, setVerificationResult] = useState<string | null>(
    null
  );
  const [verificationStatus, setVerificationStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const handleRecipientChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => setRecipient(e.target.value);

  const handleCertificateHashChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => setCertificateHash(e.target.value);

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>): void => {
    e.preventDefault();
    const href = e.currentTarget.getAttribute("href");
    if (href) {
      const targetElement = document.querySelector(href);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  const handleVerify = async (): Promise<void> => {
    if (!certificateHash || !recipient) {
      setVerificationResult(
        "Please enter both certificate hash and recipient address."
      );
      setVerificationStatus("error");
      return;
    }

    try {
      setVerificationStatus("loading");
      setVerificationResult("Connecting to blockchain...");

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();

      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        signer
      );

      setVerificationResult("Verifying certificate...");
      const documentUrl = await contract.verifyCertificate(
        certificateHash,
        recipient
      );

      setVerificationStatus("success");
      setVerificationResult(
        `Certificate is valid! View document at: ${documentUrl}`
      );
    } catch (error: any) {
      console.error("Error:", error);
      setVerificationStatus("error");
      setVerificationResult(
        error.message.includes("Certificate does not exist")
          ? "Certificate not found or invalid. Please check your inputs and try again."
          : `Verification failed: ${error.message || "Unknown error"}`
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-800 text-white md:min-h-[calc(100vh-64px)] md:max-h-[calc(100vh-64px)] flex items-center justify-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-6 xl:col-span-7">
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
                Secure Certificate Verification on Blockchain
              </h1>
              <p className="mt-6 text-xl leading-8">
                CertChain provides tamper-proof digital certificates using
                blockchain technology. Verify the authenticity of any
                certificate instantly and securely.
              </p>
              <div className="mt-10 flex items-center gap-x-6">
                <a className="rounded-md bg-secondary-500 px-6 py-3 text-lg font-semibold text-neutral-850 shadow-sm hover:bg-secondary-400 transition-all focus:outline-none focus:ring-2 focus:ring-secondary-400">
                  Verify Certificate
                </a>
                <a
                  href="#learn-more"
                  onClick={handleSmoothScroll}
                  className="text-lg font-semibold leading-6 text-white hover:text-gray-200"
                >
                  Learn more <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>
            <div className="mt-12 lg:mt-0 lg:col-span-6 xl:col-span-5 flex justify-center">
              <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl shadow-xl max-w-md w-full">
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-full">
                    <div className="flex items-center justify-center mb-6">
                      <div className="h-16 w-16 bg-secondary-500 rounded-full flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-10 w-10 text-neutral-850"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                    <h2 className="mb-4 text-2xl font-bold text-center">
                      Quick Verify
                    </h2>
                    <div id="verify" className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Certificate Hash
                        </label>
                        <input
                          type="text"
                          value={certificateHash}
                          onChange={handleCertificateHashChange}
                          placeholder="Enter certificate hash"
                          className="w-full px-4 py-3 rounded-md bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-secondary-400"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Recipient Address
                        </label>
                        <input
                          type="text"
                          value={recipient}
                          onChange={handleRecipientChange}
                          placeholder="Recipient's blockchain address"
                          className="w-full px-4 py-3 rounded-md bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-secondary-400"
                        />
                      </div>
                      <button
                        onClick={handleVerify}
                        disabled={verificationStatus === "loading"}
                        className="w-full mt-2 flex justify-center items-center px-4 py-3 rounded-md bg-secondary-500 text-neutral-850 font-medium hover:bg-secondary-400 transition-colors focus:outline-none focus:ring-2 focus:ring-secondary-400 disabled:opacity-70"
                      >
                        {verificationStatus === "loading" ? (
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

                      {verificationResult && (
                        <div
                          className={`mt-4 p-4 rounded-md ${
                            verificationStatus === "error"
                              ? "bg-red-500/20 text-white"
                              : verificationStatus === "success"
                              ? "bg-green-500/20 text-white"
                              : "bg-blue-500/20 text-white"
                          }`}
                        >
                          <p className="text-sm">{verificationResult}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="learn-more" className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-primary-600 uppercase tracking-wide">
              Features
            </h2>
            <p className="mt-1 text-3xl font-extrabold text-neutral-850 sm:text-4xl lg:text-5xl">
              Why Choose Blockchain Certificates
            </p>
            <p className="max-w-xl mt-5 mx-auto text-xl text-neutral-750">
              Our platform provides tamper-proof certification with blockchain
              security and instant verification.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6">
                <div className="bg-primary-100 rounded-md w-12 h-12 flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-primary-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-neutral-850 mb-2">
                  Tamper-Proof Security
                </h3>
                <p className="text-neutral-750">
                  Once issued, certificates cannot be modified or tampered with,
                  ensuring authenticity and integrity.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6">
                <div className="bg-primary-100 rounded-md w-12 h-12 flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-primary-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-neutral-850 mb-2">
                  Instant Verification
                </h3>
                <p className="text-neutral-750">
                  Verify any certificate instantly without needing to contact
                  the issuing institution.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6">
                <div className="bg-primary-100 rounded-md w-12 h-12 flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-primary-600"
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
                <h3 className="text-lg font-medium text-neutral-850 mb-2">
                  Decentralized Trust
                </h3>
                <p className="text-neutral-750">
                  Leveraging blockchain technology ensures no central point of
                  failure or control.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-neutral-750 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-secondary-400 uppercase tracking-wide">
              Process
            </h2>
            <p className="mt-1 text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
              How It Works
            </p>
            <p className="max-w-xl mt-5 mx-auto text-xl text-gray-300">
              Our simple three-step process makes certificate verification
              secure and straightforward.
            </p>
          </div>

          <div className="mt-16">
            <div className="grid gap-8 md:grid-cols-3">
              {/* Step 1 */}
              <div className="text-center">
                <div className="mx-auto bg-primary-500/20 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-primary-400">1</span>
                </div>
                <h3 className="text-xl font-medium text-white mb-2">
                  Issue Certificate
                </h3>
                <p className="text-gray-300">
                  Organizations issue digital certificates and store their
                  unique hash on the blockchain.
                </p>
              </div>

              {/* Step 2 */}
              <div className="text-center">
                <div className="mx-auto bg-primary-500/20 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-primary-400">2</span>
                </div>
                <h3 className="text-xl font-medium text-white mb-2">
                  Share Certificate
                </h3>
                <p className="text-gray-300">
                  Recipients receive their certificates with a unique hash
                  identifier.
                </p>
              </div>

              {/* Step 3 */}
              <div className="text-center">
                <div className="mx-auto bg-primary-500/20 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-primary-400">3</span>
                </div>
                <h3 className="text-xl font-medium text-white mb-2">
                  Verify Anytime
                </h3>
                <p className="text-gray-300">
                  Anyone can verify the certificate's authenticity using the
                  hash and recipient address.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-neutral-850 sm:text-4xl">
            <span className="block">Ready to get started?</span>
            <span className="block text-primary-600">
              Issue your first blockchain certificate today.
            </span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <a className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700">
                Get started
              </a>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <a
                onClick={handleSmoothScroll}
                href="#learn-more"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-gray-50"
              >
                Learn more
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
