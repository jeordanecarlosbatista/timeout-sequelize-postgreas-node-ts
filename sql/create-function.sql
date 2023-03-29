CREATE OR REPLACE FUNCTION public.totalrecords()
 RETURNS integer
 LANGUAGE plpgsql
AS $function$
declare
	total integer;
begin
   PERFORM pg_sleep(35);
   RETURN 1;
END;
$function$
;