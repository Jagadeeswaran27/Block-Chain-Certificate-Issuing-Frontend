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

export default function App() {
  return (
    <AuthContextProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path={AppRoutes.home} element={<RootPage />}>
            <Route index element={<HomePage />} />
            <Route path={AppRoutes.login} element={<LoginPage />} />
            <Route path={AppRoutes.signup} element={<SignupPage />} />
            <Route
              path={AppRoutes.issueCertificate}
              element={<ProtectedRoute element={<IssueCertificatePage />} />}
            />
            <Route
              path={AppRoutes.verifyCertificate}
              element={<VerifyCertificatePage />}
            />
          </Route>
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </AuthContextProvider>
  );
}
