SELECT 'CREATE DATABASE eventdb'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'eventdb')
\gexec

GRANT ALL PRIVILEGES ON DATABASE eventdb TO authuser;
