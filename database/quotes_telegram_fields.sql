alter table quotes add column if not exists email text;
alter table quotes add column if not exists budget text;
alter table quotes add column if not exists status text default 'nueva';
alter table quotes add column if not exists created_at timestamptz not null default now();

alter table quotes add column if not exists telegram_chat_id bigint;
alter table quotes add column if not exists telegram_username text;
alter table quotes add column if not exists telegram_first_name text;
alter table quotes add column if not exists telegram_last_name text;
alter table quotes add column if not exists telegram_status text default 'new';

alter table quotes alter column status set default 'nueva';
alter table quotes alter column created_at set default now();
alter table quotes alter column telegram_status set default 'new';

create index if not exists quotes_telegram_chat_id_created_at_idx
  on quotes (telegram_chat_id, created_at);
