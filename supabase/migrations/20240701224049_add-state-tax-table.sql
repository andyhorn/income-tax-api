create type state_filing_status as enum ( 'SINGLE', 'JOINT' );

create table if not exists state_tax_brackets (
    id serial primary key,
    state text not null,
    status state_filing_status not null,
    income int not null,
    rate real not null,
    year int not null
);