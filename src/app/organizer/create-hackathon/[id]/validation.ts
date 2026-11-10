export type FieldErrors = Record<string, string>;

export const STEPS = [
  "Hackathon Details",
  "Submission",
  "Team Configuration",
  "Prizes",
  "Visibility",
] as const;

/** Which wizard step owns each backend field, so server errors land on the right page. */
export const FIELD_STEP: Record<string, number> = {
  title: 0,
  start_date: 0,
  end_date: 0,
  banner_image_file: 0,
  banner_image: 0,
  description: 0,
  rules: 0,
  details: 0,
  evaluation_criteria: 0,
  submission_deadline: 1,
  min_team_size: 2,
  max_team_size: 2,
  skills: 2,
  grand_prize: 3,
  currency: 3,
  prizes: 3,
  visibility: 4,
  venue: 4,
  organization_id: 4,
  organization: 4,
  non_field_errors: 4,
};

export const FIELD_LABELS: Record<string, string> = {
  title: "Hackathon name",
  start_date: "Start date",
  end_date: "End date",
  banner_image_file: "Banner image",
  description: "Description",
  rules: "Rules & guidelines",
  submission_deadline: "Submission deadline",
  min_team_size: "Minimum team size",
  max_team_size: "Maximum team size",
  skills: "Required skills",
  grand_prize: "Total prize pool",
  currency: "Currency",
  prizes: "Prize breakdown",
  visibility: "Visibility",
  venue: "Venue / location",
  organization_id: "Organization",
};

/** Strips HTML from rich-text editor output so "<p></p>" counts as empty. */
export const isRichTextEmpty = (html?: string | null) =>
  !html || html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim() === "";

const todayISO = () => {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

const isBlank = (v: unknown) => v === undefined || v === null || String(v).trim() === "";

export interface HackathonFormValues {
  title?: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  submission_deadline?: string;
  min_team_size?: number | string;
  max_team_size?: number | string;
  grand_prize?: number;
  venue?: string;
  visibility?: boolean;
  organization_id?: number;
  banner_uploading?: boolean;
}

export function validateStep(step: number, v: HackathonFormValues): FieldErrors {
  const e: FieldErrors = {};

  if (step === 0) {
    if (isBlank(v.title)) e.title = "Hackathon name is required.";
    else if (String(v.title).trim().length > 100) e.title = "Hackathon name must be at most 100 characters.";

    if (isBlank(v.start_date)) e.start_date = "Start date is required.";
    else if (v.start_date! < todayISO()) e.start_date = "Start date cannot be in the past.";

    if (isBlank(v.end_date)) e.end_date = "End date is required.";
    else if (v.start_date && v.end_date! < v.start_date)
      e.end_date = "End date must be on or after the start date.";

    if (isRichTextEmpty(v.description)) e.description = "Description is required.";

    if (v.banner_uploading) e.banner_image_file = "Please wait for the banner upload to finish.";
  }

  if (step === 1) {
    if (isBlank(v.submission_deadline)) e.submission_deadline = "Submission deadline is required.";
    else if (v.end_date && v.submission_deadline! > v.end_date)
      e.submission_deadline = "Submission deadline must be on or before the end date.";
    else if (v.start_date && v.submission_deadline! < v.start_date)
      e.submission_deadline = "Submission deadline must be on or after the start date.";
  }

  if (step === 2) {
    const min = Number(v.min_team_size);
    const max = Number(v.max_team_size);
    if (isBlank(v.min_team_size)) e.min_team_size = "Minimum team size is required.";
    else if (!Number.isInteger(min) || min < 1 || min > 100)
      e.min_team_size = "Minimum team size must be a whole number between 1 and 100.";

    if (isBlank(v.max_team_size)) e.max_team_size = "Maximum team size is required.";
    else if (!Number.isInteger(max) || max < 1 || max > 100)
      e.max_team_size = "Maximum team size must be a whole number between 1 and 100.";
    else if (!e.min_team_size && min > max)
      e.max_team_size = "Maximum team size must be greater than or equal to the minimum.";
  }

  if (step === 3) {
    if (v.grand_prize != null && v.grand_prize < 0) e.grand_prize = "Total prize pool cannot be negative.";
  }

  if (step === 4) {
    if (isBlank(v.venue)) e.venue = "Venue / location is required. Enter a city or \"Virtual\".";
    if (!v.organization_id)
      e.organization_id =
        "No organization selected. Go back to your organizer dashboard, select an organization, then create the hackathon.";
  }

  return e;
}

export function validateAll(v: HackathonFormValues): FieldErrors {
  return STEPS.reduce<FieldErrors>((acc, _s, i) => ({ ...acc, ...validateStep(i, v) }), {});
}

export function firstStepWithError(errors: FieldErrors): number | null {
  const steps = Object.keys(errors).map((k) => FIELD_STEP[k.split(".")[0]] ?? 4);
  return steps.length ? Math.min(...steps) : null;
}

export function stepsWithErrors(errors: FieldErrors): Set<number> {
  return new Set(Object.keys(errors).map((k) => FIELD_STEP[k.split(".")[0]] ?? 4));
}
