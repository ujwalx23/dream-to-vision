import { MilestoneCard } from './MilestoneCard';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar } from 'lucide-react';

interface Milestone {
  title: string;
  description: string;
  timeEstimate: string;
  steps: string[];
  imagePrompt: string;
}

interface RoadmapData {
  title: string;
  description: string;
  totalTimeEstimate: string;
  milestones: Milestone[];
}

interface RoadmapViewProps {
  roadmap: RoadmapData;
  onBack: () => void;
}

export const RoadmapView = ({ roadmap, onBack }: RoadmapViewProps) => {
  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <Button
        onClick={onBack}
        variant="outline"
        className="mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        New Dream
      </Button>

      <div className="text-center space-y-4 mb-12">
        <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
          {roadmap.title}
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          {roadmap.description}
        </p>
        <div className="flex items-center justify-center text-accent">
          <Calendar className="h-5 w-5 mr-2" />
          <span className="font-semibold">Total Journey: {roadmap.totalTimeEstimate}</span>
        </div>
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-secondary to-accent -translate-x-1/2 hidden lg:block" />
        
        <div className="space-y-8">
          {roadmap.milestones.map((milestone, index) => (
            <div
              key={index}
              className="relative animate-in fade-in slide-in-from-bottom-8 duration-700"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Timeline dot */}
              <div className="absolute left-1/2 top-8 w-4 h-4 rounded-full bg-accent border-4 border-background -translate-x-1/2 z-10 hidden lg:block" />
              
              <MilestoneCard milestone={milestone} index={index} />
            </div>
          ))}
        </div>
      </div>

      <div className="text-center pt-8">
        <Button
          onClick={onBack}
          size="lg"
          className="bg-gradient-to-r from-accent to-primary hover:opacity-90 transition-all"
        >
          Create Another Roadmap
        </Button>
      </div>
    </div>
  );
};
