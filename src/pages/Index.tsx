import { useState } from 'react';
import { DreamInput } from '@/components/DreamInput';
import { RoadmapView } from '@/components/RoadmapView';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import heroImage from '@/assets/hero-bg.jpg';

interface RoadmapData {
  title: string;
  description: string;
  totalTimeEstimate: string;
  milestones: Array<{
    title: string;
    description: string;
    timeEstimate: string;
    steps: string[];
    imagePrompt: string;
  }>;
}

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [roadmap, setRoadmap] = useState<RoadmapData | null>(null);
  const { toast } = useToast();

  const handleDreamSubmit = async (dream: string) => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.functions.invoke('generate-roadmap', {
        body: { dream }
      });

      if (error) throw error;

      if (!data) {
        throw new Error('No roadmap data received');
      }

      setRoadmap(data);
      
      toast({
        title: 'Roadmap Created! ✨',
        description: 'Your dream has been transformed into an actionable plan.',
      });
    } catch (error: any) {
      console.error('Error generating roadmap:', error);
      
      let errorMessage = 'Failed to generate roadmap. Please try again.';
      
      if (error.message?.includes('429')) {
        errorMessage = 'Too many requests. Please wait a moment and try again.';
      } else if (error.message?.includes('402')) {
        errorMessage = 'AI service credits depleted. Please contact support.';
      }
      
      toast({
        title: 'Generation Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setRoadmap(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Background */}
      <div 
        className="relative min-h-screen flex items-center justify-center p-6 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(15, 15, 30, 0.85), rgba(15, 15, 30, 0.85)), url(${heroImage})`
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/80" />
        
        <div className="relative z-10 w-full max-w-7xl mx-auto">
          {!roadmap ? (
            <div className="space-y-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="space-y-4">
                <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  Dream to Reality
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
                  Transform your dreams and life goals into visual, actionable roadmaps powered by AI
                </p>
              </div>
              
              <div className="pt-8">
                <DreamInput onSubmit={handleDreamSubmit} isLoading={isLoading} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto pt-12">
                <div className="p-6 rounded-lg bg-card/50 backdrop-blur border border-border">
                  <div className="text-3xl mb-3">🎯</div>
                  <h3 className="font-semibold mb-2 text-primary">Define Your Dream</h3>
                  <p className="text-sm text-muted-foreground">
                    Share any life goal or aspiration
                  </p>
                </div>
                <div className="p-6 rounded-lg bg-card/50 backdrop-blur border border-border">
                  <div className="text-3xl mb-3">✨</div>
                  <h3 className="font-semibold mb-2 text-secondary">AI Magic</h3>
                  <p className="text-sm text-muted-foreground">
                    Watch AI break it into milestones
                  </p>
                </div>
                <div className="p-6 rounded-lg bg-card/50 backdrop-blur border border-border">
                  <div className="text-3xl mb-3">🚀</div>
                  <h3 className="font-semibold mb-2 text-accent">Take Action</h3>
                  <p className="text-sm text-muted-foreground">
                    Follow your personalized roadmap
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <RoadmapView roadmap={roadmap} onBack={handleBack} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
