UPDATE public.campaign_config
SET
    campaign_name = replace(campaign_name, 'Paradigm Institute', 'ASMART.TEC'),
    main_message = replace(main_message, 'Paradigm Institute', 'ASMART.TEC'),
    announcement = replace(announcement, 'Paradigm Institute', 'ASMART.TEC'),
    updated_at = now()
WHERE id = '00000000-0000-0000-0000-000000000001'::uuid
  AND (
      campaign_name LIKE '%Paradigm Institute%'
      OR main_message LIKE '%Paradigm Institute%'
      OR announcement LIKE '%Paradigm Institute%'
  );
