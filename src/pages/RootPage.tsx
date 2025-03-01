import { Outlet } from "react-router-dom";
import Header from "../components/common/Header";
export default function RootPage() {
  return (
    <div className="font-sans">
      <Header />
      <Outlet />
    </div>
  );
}
