create table campaigns (
 id uuid primary key default gen_random_uuid(), name text not null check (btrim(name) <> ''),
 client text not null, owner text not null, target_url text not null,
 status text not null default 'active' check(status in ('active','closed')),
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create unique index campaigns_name on campaigns(lower(name));
create table contacts (
 id uuid primary key default gen_random_uuid(), name text not null, email text not null,
 permission text not null default 'unknown' check(permission in ('unknown','express','withdrawn')),
 permission_evidence text, permission_date date, suppressed_at timestamptz,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
 check(permission <> 'express' or (nullif(btrim(permission_evidence),'') is not null and permission_date is not null)),
 check(permission <> 'withdrawn' or suppressed_at is not null)
);
create unique index contacts_email on contacts(lower(email));
create table opportunities (
 id uuid primary key default gen_random_uuid(), campaign_id uuid not null references campaigns(id),
 name text not null, source_key text, publisher_url text not null, contact_id uuid references contacts(id),
 milestone text not null default 'prospect' check(milestone in ('prospect','review','contacted','reply','won','lost','paused')),
 owner text not null, next_due date, last_activity date, source_data jsonb,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
 unique(campaign_id,source_key)
);
create index opportunities_campaign on opportunities(campaign_id);
create index opportunities_contact on opportunities(contact_id);
create index opportunities_due on opportunities(next_due) where milestone not in ('lost','won','paused');
create table activities (
 id uuid primary key default gen_random_uuid(), opportunity_id uuid not null references opportunities(id),
 kind text not null check(kind in ('note','reply','follow-up','review')), note text not null,
 occurred_on date not null, actor text not null,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index activities_opportunity on activities(opportunity_id);
create table placements (
 id uuid primary key default gen_random_uuid(), opportunity_id uuid not null unique references opportunities(id),
 name text not null, page_url text not null, target_url text not null,
 consideration text not null check(consideration in ('none','paid','gifted','unknown')),
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table observations (
 id uuid primary key default gen_random_uuid(), placement_id uuid not null references placements(id),
 observed_on date not null, state text not null check(state in ('live','missing','unknown')),
 rel text not null default '', evidence text not null check(btrim(evidence) <> ''), actor text not null,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index observations_placement_date on observations(placement_id,observed_on desc,created_at desc,id desc);
create table audit_log (
 id uuid primary key default gen_random_uuid(), entity text not null, record_id uuid not null,
 action text not null, actor text not null, before_record jsonb, after_record jsonb,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index audit_entity_record on audit_log(entity,record_id);
create function record_change() returns trigger language plpgsql as $$
declare who text;
begin
 who := nullif(current_setting('links.actor',true),'');
 if who is null then raise exception 'An actor is required'; end if;
 if TG_OP = 'DELETE' then raise exception 'Deletion is disabled; close or pause the record'; end if;
 insert into audit_log(entity,record_id,action,actor,before_record,after_record)
 values(TG_TABLE_NAME,NEW.id,TG_OP,who,case when TG_OP='UPDATE' then to_jsonb(OLD) else null end,to_jsonb(NEW));
 return NEW;
end $$;
create function touch_updated() returns trigger language plpgsql as $$
begin NEW.updated_at := clock_timestamp(); return NEW; end $$;
create function reject_history_change() returns trigger language plpgsql as $$
begin raise exception 'History is append-only'; end $$;
create trigger history_fixed before update or delete on audit_log for each row execute function reject_history_change();
create trigger observations_fixed before update or delete on observations for each row execute function reject_history_change();
create trigger activities_fixed before update or delete on activities for each row execute function reject_history_change();
do $$ declare t text; begin
 foreach t in array array['campaigns','contacts','opportunities','activities','placements','observations'] loop
 execute format('create trigger changes after insert or update or delete on %I for each row execute function record_change()',t);
 execute format('create trigger touch before update on %I for each row execute function touch_updated()',t);
 end loop;
 foreach t in array array['campaigns','contacts','opportunities','activities','placements','observations','audit_log'] loop
 execute format('alter table %I enable row level security',t);
 execute format('revoke all on %I from public',t);
 end loop;
end $$;
revoke all on function record_change(), reject_history_change(), touch_updated() from public;
create view opportunity_desk with (security_invoker=true) as
 select o.*, c.name as campaign,c.client,c.target_url,ct.email,ct.permission,
 coalesce(c.status='active' and ct.permission='express' and ct.suppressed_at is null,false) as eligible,
 current_date-coalesce(o.last_activity,o.created_at::date) as quiet_days
 from opportunities o join campaigns c on c.id=o.campaign_id left join contacts ct on ct.id=o.contact_id;
create view placement_desk with (security_invoker=true) as
 select p.*,o.campaign_id,c.name as campaign,c.client,o.owner,x.observed_on,x.state,x.rel,x.evidence,
 (x.observed_on is null or x.observed_on < current_date-30) as stale,
 (p.consideration in ('paid','gifted') and not (coalesce(x.rel,'') ~* '(^|\s)(sponsored|nofollow)(\s|$)')) as qualification_gap
 from placements p join opportunities o on o.id=p.opportunity_id join campaigns c on c.id=o.campaign_id
 left join lateral (select * from observations v where v.placement_id=p.id order by observed_on desc,created_at desc,id desc limit 1) x on true;
create view campaign_desk with (security_invoker=true) as
 select c.*, (select count(*) from opportunities o where o.campaign_id=c.id) as opportunities,
 (select count(*) from opportunities o where o.campaign_id=c.id and milestone='won') as claimed_wins,
 (select count(*) from placement_desk p where p.campaign_id=c.id and p.state='live' and not p.stale) as current_live,
 (select count(*) from opportunity_desk o where o.campaign_id=c.id and o.next_due<current_date and o.milestone not in ('won','lost','paused')) as overdue
 from campaigns c;
create view compliance_desk with (security_invoker=true) as
 select 'permission'::text as rule,o.id,o.name,'Permission missing or withdrawn'::text as finding from opportunity_desk o where not eligible and milestone not in ('lost','paused')
 union all select 'placement-evidence',p.id,p.name,'Missing or stale observation' from placement_desk p where stale
 union all select 'paid-link',p.id,p.name,'Paid or gifted link lacks a recorded qualifying attribute' from placement_desk p where qualification_gap
 union all select 'consideration',p.id,p.name,'Consideration is unknown' from placement_desk p where consideration='unknown'
 union all select 'win-evidence',o.id,o.name,'Claimed win has no placement record' from opportunities o where milestone='won' and not exists(select 1 from placements p where p.opportunity_id=o.id);
revoke all on opportunity_desk,placement_desk,campaign_desk,compliance_desk from public;
