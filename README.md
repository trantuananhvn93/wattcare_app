# Wattcare App

A Nodejs Express project.

## PostgreSQL

Download PostgreSQL v13.2 for windows-64 [here](https://www.enterprisedb.com/downloads/postgres-postgresql-downloads)

Add "D:\PostgreSQL\13\bin" (where you install) to Environment variables paths

Open SQL shell (psql) on windows. By default, name DB is `postgres` and usename `postgres`, just need to type the password when installed PostgreSQL.

```
Server [localhost]:
Database [postgres]:
Port [5432]:
Username [postgres]:
Password for user postgres: <your password>
psql (13.2)

postgres=#
```

Create a new user and database for the project Wattcare. **Don't change name** pls !

### Create user

```sql
=# SELECT usename FROM pg_user;
 usename
----------
 postgres
(1 row)

=# CREATE USER anh;
CREATE ROLE
```

####  Viewing Existing User Permissions

```sql
=# \du
                             List of roles
 Role name |                   Attributes                   | Member of
-----------+------------------------------------------------+-----------
 anh 	   |                                                | {}
 postgres  | Superuser, Create role, Create DB, Replication | {}
```

#### Altering Existing User Permissions

Assigning `SUPERUSER` Permission

```sql
=# ALTER USER anh WITH SUPERUSER;
ALTER ROLE
```

```sql
=# \du
                             List of roles
 Role name |                   Attributes                   | Member of
-----------+------------------------------------------------+-----------
 anh       | Superuser                                      | {}
 postgres  | Superuser, Create role, Create DB, Replication | {}
```

Set up password and right to create DB

```sql
ALTER USER anh WITH PASSWORD 'anh' CREATEDB;
```

### Create database

```sql
CREATE DATABASE wattfield;
```

## Redis Server

not now but maybe later

## Nodejs

Run ```npm install```  to install all packages.

### Configuration for PostgreSQL database and Redis data structure store

Change connection configuration, on your root, change the following configurations `.env` with your own:

For PostgreSQL connection:

1. Database connection via URL

   ```
   DATABASE_URL=postgres://anh:anh@127.0.0.1:5432/wattfield
   # Example: DATABASE_URL=http://<user>:<password>@<host>/<database_name>
   ```

2. Database connection via credentials

   ```
   DATABASE_HOST=127.0.0.1
   DATABASE_PORT=5432
   DATABASE_NAME=anh
   DATABASE_USER=anh
   DATABASE_PASSWORD=wattfield
   ```

For Redis connection:

1. REDIS connection via URL

```
REDIS_URL=redis://:@127.0.0.1:6379
# Example: redis://:<password>@<host>:<port>
```

1. REDIS connection via credentials

```
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=
```

### Migrations and seeds

Installing `knex` in global first

```bash
npm install knex -g
```

From your root, ```cd data```.

```bash
knex migrate:latest
```

```
knex seed:run
```

### Run the application

```
npm start
```

or 

```
node app.js
```

