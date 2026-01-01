
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Brain, Activity, Shield, Pill, Users } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';

const icons = {
  Heart,
  Brain,
  Activity,
  Shield,
  Pill,
  Users,
};

interface Category {
  id: string;
  title: string;
  icon: keyof typeof icons;
  color: string;
  articles: { count: number }[];
}

interface Article {
  id: string;
  title: string;
  excerpt: string;
  read_time: string;
  health_education_categories: {
    title: string;
  };
}

const HealthEducation = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const { data: categoriesData, error: categoriesError } = await supabase
          .from('health_education_categories')
          .select('*, articles:health_education_articles(count)');

        if (categoriesError) throw categoriesError;
        setCategories(categoriesData || []);

        const { data: articlesData, error: articlesError } = await supabase
          .from('health_education_articles')
          .select('*, health_education_categories(title)');

        if (articlesError) throw articlesError;
        setArticles(articlesData || []);

      } catch (error: any) {
        console.error('Error fetching health education data:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const renderIcon = (iconName: keyof typeof icons) => {
    const Icon = icons[iconName];
    return Icon ? <Icon className={`h-12 w-12 text-primary mx-auto mb-3`} /> : null;
  };

  if (loading) {
    return <div>Loading...</div>; // Or a more sophisticated loading state
  }

  return (
    <div className="min-h-screen bg-muted/40 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Health Education Hub</h1>
          <p className="text-muted-foreground text-lg">Learn about health, wellness, and disease prevention</p>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
          {categories.map((cat) => {
            return (
              <Card key={cat.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  {renderIcon(cat.icon)}
                  <h3 className="font-semibold text-sm mb-1">{cat.title}</h3>
                  <p className="text-xs text-muted-foreground">{cat.articles[0].count} articles</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Featured Articles */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Featured Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {articles.map((article) => (
              <Card key={article.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline">{article.health_education_categories.title}</Badge>
                    <span className="text-xs text-muted-foreground">{article.read_time}</span>
                  </div>
                  <CardTitle className="text-xl">{article.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{article.excerpt}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Key Messages */}
        <Card className="bg-gradient-to-r from-primary to-secondary text-white">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-4">Important Health Messages</h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Shield className="h-6 w-6 flex-shrink-0 mt-1" />
                <span>Regular health checkups can prevent serious illnesses</span>
              </li>
              <li className="flex items-start gap-3">
                <Brain className="h-6 w-6 flex-shrink-0 mt-1" />
                <span>Mental health is just as important as physical health</span>
              </li>
              <li className="flex items-start gap-3">
                <Heart className="h-6 w-6 flex-shrink-0 mt-1" />
                <span>A healthy lifestyle includes balanced diet and exercise</span>
              </li>
              <li className="flex items-start gap-3">
                <Users className="h-6 w-6 flex-shrink-0 mt-1" />
                <span>Community support improves health outcomes</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HealthEducation;
