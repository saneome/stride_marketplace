# 頂点Stride — маркетплейс спортивных товаров

Маркетплейс для продажи спортивного инвентаря (велосипеды, самокаты, ватрушки, лыжи, сноуборды, коньки, скейты) с разделом б/у товаров. Пользователи подают объявления после регистрации, модераторы проверяют их перед публикацией.

## 🏗️ Архитектура

Проект состоит из следующих компонентов:

- **Backend** - FastAPI (Python 3.12)
- **Frontend Public** - React + Vite + TypeScript
- **Admin Frontend** - React + Vite + TypeScript
- **Database** - PostgreSQL 17
- **Cache** - Redis 7
- **File Storage** - MinIO (S3-совместимое)
- **Reverse Proxy** - Nginx
- **VPN** - WireGuard (для доступа к админке)

## 📋 Технологии

### Backend
- Python 3.12+
- FastAPI
- SQLAlchemy 2.x (async)
- Pydantic v2
- PostgreSQL 17
- Redis 7
- MinIO
- Argon2id (хэширование паролей)

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Axios
- Zustand (state management)

### DevOps
- Docker & Docker Compose
- Nginx
- WireGuard
- WireGuard

## 🚀 Быстрый старт

### Требования

- Docker 24.0+
- Docker Compose 2.20+
- Git

### Установка

1. Клонируйте репозиторий:
```bash
git clone <repository-url>
cd frilans_1
```

2. Создайте файл `.env` на основе `.env.example`:
```bash
cp .env.example .env
```

3. Отредактируйте `.env` и установите свои значения:
```env
# Database
POSTGRES_USER=marketplace_user
POSTGRES_PASSWORD=your_secure_password_here
POSTGRES_DB=marketplace_db

# Admin
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_admin_password_here

# JWT
SECRET_KEY=your-super-secret-key-change-this-in-production-min-32-chars

# WireGuard
WG_SERVERURL=your-domain.com
WG_PEERS=1
```

4. Запустите проект:
```bash
docker-compose up -d
```

5. Примените миграции и создайте начальные данные:
```bash
docker-compose exec backend alembic upgrade head
docker-compose exec backend python -m app.seed
```

6. Откройте браузер:
- Публичный сайт: http://localhost
- Админ-панель: http://admin.localhost (через VPN)

## 📁 Структура проекта

```
frilans_1/
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── models/         # SQLAlchemy модели
│   │   ├── schemas/        # Pydantic схемы
│   │   ├── api/            # API роутеры
│   │   │   ├── public/     # Публичные эндпоинты
│   │   │   └── admin/      # Админские эндпоинты
│   │   ├── security.py     # JWT, пароли
│   │   └── utils/          # Утилиты (upload, resize)
│   └── seed.py             # Начальные данные
├── frontend-public/        # Публичный фронтенд
│   └── src/
│       ├── components/     # React компоненты
│       ├── pages/          # Страницы
│       ├── lib/            # API клиент
│       └── store/          # Zustand store
├── admin-frontend/         # Админ-панель
│   └── src/
│       ├── components/     # React компоненты
│       ├── pages/          # Страницы
│       └── lib/            # API клиент
├── nginx/                  # Nginx конфигурации
├── docker-compose.yml      # Production конфигурация
└── docker-compose.override.yml  # Dev конфигурация
```

## 🔧 Разработка

### Запуск в режиме разработки

Режим разработки включает:
- Hot reload для backend и frontend
- Проброс портов БД и Redis наружу
- Отключенный HTTPS
- Расширенное логирование

```bash
docker-compose up
```

### Доступ к сервисам в dev-режиме

- Backend API: http://localhost:8000
- Frontend Public: http://localhost:3000
- Admin Frontend: http://localhost:5173
- PostgreSQL: localhost:5432
- Redis: localhost:6379
- MinIO Console: http://localhost:9001

### Создание миграций

