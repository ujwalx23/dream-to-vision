import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles } from 'lucide-react';

interface DreamInputProps {
  onSubmit: (dream: string) => void;
  isLoading: boolean;
}

export const DreamInput = ({ onSubmit, isLoading }: DreamInputProps) => {
  const [dream, setDream] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (dream.trim() && !isLoading) {
      onSubmit(dream);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto space-y-4 px-4">
      <div className="relative">
        <Textarea
          value={dream}
          onChange={(e) => setDream(e.target.value)}
          placeholder="Describe your dream... (e.g., 'I want to move to Japan in 2 years' or 'Start a successful bakery business')"
          className="min-h-32 text-base sm:text-lg resize-none bg-card border-border focus:border-primary transition-all"
          disabled={isLoading}
        />
      </div>
      <Button
        type="submit"
        disabled={!dream.trim() || isLoading}
        className="w-full h-14 text-base sm:text-lg font-semibold bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-all"
      >
        {isLoading ? (
          <>
            <Sparkles className="mr-2 h-5 w-5 animate-pulse" />
            Creating Your Roadmap...
          </>
        ) : (
          <>
            <Sparkles className="mr-2 h-5 w-5" />
            Visualize My Dream
          </>
        )}
      </Button>
    </form>
  );
};
