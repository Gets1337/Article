Для запуска проекта выполните следующие шаги:

Запустите Docker контейнер с PostgreSQL:

```bash
docker-compose up -d
```

Установите зависимости:

```bash
npm install
```

Выполните миграции Prisma:

```bash
npx prisma migrate dev --name init
```

Сгенерируйте Prisma Client:

```bash
npx prisma generate
```
