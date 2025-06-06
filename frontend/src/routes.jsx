import { createBrowserRouter, Navigate } from "react-router-dom";
import React from "react";
import GmailTracker from "./pages/EmailTracker";
import MainLayout from "./layouts/MainLayout.jsx";
import Dashboard from "./pages/Dashboard";
import ErrorBoundary from "./components/ErrorBoundary";
import Landing from "./pages/Landing";
import ProtectedRoute from "./components/ProtectedRoute";

// Lazy load other pages
const Applications = React.lazy(() => import("./pages/Application"));
const SkillsTrends = React.lazy(() => import("./pages/SkillsTrends"));
const Roadmaps = React.lazy(() => import("./pages/Roadmap"));
const AIChat = React.lazy(() => import("./pages/AiChat"));
const Profile = React.lazy(() => import("./pages/Profile"));
const Auth = React.lazy(() => import("./pages/Auth"));
const ContentAssistant = React.lazy(() => import("./pages/ContentAssistant"));
// const Settings = React.lazy(() => import("./pages/Settings"));

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/auth",
    element: (
      <React.Suspense fallback={<div>Loading...</div>}>
        <Auth />
      </React.Suspense>
    ),
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/app",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <Navigate to="/app/dashboard" replace />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "gmail-tracker",
        element: (
          <React.Suspense fallback={<div>Loading...</div>}>
            <GmailTracker />
          </React.Suspense>
        ),
      },
      {
        path: "applications",
        element: (
          <React.Suspense fallback={<div>Loading...</div>}>
            <Applications />
          </React.Suspense>
        ),
      },
      {
        path: "skills-trends",
        element: (
          <React.Suspense fallback={<div>Loading...</div>}>
            <SkillsTrends />
          </React.Suspense>
        ),
      },
      {
        path: "roadmaps",
        element: (
          <React.Suspense fallback={<div>Loading...</div>}>
            <Roadmaps />
          </React.Suspense>
        ),
      },
      {
        path: "ai-chat",
        element: (
          <React.Suspense fallback={<div>Loading...</div>}>
            <AIChat />
          </React.Suspense>
        ),
      },
      {
        path: "job-description-helper",
        element: (
          <React.Suspense fallback={<div>Loading...</div>}>
            <ContentAssistant />
          </React.Suspense>
        ),
      },
      {
        path: "profile",
        element: (
          <React.Suspense fallback={<div>Loading...</div>}>
            <Profile />
          </React.Suspense>
        ),
      },
    ],
  },
]);
