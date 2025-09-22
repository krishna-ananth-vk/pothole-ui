import { createBrowserRouter, Navigate } from "react-router-dom";
import Layout from "../components/layout";
import Dashboard from "../pages/dashboard";
import Login from "../pages/login";
import ProtectedRoute from "../components/protected-route";
import Leaderboard from "../pages/leaderboard";
import Profile from "../pages/profile";
import Capture from "../pages/capture";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { path: "dashboard", element: <Dashboard /> },
      { path: "leaderboard", element: <Leaderboard /> },
      { path: "profile", element: <Profile /> },
      { path: "capture", element: <Capture /> },
    ],
  },
  { path: "/login", element: <Login /> },
]);

export default router;
