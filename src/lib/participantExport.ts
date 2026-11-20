import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import api from "./api";

export interface ExportParticipantRecord {
  fullName: string;
  email: string;
  username: string;
  teamName: string;
  teamId?: string | number;
  role: "Team Leader" | "Member" | "Individual participant";
  isLeader: boolean;
  joinedDate?: string;
}

export interface ExportHackathonMetadata {
  hackathonId: string | number;
  hackathonTitle: string;
  startDate?: string;
  endDate?: string;
  exportDate: string;
  totalParticipants: number;
  totalTeams: number;
  totalLeaders: number;
}

export type ExportFormat = "csv" | "xlsx" | "pdf";

/**
 * Safely generate a filename from the hackathon title and current date
 * e.g., web3bridge-xv-hackathon-participants-2026-11-20.xlsx
 */
export function generateExportFilename(
  hackathonTitle: string | undefined,
  extension: ExportFormat
): string {
  const safeName = (hackathonTitle || "hackathon")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const dateStr = new Date().toISOString().split("T")[0];
  return `${safeName || "hackathon"}-participants-${dateStr}.${extension}`;
}

/**
 * Normalizes raw participant and team API data into a flat array of participant records
 */
export function normalizeParticipantData(rawData: any): {
  records: ExportParticipantRecord[];
  totalTeams: number;
  totalLeaders: number;
} {
  const rawItems = Array.isArray(rawData)
    ? rawData
    : Array.isArray(rawData?.results)
    ? rawData.results
    : Array.isArray(rawData?.teams)
    ? rawData.teams
    : [];

  const records: ExportParticipantRecord[] = [];
  const seenKeys = new Set<string>();
  const uniqueTeams = new Set<string | number>();
  let leaderCount = 0;

  rawItems.forEach((item: any) => {
    // 1. Team structure with members
    if (item && Array.isArray(item.members) && item.members.length > 0) {
      const teamName = item.name || "Unnamed Team";
      const teamId = item.id !== undefined ? item.id : "N/A";
      uniqueTeams.add(teamId);

      const creatorId = item.creator?.id;
      const creatorUsername = item.creator?.username;

      // Check if creator is already present in members list
      const creatorInMembers = item.members.some(
        (m: any) =>
          (creatorId !== undefined && m.id === creatorId) ||
          (creatorUsername && m.username === creatorUsername) ||
          m.is_creator === true
      );

      // If creator is not in members array, include creator as team leader
      if (!creatorInMembers && item.creator) {
        const creatorFullName =
          `${item.creator.first_name || ""} ${item.creator.last_name || ""}`.trim() ||
          item.creator.username ||
          "Unknown";

        const key = `creator_${item.creator.id || item.creator.username}_${teamId}`;
        if (!seenKeys.has(key)) {
          seenKeys.add(key);
          leaderCount++;
          records.push({
            fullName: creatorFullName,
            email: item.creator.email || "N/A",
            username: item.creator.username ? `@${item.creator.username}` : "N/A",
            teamName,
            teamId,
            role: "Team Leader",
            isLeader: true,
            joinedDate: item.created_at
              ? new Date(item.created_at).toLocaleDateString()
              : undefined,
          });
        }
      }

      // Add each team member
      item.members.forEach((member: any) => {
        const isLeader = Boolean(
          member.is_creator === true ||
          (creatorId !== undefined && member.id === creatorId) ||
          (creatorUsername && member.username === creatorUsername)
        );

        if (isLeader) leaderCount++;

        const fullName =
          `${member.first_name || ""} ${member.last_name || ""}`.trim() ||
          member.username ||
          "Unknown";

        const key = `member_${member.id || member.username || member.email}_${teamId}`;
        if (!seenKeys.has(key)) {
          seenKeys.add(key);
          records.push({
            fullName,
            email: member.email || "N/A",
            username: member.username ? `@${member.username}` : "N/A",
            teamName,
            teamId,
            role: isLeader ? "Team Leader" : "Member",
            isLeader,
            joinedDate: item.created_at
              ? new Date(item.created_at).toLocaleDateString()
              : undefined,
          });
        }
      });
    } else if (item && (item.username || item.first_name || item.email)) {
      // 2. Individual participant record (unassigned to a team)
      const fullName =
        `${item.first_name || ""} ${item.last_name || ""}`.trim() ||
        item.username ||
        "Unknown";

      const key = `individual_${item.id || item.username || item.email}`;
      if (!seenKeys.has(key)) {
        seenKeys.add(key);
        records.push({
          fullName,
          email: item.email || "N/A",
          username: item.username ? `@${item.username}` : "N/A",
          teamName: "Not assigned",
          teamId: "N/A",
          role: "Individual participant",
          isLeader: false,
          joinedDate: item.created_at
            ? new Date(item.created_at).toLocaleDateString()
            : undefined,
        });
      }
    }
  });

  // Check for any unassigned participants returned under separate keys
  const unassigned =
    rawData?.unassigned_participants ||
    rawData?.solo_participants ||
    rawData?.participants_without_team;

  if (Array.isArray(unassigned)) {
    unassigned.forEach((p: any) => {
      const fullName =
        `${p.first_name || ""} ${p.last_name || ""}`.trim() ||
        p.username ||
        "Unknown";

      const key = `unassigned_${p.id || p.username || p.email}`;
      if (!seenKeys.has(key)) {
        seenKeys.add(key);
        records.push({
          fullName,
          email: p.email || "N/A",
          username: p.username ? `@${p.username}` : "N/A",
          teamName: "Not assigned",
          teamId: "N/A",
          role: "Individual participant",
          isLeader: false,
          joinedDate: p.created_at
            ? new Date(p.created_at).toLocaleDateString()
            : undefined,
        });
      }
    });
  }

  return {
    records,
    totalTeams: uniqueTeams.size,
    totalLeaders: leaderCount,
  };
}

