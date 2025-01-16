import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CommuneMembershipProvider } from "./context/CommuneMembershipContext";
import ProtectedRoute from "./utils/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Create from "./pages/Create";
import EditProfile from "./pages/EditProfile";
import EditCommune from "./pages/EditCommune";
import ViewCommune from "./pages/ViewCommune";
import AllCommunes from "./pages/AllCommunes";
import UserCommunes from "./pages/UserCommunes";

// Posts
import CreatePostPage from "./pages/CreatePostPage";
import CommunePostsPage from "./pages/CommunePostsPage";
import EditPostsPage from "./pages/EditPostsPage";
import ViewPostPage from "./pages/ViewPostPage";

// Lists
import DynamicListingForm from "./pages/DynamicListingForm";
import CommuneListsPage from "./pages/CommuneListsPage";
import ViewListPage from "./pages/ViewListPage";

// Events
import CreateEvent from "./pages/CreateEvent";
import CommuneEventsPage from "./pages/CommuneEventsPage";
import EditEventPage from "./pages/EditEventPage";

// Utils
import RedirectIfAuthenticated from "./utils/RedirectIfAuthenticated";
import AdminModeratorProtected from "./utils/AdminModeratorProtected";

const App = () => (
  <AuthProvider>
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/profile/:username" element={<Profile />} />

        {/* Commune Routes (Wrapped with CommuneMembershipProvider) */}
        <Route
          path="/commune/*"
          element={
            <CommuneMembershipProvider>
              <Routes>
                <Route path=":communeid" element={<ViewCommune />} />
                <Route path="" element={<AllCommunes />} />
                <Route path=":communeid/posts" element={<CommunePostsPage />} />
                <Route path=":communeid/lists" element={<CommuneListsPage />} />
                <Route
                  path=":communeid/events"
                  element={<CommuneEventsPage />}
                />
                <Route
                  path="create/:communeid/post"
                  element={
                    <ProtectedRoute>
                      <CreatePostPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="create/:communeid/list"
                  element={
                    <ProtectedRoute>
                      <DynamicListingForm />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/create/:communeid/event"
                  element={
                    <ProtectedRoute>
                      <AdminModeratorProtected>
                        <CreateEvent />
                      </AdminModeratorProtected>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="edit/:communeid/:postid/post"
                  element={
                    <ProtectedRoute>
                      <EditPostsPage />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="edit/:communeid/:eventid/event"
                  element={
                    <ProtectedRoute>
                      <EditEventPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/:communeid/post/:postid"
                  element={<ViewPostPage />}
                />

                <Route
                  path="/:communeid/list/:listid"
                  element={<ViewListPage />}
                />
              </Routes>
            </CommuneMembershipProvider>
          }
        />

        {/* Auth Routes */}
        <Route
          path="/login"
          element={
            <RedirectIfAuthenticated>
              <Login />
            </RedirectIfAuthenticated>
          }
        />
        <Route
          path="/register"
          element={
            <RedirectIfAuthenticated>
              <Register />
            </RedirectIfAuthenticated>
          }
        />

        {/* User Routes */}
        <Route
          path="/usercommunes"
          element={
            <ProtectedRoute>
              <UserCommunes />
            </ProtectedRoute>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/editprofile"
          element={
            <ProtectedRoute>
              <EditProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/createcommune"
          element={
            <ProtectedRoute>
              <Create />
            </ProtectedRoute>
          }
        />
        <Route
          path="/editcommune/:communeid"
          element={
            <ProtectedRoute>
              <EditCommune />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  </AuthProvider>
);

export default App;
