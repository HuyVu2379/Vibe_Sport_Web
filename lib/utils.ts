import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number | undefined) {
  if (amount === undefined) return "--";
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
}

const TZ = "Asia/Ho_Chi_Minh";

/**
 * Format a date string (YYYY-MM-DD) as a local date, e.g. "Wed, Mar 4".
 * Appends T00:00:00 so JS date constructor treats it as local (not UTC midnight).
 */
export function formatLocalDate(dateString: string): string {
  // Plain date "YYYY-MM-DD" → interpret in local time by appending time
  const date = new Date(`${dateString}T00:00:00`);
  return date.toLocaleDateString("vi-VN", {
    timeZone: TZ,
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

/**
 * Format a full UTC ISO string as a local date in Asia/Ho_Chi_Minh,
 * e.g. "2026-03-04T18:00:00.000Z" → "Th 4, 4 thg 3"
 */
export function formatLocalDateFromISO(isoString: string): string {
  return new Date(isoString).toLocaleDateString("vi-VN", {
    timeZone: TZ,
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

/**
 * Format a UTC ISO string as HH:mm in Asia/Ho_Chi_Minh local time, e.g. "13:00".
 */
export function formatLocalTime(isoString: string): string {
  return new Date(isoString).toLocaleTimeString("vi-VN", {
    timeZone: TZ,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

// ─── Policy Enums ────────────────────────────────────────────────────────────

export type RefundRule = "FULL" | "PARTIAL" | "NONE";
export type DepositType = "NONE" | "PERCENT" | "FULL";

interface PolicyLabel {
  label: string;      // Short label, e.g. "Hoàn tiền đầy đủ"
  description: string; // Detail shown in UI
}

/** Map RefundRule → human-readable label + description */
export function mapRefundRule(rule: RefundRule, cancelBeforeHours: number, depositPercentage?: number): PolicyLabel {
  switch (rule) {
    case "FULL":
      return {
        label: "Hoàn tiền 100%",
        description: `Hoàn tiền toàn bộ nếu hủy trước ${cancelBeforeHours} giờ`,
      };
    case "PARTIAL":
      return {
        label: "Hoàn tiền một phần",
        description: `Hoàn tiền một phần (${depositPercentage ?? 0}%) nếu hủy trước ${cancelBeforeHours} giờ`,
      };
    case "NONE":
    default:
      return {
        label: "Không hoàn tiền",
        description: "Không hoàn tiền khi hủy booking",
      };
  }
}

/** Map DepositType → human-readable label + description */
export function mapDepositType(type: DepositType, percentage?: number): PolicyLabel {
  switch (type) {
    case "FULL":
      return {
        label: "Thanh toán toàn bộ",
        description: "Thanh toán 100% ngay khi đặt booking",
      };
    case "PERCENT":
      return {
        label: `Đặt cọc ${percentage ?? 0}%`,
        description: `Cần đặt cọc ${percentage ?? 0}% tổng giá trị khi đặt`,
      };
    case "NONE":
    default:
      return {
        label: "Không cần đặt cọc",
        description: "Thanh toán tại sân khi đến chơi",
      };
  }
}
