import { createBrowserRouter } from "react-router-dom";
import React from "react";
import GmailTracker from "./pages/EmailTracker";
import MainLayout from "./layouts/MainLayout.jsx";
import Dashboard from "./pages/Dashboard";
import ErrorBoundary from "./components/ErrorBoundary";
import Landing from "./pages/Landing";

// Lazy load other pages
const Applications = React.lazy(() => import("./pages/Application"));
const SkillsTrends = React.lazy(() => import("./pages/SkillsTrends"));
const Roadmaps = React.lazy(() => import("./pages/Roadmap"));
const AIChat = React.lazy(() => import("./pages/AiChat"));
const Profile = React.lazy(() => import("./pages/Profile"));
// const Settings = React.lazy(() => import("./pages/Settings"));

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/app",
    element: <MainLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
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
