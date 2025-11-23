import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Brain, Activity, Shield, Pill, Users } from "lucide-react";

const HealthEducation = () => {
  const categories = [
    { icon: Heart, title: "Preventive Health", color: "text-primary", articles: 12 },
    { icon: Brain, title: "Mental Health", color: "text-secondary", articles: 8 },
    { icon: Activity, title: "Chronic Illness", color: "text-primary", articles: 15 },
    { icon: Shield, title: "Wellness Tips", color: "text-secondary", articles: 20 },
    { icon: Pill, title: "Medication Guide", color: "text-primary", articles: 10 },
    { icon: Users, title: "Community Health", color: "text-secondary", articles: 6 },
  ];

  const articles = [
    {
      title: "Understanding Hypertension",
      category: "Chronic Illness",
      excerpt: "Learn about blood pressure management and lifestyle changes...",
      readTime: "5 min read"
    },
    {
      title: "Mental Health Awareness",
      category: "Mental Health",
      excerpt: "Breaking the stigma around mental health in Nigeria...",
      readTime: "7 min read"
    },
    {
      title: "Diabetes Prevention",
      category: "Preventive Health",
      excerpt: "Simple steps to reduce your risk of type 2 diabetes...",
      readTime: "6 min read"
    },
    {
      title: "Proper Medication Use",
      category: "Medication Guide",
      excerpt: "How to safely take and store your medications...",
      readTime: "4 min read"
    },
  ];

  return (
    <div className="min-h-screen bg-muted/40 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Health Education Hub</h1>
          <p className="text-muted-foreground text-lg">Learn about health, wellness, and disease prevention</p>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
          {categories.map((cat, index) => {
            const Icon = cat.icon;
            return (
              <Card key={index} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <Icon className={`h-12 w-12 ${cat.color} mx-auto mb-3`} />
                  <h3 className="font-semibold text-sm mb-1">{cat.title}</h3>
                  <p className="text-xs text-muted-foreground">{cat.articles} articles</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Featured Articles */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Featured Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {articles.map((article, index) => (
              <Card key={index} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline">{article.category}</Badge>
                    <span className="text-xs text-muted-foreground">{article.readTime}</span>
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
