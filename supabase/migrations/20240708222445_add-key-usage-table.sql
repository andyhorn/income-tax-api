create table api_key_usage (
    id serial primary key,
    api_key_id int not null references api_keys(id),
    used_at timestamptz not null default now()
);