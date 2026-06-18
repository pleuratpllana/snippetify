import { Routes, Route } from "react-router-dom";
import "./global.css";

import LandingPage from "./pages/LandingPage";
import RegisterPage from "./Pages/RegisterPage";
import LoginPage from "./Pages/LoginPage";
import ResetPassword from "./pages/ResetPassword";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import SnippetPage from "./pages/SnippetPage.jsx";
import FolderPage from "./pages/FolderPage.jsx";
import FolderSnippetsPage from "./pages/FolderSnippetPage.jsx";
import AskAIPage from "./pages/AskAI.jsx";
import Error404 from "./pages/Error404.jsx";
import AuthCallback from "./pages/AuthCallback.jsx";

import ProtectedRoute from "./components/Auth/AuthProtectedRoute";
import LandingLayout from "./layouts/Landing";
import AuthLayout from "./layouts/Auth";
import AppLayout from "./layouts/Shared";

import { ThemeProvider } from "./context/themeContext";
import { FolderProvider } from "./context/FolderContext";
import { SnippetProvider } from "./context/SnippetContext";
import { SnippetFilterProvider } from "./context/SnippetFilterContext"; // NEW
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <ThemeProvider>
      <SnippetProvider>
        <FolderProvider>
          <Routes>
            {/* Landing / Auth Pages */}
            <Route
              path="/"
              element={
                <LandingLayout>
                  <LandingPage />
                </LandingLayout>
              }
            />
            <Route
              path="/login"
              element={
                <AuthLayout
                  title="Welcome Back"
                  subtitle="Dive back to your vault of snippets"
                >
                  <LoginPage />
                </AuthLayout>
              }
            />
            <Route
              path="/register"
              element={
                <AuthLayout
                  title="Create Your Account"
                  subtitle="Sign up in a few clicks"
                >
                  <RegisterPage />
                </AuthLayout>
              }
            />
            <Route
              path="/forgotpassword"
              element={
                <AuthLayout
                  title="Forgot Password?"
                  subtitle="Let us instruct you how to reset it"
                >
                  <ForgotPassword />
                </AuthLayout>
              }
            />
            <Route
              path="/resetpassword"
              element={
                <AuthLayout
                  title="Reset Password"
                  subtitle="Let us instruct you how to reset it"
                >
                  <ResetPassword />
                </AuthLayout>
              }
            />

            {/* Protected Pages with Snippet Filter Context */}
            <Route
              element={
                <ProtectedRoute>
                  <SnippetFilterProvider>
                    <AppLayout />
                  </SnippetFilterProvider>
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/snippet/:id" element={<SnippetPage />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/folders" element={<FolderPage />} />
              <Route path="/folders/new" element={<FolderPage />} />
              <Route path="/folders/:id" element={<FolderPage />} />
              <Route
                path="/folders/:id/snippets"
                element={<FolderSnippetsPage />}
              />
              <Route path="/ask-ai" element={<AskAIPage />} />
              <Route path="*" element={<Error404 />} />
            </Route>

            {/* OAuth callback */}
            <Route path="/auth/callback" element={<AuthCallback />} />

            {/* 404 for unauthenticated users */}
            <Route path="*" element={<Error404 />} />
          </Routes>

          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </FolderProvider>
      </SnippetProvider>
    </ThemeProvider>
  );
}

export default App;
