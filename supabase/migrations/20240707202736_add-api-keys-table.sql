create table api_keys (
    id serial primary key,
    token text not null,
    created_at timestamp not null default now(),
    deleted_at timestamp
);