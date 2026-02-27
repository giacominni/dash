import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import styles from './Login.module.css'

export default function Login() {
  const { login } = useAuth()
  const navigate  = useNavigate()
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) return
    setLoading(true)
    setError('')
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err) {
      setError(getErrorMessage(err.code))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      {/* Painel esquerdo decorativo */}
      <div className={styles.left}>
        <div className={styles.leftInner}>
          <div className={styles.brand}>
            <p className={styles.brandEyebrow}>Painel de Gestão</p>
            <h1 className={styles.brandName}>Use Mais<br />Soluções</h1>
            <p className={styles.brandSub}>até VM</p>
          </div>
          <div className={styles.decoration}>
            <div className={styles.circle1} />
            <div className={styles.circle2} />
            <div className={styles.circle3} />
          </div>
          <p className={styles.leftFooter}>
            Dados em tempo real · Gestão inteligente
          </p>
        </div>
      </div>

      {/* Painel direito — formulário */}
      <div className={styles.right}>
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.formHeader}>
            <h2 className={styles.formTitle}>Bem-vinda de volta</h2>
            <p className={styles.formSub}>Entre com sua conta para acessar o painel</p>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>E-mail</label>
            <input
              type="email"
              className={styles.input}
              placeholder="seu@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Senha</label>
            <input
              type="password"
              className={styles.input}
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          {error && (
            <div className={styles.error}>{error}</div>
          )}

          <button
            type="submit"
            className={styles.btn}
            disabled={loading}
          >
            {loading ? <span className={styles.btnSpinner} /> : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}

function getErrorMessage(code) {
  switch (code) {
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'E-mail ou senha incorretos.'
    case 'auth/too-many-requests':
      return 'Muitas tentativas. Tente novamente mais tarde.'
    case 'auth/user-disabled':
      return 'Esta conta foi desativada.'
    default:
      return 'Erro ao entrar. Tente novamente.'
  }
}
