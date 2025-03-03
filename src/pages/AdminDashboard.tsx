import { useEffect, useState } from "react";
import {
  fetchPendingApplications,
  fetchRejectedApplications,
  fetchApprovedApplications,
  approveApplication,
  rejectApplication,
} from "../core/services/AdminService";
import { IssuerApplicationWithStatus } from "../types/Issuer";
import ApplicationCard from "../components/admin/ApplicationCard";
import EmptyState from "../components/admin/EmptyState";
import { AdminDashboardTabs } from "../types/Admin";
import { showToast } from "../utils/Toast";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<AdminDashboardTabs>("pending");
  const [pendingApplications, setPendingApplications] = useState<
    IssuerApplicationWithStatus[]
  >([]);
  const [approvedApplications, setApprovedApplications] = useState<
    IssuerApplicationWithStatus[]
  >([]);
  const [rejectedApplications, setRejectedApplications] = useState<
    IssuerApplicationWithStatus[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isApproveLoading, setIsApproveLoading] = useState(false);
  const [isRejectLoading, setIsRejectLoading] = useState(false);

  useEffect(() => {
    const loadApplications = async () => {
      setIsLoading(true);
      try {
        const [pending, approved, rejected] = await Promise.all([
          fetchPendingApplications(),
          fetchApprovedApplications(),
          fetchRejectedApplications(),
        ]);

        setPendingApplications(pending);
        setApprovedApplications(approved);
        setRejectedApplications(rejected);
      } catch (error) {
        console.error("Error loading applications:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadApplications();
  }, []);

  const handleApproveApplication = async (aid: string, uid: string) => {
    setIsApproveLoading(true);
    const response = await approveApplication(aid, uid);
    if (response) {
      const toBeApproved = pendingApplications.find((app) => app.aid === aid);
      const newPending = pendingApplications.filter((app) => app.aid !== aid);
      setPendingApplications(newPending);
      setApprovedApplications([...approvedApplications, toBeApproved!]);
      showToast({ type: "success", message: "Application approved" });
    } else {
      showToast({ type: "error", message: "Error approving application" });
    }
    setIsApproveLoading(false);
  };
  const handleRejectApplication = async (aid: string) => {
    setIsRejectLoading(true);
    const response = await rejectApplication(aid);
    if (response) {
      const toBeRejected = pendingApplications.find((app) => app.aid === aid);
      const newPending = pendingApplications.filter((app) => app.aid !== aid);
      setPendingApplications(newPending);
      setRejectedApplications([...rejectedApplications, toBeRejected!]);
      showToast({ type: "success", message: "Application rejected" });
    } else {
      showToast({ type: "error", message: "Error rejecting application" });
    }
    setIsRejectLoading(false);
  };

  const getActiveApplications = () => {
    switch (activeTab) {
      case "pending":
        return pendingApplications;
      case "approved":
        return approvedApplications;
      case "rejected":
        return rejectedApplications;
      default:
        return [];
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-750 to-neutral-850 text-white">
      {/* Background pattern & header */}
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

      <div className="w-[90%] mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20">
        <div className="relative mb-8">
          <h1 className="font-heading text-4xl md:text-5xl mt-6 mb-2 text-white">
            Admin Dashboard
          </h1>
          <p className="text-gray-300 text-lg max-w-3xl">
            Manage and review issuer applications. Approve or reject
            verification requests.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-neutral-850/80 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden border border-primary-900/30 mb-8">
          <div className="border-b border-primary-900/30">
            <nav className="flex -mb-px">
              <button
                className={`py-4 px-6 font-medium text-sm sm:text-base flex items-center ${
                  activeTab === "pending"
                    ? "border-b-2 border-secondary-500 text-secondary-500"
                    : "text-gray-400 hover:text-gray-300"
                }`}
                onClick={() => setActiveTab("pending")}
              >
                <div
                  className={`mr-2 w-3 h-3 rounded-full bg-amber-500 ${
                    pendingApplications.length > 0 ? "animate-pulse" : ""
                  }`}
                ></div>
                Pending
                <span className="ml-2 bg-amber-500/20 text-amber-400 text-xs font-medium px-2 py-0.5 rounded">
                  {pendingApplications.length}
                </span>
              </button>

              <button
                className={`py-4 px-6 font-medium text-sm sm:text-base flex items-center ${
                  activeTab === "approved"
                    ? "border-b-2 border-secondary-500 text-secondary-500"
                    : "text-gray-400 hover:text-gray-300"
                }`}
                onClick={() => setActiveTab("approved")}
              >
                <div className="mr-2 w-3 h-3 rounded-full bg-green-500"></div>
                Approved
                <span className="ml-2 bg-green-500/20 text-green-400 text-xs font-medium px-2 py-0.5 rounded">
                  {approvedApplications.length}
                </span>
              </button>

              <button
                className={`py-4 px-6 font-medium text-sm sm:text-base flex items-center ${
                  activeTab === "rejected"
                    ? "border-b-2 border-secondary-500 text-secondary-500"
                    : "text-gray-400 hover:text-gray-300"
                }`}
                onClick={() => setActiveTab("rejected")}
              >
                <div className="mr-2 w-3 h-3 rounded-full bg-red-500"></div>
                Rejected
                <span className="ml-2 bg-red-500/20 text-red-400 text-xs font-medium px-2 py-0.5 rounded">
                  {rejectedApplications.length}
                </span>
              </button>
            </nav>
          </div>

          {/* Content Area */}
          <div className="p-6">
            {isLoading ? (
              <div className="flex justify-center items-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
              </div>
            ) : (
              <div>
                {getActiveApplications().length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {getActiveApplications().map((application) => (
                      <ApplicationCard
                        isApproveLoading={isApproveLoading}
                        isRejectLoading={isRejectLoading}
                        key={application.aid}
                        application={application}
                        status={activeTab}
                        approveApplication={handleApproveApplication}
                        rejectApplication={handleRejectApplication}
                      />
                    ))}
                  </div>
                ) : (
                  <EmptyState status={activeTab} />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
