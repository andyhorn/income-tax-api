create type filing_status as enum ('SINGLE', 'JOINT', 'HEAD');

create table if not exists federal_tax_brackets (
    id serial primary key,
    year int not null,
    status filing_status not null,
    rate real not null,
    minimum int not null,
    maximum int
);