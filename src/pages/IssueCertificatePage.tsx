import { useContext, useState } from "react";
import { AuthContext } from "../store/context/AuthContext";
import StepIndicator from "../components/certificate/IssuerApplication/StepIndicator";
import Step1Information from "../components/certificate/IssuerApplication/Step1Information";
import Step2Verification from "../components/certificate/IssuerApplication/Step2Verification";
import Step3Review from "../components/certificate/IssuerApplication/Step3Review";
import IssueCertificateForm from "../components/certificate/IssueCertificateForm";

export default function IssueCertificatePage() {
  const { user } = useContext(AuthContext);
  const [formStep, setFormStep] = useState(0);
  const [govtDocument, setGovtDocument] = useState<File | null>(null);

  const isIssuer = user?.type === "issuer";

  const nextStep = () => setFormStep((prev) => Math.min(prev + 1, 2));
  const prevStep = () => setFormStep((prev) => Math.max(prev - 1, 0));

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-750 to-neutral-850 text-white">
      {/* Decorative header pattern */}
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

      <div className="w-[70%] mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20">
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
          <IssueCertificateForm />
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
              {formStep === 0 && <Step1Information nextStep={nextStep} />}

              {formStep === 1 && (
                <Step2Verification
                  nextStep={nextStep}
                  prevStep={prevStep}
                  govtDocument={govtDocument}
                  setGovtDocument={setGovtDocument}
                />
              )}

              {formStep === 2 && (
                <Step3Review prevStep={prevStep} govtDocument={govtDocument} />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
