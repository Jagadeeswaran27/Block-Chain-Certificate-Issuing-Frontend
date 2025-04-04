import { useContext, useState, useRef } from "react";
import { AuthContext } from "../store/context/AuthContext";
import StepIndicator from "../components/certificate/IssuerApplication/StepIndicator";
import Step1Information from "../components/certificate/IssuerApplication/Step1Information";
import Step2Verification from "../components/certificate/IssuerApplication/Step2Verification";
import Step3Review from "../components/certificate/IssuerApplication/Step3Review";
import IssueCertificateForm from "../components/certificate/IssueCertificateForm";
import { IssuerApplication } from "../types/Issuer";
import { submitApplication } from "../core/services/IssuerService";
import { showToast } from "../utils/Toast";
import QRCode from "react-qr-code";
import html2canvas from "html2canvas";

export default function IssueCertificatePage() {
  const { user } = useContext(AuthContext);
  const [formStep, setFormStep] = useState(0);
  const [govtDocument, setGovtDocument] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<IssuerApplication>({
    organizationName: "",
    website: "",
    location: "",
    phoneNumber: "",
  });
  // New state variables for certificate data and QR code
  const [certificateHash, setCertificateHash] = useState<string | null>(null);
  const [recipientAddress, setRecipientAddress] = useState<string | null>(null);
  const [showQRCode, setShowQRCode] = useState<boolean>(false);

  const isIssuer = user?.type === "issuer" || user?.type === "admin";

  const nextStep = () => setFormStep((prev) => Math.min(prev + 1, 2));
  const prevStep = () => setFormStep((prev) => Math.max(prev - 1, 0));

  const handleCertificateIssued = (hash: string, recipient: string) => {
    setCertificateHash(hash);
    setRecipientAddress(recipient);
    setShowQRCode(true);
  };

  const handleSubmitApplication = async () => {
    if (
      !govtDocument ||
      !formData.organizationName ||
      !formData.location ||
      !formData.phoneNumber
    ) {
      return showToast({ type: "error", message: "Please fill all fields" });
    }
    setIsLoading(true);
    const response = await submitApplication(formData, govtDocument);
    if (response) {
      showToast({
        type: "success",
        message: "Application submitted successfully",
      });
      setFormData({
        organizationName: "",
        website: "",
        location: "",
        phoneNumber: "",
      });
      setGovtDocument(null);
    } else {
      showToast({ type: "error", message: "Error submitting application" });
    }
    setIsLoading(false);
  };

  const CertificateQRCode = () => {
    const qrCodeRef = useRef<HTMLDivElement>(null);

    if (!certificateHash || !recipientAddress) return null;

    const verificationUrl = `https://cert-chain.web.app/scan-to-verify?certhash=${certificateHash}&recipient=${recipientAddress}`;

    const handleShareQRCode = async () => {
      if (!qrCodeRef.current) return;

      try {
        const canvas = await html2canvas(qrCodeRef.current);
        canvas.toBlob(async (blob) => {
          if (!blob) {
            showToast({
              type: "error",
              message: "Failed to generate QR code image",
            });
            return;
          }

          const isMobile = /Android|iPhone|iPad|iPod/i.test(
            navigator.userAgent
          );

          if (isMobile) {
            try {
              await navigator.share({
                files: [
                  new File([blob], "certificate-qr.png", { type: "image/png" }),
                ],
                title: "Certificate QR Code",
                text: "Scan this QR code to verify the certificate authenticity",
              });
              return;
            } catch (error) {
              console.error("Error sharing:", error);
            }
          }

          // If not mobile or share failed, copy link to clipboard
          navigator.clipboard
            .writeText(verificationUrl)
            .then(() =>
              showToast({
                type: "success",
                message: "QR link copied to clipboard!",
              })
            )
            .catch(() => downloadQRCode(canvas));
        }, "image/png");
      } catch (error) {
        console.error("Error generating QR code image:", error);
        showToast({ type: "error", message: "Error generating QR code image" });
      }
    };

    const downloadQRCode = (canvas: HTMLCanvasElement) => {
      const link = document.createElement("a");
      link.download = "certificate-qr.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
      showToast({ type: "success", message: "QR code downloaded" });
    };

    return (
      <div className="mt-8 p-6 bg-neutral-800 rounded-lg border border-primary-700/30 text-center">
        <h3 className="text-xl font-medium mb-4">Certificate QR Code</h3>
        <p className="mb-4 text-sm text-gray-300">
          Scan this QR code to verify the certificate authenticity
        </p>
        <div
          ref={qrCodeRef}
          className="bg-white p-4 inline-block rounded-lg mb-4"
        >
          <QRCode value={verificationUrl} size={200} />
        </div>
        <button
          onClick={handleShareQRCode}
          className="mt-4 bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-lg flex items-center justify-center mx-auto"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
          </svg>
          Share QR Code
        </button>
        <p className="text-xs text-gray-400 break-all mt-2">
          Verification Link: {verificationUrl}
        </p>
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

      <div className="md:w-[70%] w-full mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20">
        <div className="relative mb-12">
          <h1 className="font-heading text-4xl md:text-5xl mt-6 mb-2 text-white">
            {isIssuer ? "Issue Certificate" : "Become an Issuer"}
          </h1>
          <p className="text-gray-300 text-lg max-w-3xl">
            {isIssuer
              ? "Create and issue blockchain-verified certificates that cannot be tampered with."
              : "Join our network of trusted certificate issuers by completing the verification process below."}
          </p>
        </div>

        {isIssuer ? (
          <>
            <IssueCertificateForm
              onCertificateIssued={handleCertificateIssued}
              disableQRCode={() => setShowQRCode(false)}
            />
            {showQRCode && <CertificateQRCode />}
          </>
        ) : (
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
                      Issuer Application
                    </h2>
                    <p className="text-sm text-white/70">
                      Complete the verification process to become a certificate
                      issuer
                    </p>
                  </div>
                </div>
                <StepIndicator currentStep={formStep} />
              </div>
            </div>

            <div className="p-8">
              {formStep === 0 && (
                <Step1Information
                  nextStep={nextStep}
                  formData={formData}
                  setFormData={setFormData}
                />
              )}

              {formStep === 1 && (
                <Step2Verification
                  nextStep={nextStep}
                  prevStep={prevStep}
                  govtDocument={govtDocument}
                  setGovtDocument={setGovtDocument}
                />
              )}

              {formStep === 2 && (
                <Step3Review
                  isLoading={isLoading}
                  submitApplication={handleSubmitApplication}
                  prevStep={prevStep}
                  govtDocument={govtDocument}
                  formData={formData}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
