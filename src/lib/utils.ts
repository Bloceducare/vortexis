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


export const formatStat = (value: number) =>
  value < 10 ? `${value}+` : `${Math.floor(value / 10) * 10}+`;


export function formatCurrency(
  amount: number,
  currency: string = "USD"
) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
}



export type CurrencyOption = {
  code: string;
  name: string;
  symbol: string;
  flag: string;
  label: string;
};

const CURRENCY_FLAGS: Record<string, string> = {
  USD: "🇺🇸",
  EUR: "🇪🇺",
  GBP: "🇬🇧",
  NGN: "🇳🇬",
  CAD: "🇨🇦",
  AUD: "🇦🇺",
  JPY: "🇯🇵",
  CNY: "🇨🇳",
  INR: "🇮🇳",
  GHS: "🇬🇭",
  KES: "🇰🇪",
  ZAR: "🇿🇦",
  AED: "🇦🇪",
  BRL: "🇧🇷",
  MXN: "🇲🇽",
  CHF: "🇨🇭",
  SGD: "🇸🇬",
  HKD: "🇭🇰",
  KRW: "🇰🇷",
  TRY: "🇹🇷",
  EGP: "🇪🇬",
  MAD: "🇲🇦",
  XOF: "🌍",
  XAF: "🌍",
};

const currencyNames = new Intl.DisplayNames(["en"], {
  type: "currency",
});

export const CURRENCY_OPTIONS: CurrencyOption[] =
  Intl.supportedValuesOf("currency").map((code) => {
    const name = currencyNames.of(code) ?? code;

    const symbol = new Intl.NumberFormat("en", {
      style: "currency",
      currency: code,
      currencyDisplay: "narrowSymbol",
    })
      .formatToParts(0)
      .find((part) => part.type === "currency")?.value ?? code;

    const flag = CURRENCY_FLAGS[code] ?? "🌐";

    return {
      code,
      name,
      symbol,
      flag,
      label: `${flag} ${code} — ${name} (${symbol})`,
    };
  });
