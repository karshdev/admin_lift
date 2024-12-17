import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Auth from "../_auth/Auth";
import AnalyticsDashboard from "../pages/dashboard/AnalyticsDashboard";
import CrmDashboard from "../pages/dashboard/CrmDashboard";
import EcommerceDashboard from "../pages/dashboard/EcommerceDashboard";
import LogistickDashboard from "../pages/dashboard/LogistickDashboard";
import InterviewerManagement from "../pages/admin/InterviewerManagement";
import QuestionsManagement from "../pages/admin/QuestionsManagement";
import VideoManagement from "../pages/admin/VideoManagement";


const AppRouter = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true, // Default route when path is `/`
        element: <AnalyticsDashboard />,
      },
      {
        path: "/analytics-dashboad",
        element: <AnalyticsDashboard />,
      },
      {
        path: "/crm-dashboard",
        element: <CrmDashboard />,
      },
      {
        path: "/ecommerce-dashboard",
        element: <EcommerceDashboard />,
      },
      {
        path: "/logistics-dashboard",
        element: <LogistickDashboard />,
      },
      {
        path: "/admin/interviewers",
        element: <InterviewerManagement />,
      },
      {
        path: "/admin/questions",
        element: <QuestionsManagement />,
      },
      {
        path: "/admin/videos",
        element: <VideoManagement />,
      },
      // {
      //   path: "/admin/settings",
      //   element: <Settings />,
      // },
      // {
      //   path: "/admin/logs",
      //   element: <LogsAndAnalytics />,
      // },
    ],
  },
  {
    path: "/auth",
    element: <Auth />,
  },
  {
    path: "*",
    element: <div>404</div>,
  },
]);

export default AppRouter;
