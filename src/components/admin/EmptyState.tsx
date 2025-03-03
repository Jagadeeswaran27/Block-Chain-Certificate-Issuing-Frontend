const EmptyState = ({
  status,
}: {
  status: "pending" | "approved" | "rejected";
}) => {
  const getMessage = () => {
    switch (status) {
      case "pending":
        return "No pending applications";
      case "approved":
        return "No approved applications";
      case "rejected":
        return "No rejected applications";
    }
  };

  return (
    <div className="text-center py-16">
      <div className="mx-auto h-16 w-16 bg-neutral-800/50 rounded-full flex items-center justify-center mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8 text-gray-500"
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
      <h3 className="text-lg font-medium text-white">{getMessage()}</h3>
      <p className="mt-1 text-gray-400">
        {status === "pending"
          ? "When users apply to become issuers, their applications will appear here."
          : status === "approved"
          ? "Approved applications will be listed here."
          : "Rejected applications will be listed here."}
      </p>
    </div>
  );
};

export default EmptyState;
