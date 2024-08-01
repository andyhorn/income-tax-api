alter table api_keys add column hash text;

update api_keys set hash = token;

alter table api_keys add unique (hash);
alter table api_keys alter column hash set not null;
alter table api_keys drop column token;