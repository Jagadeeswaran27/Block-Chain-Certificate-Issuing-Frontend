import { useState } from "react";
import { ethers } from "ethers";
import { ABI } from "./utils/ABI";

declare global {
  interface Window {
    ethereum: any;
  }
}

const PINATA_API_KEY = "e5990ffccc031f2d1a37";
const PINATA_SECRET_KEY =
  "41eddda616e3952fab8ce04af6ee382ba8fda7b161c1ac976208a3e147e12fda";
const PINATA_UPLOAD_URL = "https://api.pinata.cloud/pinning/pinFileToIPFS";
const CONTRACT_ADDRESS = "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853";
const CONTRACT_ABI = ABI;

const App = () => {
  const [file, setFile] = useState<File | null>(null);
  const [recipient, setRecipient] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [certificateHash, setCertificateHash] = useState<string>("");
  const [verificationResult, setVerificationResult] = useState<string>("");

  const handleRecipientChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => setRecipient(e.target.value);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };
  const handleCertificateHashChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => setCertificateHash(e.target.value);

  const handleUpload = async (): Promise<void> => {
    if (!file || !recipient) {
      setStatus("Please select a file and enter a recipient address.");
      return;
    }

    try {
      setStatus("Uploading to Pinata...");

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

      setStatus("Generating file hash...");
      const fileBuffer = await file.arrayBuffer();
      const fileHash = ethers.utils.keccak256(new Uint8Array(fileBuffer));
      console.log("File hash:", fileHash);

      setStatus("Connecting to MetaMask...");
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();

      setStatus("Storing metadata on blockchain...");
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        signer
      );
      const tx = await contract.issueCertificate(
        recipient,
        "Issuer Name",
        fileHash,
        fileUrl
      );
      await tx.wait();

      setStatus("Certificate stored successfully!");
      console.log("Transaction hash:", tx.hash);
      setFile(null);
      setRecipient("");
    } catch (error: any) {
      console.error("Error:", error);
      setStatus(`Error: ${error.message || "Transaction failed"}`);
    }
  };

  const handleVerify = async (): Promise<void> => {
    if (!certificateHash || !recipient) {
      setVerificationResult(
        "Please enter a certificate hash and recipient address."
      );
      return;
    }

    try {
      setStatus("Connecting to MetaMask...");
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();

      setStatus("Verifying certificate...");
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        signer
      );
      const documentUrl = await contract.verifyCertificate(
        certificateHash,
        recipient
      );
      setVerificationResult(
        `Certificate is valid. Document URL: ${documentUrl}`
      );
    } catch (error: any) {
      console.error("Error:", error);
      setVerificationResult(`Error: ${error.message || "Verification failed"}`);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <input
        type="text"
        value={recipient}
        onChange={handleRecipientChange}
        placeholder="Recipient Address"
      />
      <button onClick={handleUpload}>Upload</button>
      <p>{status}</p>

      <h2>Verify Certificate</h2>
      <input
        type="text"
        value={certificateHash}
        onChange={handleCertificateHashChange}
        placeholder="Certificate Hash"
      />
      <input
        type="text"
        value={recipient}
        onChange={handleRecipientChange}
        placeholder="Recipient Address"
      />
      <button onClick={handleVerify}>Verify</button>
      <p>{verificationResult}</p>
    </div>
  );
};

export default App;
