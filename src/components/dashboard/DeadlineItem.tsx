
import { FileText, Clock } from "lucide-react";

interface DeadlineItemProps {
  title: string;
  subtitle: string;
  daysLeft: number;
  date: string;
  type: "green" | "blue";
}

export function DeadlineItem({ title, subtitle, daysLeft, date, type }: DeadlineItemProps) {
  const colorClasses = {
    green: "text-green-600",
    blue: "text-blue-600"
  };

  return (
    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
      <div className="mt-1">
        <FileText className={`w-5 h-5 ${colorClasses[type]}`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="space-y-1">
          <h4 className={`text-sm font-medium ${colorClasses[type]}`}>{title}</h4>
          <p className="text-sm text-red-600">{subtitle}</p>
        </div>
      </div>
      <div className="text-right space-y-1">
        <div className="flex items-center gap-1 text-gray-500">
          <Clock className="w-3 h-3" />
          <span className="text-xs">{daysLeft} days</span>
        </div>
        <p className="text-xs text-gray-500">{date}</p>
      </div>
    </div>
  );
}