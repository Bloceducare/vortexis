import { Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useHackathonStore } from "@/store/useHackathonStore";
import { slugify } from "@/lib/utils";
import Hackathon_details from "@/app/api/utils/interface";



interface HackathonCardProps {
  hackathon: Hackathon_details;
}

export function HackathonCard({ hackathon }: HackathonCardProps) {
  const router = useRouter();
        const { setActiveHackathon } = useHackathonStore();

          const handleNavigation = (hackathon: any) => {
          setActiveHackathon(hackathon);
         const slug = slugify(hackathon.title);
          router.push(`/dashboard/${slug}/hackathon`);
        };

  const getDeadlineStatus = (dateString: string | undefined | null) => {
  if (!dateString) return "No deadline";

  const target = new Date(dateString);
  
  if (isNaN(target.getTime())) {
    return "Invalid Date"; 
  }

  const today = new Date();
  const diffInMs = target.getTime() - today.getTime();
  
  if (diffInMs < 0) return "Submission Closed";

  const daysLeft = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
  
  if (daysLeft === 0) return "Closes Today!";
  return `${daysLeft} days left`;
};

console.log("Deadline Raw Data:", hackathon?.submission_deadline);

  const status = getDeadlineStatus(hackathon?.submission_deadline ?? "");
const isClosed = status === "Submission Closed";
const isUrgent = status === "Closes Today!" || status === "1 day left";
        

  return (
    <Card
      className="transition-all p-5 duration-200 hover:shadow-lg hover:-translate-y-1 cursor-pointer"
      onClick={() => handleNavigation(hackathon) }
    >
      {/* <CardContent className="p-6"> */}
      <div className="space-y-4">
        <div>
          <h3 className="text-sm md:text-lg font-medium text-primary mb-2">{hackathon?.title} </h3>
          <span className="inline-block px-2 md:px-3 md:py-1 text-xs font-medium dark:bg-blue-700 bg-blue-100 text-blue-700 rounded-full dark:text-white">
            {status}
          </span>
        </div>

        {/* <div className="space-y-2">
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
          </div> */}

        <div className="flex items-center gap-2 text-orange-600">
          <Clock className="w-4 h-4" />
       

<span className={`text-xs md:text-sm font-medium ${
  isClosed ? "text-red-500" : isUrgent ? "text-orange-500" : "text-gray-600"
}`}>
  {status}
</span>
        </div>
      </div>
      {/* </CardContent> */}
    </Card>
  );
}
