import type { ComponentType } from "react";
import type { Section } from "@/lib/schemas";
import { sectionRegistry } from "./registry";

export function SectionRenderer({ sections }: { sections: Section[] }) {
  return (
    <>
      {sections.map((section, index) => {
        const Component = sectionRegistry[section.type] as ComponentType<{ section: Section }>;
        return <Component key={`${section.type}-${index}`} section={section} />;
      })}
    </>
  );
}
