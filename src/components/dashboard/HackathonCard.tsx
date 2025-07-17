
import { Clock } from "lucide-react";
import Card from "@/components/ui/card";

interface HackathonCardProps {
  title: string;
  status: "ACTIVE" | "UPCOMING" | "COMPLETED";
  progress: number;
  daysLeft: number;
}

export function HackathonCard({ title, status, progress, daysLeft }: HackathonCardProps) {
  return (
    <Card className="transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
      {/* <CardContent className="p-6"> */}
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium text-primary mb-2">{title}</h3>
            <span className="inline-block px-3 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
              {status}
            </span>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium text-primary">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-orange-600">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">{daysLeft} days left</span>
          </div>
        </div>
      {/* </CardContent> */}
    </Card>
  );
}