/**
 * Fetches all participants across all pagination pages if the backend paginates
 */
export async function fetchAllHackathonParticipants(
  hackathonId: string | number
): Promise<any[]> {
  const allResults: any[] = [];
  let nextUrl: string | null = `/hackathon/${hackathonId}/participants/`;

  while (nextUrl) {
    const res: any = await api.get(nextUrl);
    const data: any = res.data;

    if (Array.isArray(data)) {
      return data;
    }

    if (Array.isArray(data?.results)) {
      allResults.push(...data.results);
      if (data.next) {
        try {
          const parsed: URL = new URL(data.next, typeof window !== "undefined" ? window.location.origin : "http://localhost");
          nextUrl = `${parsed.pathname}${parsed.search}`;
        } catch {
          nextUrl = data.next;
        }
      } else {
        nextUrl = null;
      }
    } else if (Array.isArray(data?.teams)) {
      allResults.push(...data.teams);
      if (Array.isArray(data?.unassigned_participants)) {
        allResults.push(...data.unassigned_participants);
      }
      nextUrl = null;
    } else {
      return [data];
    }
  }

  return allResults;
}

/**
 * Helper to trigger a file download in the browser
 */
function triggerBrowserDownload(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.style.display = "none";
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, 200);
}

/**
 * CSV Escape function
 */
