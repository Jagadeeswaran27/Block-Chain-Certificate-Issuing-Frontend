import FileUpload from "../FileUpload";

interface Step2Props {
  nextStep: () => void;
  prevStep: () => void;
  govtDocument: File | null;
  setGovtDocument: (file: File | null) => void;
}

const Step2Verification: React.FC<Step2Props> = ({
  nextStep,
  prevStep,
  govtDocument,
  setGovtDocument,
}) => {
  return (
    <>
      <div className="bg-gradient-to-br from-secondary-500/10 to-primary-500/10 rounded-lg p-4 mb-8 border border-gray-700">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-secondary-400"
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
            <h3 className="text-sm font-medium text-secondary-400">
              Verification Process
            </h3>
            <p className="text-sm text-gray-300 mt-1">
              Please upload a government-issued document to verify your
              identity. This document will be reviewed by our team.
            </p>
          </div>
        </div>
      </div>

      <form className="space-y-8">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">
            Government Issued Document{" "}
            <span className="text-secondary-500">*</span>
          </label>
          <FileUpload
            file={govtDocument}
            setFile={setGovtDocument}
            placeholder="Upload government-issued document"
            fileTypes="PDF, PNG, JPG up to 10MB"
          />
        </div>

        <div className="mt-10 flex justify-between">
          <button
            type="button"
            onClick={prevStep}
            className="bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white py-3 px-6 rounded-md transition duration-300 font-medium flex items-center justify-center shadow-lg shadow-primary-600/20"
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Information
          </button>
          <button
            type="button"
            onClick={nextStep}
            className="bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white py-3 px-6 rounded-md transition duration-300 font-medium flex items-center justify-center shadow-lg shadow-primary-600/20"
          >
            Continue to Review
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 ml-2"
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
          </button>
        </div>
      </form>
    </>
  );
};

export default Step2Verification;
