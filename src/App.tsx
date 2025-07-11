import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'
import { PublicLayout } from '@/layouts/public-layout'
import AuthLayout from '@/layouts/auth-layout'
import Home from '@/routes/home'
import { SignInPg } from './routes/sign-in'
import { SignUpPg } from './routes/sign-up'
import ProtectedRoutes from './layouts/protected-routes'
import { MainLayout } from '@/layouts/main-layout';
import { Practice } from './components/practice'
import { Dashboard } from './routes/dashboard'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route index element={<Home />} />
        </Route>

        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/signin" element={<SignInPg />} />
          <Route path="/signup" element={<SignUpPg />} />
        </Route>
        
        {/* Protected Routes */}
        <Route element={<ProtectedRoutes><MainLayout /></ProtectedRoutes>}>
        
        {/*all protected routes */}
        <Route path="/practice" element={<Practice />}>
        
          <Route index element={<Dashboard />} />
        
        </Route>

        </Route>
        
      </Routes>
    </BrowserRouter>
  )
}

export default App