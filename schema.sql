create table if not exists products (
  id bigint primary key,
  name text not null,
  category text not null,
  price numeric(10,2) not null,
  old numeric(10,2),
  image text not null,
  tone text default 'stone',
  description text,
  sizes text[] default '{}',
  created_at timestamptz default now()
);

alter table products enable row level security;
create policy "Public can read products" on products for select using (true);

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

create policy "Public product images" on storage.objects for select
using (bucket_id = 'product-images');
create policy "Service role uploads product images" on storage.objects for insert
with check (bucket_id = 'product-images');
