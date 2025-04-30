import { createBrowserRouter } from "react-router-dom";
import MainLayout from "./layouts/MainLayout.jsx";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import React from "react";
import GmailTracker from "./pages/GmailTracker/GmailTracker.jsx";

// Lazy load other pages
const Applications = React.lazy(() =>
  import("./pages/Applications/Applications.jsx")
);
const SkillsTrends = React.lazy(() =>
  import("./pages/SkillsTrends/SkillsTrends.jsx")
);
const Roadmaps = React.lazy(() => import("./pages/Roadmaps/Roadmaps.jsx"));
const AIChat = React.lazy(() => import("./pages/AIChat/AIChat.jsx"));
const Settings = React.lazy(() => import("./pages/Settings/Settings.jsx"));

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
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
        path: "settings",
        element: (
          <React.Suspense fallback={<div>Loading...</div>}>
            <Settings />
          </React.Suspense>
        ),
      },
    ],
  },
]);
