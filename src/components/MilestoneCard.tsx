import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle2, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Milestone {
  title: string;
  description: string;
  timeEstimate: string;
  steps: string[];
  imagePrompt: string;
}

interface MilestoneCardProps {
  milestone: Milestone;
  index: number;
}

export const MilestoneCard = ({ milestone, index }: MilestoneCardProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    generateImage();
  }, [milestone.imagePrompt]);

  const generateImage = async () => {
    try {
      setIsGeneratingImage(true);
      const { data, error } = await supabase.functions.invoke('generate-milestone-image', {
        body: { prompt: milestone.imagePrompt }
      });

      if (error) throw error;

      if (data?.imageUrl) {
        setImageUrl(data.imageUrl);
      }
    } catch (error) {
      console.error('Error generating image:', error);
      toast({
        title: 'Image generation failed',
        description: 'Using placeholder for this milestone',
        variant: 'destructive',
      });
    } finally {
      setIsGeneratingImage(false);
    }
  };

  return (
    <Card className="overflow-hidden bg-card border-border hover:border-primary/50 transition-all group">
      <div className="relative h-48 bg-gradient-to-br from-primary/20 to-secondary/20 overflow-hidden">
        {isGeneratingImage ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : imageUrl ? (
          <img 
            src={imageUrl} 
            alt={milestone.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl opacity-20">{index + 1}</span>
          </div>
        )}
        <div className="absolute top-4 left-4">
          <Badge className="bg-accent text-accent-foreground">
            Milestone {index + 1}
          </Badge>
        </div>
      </div>

      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <CardTitle className="text-xl">{milestone.title}</CardTitle>
          <div className="flex items-center text-muted-foreground text-sm">
            <Clock className="h-4 w-4 mr-1" />
            {milestone.timeEstimate}
          </div>
        </div>
        <CardDescription>{milestone.description}</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-2">
          <h4 className="font-semibold text-sm text-primary mb-3">Action Steps:</h4>
          {milestone.steps.map((step, stepIndex) => (
            <div key={stepIndex} className="flex items-start space-x-2">
              <CheckCircle2 className="h-4 w-4 mt-0.5 text-accent flex-shrink-0" />
              <span className="text-sm text-foreground">{step}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
