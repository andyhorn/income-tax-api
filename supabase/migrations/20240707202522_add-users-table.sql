create table users (
    id serial primary key,
    uuid text not null,
    email text not null,
    created_at timestamp not null default now(),
    deleted_at timestamp
);