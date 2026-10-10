import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

import ContractorDashboard from "./pages/ContractorDashboard";
import WriterDashboard from "./pages/WriterDashboard";
import AdminDashboard from "./pages/AdminDashboard";

import CreateTender from "./pages/CreateTender";
import MyTenders from "./pages/MyTenders";
import BrowseTenders from "./pages/BrowseTenders";
import TenderDetails from "./pages/TenderDetails";
import WriterProfile from "./pages/WriterProfile";
import RecommendedWriters from "./pages/RecommendedWriters";
import Applications from "./pages/Applications";
import AIAssistant from "./pages/AIAssistant";
import Messages from "./pages/Messages";
import Reviews from "./pages/Reviews";
import Settings from "./pages/Settings";

import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";

import NotFound from "./pages/NotFound";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["contractor"]}>
              <DashboardLayout>
                <ContractorDashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/create-tender"
          element={
            <ProtectedRoute allowedRoles={["contractor"]}>
              <DashboardLayout>
                <CreateTender />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-tenders"
          element={
            <ProtectedRoute allowedRoles={["contractor"]}>
              <DashboardLayout>
                <MyTenders />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/tenders/:id/writers"
          element={
            <ProtectedRoute allowedRoles={["contractor"]}>
              <DashboardLayout>
                <RecommendedWriters />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/writer-dashboard"
          element={
            <ProtectedRoute allowedRoles={["writer"]}>
              <DashboardLayout>
                <WriterDashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/writer-profile"
          element={
            <ProtectedRoute allowedRoles={["writer"]}>
              <DashboardLayout>
                <WriterProfile />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/writer/:id"
          element={
            <ProtectedRoute
              allowedRoles={["contractor", "writer", "admin"]}
            >
              <DashboardLayout>
                <WriterProfile />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/browse-tenders"
          element={
            <ProtectedRoute allowedRoles={["writer"]}>
              <DashboardLayout>
                <BrowseTenders />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/tenders/:id"
          element={
            <ProtectedRoute
              allowedRoles={["writer", "contractor"]}
            >
              <DashboardLayout>
                <TenderDetails />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/applications"
          element={
            <ProtectedRoute
              allowedRoles={["writer", "contractor"]}
            >
              <DashboardLayout>
                <Applications />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/ai-assistant"
          element={
            <ProtectedRoute
              allowedRoles={["contractor", "writer", "admin"]}
            >
              <DashboardLayout>
                <AIAssistant />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/messages"
          element={
            <ProtectedRoute
              allowedRoles={["contractor", "writer", "admin"]}
            >
              <DashboardLayout>
                <Messages />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/messages/:userId"
          element={
            <ProtectedRoute
              allowedRoles={["contractor", "writer", "admin"]}
            >
              <DashboardLayout>
                <Messages />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute
              allowedRoles={["contractor", "writer", "admin"]}
            >
              <DashboardLayout>
                <Settings />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/reviews"
          element={
            <ProtectedRoute
              allowedRoles={["contractor", "writer", "admin"]}
            >
              <DashboardLayout>
                <Reviews />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <DashboardLayout>
                <AdminDashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;