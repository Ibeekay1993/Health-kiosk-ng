
CREATE TABLE health_education_articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    excerpt TEXT,
    read_time TEXT,
    category_id UUID NOT NULL REFERENCES health_education_categories(id)
);
