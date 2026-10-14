import { z } from "zod";

/* Custom sections — shared by the API routes, the dashboard and the data loader. */

export const SECTION_KINDS = ["certifications", "awards", "volunteering", "languages", "publications", "custom"] as const;
export type SectionKind = (typeof SECTION_KINDS)[number];

export const SectionItem = z.object({
  title: z.string().trim().min(1).max(120),
  subtitle: z.string().trim().max(120).optional().default(""),
  date: z.string().trim().max(40).optional().default(""),
  url: z.string().trim().max(300).optional().default(""),
  description: z.string().trim().max(500).optional().default(""),
});
export type SectionItemData = z.infer<typeof SectionItem>;

/** Tolerant parse of the stored JSON — drops anything malformed. */
export function parseItems(json: unknown): SectionItemData[] {
  if (!Array.isArray(json)) return [];
  return json.flatMap((it) => {
    const r = SectionItem.safeParse(it);
    return r.success ? [r.data] : [];
  });
}
