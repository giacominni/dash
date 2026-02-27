import { useState, useEffect } from 'react'
import { Calendar, Users, TrendingUp, Clock, Gift, BarChart2 } from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import { getClientes } from '../../services/clientes'
import { currency } from '../../utils/format'
import styles from './Clientes.module.css'

const toInputDate = (d) =>
  `${d.year}-${String(d.month).padStart(2,'0')}-${String(d.day).padStart(2,'0')}`
const fromInputDate = (str) => {
  const [year, month, day] = str.split('-').map(Number)
  return { day, month, year }
}

const COLORS_PIE = ['#C9A84C','#E8A0B4','#C97090','#A0822A','#9A8080']

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className={styles.tooltip}>
      <p className={styles.tooltipLabel}>{label}</p>
      {payload.map(p => (
        <p key={p.name} className={styles.tooltipValue} style={{ color: p.color }}>
          {typeof p.value === 'number' && p.value > 100 ? currency(p.value) : p.value}
        </p>
      ))}
    </div>
  )
}

export default function Clientes() {
  const hoje  = new Date()
  const [inicio, setInicio] = useState({ day: 1, month: hoje.getMonth() + 1, year: hoje.getFullYear() })
  const [fim,    setFim]    = useState({ day: hoje.getDate(), month: hoje.getMonth() + 1, year: hoje.getFullYear() })
  const [data,    setData]    = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)
  const [aba,     setAba]     = useState('visao')
  const [search,  setSearch]  = useState('')

  useEffect(() => {
    setLoading(true)
    setError(null)
    getClientes(inicio, fim)
      .then(setData)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [inicio, fim])

  const rankingFiltrado  = (data?.ranking  ?? []).filter(c =>
    search === '' || c.nome.toLowerCase().includes(search.toLowerCase()))
  const inativosFiltrado = (data?.inativos ?? []).filter(c =>
    search === '' || c.nome.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className={styles.page}>

      <div className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Relacionamento</p>
          <h2 className={styles.title}>Clientes</h2>
        </div>
        <div className={styles.periodFilter}>
          <Calendar size={14} />
          <input type="date" className={styles.dateInput}
            value={toInputDate(inicio)} onChange={e => setInicio(fromInputDate(e.target.value))} />
          <span className={styles.dateSep}>até</span>
          <input type="date" className={styles.dateInput}
            value={toInputDate(fim)} onChange={e => setFim(fromInputDate(e.target.value))} />
        </div>
      </div>

      {loading && <div className={styles.loading}><div className={styles.spinner} /></div>}
      {error   && <div className={styles.error}>Erro: {error}</div>}

      {!loading && !error && data && (
        <>
          {/* KPIs */}
          <div className={styles.kpiGrid}>
            {[
              { icon: Users,     color: 'var(--gold)',      label: 'Clientes Únicos',         value: data.totalUnicos },
              { icon: TrendingUp,color: 'var(--pink)',      label: 'Total em Compras',         value: currency(data.totalCompras) },
              { icon: BarChart2, color: 'var(--pink-dark)', label: 'Ticket Médio por Cliente', value: currency(data.ticketMedioCliente) },
              { icon: Clock,     color: 'var(--danger)',    label: 'Inativos +60 dias',        value: data.inativos.length },
            ].map(({ icon: Icon, color, label, value }) => (
              <div key={label} className={styles.kpi} style={{'--c': color}}>
                <div className={styles.kpiIcon}><Icon size={15} /></div>
                <div>
                  <p className={styles.kpiLabel}>{label}</p>
                  <p className={styles.kpiValue}>{value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Abas */}
          <div className={styles.tabs}>
            {[
              { id: 'visao',          label: 'Visão Geral',          icon: BarChart2   },
              { id: 'ranking',        label: 'Quem mais compra',     icon: TrendingUp  },
              { id: 'inativos',       label: 'Sem compras recentes', icon: Clock       },
              { id: 'aniversariantes',label: 'Aniversariantes',      icon: Gift        },
            ].map(({ id, label, icon: Icon }) => (
              <button key={id} className={`${styles.tab} ${aba === id ? styles.tabActive : ''}`}
                onClick={() => { setAba(id); setSearch('') }}>
                <Icon size={13} /> {label}
              </button>
            ))}
          </div>

          {/* ── Visão Geral — gráficos ────────────────────────────────────── */}
          {aba === 'visao' && (
            <>
              <div className={styles.chartsRow}>
                {/* Top 5 clientes */}
                <div className={styles.card}>
                  <h3 className={styles.cardTitle}>Top 5 Clientes</h3>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={data.ranking.slice(0,5)} layout="vertical"
                      margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                      <XAxis type="number" tick={{ fontSize: 10, fill: 'var(--muted)' }} axisLine={false} tickLine={false}
                        tickFormatter={v => `R$${(v/1000).toFixed(0)}k`} />
                      <YAxis type="category" dataKey="nome" tick={{ fontSize: 10, fill: 'var(--muted)' }}
                        axisLine={false} tickLine={false} width={90}
                        tickFormatter={v => v.split(' ')[0]} />
                      <Tooltip formatter={(v) => [currency(v), 'Total']} />
                      <Bar dataKey="total" fill="var(--pink-dark)" radius={[0,4,4,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Distribuição por faixa de valor */}
                <div className={styles.card}>
                  <h3 className={styles.cardTitle}>Clientes por Faixa de Gasto</h3>
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie data={data.faixas} dataKey="count" nameKey="faixa"
                        cx="50%" cy="50%" outerRadius={80} innerRadius={45}
                        paddingAngle={3}>
                        {data.faixas.map((_, i) => <Cell key={i} fill={COLORS_PIE[i % COLORS_PIE.length]} />)}
                      </Pie>
                      <Tooltip formatter={(v, n) => [`${v} clientes`, n]} />
                      <Legend iconType="circle" iconSize={8}
                        formatter={(v) => <span style={{ fontSize: 11, color: 'var(--muted)' }}>{v}</span>} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className={styles.chartsRow}>
                {/* Recorrência */}
                <div className={styles.card}>
                  <h3 className={styles.cardTitle}>Recorrência de Compras</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={data.recorrencia} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                      <XAxis dataKey="compras" tick={{ fontSize: 10, fill: 'var(--muted)' }} axisLine={false} tickLine={false}
                        label={{ value: 'nº de compras', position: 'insideBottom', offset: -2, fontSize: 10, fill: 'var(--muted)' }} />
                      <YAxis tick={{ fontSize: 10, fill: 'var(--muted)' }} axisLine={false} tickLine={false} width={30} />
                      <Tooltip formatter={(v) => [`${v} clientes`, 'Clientes']} />
                      <Bar dataKey="clientes" fill="var(--gold)" radius={[4,4,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Evolução de compras por mês */}
                <div className={styles.card}>
                  <h3 className={styles.cardTitle}>Evolução de Compras por Mês</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={data.evolucaoMes} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="cliGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%"  stopColor="var(--pink)" stopOpacity={0.25} />
                          <stop offset="95%" stopColor="var(--pink)" stopOpacity={0}    />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                      <XAxis dataKey="mes" tick={{ fontSize: 10, fill: 'var(--muted)' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 10, fill: 'var(--muted)' }} axisLine={false} tickLine={false} width={48}
                        tickFormatter={v => `R$${(v/1000).toFixed(0)}k`} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area type="monotone" dataKey="total" name="Faturamento"
                        stroke="var(--pink-dark)" strokeWidth={2} fill="url(#cliGrad)" dot={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          )}

          {/* ── Ranking ──────────────────────────────────────────────────── */}
          {aba === 'ranking' && (
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>Clientes que mais compraram</h3>
                <input placeholder="Buscar cliente..." className={styles.search}
                  value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead><tr>
                    <th>#</th><th>Cliente</th>
                    <th className={styles.right}>Compras</th>
                    <th className={styles.right}>Total Gasto</th>
                    <th className={styles.right}>Ticket Médio</th>
                    <th className={styles.right}>Última Compra</th>
                  </tr></thead>
                  <tbody>
                    {rankingFiltrado.length === 0 && (
                      <tr><td colSpan={6} className={styles.empty}>Nenhum cliente encontrado</td></tr>
                    )}
                    {rankingFiltrado.map((c, i) => (
                      <tr key={c.nome}>
                        <td className={styles.rankCell}>
                          {i < 3 ? <span className={styles.rankTop}>{i + 1}</span> :
                            <span className={styles.rankNum}>{i + 1}</span>}
                        </td>
                        <td>
                          <div className={styles.clientInfo}>
                            <div className={styles.avatar}>{c.nome.substring(0,2).toUpperCase()}</div>
                            <span className={styles.clientName}>{c.nome}</span>
                          </div>
                        </td>
                        <td className={styles.right}>{c.compras}</td>
                        <td className={`${styles.right} ${styles.bold}`}>{currency(c.total)}</td>
                        <td className={styles.right}>{currency(c.ticket)}</td>
                        <td className={`${styles.right} ${styles.mono}`}>{c.ultimaCompra}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── Inativos ─────────────────────────────────────────────────── */}
          {aba === 'inativos' && (
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>Clientes sem compra recente</h3>
                <input placeholder="Buscar cliente..." className={styles.search}
                  value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead><tr>
                    <th>Cliente</th>
                    <th className={styles.right}>Última Compra</th>
                    <th className={styles.right}>Dias sem comprar</th>
                    <th className={styles.right}>Total Histórico</th>
                    <th className={styles.right}>Nº Compras</th>
                  </tr></thead>
                  <tbody>
                    {inativosFiltrado.length === 0 && (
                      <tr><td colSpan={5} className={styles.empty}>Nenhum cliente inativo</td></tr>
                    )}
                    {inativosFiltrado.map(c => (
                      <tr key={c.nome}>
                        <td>
                          <div className={styles.clientInfo}>
                            <div className={styles.avatar}>{c.nome.substring(0,2).toUpperCase()}</div>
                            <span className={styles.clientName}>{c.nome}</span>
                          </div>
                        </td>
                        <td className={`${styles.right} ${styles.mono}`}>{c.ultimaCompra}</td>
                        <td className={styles.right}>
                          <span className={c.diasSemComprar > 90 ? styles.badgeRed : styles.badgeOrange}>
                            {c.diasSemComprar} dias
                          </span>
                        </td>
                        <td className={`${styles.right} ${styles.bold}`}>{currency(c.total)}</td>
                        <td className={styles.right}>{c.compras}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── Aniversariantes ──────────────────────────────────────────── */}
          {aba === 'aniversariantes' && (
            <>
              {/* KPI aniversários do mês */}
              <div className={styles.anivKpis}>
                <div className={styles.anivKpi}>
                  <span className={styles.anivKpiNum}>
                    {(data.aniversariantes ?? []).filter(a => a.hoje || a.proximo).length}
                  </span>
                  <span className={styles.anivKpiLabel}>este mês</span>
                </div>
                <div className={styles.anivKpi}>
                  <span className={styles.anivKpiNum} style={{color:'var(--gold)'}}>
                    {(data.aniversariantes ?? []).filter(a => a.hoje).length}
                  </span>
                  <span className={styles.anivKpiLabel}>hoje</span>
                </div>
                <div className={styles.anivKpi}>
                  <span className={styles.anivKpiNum}>
                    {(data.aniversariantes ?? []).filter(a => a.proximo).length}
                  </span>
                  <span className={styles.anivKpiLabel}>próximos 7 dias</span>
                </div>
              </div>

              <div className={styles.card}>
                <h3 className={styles.cardTitle}>Aniversariantes</h3>
                {(data.aniversariantes ?? []).length === 0 ? (
                  <p className={styles.empty}>Nenhum aniversariante encontrado</p>
                ) : (
                  <div className={styles.anivGrid}>
                    {(data.aniversariantes ?? []).map((a, i) => (
                      <div key={i} className={`${styles.anivCard} ${a.hoje ? styles.anivHoje : ''} ${a.proximo ? styles.anivMes : ''}`}>
                        <div className={styles.anivAvatar}>
                          {a.nome.substring(0,2).toUpperCase()}
                        </div>
                        <div className={styles.anivInfo}>
                          <p className={styles.anivNome}>{a.nome}</p>
                          <p className={styles.anivData}>{a.data}</p>
                        </div>
                        <div className={styles.anivBadge}>
                          {a.hoje
                            ? <span className={styles.badgeHoje}>Hoje!</span>
                            : a.diasAte <= 7
                            ? <span className={styles.badgeProximo}>em {a.diasAte}d</span>
                            : <span className={styles.badgeFuturo}>em {a.diasAte}d</span>
                          }
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}
