-- supabase/migrations/20240729120000_add_get_delivery_dashboard_function.sql

CREATE OR REPLACE FUNCTION get_delivery_dashboard(p_rider_id TEXT)
RETURNS JSON
LANGUAGE plpgsql
AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'pending_pickups_count', (SELECT COUNT(*) FROM orders WHERE status = 'pending_pickup'),
        'active_deliveries_count', (SELECT COUNT(*) FROM orders WHERE status = 'in_transit' AND delivery_rider_id = p_rider_id),
        'completed_today_count', (SELECT COUNT(*) FROM orders WHERE status = 'delivered' AND delivery_rider_id = p_rider_id AND updated_at >= current_date),
        'earnings_today', (SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE status = 'delivered' AND delivery_rider_id = p_rider_id AND updated_at >= current_date),
        'available_pickups', (SELECT json_agg(o) FROM (SELECT o.id as order_id, o.delivery_address as order_delivery_address, o.total_amount as order_total_amount, p.full_name as patient_full_name FROM orders o JOIN patients p ON o.patient_id = p.id WHERE o.status = 'pending_pickup') as o),
        'active_deliveries', (SELECT json_agg(o) FROM (SELECT o.id as order_id, o.delivery_address as order_delivery_address, o.total_amount as order_total_amount, p.full_name as patient_full_name FROM orders o JOIN patients p ON o.patient_id = p.id WHERE o.status = 'in_transit' AND o.delivery_rider_id = p_rider_id) as o),
        'completed_deliveries', (SELECT json_agg(o) FROM (SELECT o.id as order_id, o.delivery_address as order_delivery_address, o.total_amount as order_total_amount, p.full_name as patient_full_name FROM orders o JOIN patients p ON o.patient_id = p.id WHERE o.status = 'delivered' AND o.delivery_rider_id = p_rider_id) as o)
    ) INTO result;
    
    RETURN result;
END;
$$;
