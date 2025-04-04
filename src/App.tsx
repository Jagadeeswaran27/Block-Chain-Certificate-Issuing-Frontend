import { BrowserRouter, Route, Routes } from "react-router-dom";
import RootPage from "./pages/RootPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import "react-toastify/dist/ReactToastify.css";
import SignupPage from "./pages/SignupPage";
import { Routes as AppRoutes } from "./utils/Routes";
import IssueCertificatePage from "./pages/IssueCertificatePage";
import VerifyCertificatePage from "./pages/VerifyCertificatePage";
import AuthContextProvider from "./store/context/AuthContext";
import ProtectedRoute from "./store/protection/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import ScrollToTop from "./components/common/ScrollToTop";
import AdminProtection from "./store/protection/AdminProtection";
import AdminDashboard from "./pages/AdminDashboard";
import AuthRedirect from "./store/protection/AuthRedirect";
import ScanToVerifyPage from "./pages/ScanToVerifyPage";
import IssuedCertificatesPage from "./pages/IssuedCertificatesPage";

export default function App() {
  return (
    <AuthContextProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path={AppRoutes.home} element={<RootPage />}>
            <Route index element={<HomePage />} />
            <Route
              path={AppRoutes.login}
              element={<AuthRedirect element={<LoginPage />} />}
            />
            <Route
              path={AppRoutes.signup}
              element={<AuthRedirect element={<SignupPage />} />}
            />
            <Route
              path={AppRoutes.issueCertificate}
              element={<ProtectedRoute element={<IssueCertificatePage />} />}
            />
            <Route
              path={AppRoutes.verifyCertificate}
              element={<VerifyCertificatePage />}
            />
            <Route
              path={AppRoutes.adminDashboard}
              element={<AdminProtection element={<AdminDashboard />} />}
            />
            <Route
              path={AppRoutes.scanToVerify}
              element={<ScanToVerifyPage />}
            />
            <Route
              path="/issued-certificates"
              element={<ProtectedRoute element={<IssuedCertificatesPage />} />}
            />
          </Route>
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </AuthContextProvider>
  );
}
