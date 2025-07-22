import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
  } from "@/components/ui/dropdown-menu"; 
  import Link from "next/link";
  
import { CalendarDays, MapPin, Users, FileText, Scale, Eye, EyeOff, MoreVertical, UserPlus, Pencil } from "lucide-react";

export type HackathonStatus = "upcoming" | "just-created" | "active" | "finished";

export interface Hackathon {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  duration: string;
  venue: string;
  visibility: "public" | "private";
  status: HackathonStatus;
  judges: number;
  participants: number;
  submissions: number;
}

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
  hackathon: Hackathon;
}

export const HackathonCard = ({ hackathon }: HackathonCardProps) => {
  const statusStyle = statusConfig[hackathon.status];

  return (
    <Card className="group hover:shadow-hover transition-all duration-300 hover:-translate-y-1 bg-card border border-border shadow-card cursor-pointer">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="text-xl font-semibold text-card-foreground group-hover:text-primary transition-colors">
            {hackathon.title}
          </CardTitle>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Badge className={statusStyle.className}>
              {statusStyle.label}
            </Badge>
            <div className="flex items-center gap-1 text-muted-foreground">
              {hackathon.visibility === "public" ? (
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
          {hackathon.description}
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Date and Duration */}
        <div className="flex items-center gap-2 text-sm">
          <CalendarDays className="h-4 w-4 text-primary" />
          <span className="text-card-foreground font-medium">
            {hackathon.startDate} - {hackathon.endDate}
          </span>
          <Badge variant="outline" className="ml-auto">
            {hackathon.duration}
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
                {hackathon.judges}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">Judges</p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Users className="h-4 w-4 text-primary" />
              <span className="text-lg font-semibold text-card-foreground">
                {hackathon.participants}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">Participants</p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <FileText className="h-4 w-4 text-primary" />
              <span className="text-lg font-semibold text-card-foreground">
                {hackathon.submissions}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">Submissions</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};