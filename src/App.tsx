import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthProvider'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Register from './pages/Register'
import DriverLayout from './pages/driver/DriverLayout'
import Dashboard from './pages/driver/Dashboard'
import SearchParkingPage from './pages/driver/SearchParkingPage'
import LocationSlotsPage from './pages/driver/LocationSlotsPage'
import MyBookingsPage from './pages/driver/MyBookingsPage'
import AdminLayout from './pages/admin/AdminLayout'
import ManagersPage from './pages/admin/ManagersPage'
import LocationsPage from './pages/admin/LocationsPage'
import ManagerLayout from './pages/manager/ManagerLayout'
import MyLocationsPage from './pages/manager/MyLocationsPage'
import LocationDetailPage from './pages/manager/LocationDetailPage'
import FloorDetailPage from './pages/manager/FloorDetailPage'
import NotFound from './pages/NotFound'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#111729',
              color: '#e2e8f0',
              border: '1px solid #263049',
            },
            success: { iconTheme: { primary: '#3b6bff', secondary: '#111729' } },
            error: { iconTheme: { primary: '#f43f5e', secondary: '#111729' } },
          }}
        />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedRoute allowedRoles={['USER']} />}>
            <Route path="/" element={<DriverLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="search" element={<SearchParkingPage />} />
              <Route path="locations/:locationId" element={<LocationSlotsPage />} />
              <Route path="bookings" element={<MyBookingsPage />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['SUPER_ADMIN']} />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="managers" replace />} />
              <Route path="managers" element={<ManagersPage />} />
              <Route path="locations" element={<LocationsPage />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['PARKING_MANAGER']} />}>
            <Route path="/manager" element={<ManagerLayout />}>
              <Route index element={<MyLocationsPage />} />
              <Route path="locations/:locationId" element={<LocationDetailPage />} />
              <Route path="floors/:floorId" element={<FloorDetailPage />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