function escapeCSV(val: string | number | undefined | null): string {
  if (val === undefined || val === null) return '""';
  const str = String(val);
  if (str.includes(",") || str.includes('"') || str.includes("\n") || str.includes("\r")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return `"${str}"`;
}

/**
 * Generate and download CSV export
 */
export function exportParticipantsToCSV(
  metadata: ExportHackathonMetadata,
  records: ExportParticipantRecord[]
) {
  const lines: string[] = [];

  // Header metadata block
  lines.push("# ============================================================");
  lines.push(`# HACKATHON PARTICIPANT REPORT`);
  lines.push(`# Hackathon: ${metadata.hackathonTitle}`);
  lines.push(`# Start Date: ${metadata.startDate || "N/A"}`);
  lines.push(`# End Date: ${metadata.endDate || "N/A"}`);
  lines.push(`# Export Generated: ${metadata.exportDate}`);
  lines.push(`# Total Participants: ${metadata.totalParticipants}`);
  lines.push(`# Total Teams: ${metadata.totalTeams}`);
  lines.push(`# Total Team Leaders: ${metadata.totalLeaders}`);
  lines.push("# ============================================================");
  lines.push("");

  // Tabular column headers
  const columns = [
    "Participant",
    "Email",
    "Username",
    "Team",
    "Role",
    "Joined Date",
  ];
  lines.push(columns.map(escapeCSV).join(","));

  // Rows
  if (records.length === 0) {
    lines.push(escapeCSV("No participants registered yet.") + ",,,,");
  } else {
    records.forEach((r) => {
      lines.push(
        [
          r.fullName,
          r.email,
          r.username,
          r.teamName,
          r.role,
          r.joinedDate || "N/A",
        ]
          .map(escapeCSV)
          .join(",")
      );
    });
  }

  // Prepend UTF-8 BOM so Excel opens accented & international characters cleanly
  const csvContent = "\uFEFF" + lines.join("\r\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const filename = generateExportFilename(metadata.hackathonTitle, "csv");
  triggerBrowserDownload(blob, filename);
}

/**
 * Generate and download Excel (.xlsx) export
 */
export function exportParticipantsToExcel(
  metadata: ExportHackathonMetadata,
  records: ExportParticipantRecord[]
) {
  const wsData: any[][] = [];

  // Metadata Block
  wsData.push(["HACKATHON PARTICIPANT REPORT"]);
  wsData.push(["Hackathon:", metadata.hackathonTitle]);
  wsData.push(["Start Date:", metadata.startDate || "N/A"]);
  wsData.push(["End Date:", metadata.endDate || "N/A"]);
  wsData.push(["Export Generated:", metadata.exportDate]);
  wsData.push(["Total Participants:", metadata.totalParticipants]);
  wsData.push(["Total Teams:", metadata.totalTeams]);
  wsData.push(["Total Team Leaders:", metadata.totalLeaders]);
  wsData.push([]); // blank row separator

  // Table Headers
  const tableHeader = [
    "Participant",
    "Email",
    "Username",
    "Team",
    "Role",
    "Joined Date",
  ];
  wsData.push(tableHeader);

  // Table Rows
  if (records.length === 0) {
    wsData.push(["No participants registered yet.", "", "", "", "", ""]);
  } else {
    records.forEach((r) => {
      wsData.push([
        r.fullName,
        r.email,
        r.username,
        r.teamName,
        r.role,
        r.joinedDate || "N/A",
      ]);
    });
  }

  const ws = XLSX.utils.aoa_to_sheet(wsData);

  // Column width formatting
  ws["!cols"] = [
    { wch: 28 }, // Participant Name
    { wch: 34 }, // Email
    { wch: 20 }, // Username
    { wch: 28 }, // Team Name
    { wch: 24 }, // Role
    { wch: 18 }, // Joined Date
  ];

  // Enable AutoFilter on the participant records table
  if (records.length > 0) {
    const headerRowIndex = 9; // 0-indexed row for tableHeader
    const lastRowIndex = headerRowIndex + records.length;
    ws["!autofilter"] = {
      ref: `A${headerRowIndex + 1}:F${lastRowIndex + 1}`,
    };
  }

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Participants");

  const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const blob = new Blob([wbout], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const filename = generateExportFilename(metadata.hackathonTitle, "xlsx");
  triggerBrowserDownload(blob, filename);
}

/**
 * Generate and download PDF export
 */
export function exportParticipantsToPDF(
  metadata: ExportHackathonMetadata,
  records: ExportParticipantRecord[]
) {
  // Landscape orientation allows generous spacing for tables with emails and team names
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  const primaryColor: [number, number, number] = [79, 70, 229]; // Indigo-600 #4f46e5
  const darkTextColor: [number, number, number] = [31, 41, 55]; // Gray-800
  const lightBgColor: [number, number, number] = [243, 244, 246]; // Gray-100

  // Title & Header Accent Bar
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, doc.internal.pageSize.getWidth(), 8, "F");

  doc.setFontSize(20);
  doc.setTextColor(...primaryColor);
  doc.setFont("helvetica", "bold");
  doc.text("Hackathon Participant Report", 14, 20);

  doc.setFontSize(12);
  doc.setTextColor(...darkTextColor);
  doc.setFont("helvetica", "normal");
  doc.text(metadata.hackathonTitle, 14, 27);

  // Metadata Box
  doc.setFillColor(...lightBgColor);
  doc.roundedRect(14, 32, doc.internal.pageSize.getWidth() - 28, 22, 3, 3, "F");

  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...primaryColor);

  // Left Column
  doc.text("Start Date:", 18, 38);
  doc.text("End Date:", 18, 44);
  doc.text("Generated:", 18, 50);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(...darkTextColor);
  doc.text(metadata.startDate || "N/A", 42, 38);
  doc.text(metadata.endDate || "N/A", 42, 44);
  doc.text(metadata.exportDate, 42, 50);

  // Right Column (Stats)
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...primaryColor);
  doc.text("Total Participants:", 160, 38);
  doc.text("Total Teams:", 160, 44);
  doc.text("Team Leaders:", 160, 50);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(...darkTextColor);
  doc.text(String(metadata.totalParticipants), 195, 38);
  doc.text(String(metadata.totalTeams), 195, 44);
  doc.text(String(metadata.totalLeaders), 195, 50);

  // Participant Table
  const tableHeaders = [
    "Participant",
    "Email",
    "Username",
    "Team",
    "Role",
    "Joined Date",
  ];

  const tableBody =
    records.length === 0
      ? [["No participants registered for this hackathon.", "", "", "", "", ""]]
      : records.map((r) => [
          r.fullName,
          r.email,
          r.username,
          r.teamName,
          r.role,
          r.joinedDate || "N/A",
        ]);

  autoTable(doc, {
    startY: 58,
    head: [tableHeaders],
    body: tableBody,
    theme: "striped",
    headStyles: {
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 9,
      halign: "left",
    },
    styles: {
      fontSize: 8.5,
      textColor: darkTextColor,
      cellPadding: 2.5,
      overflow: "linebreak",
    },
    alternateRowStyles: {
      fillColor: [249, 250, 251], // Gray-50
    },
    columnStyles: {
      0: { cellWidth: 48, fontStyle: "bold" }, // Name
      1: { cellWidth: 62 }, // Email
      2: { cellWidth: 36 }, // Username
      3: { cellWidth: 54 }, // Team Name
      4: { cellWidth: 40 }, // Role
      5: { cellWidth: 26, halign: "center" }, // Joined Date
    },
    didParseCell: (data) => {
      // Highlight Team Leader in Role column
      if (data.section === "body" && data.column.index === 4) {
        if (data.cell.raw === "Team Leader") {
          data.cell.styles.fontStyle = "bold";
          data.cell.styles.textColor = [79, 70, 229]; // Indigo
        } else if (data.cell.raw === "Individual participant") {
          data.cell.styles.textColor = [156, 163, 175]; // Gray-400
        }
      }
    },
    didDrawPage: (data) => {
      // Footer: Page Number & Platform tag
      const pageCount = doc.getNumberOfPages();
      const currentPage = data.pageNumber;
      doc.setFontSize(8);
      doc.setTextColor(156, 163, 175);
      doc.text(
        `Vortexis Hackathon Platform • Page ${currentPage} of ${pageCount}`,
        doc.internal.pageSize.getWidth() / 2,
        doc.internal.pageSize.getHeight() - 6,
        { align: "center" }
      );
    },
  });

  const filename = generateExportFilename(metadata.hackathonTitle, "pdf");
  doc.save(filename);
}

