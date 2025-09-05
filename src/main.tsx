import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router";
import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";
import SearchPage from "./pages/SearchPage";
import CreateLocationPage from "./pages/LocationCreationPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { AuthContextProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import ContactPage from "./pages/ContactPage";
import AboutPage from "./pages/AboutPage";
import OneLocationDetailPage from "./pages/OneLocationDetailPage";
import MyLocationsPage from "./pages/MyLocationsPage";
import EventCreationPage from "./pages/EventCreationPage";
import EditProfile from "./pages/EditProfile";
import EventSearchPage from "./pages/EventSearchPage";
import MyEventsPage from "./pages/MyEventsPage";
import OneEventDetailPage from "./pages/OneEventDetailePage";
import FavoritesPage from "./pages/FavoritesPage";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthContextProvider>
        <Routes>
          <Route path="" element={<MainLayout />}>
            <Route path="/" index element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/registration" element={<RegisterPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route
              path="/location/:locationId"
              element={<OneLocationDetailPage />}
            />
            <Route
              path="/create"
              element={
                <ProtectedRoute>
                  <CreateLocationPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/editprofile"
              element={
                <ProtectedRoute>
                  <EditProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/favorites"
              element={
                <ProtectedRoute>
                  <FavoritesPage />
                </ProtectedRoute>
              }
            />

            <Route path="/contact" element={<ContactPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route
              path="/my-locations"
              element={
                <ProtectedRoute>
                  <MyLocationsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/event-creation"
              element={
                <ProtectedRoute>
                  <EventCreationPage />
                </ProtectedRoute>
              }
            />
            <Route path="/eventSearch" element={<EventSearchPage />} />
            <Route
              path="/my-events"
              element={
                <ProtectedRoute>
                  <MyEventsPage />
                </ProtectedRoute>
              }
            />
            <Route path="/event/:eventId" element={<OneEventDetailPage />} />
          </Route>
        </Routes>
      </AuthContextProvider>
    </BrowserRouter>
  </StrictMode>
);
