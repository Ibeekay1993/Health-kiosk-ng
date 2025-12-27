DO $$
DECLARE
    r RECORD;
BEGIN
    -- Backfill Patients
    FOR r IN (SELECT user_id FROM public.patients WHERE custom_id IS NULL) LOOP
        UPDATE public.patients SET custom_id = public.generate_custom_id('HKP') WHERE user_id = r.user_id;
    END LOOP;

    -- Backfill Doctors
    FOR r IN (SELECT user_id FROM public.doctors WHERE custom_id IS NULL) LOOP
        UPDATE public.doctors SET custom_id = public.generate_custom_id('HKD') WHERE user_id = r.user_id;
    END LOOP;

    -- Backfill Vendors
    FOR r IN (SELECT user_id FROM public.vendors WHERE custom_id IS NULL) LOOP
        UPDATE public.vendors SET custom_id = public.generate_custom_id('HKV') WHERE user_id = r.user_id;
    END LOOP;

    -- Backfill Delivery Riders
    FOR r IN (SELECT user_id FROM public.delivery_riders WHERE custom_id IS NULL) LOOP
        UPDATE public.delivery_riders SET custom_id = public.generate_custom_id('HKR') WHERE user_id = r.user_id;
    END LOOP;

    -- Backfill Kiosk Partners
    FOR r IN (SELECT user_id FROM public.kiosk_partners WHERE custom_id IS NULL) LOOP
        UPDATE public.kiosk_partners SET custom_id = public.generate_custom_id('HKK') WHERE user_id = r.user_id;
    END LOOP;
END;
$$;
