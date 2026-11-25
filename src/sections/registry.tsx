import type { ComponentType } from "react";
import type { SectionOf, SectionType } from "@/lib/schemas";
import { AudienceSplitSection } from "./audience-split";
import { CalculatorTeaserSection } from "./calculator-teaser";
import { CtaBannerSection } from "./cta-banner";
import { FaqSection } from "./faq";
import { HeroSection } from "./hero";
import { LocationsSection } from "./locations";
import { PageHeaderSection } from "./page-header";
import { ProcessSection } from "./process";
import { ProjectsSection } from "./projects";
import { ReviewsSection } from "./reviews";
import { RichTextSection } from "./rich-text";
import { ServiceGridSection } from "./service-grid";
import { StatsSection } from "./stats";
import { TeamSection } from "./team";
import { ValuesSection } from "./values";

type SectionComponent<T extends SectionType> = ComponentType<{ section: SectionOf<T> }>;

/**
 * Maps a JSON "type" to its component. TypeScript forces every section type in
 * lib/schemas/page.ts to have a component here.
 */
export const sectionRegistry: { [K in SectionType]: SectionComponent<K> } = {
  hero: HeroSection,
  "page-header": PageHeaderSection,
  stats: StatsSection,
  "audience-split": AudienceSplitSection,
  "service-grid": ServiceGridSection,
  process: ProcessSection,
  reviews: ReviewsSection,
  projects: ProjectsSection,
  "calculator-teaser": CalculatorTeaserSection,
  faq: FaqSection,
  locations: LocationsSection,
  values: ValuesSection,
  "rich-text": RichTextSection,
  team: TeamSection,
  "cta-banner": CtaBannerSection,
};
