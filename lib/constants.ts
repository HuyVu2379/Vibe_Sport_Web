// Application constants

export const BOOKING_STATUS = {
  HOLD: "HOLD",
  CONFIRMED: "CONFIRMED",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
} as const;

export type BookingStatus = (typeof BOOKING_STATUS)[keyof typeof BOOKING_STATUS];

export const SLOT_STATUS = {
  AVAILABLE: "AVAILABLE",
  HOLD: "HOLD",
  BOOKED: "BOOKED",
} as const;

export type SlotStatus = (typeof SLOT_STATUS)[keyof typeof SLOT_STATUS];

export const DEPOSIT_TYPE = {
  NONE: "NONE",
  PERCENTAGE: "PERCENTAGE",
  FULL: "FULL",
} as const;

export type DepositType = (typeof DEPOSIT_TYPE)[keyof typeof DEPOSIT_TYPE];

export const USER_ROLE = {
  CUSTOMER: "CUSTOMER",
  OWNER: "OWNER",
  STAFF: "STAFF",
  ADMIN: "ADMIN",
} as const;

export type UserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];

export const SPORT_TYPES = [
  { id: "FOOTBALL", label: "Football", icon: "⚽" },
  { id: "BASKETBALL", label: "Basketball", icon: "🏀" },
  { id: "TENNIS", label: "Tennis", icon: "🎾" },
  { id: "BADMINTON", label: "Badminton", icon: "🏸" },
  { id: "VOLLEYBALL", label: "Volleyball", icon: "🏐" },
  { id: "PICKLEBALL", label: "Futsal", icon: "⚽" },
] as const;
export type SportType = (typeof SPORT_TYPES)[number]["id"];

// Status color mapping for consistent UI
export const STATUS_COLORS = {
  [BOOKING_STATUS.HOLD]: {
    bg: "bg-status-hold/15",
    text: "text-status-hold",
    border: "border-status-hold/30",
    class: "status-hold",
  },
  [BOOKING_STATUS.CONFIRMED]: {
    bg: "bg-status-confirmed/15",
    text: "text-status-confirmed",
    border: "border-status-confirmed/30",
    class: "status-confirmed",
  },
  [BOOKING_STATUS.COMPLETED]: {
    bg: "bg-status-completed/15",
    text: "text-status-completed",
    border: "border-status-completed/30",
    class: "status-completed",
  },
  [BOOKING_STATUS.CANCELLED]: {
    bg: "bg-status-cancelled/15",
    text: "text-status-cancelled",
    border: "border-status-cancelled/30",
    class: "status-cancelled",
  },
} as const;

export const SLOT_COLORS = {
  [SLOT_STATUS.AVAILABLE]: {
    bg: "bg-status-available/15",
    text: "text-status-available",
    border: "border-status-available/30",
    class: "status-available",
    hover: "hover:bg-status-available/25",
  },
  [SLOT_STATUS.HOLD]: {
    bg: "bg-status-hold/15",
    text: "text-status-hold",
    border: "border-status-hold/30",
    class: "status-hold",
    hover: "",
  },
  [SLOT_STATUS.BOOKED]: {
    bg: "bg-muted/50",
    text: "text-muted-foreground",
    border: "border-muted",
    class: "",
    hover: "",
  },
} as const;

// Default hold TTL in minutes
export const DEFAULT_HOLD_TTL = 10;

// Animation durations
export const ANIMATION = {
  fast: 150,
  normal: 300,
  slow: 500,
} as const;
