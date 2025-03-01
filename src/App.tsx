import { BrowserRouter, Route, Routes } from "react-router-dom";
import RootPage from "./pages/RootPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import { Routes as AppRoutes } from "./utils/Routes";
import IssueCertificatePage from "./pages/IssueCertificatePage";
import VerifyCertificatePage from "./pages/VerifyCertificatePage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={AppRoutes.home} element={<RootPage />}>
          <Route index element={<HomePage />} />
          <Route path={AppRoutes.login} element={<LoginPage />} />
          <Route path={AppRoutes.signup} element={<SignupPage />} />
          <Route
            path={AppRoutes.issueCertificate}
            element={<IssueCertificatePage />}
          />
          <Route
            path={AppRoutes.verifyCertificate}
            element={<VerifyCertificatePage />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
