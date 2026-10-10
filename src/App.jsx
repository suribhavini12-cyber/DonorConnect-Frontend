import Main from './pages/Main'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

import Login from './pages/Login'
import Register from './components/Register'
import Home from './pages/Home'
import DonorProfile from './pages/DonorProfile'
import CreateRequest from './pages/CreateRequest'
import MyRequests from './pages/MyRequests'
import RequestDetails from './pages/RequestDetails'
import PotentialMatches from './pages/PotentialMatches'
import AvailableRequests from './pages/AvailableRequests'
import DonorRequestDetails from './pages/DonorRequestDetails'
import MyResponses from './pages/MyResponses'
import AdminDashboard from './pages/AdminDashboard'
import AdminUsers from './pages/AdminUsers'
import AdminRequests from './pages/AdminRequests'
import AdminReports from './pages/AdminReports'
import Chatbot from './pages/Chatbot'

import './App.css'

function DonorOnlyRoute({ children }) {
  const { user } = useAuth()

  if (user?.role !== 'DONOR') {
    return <Navigate to="/home" replace />
  }

  return children
}

function RequesterOnlyRoute({ children }) {
  const { user } = useAuth()

  if (user?.role !== 'REQUESTER') {
    return <Navigate to="/home" replace />
  }

  return children
}

function AdminOnlyRoute({ children }) {
  const { user } = useAuth()

  if (user?.role !== 'ADMIN') {
    return <Navigate to="/home" replace />
  }

  return children
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app-shell">

          <header className="app-header">
            <div className="app-header-inner">
              <div className="brand">
                <div className="brand-icon">🩸</div>

                <div>
                  <div className="brand-name">DonorConnect</div>
                  <div className="brand-tagline">
                    Connecting donors with those in need
                  </div>
                </div>
              </div>
            </div>
          </header>

          <main className="app-main">
            <Routes>

              <Route
                path="/"
                element={<Main />}
              />

              <Route
                path="/login"
                element={<Login />}
              />

              <Route
                path="/register"
                element={<Register />}
              />

              <Route
                path="/home"
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/donor"
                element={
                  <ProtectedRoute>
                    <DonorOnlyRoute>
                      <Home />
                    </DonorOnlyRoute>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/donor/profile"
                element={
                  <ProtectedRoute>
                    <DonorOnlyRoute>
                      <DonorProfile />
                    </DonorOnlyRoute>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/donor/requests"
                element={
                  <ProtectedRoute>
                    <DonorOnlyRoute>
                      <AvailableRequests />
                    </DonorOnlyRoute>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/donor/requests/:id"
                element={
                  <ProtectedRoute>
                    <DonorOnlyRoute>
                      <DonorRequestDetails />
                    </DonorOnlyRoute>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/donor/responses"
                element={
                  <ProtectedRoute>
                    <DonorOnlyRoute>
                      <MyResponses />
                    </DonorOnlyRoute>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/requests/new"
                element={
                  <ProtectedRoute>
                    <RequesterOnlyRoute>
                      <CreateRequest />
                    </RequesterOnlyRoute>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/requests"
                element={
                  <ProtectedRoute>
                    <RequesterOnlyRoute>
                      <MyRequests />
                    </RequesterOnlyRoute>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/requests/my"
                element={
                  <ProtectedRoute>
                    <RequesterOnlyRoute>
                      <MyRequests />
                    </RequesterOnlyRoute>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/requests/:id"
                element={
                  <ProtectedRoute>
                    <RequestDetails />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/requests/:id/matches"
                element={
                  <ProtectedRoute>
                    <RequesterOnlyRoute>
                      <PotentialMatches />
                    </RequesterOnlyRoute>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminOnlyRoute>
                      <AdminDashboard />
                    </AdminOnlyRoute>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute>
                    <AdminOnlyRoute>
                      <AdminUsers />
                    </AdminOnlyRoute>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/requests"
                element={
                  <ProtectedRoute>
                    <AdminOnlyRoute>
                      <AdminRequests />
                    </AdminOnlyRoute>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/reports"
                element={
                  <ProtectedRoute>
                    <AdminOnlyRoute>
                      <AdminReports />
                    </AdminOnlyRoute>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/chat"
                element={
                  <ProtectedRoute>
                    <Chatbot />
                  </ProtectedRoute>
                }
              />

              <Route
                path="*"
                element={<Navigate to="/login" replace />}
              />

            </Routes>
          </main>

        </div>
      </AuthProvider>
    </Router>
  )
}

export default App