```bash
docker-compose exec backend alembic revision --autogenerate -m "description"
```

### Применение миграций

```bash
docker-compose exec backend alembic upgrade head
```

### Запуск тестов

```bash
# Backend
docker-compose exec backend pytest tests/ -v

# Frontend
cd frontend-public && npm test
```

### Линтинг

```bash
# Backend
docker-compose exec backend ruff check .
docker-compose exec backend mypy app/

# Frontend
cd frontend-public && npm run lint
```

## 🔐 Безопасность

### Аутентификация

- JWT токены (access: 15 мин, refresh: 7 дней)
- Argon2id для хэширования паролей
- Двухфакторная аутентификация (TOTP) для админов
- Rate limiting на эндпоинты аутентификации

### Сетевая изоляция

- Админ-панель доступна только через WireGuard VPN
- Nginx блокирует внешние запросы к `/admin/*`
- Все сервисы во внутренней Docker-сети

### Защита файлов

- Валидация MIME-типов изображений
- Ограничение размера файлов (5 МБ)
- Генерация уникальных имён файлов
- Создание thumbnail

## 📊 API документация

Swagger UI доступен в dev-режиме:
- Публичный API: http://localhost:8000/api/docs
- Админ API: http://localhost:8000/admin/api/docs

## 🌐 Деплой

### Подготовка сервера

1. Установите Docker и Docker Compose
2. Настройте DNS записи
3. Сгенерируйте SSL сертификаты (Let's Encrypt)

### Настройка CI/CD

Добавьте секреты в GitHub:
- `DOCKER_USERNAME` - логин Docker Hub
- `DOCKER_PASSWORD` - пароль Docker Hub
- `SERVER_HOST` - IP адрес сервера
- `SERVER_USER` - пользователь на сервере
- `SSH_PRIVATE_KEY` - SSH ключ для доступа к серверу

### Деплой через GitHub Actions

При пуше в ветку `main` автоматически:
1. Собираются Docker образы
2. Пушатся в Docker Hub
3. Деплоятся на сервер

## 📝 Порядок реализации

### ✅ Этап 1 - Каркас (выполнен)
- Docker Compose со всеми сервисами
- Nginx конфигурация
- Подключение к БД
- Alembic
- Все модели данных
- Seed-скрипт
- Healthcheck
- Структурированное логирование
- CI (lint + typecheck)

### ✅ Этап 2 - Аутентификация (выполнен)
- Регистрация / Логин
- JWT токены с инвалидацией
- Проверка токена при загрузке (verifyToken)
- Автоматический logout при 401
- 2FA (TOTP) для админов

### ✅ Этап 3 - CRUD объявлений (выполнен)
- Создание объявлений с загрузкой изображений
- Inline-редактирование (всё кроме категории)
- Удаление с подтверждением
- Модерация перед публикацией
- Пагинация и фильтры по категориям
- Категории

### ✅ Этап 4 - Админка (выполнен)
- Админ-фронтенд (SPA)
- Модерация объявлений
- Управление пользователями
- Управление категориями
- Дашборд со статистикой
- Журнал аудита

### ⏳ Этап 5 - Дополнительные функции
- Избранное
- Личные сообщения
- Уведомления
- Публичный профиль пользователя

### ✅ Этап 6 - Безопасность и деплой (выполнен)
- WireGuard конфигурация
- Nginx reverse proxy
- Security headers
- Docker Compose оркестрация

## 🤝 Вклад в проект

1. Fork репозитория
2. Создайте ветку для фичи (`git checkout -b feature/AmazingFeature`)
3. Commit изменения (`git commit -m 'Add some AmazingFeature'`)
4. Push в ветку (`git push origin feature/AmazingFeature`)
5. Откройте Pull Request

## 📄 Лицензия

Этот проект лицензирован под MIT License.

## 📞 Контакты

Для вопросов и предложений обращайтесь к разработчику.
