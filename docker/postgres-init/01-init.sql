DO

BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_database WHERE datname = 'eventdb') THEN
        CREATE DATABASE eventdb;
    END IF;
END
;

GRANT ALL PRIVILEGES ON DATABASE eventdb TO authuser;
