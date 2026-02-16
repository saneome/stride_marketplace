# 🚀 Инструкция по запуску проекта

## Первоначальная настройка

### 1. Клонирование и установка

```bash
# Клонируйте репозиторий (если еще не клонировали)
cd /home/xaneodev/frilans_1

# Файл .env уже создан с базовыми настройками для разработки
# Вы можете отредактировать его при необходимости
nano .env
```

### 2. Запуск проекта

```bash
# Запуск всех сервисов в режиме разработки
docker-compose up -d

# Проверка статуса сервисов
docker-compose ps

# Просмотр логов
docker-compose logs -f
```

### 3. Инициализация базы данных

```bash
# Применение миграций
docker-compose exec backend alembic upgrade head

# Создание начальных данных (админ и категории)
docker-compose exec backend python -m app.seed
```

### 4. Проверка работоспособности

```bash
# Проверка healthcheck
curl http://localhost/api/v1/health

# Должен вернуть: {"status":"healthy","version":"1.0.0"}
```

## 🌐 Доступ к сервисам

После запуска вы сможете получить доступ к следующим сервисам:

| Сервис | URL | Описание |
|--------|-----|----------|
| Публичный сайт | http://localhost | Главная страница |
| API документация | http://localhost:8000/api/docs | Swagger UI |
| Frontend Public | http://localhost:3000 | React приложение |
| Admin Frontend | http://localhost:5173 | Админ-панель |
| PostgreSQL | localhost:5432 | База данных |
| Redis | localhost:6379 | Кэш |
| MinIO Console | http://localhost:9001 | Файловое хранилище |

## 👤 Данные для входа

После выполнения seed-скрипта будут созданы следующие данные:

### Админ
- **Email:** admin@example.com
- **Пароль:** admin_password_123
- **Роль:** admin

> ⚠️ **Важно:** В production обязательно измените эти пароли!

## 📝 Основные команды

### Docker Compose

```bash
# Запуск всех сервисов
docker-compose up -d

# Остановка всех сервисов
docker-compose down

# Перезапуск сервиса
docker-compose restart backend

# Просмотр логов конкретного сервиса
docker-compose logs -f backend

# Выполнение команды в контейнере
docker-compose exec backend <command>

# Пересборка после изменений
docker-compose up -d --build
```

### Backend

```bash
# Создание новой миграции
docker-compose exec backend alembic revision --autogenerate -m "description"

# Применение миграций
docker-compose exec backend alembic upgrade head

# Откат миграции
docker-compose exec backend alembic downgrade -1

# Запуск тестов
docker-compose exec backend pytest tests/ -v

# Линтинг
docker-compose exec backend ruff check .
docker-compose exec backend mypy app/

# Запуск seed-скрипта
docker-compose exec backend python -m app.seed
```

### Frontend

```bash
# Установка зависимостей (если нужно локально)
cd frontend-public
npm install

# Запуск в dev-режиме (локально)
npm run dev

# Сборка для production
npm run build

# Линтинг
npm run lint
```

## 🔧 Разработка

### Hot Reload

В режиме разработки (docker-compose.override.yml) включен hot reload:

- **Backend:** изменения в Python файлах автоматически перезагружают сервер
- **Frontend:** изменения в React/Vite файлах автоматически обновляются в браузере

### Работа с базой данных

Для подключения к базе данных используйте:

```bash
# Через docker-compose exec
docker-compose exec backend python

# Или через внешний клиент (DBeaver, pgAdmin)
# Host: localhost
# Port: 5432
# Database: marketplace_db
# User: marketplace_user
# Password: marketplace_password_123
```

### Отладка

```bash
# Просмотр логов всех сервисов
docker-compose logs -f

# Просмотр логов конкретного сервиса
docker-compose logs -f backend

# Вход в контейнер
docker-compose exec backend bash

# Проверка переменных окружения
docker-compose exec backend env
```

## 🐛 Решение проблем

### Проблема: Порты уже заняты

```bash
# Проверка занятых портов
sudo lsof -i :80
sudo lsof -i :5432

# Остановка сервисов, занимающих порты
sudo systemctl stop nginx  # если nginx установлен на хосте
```

### Проблема: Контейнеры не запускаются

```bash
# Просмотр логов для диагностики
docker-compose logs

# Пересборка контейнеров
docker-compose down
docker-compose up -d --build

# Очистка и пересоздание
docker-compose down -v
docker-compose up -d
```

### Проблема: База данных не инициализируется

```bash
# Проверка статуса PostgreSQL
docker-compose ps postgres

# Просмотр логов PostgreSQL
docker-compose logs postgres

# Ручное подключение к БД
docker-compose exec postgres psql -U marketplace_user -d marketplace_db
```

### Проблема: Миграции не применяются

```bash
# Проверка текущей версии миграции
docker-compose exec backend alembic current

# Сброс и повторное применение миграций (⚠️ удалит данные!)
docker-compose exec backend alembic downgrade base
docker-compose exec backend alembic upgrade head
```

## 📊 Мониторинг

### Проверка здоровья сервисов

```bash
# Healthcheck endpoint
curl http://localhost/api/v1/health

# Статус контейнеров
docker-compose ps

# Использование ресурсов
docker stats
```

### Логи

```bash
# Все логи
docker-compose logs

# Логи конкретного сервиса
docker-compose logs backend
docker-compose logs frontend-public
docker-compose logs postgres
```

## 🚀 Production развертывание

Для production развертывания:

1. Измените `.env` файл:
   - Установите `DEBUG=false`
   - Измените все пароли и секретные ключи
   - Настройте реальные SMTP данные
   - Укажите реальный домен для WireGuard

2. Удалите `docker-compose.override.yml` или закомментируйте его

3. Настройте SSL сертификаты (Let's Encrypt)

4. Настройте WireGuard для доступа к админке

5. Запустите:
```bash
docker-compose -f docker-compose.yml up -d
```

## 📚 Дополнительная информация

Более подробная информация доступна в [README.md](README.md)

## 🆘 Поддержка

При возникновении проблем:

1. Проверьте логи: `docker-compose logs`
2. Проверьте статус сервисов: `docker-compose ps`
3. Убедитесь, что порты не заняты
4. Попробуйте пересобрать контейнеры: `docker-compose up -d --build`
