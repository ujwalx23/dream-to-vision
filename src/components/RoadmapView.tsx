import { MilestoneCard } from './MilestoneCard';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Download } from 'lucide-react';
import jsPDF from 'jspdf';

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
  const handleDownloadPDF = () => {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 15;
    let yPosition = margin;

    // Title
    pdf.setFontSize(22);
    pdf.setFont('helvetica', 'bold');
    pdf.text(roadmap.title, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 10;

    // Description
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    const descLines = pdf.splitTextToSize(roadmap.description, pageWidth - 2 * margin);
    pdf.text(descLines, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += descLines.length * 5 + 10;

    // Total time
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'italic');
    pdf.text(`Total Journey: ${roadmap.totalTimeEstimate}`, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 15;

    // Milestones
    roadmap.milestones.forEach((milestone, index) => {
      // Check if we need a new page
      if (yPosition > pageHeight - 60) {
        pdf.addPage();
        yPosition = margin;
      }

      // Milestone title
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`${index + 1}. ${milestone.title}`, margin, yPosition);
      yPosition += 7;

      // Time estimate
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'italic');
      pdf.text(`Time: ${milestone.timeEstimate}`, margin, yPosition);
      yPosition += 7;

      // Description
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      const milestoneDescLines = pdf.splitTextToSize(milestone.description, pageWidth - 2 * margin);
      pdf.text(milestoneDescLines, margin, yPosition);
      yPosition += milestoneDescLines.length * 5 + 5;

      // Steps
      milestone.steps.forEach((step, stepIndex) => {
        if (yPosition > pageHeight - 20) {
          pdf.addPage();
          yPosition = margin;
        }
        const stepLines = pdf.splitTextToSize(`• ${step}`, pageWidth - 2 * margin - 5);
        pdf.text(stepLines, margin + 5, yPosition);
        yPosition += stepLines.length * 5;
      });

      yPosition += 10;
    });

    pdf.save(`${roadmap.title.replace(/[^a-z0-9]/gi, '_')}_roadmap.pdf`);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 px-4">
      <Button
        onClick={onBack}
        variant="outline"
        className="mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        New Dream
      </Button>

      <div className="text-center space-y-4 mb-12">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent px-4">
          {roadmap.title}
        </h2>
        <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
          {roadmap.description}
        </p>
        <div className="flex items-center justify-center text-accent flex-wrap gap-2">
          <Calendar className="h-5 w-5" />
          <span className="font-semibold">Total Journey: {roadmap.totalTimeEstimate}</span>
        </div>
        <Button
          onClick={handleDownloadPDF}
          variant="outline"
          className="mt-4"
        >
          <Download className="mr-2 h-4 w-4" />
          Download Roadmap
        </Button>
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

      <div className="text-center pt-8 px-4">
        <Button
          onClick={onBack}
          size="lg"
          className="bg-gradient-to-r from-accent to-primary hover:opacity-90 transition-all w-full sm:w-auto"
        >
          Create Another Roadmap
        </Button>
      </div>
    </div>
  );
};
