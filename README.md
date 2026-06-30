# IC Group — корпоративный сайт

Сайт компании IC Group (профессиональный клининг, Казахстан).

## Стек

- React 19 + TypeScript + Vite
- Tailwind CSS v4
- React Router v7
- Vercel (хостинг + serverless API)

## Структура

```
app/        — фронтенд (React)
api/        — serverless функции Vercel
scripts/    — утилиты: генерация sitemap, синхронизация PST-локаций
docs/       — документация по сервисам
```

## Запуск

```bash
cd app
npm install
npm run dev
```

## Деплой

Автоматически через GitHub Actions при пуше в `main`.
