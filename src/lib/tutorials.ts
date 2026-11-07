export const CATEGORIES = [
  "Hip-Hop",
  "Bollywood",
  "Classical",
  "Contemporary",
  "Freestyle",
] as const;

export const LEVELS = ["Beginner", "Intermediate", "Advanced"] as const;

export function isCategory(name: string): boolean {
  return (CATEGORIES as readonly string[]).includes(name);
}
