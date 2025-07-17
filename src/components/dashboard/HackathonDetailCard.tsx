

import Card from "@/components/ui/card";

interface HackathonDetailCardProps {
  title: string;
  description: string;
  status: "in progress" | "upcoming" | "completed";
  deadline: string;
  progress: number;
}

export function HackathonDetailCard({ 
  title, 
  description, 
  status, 
  deadline, 
  progress 
}: HackathonDetailCardProps) {
  return (
    <Card className="w-full hover:shadow-lg transition-shadow duration-200">
      <div className="p-6 space-y-4">
        <div>
          <h3 className="text-xl font-semibold text-blue-600 mb-2">{title}</h3>
          <p className="text-muted-foreground text-sm">{description}</p>
        </div>
        
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            This hackathon is currently {status}. Deadline: {deadline}
          </p>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Progress: {progress}%</span>
            </div>
            {/* <Progress value={progress} className="h-2" /> */}
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}