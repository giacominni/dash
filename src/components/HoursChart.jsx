import {
  ResponsiveContainer, BarChart, Bar,
  XAxis, YAxis, Tooltip, CartesianGrid, Cell
} from 'recharts'
import { currency } from '../utils/format'
import styles from './HoursChart.module.css'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className={styles.tooltip}>
      <p className={styles.tooltipLabel}>{label}</p>
      <p className={styles.tooltipValue}>{currency(payload[0].value)}</p>
      {payload[0].payload.vendas != null && (
        <p className={styles.tooltipSub}>{payload[0].payload.vendas} vendas</p>
      )}
    </div>
  )
}

export default function HoursChart({ data }) {
  const max = Math.max(...(data ?? []).map(d => d.value), 1)

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>Horários de Venda</h3>
        <span className={styles.sub}>por faturamento</span>
      </div>
      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(232,160,180,0.15)" vertical={false} />
          <XAxis dataKey="hour" tick={{ fontSize: 10, fill: '#9A8080' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 10, fill: '#9A8080' }} axisLine={false} tickLine={false}
            tickFormatter={v => v >= 1000 ? `${(v/1000).toFixed(0)}k` : v} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="value" radius={[3,3,0,0]}>
            {(data ?? []).map((d, i) => (
              <Cell key={i}
                fill={d.value === max ? 'var(--gold)' : 'var(--pink)'}
                opacity={0.7 + (d.value / max) * 0.3}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
