import { useState, useContext } from "react";
import FileUpload from "./FileUpload";
import { ethers } from "ethers";
import { showToast } from "../../utils/Toast";
import { AuthContext } from "../../store/context/AuthContext";
import { storeCertificate } from "../../core/services/CertificateService";
import { Certificate } from "../../types/Certificate";
import { Link } from "react-router-dom"; // Add this import
import { ADDRESS } from "../../utils/Connection";

type ResponseType = {
  timestamp: number;
  txHash: string;
  tokenId: string;
};
interface IssueCertificateFormProps {
  onCertificateIssued: (hash: string, recipient: string) => void;
  disableQRCode: () => void;
}

const IssueCertificateForm = ({
  onCertificateIssued,
  disableQRCode,
}: IssueCertificateFormProps) => {
  const { user } = useContext(AuthContext);
  const [file, setFile] = useState<File | null>(null);
  const [issuerName, setIssuerName] = useState("");
  const [certificateTitle, setCertificateTitle] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [transactionHash, setTransactionHash] = useState("");
  const [certificateHash, setCertificateHash] = useState("");
  const [certificateUrl, setCertificateUrl] = useState("");
  const [issueTimestamp, setIssueTimestamp] = useState<number>(0);
  const [tokenId, setTokenId] = useState<string>("");

  const PINATA_UPLOAD_URL = import.meta.env.VITE_PINATA_UPLOAD_URL;
  const PINATA_API_KEY = import.meta.env.VITE_PINATA_API_KEY;
  const PINATA_SECRET_KEY = import.meta.env.VITE_PINATA_SECRET_KEY;

  const handleUpload = async () => {
    if (
      !file ||
      recipientAddress.trim().length === 0 ||
      issuerName.trim().length === 0 ||
      certificateTitle.trim().length === 0
    ) {
      showToast({ type: "error", message: "Please fill all fields" });
      return;
    }
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(PINATA_UPLOAD_URL, {
        method: "POST",
        headers: {
          pinata_api_key: PINATA_API_KEY,
          pinata_secret_api_key: PINATA_SECRET_KEY,
        },
        body: formData,
      });

      const data = await response.json();
      console.log("Pinata response:", data);

      if (!data.IpfsHash) {
        throw new Error("File upload failed");
      }

      const fileUrl = `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`;
      console.log("File URL:", fileUrl);
      setCertificateUrl(fileUrl);

      const fileBuffer = await file.arrayBuffer();
      const fileHash = ethers.utils.keccak256(new Uint8Array(fileBuffer));
      console.log("File hash:", fileHash);
      setCertificateHash(fileHash);

      const apiRes = await fetch(
        "https://us-central1-cerchain-48685.cloudfunctions.net/api/issue-certificate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            issuerName,
            recipientAddress,
            fileHash,
            fileUrl,
            certificateTitle,
          }),
        }
      );

      let tstamp = 0;
      let thash = "";
      let tId = "";
      if (apiRes.ok) {
        const data: ResponseType = await apiRes.json();
        console.log("API response:", data);
        const { timestamp, txHash, tokenId } = data;
        tstamp = data.timestamp;
        thash = data.txHash;
        tId = tokenId;
        setTransactionHash(txHash);
        setIssueTimestamp(timestamp);
        setTokenId(tokenId); // Make sure to set the tokenId state
      }

      if (user?.uid) {
        const certificateData: Certificate = {
          title: certificateTitle,
          issuer: issuerName,
          recipient: recipientAddress,
          certificateHash: fileHash,
          fileUrl: fileUrl,
          timestamp: tstamp,
          transactionHash: thash,
          qrLink: `https://cert-chain.web.app/scan-to-verify?certhash=${fileHash}&recipient=${recipientAddress}`,
          tokenId: tId,
        };

        await storeCertificate(user.uid, certificateData);
      } else {
        console.error("User not authenticated");
      }

      setIsSuccess(true);
      onCertificateIssued(fileHash, recipientAddress);
      showToast({
        type: "success",
        message: "Certificate successfully issued on the blockchain!",
      });
    } catch (error: unknown) {
      console.error("Error:", error);
      showToast({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Failed to issue certificate",
      });
    }
    setIsLoading(false);
  };

  const getNftLink = (tokenId: string) => {
    return `https://sepolia.etherscan.io/nft/${ADDRESS}/${tokenId}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        showToast({
          type: "success",
          message: "Copied to clipboard",
        });
      })
      .catch((error) => {
        console.error("Failed to copy: ", error);
        showToast({
          type: "error",
          message: "Failed to copy to clipboard",
        });
      });
  };

  const resetForm = () => {
    setFile(null);
    setCertificateTitle("");
    setRecipientAddress("");
    setIssuerName("");
    setIsSuccess(false);
    setTransactionHash("");
    setCertificateHash("");
    setCertificateUrl("");
    disableQRCode();
  };

  const SuccessDisplay = () => {
    const nftLink = getNftLink(tokenId);

    return (
      <div className="bg-neutral-750/70 rounded-xl border border-green-500/30 p-6 mt-8 shadow-lg overflow-hidden">
        <div className="flex items-center mb-6">
          <div className="flex-shrink-0 bg-green-500/20 rounded-full p-3">
            <svg
              className="h-6 w-6 text-green-500"
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
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium text-white">
              Certificate Successfully Issued!
            </h3>
            <p className="text-sm text-gray-300">
              {new Date(issueTimestamp).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-400">
                Certificate Details
              </h4>
              <div className="mt-2 bg-neutral-850 rounded-lg p-4 border border-gray-700">
                <div className="mb-3">
                  <span className="text-xs text-gray-500">Title</span>
                  <p className="text-white font-medium">{certificateTitle}</p>
                </div>
                <div className="mb-3">
                  <span className="text-xs text-gray-500">Issuer</span>
                  <p className="text-white font-medium">{issuerName}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-500">Recipient</span>
                  <p className="text-white font-medium break-all">
                    {recipientAddress}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-400">
                Blockchain Verification
              </h4>
              <div className="mt-2 bg-neutral-850 rounded-lg p-4 border border-gray-700">
                <div className="mb-3">
                  <span className="text-xs text-gray-500">
                    Transaction Hash
                  </span>
                  <p className="text-primary-400 font-mono text-sm break-all">
                    {transactionHash}
                  </p>
                </div>
                <div className="mb-3">
                  <span className="text-xs text-gray-500">
                    Certificate Hash
                  </span>
                  <p className="text-primary-400 font-mono text-sm break-all">
                    {certificateHash}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-gray-500">NFT Link</span>
                  <div className="flex items-center mt-1">
                    <p className="text-primary-400 font-mono text-sm truncate flex-1">
                      {nftLink}
                    </p>
                    <button
                      onClick={() => copyToClipboard(nftLink)}
                      className="ml-2 text-gray-400 hover:text-white"
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-400">
              Certificate Preview
            </h4>
            <div className="mt-2 bg-neutral-850 rounded-lg p-4 border border-gray-700 h-[443px]">
              {file && (
                <div className="flex flex-col h-full">
                  <div className="text-center mb-3">
                    <p className="text-sm text-gray-300">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>

                  <div className="flex-grow flex items-center justify-center bg-neutral-750/50 rounded-lg p-3">
                    {file.type.startsWith("image/") ? (
                      <img
                        src={URL.createObjectURL(file)}
                        alt="Certificate Preview"
                        className="max-h-48 object-contain"
                      />
                    ) : (
                      <div className="text-center p-6">
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        <p className="mt-2 text-sm text-gray-500">Document</p>
                      </div>
                    )}
                  </div>

                  <a
                    href={certificateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 flex items-center justify-center text-sm text-primary-400 hover:text-primary-300 transition-colors"
                  >
                    <svg
                      className="h-4 w-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                    View on IPFS
                  </a>
                  <a
                    href={nftLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center text-sm text-green-500 hover:text-green-400 transition-colors"
                  >
                    <svg
                      className="h-4 w-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                      />
                    </svg>
                    View NFT on Etherscan
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-12 flex justify-end">
          <button
            onClick={resetForm}
            className="bg-neutral-700 hover:bg-neutral-600 text-white py-2 px-4 rounded-md transition duration-200 flex items-center"
          >
            <svg
              className="h-5 w-5 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Issue Another Certificate
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-neutral-850/80 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden border border-primary-900/30">
      <div className="bg-gradient-to-r from-primary-700 to-primary-600 py-6 px-8">
        <div className="flex items-center justify-between">
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
                Certificate Issuance Portal
              </h2>
              <p className="text-sm text-white/70">
                Complete the form below to create a new certificate
              </p>
            </div>
          </div>

          <Link
            to="/issued-certificates"
            className="hidden sm:flex items-center px-4 py-2 bg-white/20 hover:bg-white/30 rounded-md transition text-white text-sm font-medium group"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            View Issued Certificates
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 ml-1 transform transition-transform group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </div>

      {/* Also add a mobile-friendly link at the bottom of the form for small screens */}
      <div className="p-8">
        {!isSuccess ? (
          <form className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                {/* ...existing code... */}
                <div>
                  <label
                    htmlFor="issuerName"
                    className="block text-sm font-medium mb-2 text-gray-300"
                  >
                    Issuer Organization
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                    </div>
                    <input
                      type="text"
                      id="issuerName"
                      className="w-full pl-10 px-4 py-3 rounded-md bg-neutral-750/50 border border-gray-600 text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your organization name"
                      value={issuerName}
                      onChange={(e) => setIssuerName(e.target.value)}
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-400">
                    This will appear as the issuer name on the certificate
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="certificateTitle"
                    className="block text-sm font-medium mb-2 text-gray-300"
                  >
                    Certificate Title
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <input
                      type="text"
                      id="certificateTitle"
                      className="w-full pl-10 px-4 py-3 rounded-md bg-neutral-750/50 border border-gray-600 text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                      placeholder="e.g. Certificate of Completion"
                      value={certificateTitle}
                      onChange={(e) => setCertificateTitle(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="recipientAddress"
                    className="block text-sm font-medium mb-2 text-gray-300"
                  >
                    Recipient Wallet Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-500"
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
                    <input
                      type="text"
                      id="recipientAddress"
                      className="w-full pl-10 px-4 py-3 rounded-md bg-neutral-750/50 border border-gray-600 text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                      placeholder="0x..."
                      value={recipientAddress}
                      onChange={(e) => setRecipientAddress(e.target.value)}
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-400">
                    The blockchain address of the certificate recipient
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Certificate File
                </label>
                <FileUpload file={file} setFile={setFile} />
              </div>
            </div>

            <div>
              <div className="bg-neutral-750/70 rounded-lg p-4 mb-6 border border-yellow-500/20">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-secondary-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-300">
                      By issuing this certificate, you confirm that you have the
                      authority to do so and that the information is accurate.
                      Certificate will be permanently recorded on the blockchain
                      and cannot be modified after issuance.
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleUpload}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white py-3 px-6 rounded-md transition duration-300 font-medium flex items-center justify-center shadow-lg shadow-primary-600/20"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                    Uploading to Blockchain...
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Issue Certificate on Blockchain
                  </>
                )}
              </button>

              <div className="mt-4 text-center sm:hidden">
                <Link
                  to="/issued-certificates"
                  className="inline-flex items-center text-primary-400 hover:text-primary-300 transition"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  View all your issued certificates
                </Link>
              </div>
            </div>
          </form>
        ) : (
          <SuccessDisplay />
        )}
      </div>
    </div>
  );
};

export default IssueCertificateForm;
