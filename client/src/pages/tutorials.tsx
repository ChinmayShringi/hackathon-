import { useState } from "react";
import Navigation from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Play, 
  Clock, 
  Users, 
  BookOpen, 
  Lightbulb, 
  Target,
  CheckCircle,
  ArrowRight,
  Video,
  FileText,
  Zap
} from "lucide-react";

const TUTORIALS = [
  {
    id: 1,
    title: "Getting Started with MagicVidio",
    description: "Learn the basics of AI content creation using our recipe system",
    duration: "5 min",
    difficulty: "Beginner",
    category: "Basics",
    thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
    videoUrl: "#",
    completed: false,
    lessons: 4,
    students: 12847
  },
  {
    id: 2,
    title: "Mastering Digital Art Recipes",
    description: "Create stunning digital illustrations using AI-powered prompts",
    duration: "12 min",
    difficulty: "Intermediate",
    category: "Digital Art",
    thumbnail: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
    videoUrl: "#",
    completed: false,
    lessons: 8,
    students: 9432
  },
  {
    id: 3,
    title: "Social Media Content Strategy",
    description: "Build engaging social media content with viral potential",
    duration: "18 min",
    difficulty: "Intermediate",
    category: "Social Media",
    thumbnail: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
    videoUrl: "#",
    completed: true,
    lessons: 6,
    students: 7823
  },
  {
    id: 4,
    title: "Advanced Prompt Engineering",
    description: "Customize recipes and create your own prompting strategies",
    duration: "25 min",
    difficulty: "Advanced",
    category: "Advanced",
    thumbnail: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
    videoUrl: "#",
    completed: false,
    lessons: 10,
    students: 4567
  },
  {
    id: 5,
    title: "Credit Optimization Strategies",
    description: "Maximize your content output while minimizing credit usage",
    duration: "8 min",
    difficulty: "Beginner",
    category: "Tips",
    thumbnail: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
    videoUrl: "#",
    completed: false,
    lessons: 5,
    students: 8934
  },
  {
    id: 6,
    title: "Marketing & Brand Content",
    description: "Create professional marketing materials and brand assets",
    duration: "15 min",
    difficulty: "Intermediate",
    category: "Marketing",
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
    videoUrl: "#",
    completed: false,
    lessons: 7,
    students: 6234
  }
];

const QUICK_TIPS = [
  {
    icon: Lightbulb,
    title: "Start with Low-Cost Recipes",
    description: "Begin with text overlay and simple editing recipes (1-2 credits) before moving to complex AI generation."
  },
  {
    icon: Target,
    title: "Be Specific with Parameters",
    description: "The more detailed your input parameters, the better your AI-generated results will be."
  },
  {
    icon: Zap,
    title: "Batch Similar Content",
    description: "Create multiple variations of the same concept to maximize your credit efficiency."
  },
  {
    icon: CheckCircle,
    title: "Save Successful Prompts",
    description: "Keep track of parameter combinations that work well for future reference."
  }
];

