import { useContext, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Routes } from "../../utils/Routes";
import { AuthContext } from "../../store/context/AuthContext";
import { logout } from "../../core/services/AuthService";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(Routes.home);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-white sticky top-0 left-0 z-10 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and brand name */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="h-8 w-8 bg-primary-500 rounded flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-white"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="ml-2 text-xl font-bold text-primary-700">
                CertChain
              </span>
            </div>

            {/* Navigation links - desktop */}
            <nav className="hidden md:ml-8 md:flex md:space-x-8">
              <NavLink
                to={Routes.home}
                className={({ isActive }) =>
                  isActive
                    ? "text-primary-500 border-primary-500 font-medium border-b-2 px-1 pt-1 text-sm"
                    : "text-neutral-750 hover:text-primary-500 px-1 pt-1 text-sm font-medium"
                }
              >
                Home
              </NavLink>
              <NavLink
                to={Routes.issueCertificate || "#"}
                className={({ isActive }) =>
                  isActive
                    ? "text-primary-500 border-primary-500 font-medium border-b-2 px-1 pt-1 text-sm"
                    : "text-neutral-750 hover:text-primary-500 px-1 pt-1 text-sm font-medium"
                }
              >
                Issue Certificate
              </NavLink>
              <NavLink
                to={Routes.verifyCertificate || "#"}
                className={({ isActive }) =>
                  isActive
                    ? "text-primary-500 border-primary-500 font-medium border-b-2 px-1 pt-1 text-sm"
                    : "text-neutral-750 hover:text-primary-500 px-1 pt-1 text-sm font-medium"
                }
              >
                Verify Certificate
              </NavLink>
            </nav>
          </div>

          {/* Auth buttons - desktop */}
          {!user ? (
            <div className="hidden md:flex items-center">
              <Link
                to={Routes.login}
                className="px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-800"
              >
                Log in
              </Link>
              <Link
                to={Routes.signup}
                className="ml-4 px-4 py-2 text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 rounded-md shadow-sm"
              >
                Sign up
              </Link>
            </div>
          ) : (
            <div className="hidden md:flex items-center space-x-4">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-primary-500 rounded-full flex items-center justify-center text-white font-medium">
                  {user.userName.charAt(0).toUpperCase()}
                </div>
                <span className="ml-2 text-sm font-medium text-neutral-800">
                  {user.userName}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-md shadow-sm"
              >
                Logout
              </button>
            </div>
          )}

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-neutral-750 hover:text-primary-500 hover:bg-gray-100"
            >
              <span className="sr-only">Open main menu</span>
              {/* Icon when menu is closed */}
              <svg
                className={`${isMobileMenuOpen ? "hidden" : "block"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              {/* Icon when menu is open */}
              <svg
                className={`${isMobileMenuOpen ? "block" : "hidden"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
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
        </div>

        {/* Mobile menu */}
        <div
          className={`
            fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-20 md:hidden
            ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          <div className="pt-2 pb-3 space-y-1">
            <div className="p-2">
              <div className="flex-shrink-0 flex items-center">
                <div className="h-8 w-8 bg-primary-500 rounded flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-white"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="ml-2 text-xl font-bold text-primary-700">
                  CertChain
                </span>
              </div>
            </div>
            <NavLink
              to={Routes.home}
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) =>
                isActive
                  ? "bg-primary-50 border-primary-500 text-primary-500 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                  : "border-transparent text-neutral-750 hover:bg-gray-50 hover:border-primary-300 hover:text-primary-500 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
              }
            >
              Home
            </NavLink>
            <NavLink
              onClick={() => setIsMobileMenuOpen(false)}
              to={Routes.issueCertificate || "#"}
              className={({ isActive }) =>
                isActive
                  ? "bg-primary-50 border-primary-500 text-primary-500 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                  : "border-transparent text-neutral-750 hover:bg-gray-50 hover:border-primary-300 hover:text-primary-500 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
              }
            >
              Issue Certificate
            </NavLink>
            <NavLink
              onClick={() => setIsMobileMenuOpen(false)}
              to={Routes.verifyCertificate || "#"}
              className={({ isActive }) =>
                isActive
                  ? "bg-primary-50 border-primary-500 text-primary-500 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                  : "border-transparent text-neutral-750 hover:bg-gray-50 hover:border-primary-300 hover:text-primary-500 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
              }
            >
              Verify Certificate
            </NavLink>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center px-4">
              {!user ? (
                <>
                  <div className="flex-shrink-0">
                    <Link
                      to={Routes.login}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="ml-auto px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-800"
                    >
                      Log in
                    </Link>
                  </div>
                  <div className="ml-3">
                    <Link
                      to={Routes.signup}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="px-4 py-2 text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 rounded-md shadow-sm"
                    >
                      Sign up
                    </Link>
                  </div>
                </>
              ) : (
                <div className="w-full">
                  <div className="flex items-center mb-3">
                    <div className="h-8 w-8 bg-primary-500 rounded-full flex items-center justify-center text-white font-medium">
                      {user.userName.charAt(0).toUpperCase()}
                    </div>
                    <span className="ml-2 text-sm font-medium text-neutral-800">
                      {user.userName}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-md shadow-sm"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Overlay when menu is open */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-25 z-10 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
        )}
      </div>
    </header>
  );
}
