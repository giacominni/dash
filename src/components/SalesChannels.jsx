import { currency } from '../utils/format'
import styles from './SalesChannels.module.css'

const CANAL_COLORS = {
  'Balcão':    'var(--gold)',
  'Delivery':  'var(--pink-dark)',
  'Online':    'var(--pink)',
  'Telefone':  'var(--muted)',
}

export default function SalesChannels({ data }) {
  if (!data?.length) return null
  const max = Math.max(...data.map(c => c.value), 1)
  const totalVendas = data.reduce((s, c) => s + c.vendas, 0)

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>Canais de Venda</h3>
      <div className={styles.list}>
        {data.map((c) => {
          const color = CANAL_COLORS[c.label] || 'var(--pink)'
          const pct   = totalVendas > 0 ? ((c.vendas / totalVendas) * 100).toFixed(1) : 0
          return (
            <div key={c.label} className={styles.item}>
              <div className={styles.top}>
                <div className={styles.labelWrap}>
                  <span className={styles.dot} style={{ background: color }} />
                  <span className={styles.label}>{c.label}</span>
                </div>
                <div className={styles.vals}>
                  <span className={styles.pct}>{pct}%</span>
                  <span className={styles.count}>{currency(c.value)}</span>
                </div>
              </div>
              <div className={styles.barBg}>
                <div className={styles.bar}
                  style={{ width: `${(c.value / max) * 100}%`, background: color }} />
              </div>
              <span className={styles.sub}>{c.vendas} vendas</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
