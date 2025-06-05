alter table saves drop constraint unique_url;

alter table saves add constraint unique_user_url unique (user_id, url);