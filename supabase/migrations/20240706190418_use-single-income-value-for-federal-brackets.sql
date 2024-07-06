alter table federal_tax_brackets add column income int;

update federal_tax_brackets set income = minimum;

alter table federal_tax_brackets alter column income set not null;

alter table federal_tax_brackets drop column maximum;
alter table federal_tax_brackets drop column minimum;