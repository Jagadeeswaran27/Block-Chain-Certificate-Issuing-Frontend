import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { getUserIssuedCertificates } from "../core/services/CertificateService";
import { Certificate } from "../types/Certificate";
import { AuthContext } from "../store/context/AuthContext";
import { showToast } from "../utils/Toast";
import QRCode from "react-qr-code";
import { ADDRESS } from "../utils/Connection";

const IssuedCertificatesPage = () => {
  const { user } = useContext(AuthContext);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedCertificate, setSelectedCertificate] =
    useState<Certificate | null>(null);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        if (!user) return;

        const data = await getUserIssuedCertificates();
        setCertificates(data);
      } catch (error) {
        console.error("Error fetching certificates:", error);
        showToast({
          type: "error",
          message: "Failed to load certificates",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCertificates();
  }, [user]);

  const handleSort = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const filteredCertificates = certificates
    .filter(
      (cert) =>
        cert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cert.recipient.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === "asc") {
        return a.timestamp - b.timestamp;
      } else {
        return b.timestamp - a.timestamp;
      }
    });

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(
      address.length - 4
    )}`;
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

  const CertificateModal = () => {
    if (!selectedCertificate) return null;

    const nftLink = getNftLink(selectedCertificate.tokenId);

    return (
      <div className="fixed inset-0 z-50 flex items-start justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
        <div className="bg-neutral-850 rounded-xl border border-primary-800/30 w-full max-w-3xl overflow-hidden shadow-2xl my-4">
          <div className="bg-gradient-to-r from-primary-700 to-primary-600 py-4 px-4 sm:px-6 flex justify-between items-center sticky top-0 z-10">
            <h3 className="text-lg font-medium text-white">
              Certificate Details
            </h3>
            <button
              onClick={() => setSelectedCertificate(null)}
              className="text-white hover:text-gray-200"
            >
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="p-4 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-400">
                    Certificate Information
                  </h4>
                  <div className="mt-2 bg-neutral-750 rounded-lg p-4 border border-gray-700">
                    <div className="mb-3">
                      <span className="text-xs text-gray-500">Title</span>
                      <p className="text-white font-medium">
                        {selectedCertificate.title}
                      </p>
                    </div>
                    <div className="mb-3">
                      <span className="text-xs text-gray-500">Issuer</span>
                      <p className="text-white font-medium">
                        {selectedCertificate.issuer}
                      </p>
                    </div>
                    <div className="mb-3">
                      <span className="text-xs text-gray-500">Recipient</span>
                      <p className="text-white font-medium break-all">
                        {selectedCertificate.recipient}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Issue Date</span>
                      <p className="text-white font-medium">
                        {formatDate(selectedCertificate.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-400">
                    Blockchain Information
                  </h4>
                  <div className="mt-2 bg-neutral-750 rounded-lg p-4 border border-gray-700">
                    <div className="mb-3">
                      <span className="text-xs text-gray-500">
                        Transaction Hash
                      </span>
                      <p className="text-primary-400 font-mono text-sm break-all">
                        {selectedCertificate.transactionHash}
                      </p>
                    </div>
                    <div className="mb-3">
                      <span className="text-xs text-gray-500">
                        Certificate Hash
                      </span>
                      <p className="text-primary-400 font-mono text-sm break-all">
                        {selectedCertificate.certificateHash}
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
                  QR Code & Verification
                </h4>
                <div className="mt-2 bg-neutral-750 rounded-lg p-4 border border-gray-700 flex flex-col items-center">
                  <div className="bg-white p-4 rounded-lg mb-4">
                    <QRCode value={selectedCertificate.qrLink} size={150} />
                  </div>
                  <div className="space-y-3 w-full">
                    <a
                      href={selectedCertificate.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full text-center bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded transition"
                    >
                      View Certificate
                    </a>
                    <a
                      href={selectedCertificate.qrLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full text-center bg-secondary-600 hover:bg-secondary-700 text-white py-2 px-4 rounded transition"
                    >
                      Open Verification Link
                    </a>
                    <a
                      href={nftLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full text-center bg-neutral-600 hover:bg-neutral-700 text-white py-2 px-4 rounded transition"
                    >
                      View NFT on Etherscan
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
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

      <div className="md:w-[90%] w-full mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20">
        <div className="relative mb-8">
          <h1 className="font-heading text-4xl md:text-5xl mt-6 mb-2 text-white">
            Issued Certificates
          </h1>
          <p className="text-gray-300 text-lg max-w-3xl">
            Manage and track all certificates you've issued on the blockchain
          </p>
        </div>

        <div className="bg-neutral-850/80 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden border border-primary-900/30 mb-8">
          <div className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div className="relative w-full md:w-96">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-2 rounded-md bg-neutral-750/50 border border-gray-600 text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Search by title or recipient..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex items-center space-x-3 w-full md:w-auto">
                <button
                  onClick={handleSort}
                  className="inline-flex items-center px-4 py-2 bg-neutral-750 hover:bg-neutral-700 rounded-md border border-gray-600 transition"
                >
                  <span className="mr-2">Sort by Date</span>
                  <span className="text-xs font-medium px-2 py-1 rounded bg-primary-600/30 text-primary-400">
                    {sortOrder === "desc" ? "DESC" : "ASC"}
                  </span>
                </button>

                <Link
                  to="/issue-certificate"
                  className="inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 rounded-md shadow transition"
                >
                  <svg
                    className="h-4 w-4 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Issue New
                </Link>
              </div>
            </div>

            {isLoading ? (
              <div className="py-16 flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
              </div>
            ) : filteredCertificates.length === 0 ? (
              <div className="py-16 text-center">
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
                <h3 className="mt-2 text-lg font-medium text-white">
                  No certificates found
                </h3>
                <p className="mt-1 text-gray-400">
                  {searchTerm
                    ? "No results match your search criteria"
                    : "You haven't issued any certificates yet"}
                </p>
                <div className="mt-6">
                  <Link
                    to="/issue-certificate"
                    className="inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 rounded-md transition"
                  >
                    <svg
                      className="h-4 w-4 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Issue Your First Certificate
                  </Link>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-neutral-800">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                      >
                        Certificate
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                      >
                        Recipient
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                      >
                        Date Issued
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-neutral-750 divide-y divide-gray-700">
                    {filteredCertificates.map((certificate, index) => (
                      <tr
                        key={index}
                        className="hover:bg-neutral-700/20 transition"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-primary-600/20 rounded-full flex items-center justify-center">
                              <svg
                                className="h-5 w-5 text-primary-500"
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
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-white">
                                {certificate.title}
                              </div>
                              <div className="text-sm text-gray-400">
                                {certificate.issuer}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-white">
                            {formatAddress(certificate.recipient)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-white">
                            {formatDate(certificate.timestamp)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-3">
                            <a
                              href={certificate.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary-400 hover:text-primary-300"
                              title="View Certificate"
                            >
                              <svg
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                              </svg>
                            </a>
                            <button
                              onClick={() =>
                                setSelectedCertificate(certificate)
                              }
                              className="text-secondary-500 hover:text-secondary-400"
                              title="View Details"
                            >
                              <svg
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                            </button>
                            <a
                              href={getNftLink(certificate.tokenId)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-green-500 hover:text-green-400"
                              title="View NFT on Etherscan"
                            >
                              <svg
                                className="h-5 w-5"
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
                            </a>
                            <button
                              onClick={() =>
                                copyToClipboard(getNftLink(certificate.tokenId))
                              }
                              className="text-blue-500 hover:text-blue-400"
                              title="Copy NFT Link"
                            >
                              <svg
                                className="h-5 w-5"
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
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedCertificate && <CertificateModal />}
    </div>
  );
};

export default IssuedCertificatesPage;
