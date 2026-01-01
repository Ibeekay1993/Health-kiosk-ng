
-- Seed Health Education Categories
INSERT INTO health_education_categories (id, title, icon, color) VALUES
('f7e7e7e7-e7e7-e7e7-e7e7-e7e7e7e7e7e1', 'Preventive Health', 'Heart', 'text-primary'),
('f7e7e7e7-e7e7-e7e7-e7e7-e7e7e7e7e7e2', 'Mental Health', 'Brain', 'text-secondary'),
('f7e7e7e7-e7e7-e7e7-e7e7-e7e7e7e7e7e3', 'Chronic Illness', 'Activity', 'text-primary'),
('f7e7e7e7-e7e7-e7e7-e7e7-e7e7e7e7e7e4', 'Wellness Tips', 'Shield', 'text-secondary'),
('f7e7e7e7-e7e7-e7e7-e7e7-e7e7e7e7e7e5', 'Medication Guide', 'Pill', 'text-primary'),
('f7e7e7e7-e7e7-e7e7-e7e7-e7e7e7e7e7e6', 'Community Health', 'Users', 'text-secondary');

-- Seed Health Education Articles
INSERT INTO health_education_articles (title, excerpt, read_time, category_id) VALUES
('Understanding Hypertension', 'Learn about blood pressure management and lifestyle changes...', '5 min read', 'f7e7e7e7-e7e7-e7e7-e7e7-e7e7e7e7e7e3'),
('Mental Health Awareness', 'Breaking the stigma around mental health in Nigeria...', '7 min read', 'f7e7e7e7-e7e7-e7e7-e7e7-e7e7e7e7e7e2'),
('Diabetes Prevention', 'Simple steps to reduce your risk of type 2 diabetes...', '6 min read', 'f7e7e7e7-e7e7-e7e7-e7e7-e7e7e7e7e7e1'),
('Proper Medication Use', 'How to safely take and store your medications...', '4 min read', 'f7e7e7e7-e7e7-e7e7-e7e7-e7e7e7e7e7e5');
