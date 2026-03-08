export type NotificationType = "medicine_reminder" | "health_tip" | "checkup_reminder" | "cost_alert" | "scheme_update";

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string; // ISO
  read: boolean;
  actionPath?: string; // route to navigate to
  icon?: string; // emoji
}

const STORAGE_KEY = "medibudget_notifications";
const PREFS_KEY = "medibudget_notification_prefs";

export interface NotificationPreferences {
  medicine_reminder: boolean;
  health_tip: boolean;
  checkup_reminder: boolean;
  cost_alert: boolean;
  scheme_update: boolean;
}

const DEFAULT_PREFS: NotificationPreferences = {
  medicine_reminder: true,
  health_tip: true,
  checkup_reminder: true,
  cost_alert: true,
  scheme_update: true,
};

// ─── Storage helpers ────────────────────────────
export function getNotifications(): AppNotification[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveNotifications(notifs: AppNotification[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notifs.slice(0, 50))); // keep max 50
}

export function addNotification(notif: Omit<AppNotification, "id" | "timestamp" | "read">) {
  const prefs = getPreferences();
  if (!prefs[notif.type]) return; // user disabled this type

  const all = getNotifications();
  const newNotif: AppNotification = {
    ...notif,
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    read: false,
  };
  saveNotifications([newNotif, ...all]);
  return newNotif;
}

export function markAsRead(id: string) {
  const all = getNotifications();
  saveNotifications(all.map((n) => (n.id === id ? { ...n, read: true } : n)));
}

export function markAllAsRead() {
  const all = getNotifications();
  saveNotifications(all.map((n) => ({ ...n, read: true })));
}

export function clearNotifications() {
  localStorage.setItem(STORAGE_KEY, "[]");
}

export function getUnreadCount(): number {
  return getNotifications().filter((n) => !n.read).length;
}

export function getPreferences(): NotificationPreferences {
  try {
    return { ...DEFAULT_PREFS, ...JSON.parse(localStorage.getItem(PREFS_KEY) || "{}") };
  } catch {
    return DEFAULT_PREFS;
  }
}

export function savePreferences(prefs: NotificationPreferences) {
  localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
}

// ─── Health tips pool ───────────────────────────
const HEALTH_TIPS: Array<{ title: string; message: string }> = [
  { title: "💧 Stay Hydrated", message: "Drink at least 8 glasses of water daily. Proper hydration supports digestion, circulation, and energy levels." },
  { title: "🚶 Walk More", message: "A 30-minute daily walk can reduce the risk of heart disease, improve mood, and strengthen bones." },
  { title: "😴 Sleep Well", message: "Adults need 7-9 hours of sleep. Poor sleep weakens immunity and increases the risk of chronic diseases." },
  { title: "🥗 Eat Your Greens", message: "Include leafy vegetables in at least one meal. They're rich in iron, calcium, and essential vitamins." },
  { title: "🧘 Manage Stress", message: "Practice deep breathing or meditation for 10 minutes daily. Chronic stress affects heart health and immunity." },
  { title: "🦷 Dental Health", message: "Brush twice daily and floss once. Poor oral hygiene is linked to heart disease and diabetes." },
  { title: "👁️ Screen Break", message: "Follow the 20-20-20 rule: every 20 minutes, look at something 20 feet away for 20 seconds." },
  { title: "🧴 Sunscreen Reminder", message: "Apply sunscreen (SPF 30+) even on cloudy days. UV damage accumulates over time and increases skin cancer risk." },
  { title: "🏋️ Strengthen Your Core", message: "Core exercises prevent back pain, improve posture, and support better balance as you age." },
  { title: "🫁 Breathing Exercise", message: "Practice diaphragmatic breathing: inhale for 4 counts, hold for 4, exhale for 6. Reduces anxiety and lowers blood pressure." },
  { title: "🧂 Watch Your Salt", message: "Limit sodium to 2,300 mg/day. Excess salt raises blood pressure and strains your kidneys." },
  { title: "🍎 Breakfast Matters", message: "A balanced breakfast kickstarts metabolism and improves concentration throughout the day." },
];

/**
 * Generates a daily health tip if one hasn't been generated today.
 */
export function generateDailyHealthTip() {
  const today = new Date().toDateString();
  const lastTipDate = localStorage.getItem("medibudget_last_tip_date");
  if (lastTipDate === today) return;

  const tipIndex = Math.floor(Math.random() * HEALTH_TIPS.length);
  const tip = HEALTH_TIPS[tipIndex];
  addNotification({
    type: "health_tip",
    title: tip.title,
    message: tip.message,
    icon: "💡",
  });
  localStorage.setItem("medibudget_last_tip_date", today);
}

/**
 * Generates a periodic checkup reminder if none exists recently.
 */
export function generateCheckupReminder() {
  const lastCheckup = localStorage.getItem("medibudget_last_checkup_reminder");
  const now = Date.now();
  // Once per week
  if (lastCheckup && now - parseInt(lastCheckup) < 7 * 24 * 60 * 60 * 1000) return;

  addNotification({
    type: "checkup_reminder",
    title: "🩺 Health Checkup Due",
    message: "Regular health checkups help detect problems early. Consider scheduling a routine checkup with your doctor.",
    icon: "🩺",
    actionPath: "/symptoms",
  });
  localStorage.setItem("medibudget_last_checkup_reminder", String(now));
}

/**
 * Generates a cost alert notification when estimation is saved.
 */
export function notifyCostEstimation(condition: string, total: number) {
  addNotification({
    type: "cost_alert",
    title: "💰 Cost Estimate Saved",
    message: `Your estimated cost for ${condition} is ₹${total.toLocaleString("en-IN")}. View history for details.`,
    icon: "💰",
    actionPath: "/history",
  });
}

/**
 * Generates a scheme eligibility notification.
 */
export function notifySchemeEligibility(schemeName: string) {
  addNotification({
    type: "scheme_update",
    title: "🏛️ Scheme Match Found",
    message: `You may be eligible for ${schemeName}. Check the Scheme Checker for details.`,
    icon: "🏛️",
    actionPath: "/schemes",
  });
}

// ─── Notification type metadata ─────────────────
export const NOTIFICATION_TYPE_META: Record<NotificationType, { label: string; emoji: string; color: string }> = {
  medicine_reminder: { label: "Medicine Reminder", emoji: "💊", color: "text-primary" },
  health_tip: { label: "Health Tip", emoji: "💡", color: "text-accent" },
  checkup_reminder: { label: "Checkup Reminder", emoji: "🩺", color: "text-primary" },
  cost_alert: { label: "Cost Alert", emoji: "💰", color: "text-accent" },
  scheme_update: { label: "Scheme Update", emoji: "🏛️", color: "text-primary" },
};
