// ============================================================
// Legit — Constants & Configuration
// ============================================================

/** SWR polling interval: 5 minutes (300,000ms) */
export const SWR_REFRESH_INTERVAL = 300_000;

/** LocalStorage key for device fingerprint */
export const DEVICE_ID_KEY = 'legit_device_id';

/** Tag configuration: colors and labels */
export const TAG_CONFIG: Record<string, { label: string; emoji: string; bgClass: string; textClass: string }> = {
  mobilite: {
    label: 'Mobilité',
    emoji: '🚗',
    bgClass: 'bg-emerald-500/20',
    textClass: 'text-emerald-300',
  },
  fiscalite: {
    label: 'Fiscalité',
    emoji: '💰',
    bgClass: 'bg-amber-500/20',
    textClass: 'text-amber-300',
  },
  sante: {
    label: 'Santé',
    emoji: '🏥',
    bgClass: 'bg-rose-500/20',
    textClass: 'text-rose-300',
  },
  education: {
    label: 'Éducation',
    emoji: '📚',
    bgClass: 'bg-blue-500/20',
    textClass: 'text-blue-300',
  },
  environnement: {
    label: 'Environnement',
    emoji: '🌿',
    bgClass: 'bg-green-500/20',
    textClass: 'text-green-300',
  },
  securite: {
    label: 'Sécurité',
    emoji: '🛡️',
    bgClass: 'bg-red-500/20',
    textClass: 'text-red-300',
  },
  economie: {
    label: 'Économie',
    emoji: '📊',
    bgClass: 'bg-purple-500/20',
    textClass: 'text-purple-300',
  },
  justice: {
    label: 'Justice',
    emoji: '⚖️',
    bgClass: 'bg-indigo-500/20',
    textClass: 'text-indigo-300',
  },
  general: {
    label: 'Général',
    emoji: '📄',
    bgClass: 'bg-gray-500/20',
    textClass: 'text-gray-300',
  },
};

/** Slide type labels */
export const SLIDE_LABELS: Record<number, { label: string; emoji: string; type: string }> = {
  1: { label: 'Le Problème', emoji: '🔍', type: 'problem' },
  2: { label: 'La Solution', emoji: '⚙️', type: 'solution' },
  3: { label: "L'Impact", emoji: '🎯', type: 'impact' },
};

/** Likert scale configuration */
export const LIKERT_OPTIONS = [
  { value: 1 as const, label: 'Totalement contre', color: 'bg-red-500', activeColor: 'bg-red-400', emoji: '👎' },
  { value: 2 as const, label: 'Plutôt contre', color: 'bg-orange-500', activeColor: 'bg-orange-400', emoji: '😟' },
  { value: 3 as const, label: 'Neutre', color: 'bg-gray-400', activeColor: 'bg-gray-300', emoji: '😐' },
  { value: 4 as const, label: 'Plutôt pour', color: 'bg-lime-500', activeColor: 'bg-lime-400', emoji: '😊' },
  { value: 5 as const, label: 'Totalement pour', color: 'bg-green-500', activeColor: 'bg-green-400', emoji: '👍' },
];
