import { AdminDashboardTabs } from "../../types/Admin";
import { IssuerApplicationWithStatus } from "../../types/Issuer";

interface ApplicationCardProps {
  application: IssuerApplicationWithStatus;
  status: AdminDashboardTabs;
  approveApplication: (aid: string, uid: string) => void;
  rejectApplication: (aid: string) => void;
  isApproveLoading: boolean;
  isRejectLoading: boolean;
}

const ApplicationCard = ({
  application,
  status,
  approveApplication,
  rejectApplication,
  isApproveLoading,
  isRejectLoading,
}: ApplicationCardProps) => {
  const getStatusBadge = () => {
    switch (status) {
      case "pending":
        return (
          <span className="bg-amber-500/20 text-amber-400 text-xs font-medium px-2 py-1 rounded-full">
            Pending Review
          </span>
        );
      case "approved":
        return (
          <span className="bg-green-500/20 text-green-400 text-xs font-medium px-2 py-1 rounded-full">
            Approved
          </span>
        );
      case "rejected":
        return (
          <span className="bg-red-500/20 text-red-400 text-xs font-medium px-2 py-1 rounded-full">
            Rejected
          </span>
        );
    }
  };

  return (
    <div className="bg-neutral-750/50 border border-primary-900/30 rounded-lg overflow-hidden hover:shadow-md transition-all hover:border-primary-800/50">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="font-bold text-lg text-white">
            {application.organizationName}
          </h3>
          {getStatusBadge()}
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex items-center text-gray-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 text-primary-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                clipRule="evenodd"
              />
            </svg>
            <span>{application.location}</span>
          </div>

          <div className="flex items-center text-gray-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 text-primary-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
            </svg>
            <span>{application.phoneNumber}</span>
          </div>

          {application.website && (
            <div className="flex items-center text-gray-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-primary-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
                  clipRule="evenodd"
                />
              </svg>
              <a
                href={
                  application.website.startsWith("http")
                    ? application.website
                    : `https://${application.website}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-400 hover:text-primary-300 truncate"
              >
                {application.website}
              </a>
            </div>
          )}
        </div>

        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
          <a
            href={application.govtDocument}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-4 py-2 border border-primary-600 rounded-md text-sm font-medium text-primary-400 bg-transparent hover:bg-primary-900/30"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2"
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
            View Doc
          </a>

          {status === "pending" && (
            <>
              <button
                disabled={isApproveLoading || isRejectLoading}
                onClick={() =>
                  approveApplication(application.aid, application.uid)
                }
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-neutral-850 bg-green-500 hover:bg-green-600"
              >
                {isApproveLoading ? "Approving..." : "Approve"}
              </button>

              <button
                disabled={isApproveLoading || isRejectLoading}
                onClick={() => rejectApplication(application.aid)}
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
              >
                {isRejectLoading ? "Rejecting..." : "Reject"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationCard;
