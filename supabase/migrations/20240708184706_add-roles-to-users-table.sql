create type user_roles as enum ('USER', 'ADMIN');

alter table users add column role user_roles not null default 'USER'::user_roles;