import React from "react";
import BottomNav from "./bottom-nav-bar";
import { Outlet } from "react-router-dom";
import { useAuth } from "../context/auth-context";
import IncopmpleteProfileAlert from "./incomplete-profile-alert";

const Layout: React.FC = () => {
  const { userProfile } = useAuth();
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="pb-20">
        {!userProfile?.user_exist && <IncopmpleteProfileAlert />}
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
};

export default Layout;
