import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import UploadForm from "./components/UploadForm";
import LandingPage from "./pages/LandingPage";
import LoginModal from "./components/LoginModal";
import SearchPage from "./pages/SearchPage";
import AdminPage from "./pages/AdminPage";
import ManagePapers from "./pages/ManagePapers";
import FavouritesPage from "./pages/FavouritesPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import RequestPaperPage from "./pages/RequestPaperPage";
import AdminRequestsPage from "./pages/AdminRequestsPage";
import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./components/AdminRoute";

function App() {
  return (
    <AuthProvider>
      <Router>
        <LoginModal />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route
            path="/favourites"
            element={
              <PrivateRoute>
                <FavouritesPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/request-paper"
            element={
              <PrivateRoute>
                <RequestPaperPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminPage />
              </AdminRoute>
            }
          />
          <Route
            path="/upload"
            element={
              <AdminRoute>
                <UploadForm />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/analytics"
            element={
              <AdminRoute>
                <AnalyticsPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/manage"
            element={
              <AdminRoute>
                <ManagePapers />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/requests"
            element={
              <AdminRoute>
                <AdminRequestsPage />
              </AdminRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
