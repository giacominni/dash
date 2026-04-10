# 📊 Painel de Gestão

Dashboard financeiro e de relacionamento para gestão de vendas, clientes e produtos — integrado ao Google Sheets como banco de dados.

![deploy](https://img.shields.io/badge/deploy-vercel-4d1e24?style=flat-square&labelColor=FFFFFF&logo=vercel&logoColor=4d1e24)
![license](https://img.shields.io/badge/license-MIT-4d1e24?style=flat-square&labelColor=FFFFFF)
![version](https://img.shields.io/badge/version-1.0.0-4d1e24?style=flat-square&labelColor=FFFFFF)

![React](https://img.shields.io/badge/React-4d1e24?style=for-the-badge&logo=react&logoColor=c97c85)
![TypeScript](https://img.shields.io/badge/TypeScript-4d1e24?style=for-the-badge&logo=typescript&logoColor=c97c85)
![Firebase](https://img.shields.io/badge/Firebase-1a2e0a?style=for-the-badge&logo=firebase&logoColor=7a9e3a)
![Google Sheets](https://img.shields.io/badge/Google_Sheets-1a2e0a?style=for-the-badge&logo=googlesheets&logoColor=7a9e3a)
![Vercel](https://img.shields.io/badge/Vercel-1c2128?style=for-the-badge&logo=vercel&logoColor=8b949e)

---

## 📸 Screenshots

<!-- adicione os screenshots na pasta docs/ -->
| Login | Dashboard |
|-------|-----------|
| ![login](./docs/login.png) | ![dashboard](./docs/dashboard.png) |

---

## ✨ Funcionalidades

- 🔐 **Autenticação Firebase** — login seguro com controle de sessão
- 👥 **Permissões por perfil** — administrador com acesso total
- 📈 **Dashboard de Faturamento** — receita, vendas, ticket médio e devoluções
- 👤 **Gestão de Clientes** — top clientes, inativos e aniversariantes
- 📦 **Catálogo de Produtos** — ranking, categorias e evolução de vendas
- 📊 **Google Sheets como banco de dados** — sem backend adicional

---

## 🗂 Páginas

| Rota | Descrição |
|------|-----------|
| `/login` | Autenticação via Firebase |
| `/dashboard` | Visão geral — faturamento, horários, produtos e top clientes |
| `/faturamento` | Relatório financeiro com evolução e detalhamento por dia |
| `/clientes` | Relacionamento — faixa de gasto, recorrência e aniversariantes |
| `/produtos` | Catálogo — ranking por quantidade e receita |

---

## 🔑 Permissões de Acesso

| Perfil | Dashboard | Faturamento | Clientes | Produtos |
|--------|-----------|-------------|----------|----------|
| Administrador | ✔ | ✔ | ✔ | ✔ |
| Usuário | — | — | ✔ | — |

---

## 🚀 Como rodar

### Pré-requisitos

- Node.js 18+
- Conta no Firebase
- Google Sheets com os dados configurados
- Conta na Vercel (para deploy)

### Instalação

```bash
# 1. clone o repositório
git clone https://github.com/giacominni/dash.git
cd dashboard

# 2. instale as dependências
npm install

# 3. configure as variáveis de ambiente
cp .env.example .env

# 4. inicie em modo desenvolvimento
npm run dev
```

### Variáveis de ambiente

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_GOOGLE_SHEETS_ID=
VITE_GOOGLE_API_KEY=
```

---

## 📁 Estrutura

```
sulmidia-dashboard/
├── src/
│   ├── components/
│   ├── pages/
│   │   ├── Login.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Faturamento.tsx
│   │   ├── Clientes.tsx
│   │   └── Produtos.tsx
│   ├── hooks/
│   ├── services/
│   │   ├── firebase.ts
│   │   └── sheets.ts
│   └── types/
├── docs/
│   ├── login.png
│   └── dashboard.png
├── .env.example
└── README.md
```

---

## 📄 Licença

MIT License — veja [LICENSE](./LICENSE) para detalhes.

---

<p align="center">feito por <a href="https://github.com/giacominni">giacominni</a> · Sul Mídia Software</p>
