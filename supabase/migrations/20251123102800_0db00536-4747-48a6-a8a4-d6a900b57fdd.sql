-- Add RLS policies for tables missing them

-- Delivery Riders policies
CREATE POLICY "Delivery riders can view own profile"
ON delivery_riders
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all delivery riders"
ON delivery_riders
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Delivery riders can update own profile"
ON delivery_riders
FOR UPDATE
USING (auth.uid() = user_id);

-- Doctors policies
CREATE POLICY "Doctors can view own profile"
ON doctors
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all doctors"
ON doctors
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Doctors can update own profile"
ON doctors
FOR UPDATE
USING (auth.uid() = user_id);

-- Kiosk Partners policies
CREATE POLICY "Kiosk partners can view own profile"
ON kiosk_partners
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all kiosk partners"
ON kiosk_partners
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Kiosk partners can update own profile"
ON kiosk_partners
FOR UPDATE
USING (auth.uid() = user_id);

-- Orders policies
CREATE POLICY "Patients can view own orders"
ON orders
FOR SELECT
USING (patient_id IN (SELECT id FROM patients WHERE user_id = auth.uid()));

CREATE POLICY "Vendors can view assigned orders"
ON orders
FOR SELECT
USING (vendor_id IN (SELECT id FROM vendors WHERE user_id = auth.uid()));

CREATE POLICY "Delivery riders can view assigned orders"
ON orders
FOR SELECT
USING (delivery_rider_id IN (SELECT id FROM delivery_riders WHERE user_id = auth.uid()));

CREATE POLICY "Admins can view all orders"
ON orders
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Patients can create orders"
ON orders
FOR INSERT
WITH CHECK (patient_id IN (SELECT id FROM patients WHERE user_id = auth.uid()));

CREATE POLICY "Vendors and delivery riders can update orders"
ON orders
FOR UPDATE
USING (
  vendor_id IN (SELECT id FROM vendors WHERE user_id = auth.uid())
  OR delivery_rider_id IN (SELECT id FROM delivery_riders WHERE user_id = auth.uid())
  OR has_role(auth.uid(), 'admin')
);

-- Prescriptions policies
CREATE POLICY "Patients can view own prescriptions"
ON prescriptions
FOR SELECT
USING (patient_id IN (SELECT id FROM patients WHERE user_id = auth.uid()));

CREATE POLICY "Doctors can view prescriptions they created"
ON prescriptions
FOR SELECT
USING (doctor_id IN (SELECT id FROM doctors WHERE user_id = auth.uid()));

CREATE POLICY "Vendors can view assigned prescriptions"
ON prescriptions
FOR SELECT
USING (vendor_id IN (SELECT id FROM vendors WHERE user_id = auth.uid()));

CREATE POLICY "Admins can view all prescriptions"
ON prescriptions
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Doctors can create prescriptions"
ON prescriptions
FOR INSERT
WITH CHECK (doctor_id IN (SELECT id FROM doctors WHERE user_id = auth.uid()));

CREATE POLICY "Doctors can update own prescriptions"
ON prescriptions
FOR UPDATE
USING (doctor_id IN (SELECT id FROM doctors WHERE user_id = auth.uid()));

-- Vendors policies
CREATE POLICY "Vendors can view own profile"
ON vendors
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Public can view active vendors"
ON vendors
FOR SELECT
USING (status = 'active');

CREATE POLICY "Admins can view all vendors"
ON vendors
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Vendors can update own profile"
ON vendors
FOR UPDATE
USING (auth.uid() = user_id);