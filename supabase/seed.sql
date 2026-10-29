select set_config('links.actor','fictional-demo',true);
insert into campaigns(id,name,client,owner,target_url) values
 ('10000000-0000-0000-0000-000000000001','Coastal research','Coastal Example','Aroha','https://coastal.example/research'),
 ('10000000-0000-0000-0000-000000000002','Alpine guide','Alpine Example','Morgan','https://alpine.example/guide') on conflict do nothing;
insert into contacts(id,name,email,permission,permission_evidence,permission_date,suppressed_at) values
 ('20000000-0000-0000-0000-000000000001','Jamie Editor','jamie@journal.example','express','Fictional editorial invitation',current_date-40,null),
 ('20000000-0000-0000-0000-000000000002','Alex Publisher','alex@weekly.example','unknown',null,null,null),
 ('20000000-0000-0000-0000-000000000003','Rowan Editor','rowan@review.example','withdrawn','Fictional withdrawal',current_date-10,now()-interval '10 days') on conflict do nothing;
insert into opportunities(id,campaign_id,name,publisher_url,contact_id,milestone,owner,next_due,last_activity) values
 ('30000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000001','Journal research feature','https://journal.example','20000000-0000-0000-0000-000000000001','reply','Aroha',current_date-3,current_date-18),
 ('30000000-0000-0000-0000-000000000002','10000000-0000-0000-0000-000000000001','Weekly reference','https://weekly.example','20000000-0000-0000-0000-000000000002','review','Aroha',current_date-5,current_date-25),
 ('30000000-0000-0000-0000-000000000003','10000000-0000-0000-0000-000000000001','Review feature','https://review.example','20000000-0000-0000-0000-000000000003','contacted','Morgan',current_date-1,current_date-20),
 ('30000000-0000-0000-0000-000000000004','10000000-0000-0000-0000-000000000002','Alpine placement','https://outdoors.example','20000000-0000-0000-0000-000000000001','won','Morgan',null,current_date-10),
 ('30000000-0000-0000-0000-000000000005','10000000-0000-0000-0000-000000000002','Unverified win','https://index.example',null,'won','Morgan',null,current_date-35),
 ('30000000-0000-0000-0000-000000000006','10000000-0000-0000-0000-000000000001','Coastal mention','https://coastnews.example','20000000-0000-0000-0000-000000000001','won','Aroha',null,current_date-45) on conflict do nothing;
insert into placements(id,opportunity_id,name,page_url,target_url,consideration) values
 ('40000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000004','Alpine placement','https://outdoors.example/guide','https://alpine.example/guide','paid'),
 ('40000000-0000-0000-0000-000000000002','30000000-0000-0000-0000-000000000006','Coastal mention','https://coastnews.example/story','https://coastal.example/research','none') on conflict do nothing;
insert into observations(id,placement_id,observed_on,state,rel,evidence,actor) values
 ('50000000-0000-0000-0000-000000000001','40000000-0000-0000-0000-000000000001',current_date-2,'live','','Fictional manual page review','Demo reviewer'),
 ('50000000-0000-0000-0000-000000000002','40000000-0000-0000-0000-000000000002',current_date-45,'missing','','Fictional missing mention review','Demo reviewer') on conflict do nothing;
