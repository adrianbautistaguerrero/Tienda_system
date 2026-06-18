FROM php:8.2-cli

# Instala la extensión pdo_mysql para conectar a MySQL/MariaDB
RUN docker-php-ext-install pdo pdo_mysql

WORKDIR /app
COPY . /app

# Render expone el puerto en la variable $PORT
ENV PORT=10000
EXPOSE 10000

# Servidor embebido de PHP usando el router
CMD php -S 0.0.0.0:${PORT} router.php
