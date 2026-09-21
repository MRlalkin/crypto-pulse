# ⚡ Crypto Pulse — Telegram Mini App & Web Terminal

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Telegram TMA](https://img.shields.io/badge/Telegram-Mini_App-26A5E4?style=for-the-badge&logo=telegram&logoColor=white)
![viem](https://img.shields.io/badge/viem-Ethereum_RPC-627EEA?style=for-the-badge&logo=ethereum&logoColor=white)
![SWR](https://img.shields.io/badge/SWR-Data_Fetching-black?style=for-the-badge&logo=vercel&logoColor=white)

<p align="center">
  <b>High-frequency crypto market radar & on-chain wallet inspector styled in a retro-cyber Dark Terminal aesthetic.</b><br/>
  <b>Высокоскоростной радар криптовалютного рынка и ончейн-инспектор кошельков в стиле ретро-кибер Dark Terminal.</b>
</p>

[ 🇷🇺 Перейти к русской версии ](#-crypto-pulse--telegram-mini-app-русский) &nbsp;•&nbsp; [ 🇬🇧 Switch to English ](#-crypto-pulse--telegram-mini-app-english)

</div>

---

## 🇷🇺 Crypto Pulse — Telegram Mini App (Русский)

**Crypto Pulse** — это специализированное Telegram Mini App (TMA) и веб-приложение, созданное для трейдеров, DeFi-пользователей и криптоэнтузиастов. Интерфейс выполнен в бескомпромиссном стиле **Dark Terminal** (`#0B0E14`, `#1E293B`, неоновый изумруд `#10B981`, кораллово-красный `#F43F5E`) с моноширинной типографикой, сканирующими линиями и тактильным откликом Telegram Haptic Feedback.

### 🚀 Основные возможности

#### 1. 📈 Market Pulse (Экран рынка)
- **Топ-20 криптовалют в реальном времени**: получение свежих котировок, суточных объемов и рыночной капитализации через CoinGecko API.
- **Серверное кэширование на 30 секунд**: роут `/api/market` с директивами `next: { revalidate: 30 }` и заголовками `Cache-Control`.
- **Отказоустойчивый fallback-кэш**: гарантирует бесперебойную работу интерфейса даже при жестких лимитах CoinGecko (HTTP 429).
- **Живой мгновенный поиск**: фильтрация списка по тикеру (`BTC`, `SOL`, `ETH`) или названию.
- **Интерактивные фильтры**:
  - `Капитализация` (сортировка по рангу CoinGecko);
  - `Рост (24h)` (сортировка по наибольшему % роста);
  - `Падение (24h)` (сортировка по наибольшему % падения).
- **Синхронизация через SWR**: автоматическое фоновое обновление и кнопка ручного рефреша с анимацией спиннера и виброоткликом.

#### 2. 🔍 Wallet Inspector (Аудит кошельков)
- **Валидация адресов через viem**: строгая проверка формата адреса Ethereum как на клиенте, так и на сервере (`isAddress`).
- **Нативный баланс ETH через RPC**: получение точного баланса в реальном времени через публичный RPC Ethereum (`createPublicClient`, `http`, `formatEther`).
- **Конвертация в USD**: автоматический пересчет баланса в доллары США по текущему биржевому курсу ETH из `/api/market`.
- **Последние 5 транзакций Etherscan**:
  - Направление перевода (зеленая стрелка вниз — входящая, красная вверх — исходящая);
  - Форматированная сумма в ETH, дата и время;
  - Прямой переход к транзакции на Etherscan в один клик.
- **Недавние кошельки**: сохранение последних 3 проверенных адресов в `localStorage` с интерактивными чипами.
- **Копирование адреса**: копирование полного адреса в буфер обмена в один клик.
- **Обработка состояний**: скелетоны загрузки (`animate-pulse`) и информативные баннеры ошибок.

#### 3. 👤 Profile TMA (Профиль оператора)
- **Интеграция с Telegram WebApp SDK**: получение данных авторизованного пользователя (`first_name`, `last_name`, `username`, `photo_url`, `id`).
- **Веб-режим**: аккуратная плашка *«Веб-режим: Telegram данные недоступны»* и терминальный аватар при открытии вне Telegram.
- **Мониторинг статуса сети**:
  - Первичная сеть: `Ethereum Mainnet (Chain ID: 1)`;
  - Статус: `ONLINE`;
  - RPC Provider: `ethereum-rpc.publicnode.com`;
  - Динамический замер задержки RPC в миллисекундах.
- **Комьюнити-кнопка**: ссылка на Telegram-канал/чат с неоновым изумрудным свечением и виброоткликом.
- **Версия приложения**: `v1.0.0 (MVP)`.

#### 4. 🎮 Интеграция с Telegram WebApp
- Нижняя панель навигации **BottomNav** с табами: *Рынок*, *Кошелек*, *Профиль*.
- Вызов **Telegram Haptic Feedback** на ключевых событиях:
  - `triggerHaptic('light')` при переключении табов, клике по ссылкам и недавним кошелькам;
  - `triggerHaptic('medium')` при поиске и аудите адреса кошелька.
- Автоматическая адаптация под safe-area мобильных устройств.

---

### 🛠 Стек технологий

| Технология | Назначение |
| :--- | :--- |
| **Next.js 16 (App Router)** | Высокопроизводительный гибридный SSR/SSG фреймворк и Route Handlers |
| **React 19** | Современная компонентная архитектура |
| **TypeScript 5** | Строгая статическая типизация всего приложения |
| **Tailwind CSS v4** | Утилитарная стилизация под ретро-киберпанк Dark Terminal |
| **viem** | Легковесное и типобезопасное взаимодействие с Ethereum JSON-RPC |
| **SWR** | Реактивное получение, кэширование и фоновая ревалидация данных |
| **Telegram WebApp SDK** | Нативная интеграция в экосистему Telegram Mini Apps и Haptic Feedback |
| **Lucide React** | Минималистичные моноширинные иконки интерфейса |

---

### 📂 Структура проекта

```text
crypto-pulse/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── market/route.ts   # Серверный эндпоинт кэширования CoinGecko (30s TTL)
│   │   │   └── wallet/route.ts   # Серверный RPC-инспектор баланса и транзакций viem
│   │   ├── globals.css           # Базовые стили терминала, кастомные скроллбары
│   │   ├── layout.tsx            # Корневой лейаут, подключение telegram-web-app.js
│   │   └── page.tsx              # Главный контейнер табов (Рынок, Кошелек, Профиль)
│   ├── components/
│   │   ├── BottomNav.tsx         # Нижняя навигация с Haptic Feedback
│   │   ├── MarketPulse.tsx       # Экран топ-20 монет, фильтров и живого поиска
│   │   ├── WalletInspector.tsx   # Экран ончейн-аудита кошельков Ethereum
│   │   └── ProfileScreen.tsx     # Экран профиля пользователя Telegram и статуса сети
│   ├── hooks/
│   │   └── useTelegram.ts        # Кастомный хук для Telegram WebApp API и Haptics
│   └── types/
│       ├── market.ts             # Типы Coin, FilterSort, Telegram WebApp
│       └── wallet.ts             # Типы Transaction, WalletData
├── next.config.mjs               # Конфигурация Next.js и remotePatterns для CoinGecko
├── tsconfig.json                 # Настройки TypeScript
└── package.json                  # Зависимости и скрипты
```

---

### 💻 Инструкция по локальному запуску

#### Шаг 1. Клонирование репозитория
```bash
git clone https://github.com/MRlalkin/crypto-pulse.git
cd crypto-pulse
```

#### Шаг 2. Установка зависимостей
```bash
npm install
```

#### Шаг 3. Настройка переменных окружения (опционально)
Создайте файл `.env.local` в корне проекта, если хотите использовать собственные API ключи:
```env
# Опционально: Ключ для платного доступа к CoinGecko
COINGECKO_API_KEY=your_coingecko_key_here

# Опционально: Ключ Etherscan для неограниченных запросов транзакций
ETHERSCAN_API_KEY=your_etherscan_key_here
```
*(Приложение полноценно функционирует и без ключей благодаря публичным RPC и fallback-кэшу).*

#### Шаг 4. Запуск сервера разработки
```bash
npm run dev
```
Откройте в браузере: [http://localhost:3000](http://localhost:3000).

#### Шаг 5. Сборка и запуск продакшн-версии
```bash
npm run build
npm run start
```

---
---

## 🇬🇧 Crypto Pulse — Telegram Mini App (English)

**Crypto Pulse** is a high-performance Telegram Mini App (TMA) and Web application engineered for active crypto traders, DeFi users, and web3 enthusiasts. Built around a striking **Dark Terminal** aesthetic (`#0B0E14`, `#1E293B`, neon emerald `#10B981`, coral-red `#F43F5E`), it delivers instant market telemetry, on-chain Ethereum wallet inspection, and seamless Telegram integration.

### 🚀 Key Features

#### 1. 📈 Market Pulse (Market Radar)
- **Real-Time Top 20 Coins**: Instant cryptocurrency prices, 24h market performance, and market cap from CoinGecko.
- **30-Second Server Cache**: Dedicated `/api/market` endpoint with Next.js route caching (`revalidate: 30`) and `Cache-Control` headers.
- **Zero-Downtime Fallback Cache**: Built-in memory fallback protecting the user interface from CoinGecko public rate limits (HTTP 429).
- **Instant Live Search**: Search and filter instantly by symbol (`BTC`, `ETH`, `SOL`) or project name.
- **Interactive Sorting Filters**:
  - `Market Cap` (sorted by official CoinGecko rank);
  - `Gainers (24h)` (sorted by highest percentage gain);
  - `Losers (24h)` (sorted by highest percentage drop).
- **SWR-Powered State**: Automatic background revalidation and a manual refresh trigger with spinner animation and haptic vibration.

#### 2. 🔍 Wallet Inspector (On-Chain Audit)
- **Viem-Powered Address Validation**: Rigorous client and server-side address validation using `isAddress` from viem.
- **Native ETH Balance via Public RPC**: Direct on-chain balance queries via Ethereum JSON-RPC (`createPublicClient`, `http`, `formatEther`).
- **Real-Time USD Conversion**: Live calculation of wallet valuation in USD using the current ETH index from `/api/market`.
- **Last 5 Etherscan Transactions**:
  - Transaction direction (green down-arrow for incoming, coral up-arrow for outgoing);
  - Formatted ETH amount, relative and absolute timestamps;
  - One-click direct link to Etherscan explorer.
- **Recent Wallets History**: Stores up to 3 recently audited wallets in `localStorage` with clickable chips (`0x12...ab34`).
- **One-Click Copy**: Copy address to clipboard with visual confirmation.
- **Resilient States**: Terminal `animate-pulse` skeletons and distinct error banners for invalid addresses or network drops.

#### 3. 👤 Profile TMA (Operator Dossier)
- **Telegram WebApp Integration**: Real-time user info extraction (`first_name`, `last_name`, `username`, `photo_url`, `id`) via custom `useTelegram` hook.
- **Browser Fallback**: Clean *“Web Mode: Telegram data unavailable”* banner with an anonymous operator avatar when accessed outside of Telegram.
- **Live Node Diagnostics**:
  - Primary Chain: `Ethereum Mainnet (Chain ID: 1)`;
  - Status: `ONLINE`;
  - Public Node: `ethereum-rpc.publicnode.com`;
  - Live latency indicator in milliseconds.
- **Community Portal**: Neon-glowing button linking directly to the official Telegram community with haptic feedback.
- **Application Version**: `v1.0.0 (MVP)`.

#### 4. 🎮 Telegram Native Experience
- Fixed **BottomNav** bar with 3 core tabs: *Market*, *Wallet*, *Profile*.
- Tactile **Haptic Feedback**:
  - `triggerHaptic('light')` on tab switches, link clicks, and history chips;
  - `triggerHaptic('medium')` on wallet audits and search execution.
- Mobile viewport safety with `env(safe-area-inset-bottom)` support.

---

### 🛠 Tech Stack

| Technology | Role |
| :--- | :--- |
| **Next.js 16 (App Router)** | Server route handlers, Turbopack, and hybrid rendering |
| **React 19** | Component-based UI state architecture |
| **TypeScript 5** | End-to-end static type safety |
| **Tailwind CSS v4** | Dark Terminal design system, custom glows, and scrollbars |
| **viem** | Ethereum JSON-RPC client and blockchain utilities |
| **SWR** | Stale-while-revalidate client fetching and cache management |
| **Telegram WebApp SDK** | TMA context, viewport handling, and native haptic feedback |
| **Lucide React** | Cyberpunk-styled terminal iconography |

---

### 💻 Local Development & Setup

#### 1. Clone the repository
```bash
git clone https://github.com/MRlalkin/crypto-pulse.git
cd crypto-pulse
```

#### 2. Install dependencies
```bash
npm install
```

#### 3. Configure Environment Variables (Optional)
Create a `.env.local` file in the root directory if you wish to configure dedicated API keys:
```env
# Optional: CoinGecko Demo or Pro API Key
COINGECKO_API_KEY=your_coingecko_key_here

# Optional: Etherscan API Key for transaction history
ETHERSCAN_API_KEY=your_etherscan_key_here
```
*(The app is fully functional out of the box without any keys thanks to public RPC and fallback caches).*

#### 4. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

#### 5. Build for Production
```bash
npm run build
npm run start
```

---

### 📜 License
MIT License. Created for the Web3 and Telegram Mini App Developer Ecosystem.