export default function Tutorials() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTutorial, setSelectedTutorial] = useState<typeof TUTORIALS[0] | null>(null);

  const categories = [
    { value: "all", label: "All Tutorials" },
    { value: "Basics", label: "Basics" },
    { value: "Digital Art", label: "Digital Art" },
    { value: "Social Media", label: "Social Media" },
    { value: "Marketing", label: "Marketing" },
    { value: "Advanced", label: "Advanced" },
    { value: "Tips", label: "Tips" }
  ];

  const filteredTutorials = TUTORIALS.filter(tutorial => 
    selectedCategory === "all" || tutorial.category === selectedCategory
  );

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-500/20 text-green-400";
      case "Intermediate":
        return "bg-yellow-500/20 text-yellow-400";
      case "Advanced":
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  return (
    <div className="min-h-screen bg-dark">
      <Navigation />
      
      <main className="pt-24 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Learn & Master
              <span className="bg-gradient-to-r from-accent-blue to-accent-purple bg-clip-text text-transparent">
                {" "}AI Creation
              </span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              From beginner basics to advanced techniques, learn how to create stunning content with our AI-powered recipes.
            </p>
          </div>

          {/* Learning Path Overview */}
          <div className="bg-card-bg rounded-xl p-8 mb-16">
            <h2 className="text-2xl font-bold mb-6">Your Learning Journey</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="bg-green-500/20 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <BookOpen className="h-8 w-8 text-green-400" />
                </div>
                <h3 className="font-semibold mb-2">Learn Basics</h3>
                <p className="text-gray-400 text-sm">Understand how AI recipes work</p>
              </div>
              <div className="text-center">
                <div className="bg-blue-500/20 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Target className="h-8 w-8 text-blue-400" />
                </div>
                <h3 className="font-semibold mb-2">Practice Skills</h3>
                <p className="text-gray-400 text-sm">Apply techniques with real projects</p>
              </div>
              <div className="text-center">
                <div className="bg-purple-500/20 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Lightbulb className="h-8 w-8 text-purple-400" />
                </div>
                <h3 className="font-semibold mb-2">Get Creative</h3>
                <p className="text-gray-400 text-sm">Develop your unique style</p>
              </div>
              <div className="text-center">
                <div className="bg-yellow-500/20 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-yellow-400" />
                </div>
                <h3 className="font-semibold mb-2">Master Platform</h3>
                <p className="text-gray-400 text-sm">Become a content creation expert</p>
              </div>
            </div>
          </div>

          {/* Category Filter */}
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-8">
            <TabsList className="grid w-full max-w-4xl mx-auto grid-cols-7 bg-card-bg">
              {categories.map((category) => (
                <TabsTrigger
                  key={category.value}
                  value={category.value}
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-accent-blue data-[state=active]:to-accent-purple text-xs"
                >
                  {category.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {/* Tutorial Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {filteredTutorials.map((tutorial) => (
              <Card key={tutorial.id} className="bg-card-bg border-gray-700 overflow-hidden group hover:border-gray-600 transition-all">
                <div className="relative">
                  <img
                    src={tutorial.thumbnail}
                    alt={tutorial.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="lg" className="bg-white/20 hover:bg-white/30 backdrop-blur-sm">
                      <Play className="mr-2 h-5 w-5" />
                      Watch Now
                    </Button>
                  </div>
                  {tutorial.completed && (
                    <div className="absolute top-3 right-3 bg-green-500 rounded-full p-1">
                      <CheckCircle className="h-4 w-4 text-white" />
                    </div>
                  )}
                  <div className="absolute bottom-3 left-3">
                    <Badge className={getDifficultyColor(tutorial.difficulty)}>
                      {tutorial.difficulty}
                    </Badge>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2 text-lg">{tutorial.title}</h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">{tutorial.description}</p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{tutorial.duration}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Video className="h-4 w-4" />
                      <span>{tutorial.lessons} lessons</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>{tutorial.students.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full bg-gradient-to-r from-accent-blue to-accent-purple hover:shadow-lg transition-all"
                    onClick={() => setSelectedTutorial(tutorial)}
                  >
                    {tutorial.completed ? "Review" : "Start Learning"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Tips Section */}
          <div className="bg-card-bg rounded-xl p-8 mb-16">
            <h2 className="text-2xl font-bold mb-6">Quick Tips for Success</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {QUICK_TIPS.map((tip, index) => {
                const IconComponent = tip.icon;
                return (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="bg-accent-blue/20 rounded-lg p-3 flex-shrink-0">
                      <IconComponent className="h-6 w-6 text-accent-blue" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">{tip.title}</h3>
                      <p className="text-gray-400 text-sm">{tip.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Resources Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <Card className="bg-card-bg border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5" />
                  Documentation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 mb-4">
                  Comprehensive guides and reference materials for all platform features.
                </p>
                <Button variant="outline" className="border-gray-600">
                  Browse Docs
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-card-bg border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5" />
                  Community Forum
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 mb-4">
                  Connect with other creators, share tips, and get help from the community.
                </p>
                <Button variant="outline" className="border-gray-600">
                  Join Community
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* CTA Section */}
          <div className="text-center py-16 border-t border-gray-800">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Creating?</h2>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              Put your new skills to the test and create amazing content with our AI-powered recipes
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => window.location.href = "/"}
                className="bg-gradient-to-r from-accent-blue to-accent-purple px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-xl transition-all"
              >
                Browse Recipes
              </Button>
              <Button
                onClick={() => window.location.href = "/gallery"}
                variant="outline"
                className="border-gray-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-800 transition-all"
              >
                View Gallery
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}