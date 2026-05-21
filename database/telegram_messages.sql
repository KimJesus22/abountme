create table if not exists telegram_messages (
  id uuid primary key default gen_random_uuid(),
  quote_id uuid not null references quotes(id) on delete cascade,
  telegram_chat_id bigint not null,
  direction text not null check (direction in ('inbound', 'outbound')),
  message_text text not null,
  created_at timestamptz not null default now()
);

create index if not exists telegram_messages_quote_id_created_at_idx
  on telegram_messages (quote_id, created_at);
