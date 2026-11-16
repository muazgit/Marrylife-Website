-- ============================================================================
-- MarryLife — Atomic Credit Operations Migration
-- ============================================================================
-- Provides database-level atomic credit deduction and refund functions
-- with explicit row-level locking (FOR UPDATE) to prevent race conditions.

create or replace function public.deduct_user_credit(
  p_user_id uuid,
  p_amount integer default 1
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_current_credits integer;
begin
  -- Lock the row for update
  select credits into v_current_credits
  from public.profiles
  where id = p_user_id
  for update;

  if not found or v_current_credits < p_amount then
    return false;
  end if;

  update public.profiles
  set credits = credits - p_amount,
      updated_at = now()
  where id = p_user_id;

  return true;
end;
$$;

create or replace function public.refund_user_credit(
  p_user_id uuid,
  p_amount integer default 1
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.profiles
  set credits = credits + p_amount,
      updated_at = now()
  where id = p_user_id;
end;
$$;
