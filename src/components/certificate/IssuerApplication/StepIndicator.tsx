interface StepIndicatorProps {
  currentStep: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  return (
    <div className="hidden md:flex items-center">
      <div
        className={`flex items-center ${
          currentStep >= 0 ? "text-white" : "text-gray-500"
        }`}
      >
        <div
          className={`h-6 w-6 rounded-full flex items-center justify-center text-xs ${
            currentStep >= 0
              ? "bg-secondary-500 text-neutral-850"
              : "bg-neutral-750"
          }`}
        >
          1
        </div>
        <span className="ml-2 text-sm">Information</span>
      </div>
      <div
        className={`w-10 h-1 mx-2 ${
          currentStep >= 1 ? "bg-secondary-500" : "bg-neutral-750"
        }`}
      ></div>
      <div
        className={`flex items-center ${
          currentStep >= 1 ? "text-white" : "text-gray-500"
        }`}
      >
        <div
          className={`h-6 w-6 rounded-full flex items-center justify-center text-xs ${
            currentStep >= 1
              ? "bg-secondary-500 text-neutral-850"
              : "bg-neutral-750"
          }`}
        >
          2
        </div>
        <span className="ml-2 text-sm">Verification</span>
      </div>
      <div
        className={`w-10 h-1 mx-2 ${
          currentStep >= 2 ? "bg-secondary-500" : "bg-neutral-750"
        }`}
      ></div>
      <div
        className={`flex items-center ${
          currentStep >= 2 ? "text-white" : "text-gray-500"
        }`}
      >
        <div
          className={`h-6 w-6 rounded-full flex items-center justify-center text-xs ${
            currentStep >= 2
              ? "bg-secondary-500 text-neutral-850"
              : "bg-neutral-750"
          }`}
        >
          3
        </div>
        <span className="ml-2 text-sm">Review</span>
      </div>
    </div>
  );
};

export default StepIndicator;