/**
 * Universal export orchestrator
 */
export async function exportParticipants(
  format: ExportFormat,
  hackathon: {
    id: string | number;
    title: string;
    start_date?: string;
    end_date?: string;
  },
  existingTeamsOrParticipants?: any[]
): Promise<{
  filename: string;
  totalParticipants: number;
  totalTeams: number;
  totalLeaders: number;
}> {
  let rawData = existingTeamsOrParticipants;

  try {
    // Attempt to fetch all pages to guarantee a complete dataset
    const fetched = await fetchAllHackathonParticipants(hackathon.id);
    if (fetched && fetched.length > 0) {
      rawData = fetched;
    }
  } catch (err) {
    console.warn("Could not fetch full participants list via API, using provided records:", err);
    if (!rawData || rawData.length === 0) {
      throw err;
    }
  }

  const { records, totalTeams, totalLeaders } = normalizeParticipantData(rawData);

  const now = new Date();
  const exportDate = `${now.toISOString().split("T")[0]} ${now.toLocaleTimeString("en-US", {
    hour12: false,
  })}`;

  const metadata: ExportHackathonMetadata = {
    hackathonId: hackathon.id,
    hackathonTitle: hackathon.title || "Hackathon",
    startDate: hackathon.start_date
      ? new Date(hackathon.start_date).toLocaleDateString()
      : undefined,
    endDate: hackathon.end_date
      ? new Date(hackathon.end_date).toLocaleDateString()
      : undefined,
    exportDate,
    totalParticipants: records.length,
    totalTeams,
    totalLeaders,
  };

  switch (format) {
    case "csv":
      exportParticipantsToCSV(metadata, records);
      break;
    case "xlsx":
      exportParticipantsToExcel(metadata, records);
      break;
    case "pdf":
      exportParticipantsToPDF(metadata, records);
      break;
  }

  const filename = generateExportFilename(metadata.hackathonTitle, format);
  return {
    filename,
    totalParticipants: records.length,
    totalTeams,
    totalLeaders,
  };
}
