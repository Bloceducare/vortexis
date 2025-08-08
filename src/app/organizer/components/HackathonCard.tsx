"use client"
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
  } from "@/components/ui/dropdown-menu"; 
  import Link from "next/link";
  import Hackathon_details from "@/app/api/utils/interface";
  import HtmlContent from "@/components/ui/HtMLContent";
  
import { CalendarDays, MapPin, Users, FileText, Scale, Eye, EyeOff, MoreVertical, UserPlus, Pencil } from "lucide-react";
import { useRouter } from 'next/navigation';


export type HackathonStatus = "upcoming" | "just-created" | "active" | "finished";


const statusConfig = {
  upcoming: {
    label: "Upcoming",
    className: "bg-blue-100 text-blue-700",
  },
  "just-created": {
    label: "Just Created",
    className: "bg-yellow-100 text-yellow-700",
  },
  active: {
    label: "Active",
    className: "bg-green-100 text-green-700",
  },
  finished: {
    label: "Finished",
    className: "bg-gray-200 text-gray-700",
  }
};

interface HackathonCardProps {
  hackathon: Hackathon_details;
}

export const HackathonCard = ({ hackathon }: HackathonCardProps) => {

  const router = useRouter();
  const getDurationInDays = (start: string, end: string): number => {
    const startDate = new Date(start);
    const endDate = new Date(end);
  
    const diffInMs = endDate.getTime() - startDate.getTime();
    const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
    return diffInDays;
  };

  const navigateToDashboard = (hackathon_id: string | undefined) => {
    router.push(`/organizer/${hackathon_id}/hackathon`)
  }  

  return (
    <Card className="group hover:shadow-hover transition-all duration-300 hover:-translate-y-1 bg-card border border-border shadow-card cursor-pointer" onClick={() => navigateToDashboard(hackathon.id)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="text-xl font-semibold text-card-foreground group-hover:text-primary transition-colors">
            {hackathon.title}
          </CardTitle>
          <div className="flex items-center gap-2 flex-shrink-0">
          
            <div className="flex items-center gap-1 text-muted-foreground">
              {hackathon.visibility === true ? (
                <Eye className="h-4 w-4" />
              ) : (
                <EyeOff className="h-4 w-4" />
              )}
              <span className="text-xs font-medium capitalize">
                {hackathon.visibility}
              </span>
            </div>


            <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <button className="p-1 rounded hover:bg-muted cursor-pointer">
        <MoreVertical className="w-4 h-4 text-muted-foreground" />
      </button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" className="w-48">
      <DropdownMenuItem asChild>
        <Link href={`/organizer/${hackathon.id}/participants`} className="flex items-center gap-2">
          <Users className="w-4 h-4" /> View Participants
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem asChild>
        <Link href={`/organizer/${hackathon.id}/judges`} className="flex items-center gap-2">
          <Scale className="w-4 h-4" /> View Judges
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem asChild>
        <Link href={`/organizer/${hackathon.id}/submission`} className="flex items-center gap-2">
          <FileText className="w-4 h-4" /> View Submissions
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem asChild>
        <Link href={`/organizer/${hackathon.id}/judges`} className="flex items-center gap-2">
          <UserPlus className="w-4 h-4" /> Invite Judges
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem asChild>
        <Link href={`/organizer/${hackathon.id}/edit`} className="flex items-center gap-2">
          <Pencil className="w-4 h-4" /> Edit
        </Link>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>

          </div>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {hackathon.description && (
          <HtmlContent html={hackathon?.description} />
          )}
          
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Date and Duration */}
        <div className="flex items-center gap-2 text-sm">
          <CalendarDays className="h-4 w-4 text-primary" />
          <span className="text-card-foreground font-medium">
            {hackathon.start_date} - {hackathon.end_date}
          </span>
          <Badge variant="outline" className="ml-auto">
         {getDurationInDays(hackathon.start_date!, hackathon.end_date!)} days
          </Badge>
        </div>

        {/* Venue */}
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="h-4 w-4 text-primary" />
          <span className="text-muted-foreground">{hackathon.venue}</span>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 pt-2">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Scale className="h-4 w-4 text-primary" />
              <span className="text-lg font-semibold text-card-foreground">
                {hackathon.judges?.length}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">Judges</p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Users className="h-4 w-4 text-primary" />
              <span className="text-lg font-semibold text-card-foreground">
                {hackathon.participants?.length}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">Participants</p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <FileText className="h-4 w-4 text-primary" />
              <span className="text-lg font-semibold text-card-foreground">
                {hackathon.submissions?.length}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">Submissions</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};