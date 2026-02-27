import { NavLink } from 'react-router-dom'
import { LayoutDashboard, DollarSign, Users, ShoppingBag, LogOut } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import styles from './Sidebar.module.css'

const NAV = [
  { to: '/dashboard',   icon: LayoutDashboard, label: 'Dashboard'   },
  { to: '/faturamento', icon: DollarSign,      label: 'Faturamento' },
  { to: '/clientes',    icon: Users,           label: 'Clientes'    },
  { to: '/produtos',    icon: ShoppingBag,     label: 'Produtos'    },
]

export default function Sidebar() {
  const { user, logout } = useAuth()

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <p className={styles.logoEyebrow}>Painel de Gestão</p>
        <h1 className={styles.logoText}>Sul Mídia<br />Software</h1>
        <p className={styles.logoSub}>até VM</p>
      </div>
      <nav className={styles.nav}>
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to}
            className={({ isActive }) => `${styles.item} ${isActive ? styles.active : ''}`}>
            <Icon size={16} className={styles.icon} />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className={styles.user}>
        <div className={styles.avatar}>
          {user?.email?.substring(0,2).toUpperCase() ?? 'VM'}
        </div>
        <div className={styles.userInfo}>
          <p className={styles.userName}>{user?.email ?? 'Usuário'}</p>
          <p className={styles.userRole}>Administrador</p>
        </div>
        <button className={styles.logoutBtn} onClick={logout} title="Sair">
          <LogOut size={14} />
        </button>
      </div>
    </aside>
  )
}
