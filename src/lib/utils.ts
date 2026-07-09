import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const stripHtml = (htmlString: string) => {
  return htmlString.replace(/<\/?[^>]+(>|$)/g, "");
};



export function normalizeContent(content: string | null | undefined): string {
  if (!content) return "";
  try {
    const parsed = JSON.parse(content);
    if (Array.isArray(parsed)) return parsed.join("");
    if (typeof parsed === "string") return parsed;
    return "";
  } catch {
    return content;
  }
}




export const slugify = (text: string) => {
  return (text || '')
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')    
    .replace(/[\s_-]+/g, '-')    
    .replace(/^-+|-+$/g, '');     
};