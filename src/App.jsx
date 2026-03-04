import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { useAuth } from './contexts/AuthContext'
import PrivateRoute   from './components/PrivateRoute'
import Sidebar        from './components/Sidebar'
import Login          from './pages/Login/Login'
import Dashboard      from './pages/Dashboard/Dashboard'
import Faturamento    from './pages/Faturamento/Faturamento'
import Clientes       from './pages/Clientes/Clientes'
import Produtos       from './pages/Produtos/Produtos'
import './styles/global.css'
import styles from './App.module.css'

// Rota que bloqueia usuários sem role admin
function AdminRoute({ children }) {
  const { isAdmin, loading } = useAuth()
  if (loading) return null
  return isAdmin ? children : <Navigate to="/clientes" replace />
}

function AppLayout() {
  const { isAniversariantes } = useAuth()
  return (
    <div className={styles.layout}>
      <Sidebar />
      <main className={styles.main}>
        <Routes>
          <Route path="/" element={
            <Navigate to={isAniversariantes ? '/clientes' : '/dashboard'} replace />
          } />
          <Route path="/dashboard" element={
            <AdminRoute><Dashboard /></AdminRoute>
          } />
          <Route path="/faturamento" element={
            <AdminRoute><Faturamento /></AdminRoute>
          } />
          <Route path="/clientes"    element={<Clientes />} />
          <Route path="/produtos"    element={
            <AdminRoute><Produtos /></AdminRoute>
          } />
          <Route path="*" element={
            <Navigate to={isAniversariantes ? '/clientes' : '/dashboard'} replace />
          } />
        </Routes>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={
            <PrivateRoute>
              <AppLayout />
            </PrivateRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
