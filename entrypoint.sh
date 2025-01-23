#!/bin/sh
# echo "Waiting for database..."

# while ! nc -z db 27017; do
#   sleep 10
# done

# echo "Database started"
echo "Seting up database"

# yarn migration:deploy

yarn migration:generate

yarn migration:deploy

yarn prisma:seed

echo "Starting up server"

yarn build && yarn start

