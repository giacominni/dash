import { useNavigate } from 'react-router-dom'
import { currency } from '../utils/format'
import styles from './TopClients.module.css'

const OCULTAR = ['moss', 'consumidor final']

export default function TopClients({ data }) {
  const navigate = useNavigate()
  const lista = data.filter(c =>
    !OCULTAR.some(p => c.name.toLowerCase().includes(p))
  )

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>Top Clientes do Mês</h3>
        <span className={styles.link} onClick={() => navigate('/clientes')}>Ver todos →</span>
      </div>
      <ul className={styles.list}>
        {lista.map((c) => (
          <li key={c.rank} className={styles.row}>
            <span className={`${styles.rank} ${c.rank === 1 ? styles.gold : ''}`}>{c.rank}</span>
            <div className={styles.avatar}>{c.initials}</div>
            <div className={styles.info}>
              <p className={styles.name}>{c.name}</p>
              <p className={styles.sub}>{c.sub}</p>
            </div>
            <span className={`${styles.value} ${!c.value ? styles.empty : ''}`}>
              {c.value ? currency(c.value) : '—'}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
