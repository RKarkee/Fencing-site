import {
  AlignJustify,
  BrickWall,
  Building2,
  CalendarCheck,
  CircleHelp,
  Columns3,
  DoorOpen,
  Fence,
  Hammer,
  Leaf,
  Package,
  Receipt,
  Rows3,
  ShieldCheck,
  Users,
  Waves,
  type LucideIcon,
} from "lucide-react";

/** Icons referenced by name from JSON data. Add new names here. */
const icons: Record<string, LucideIcon> = {
  fence: Fence,
  waves: Waves,
  "rows-3": Rows3,
  "align-justify": AlignJustify,
  "columns-3": Columns3,
  "shield-check": ShieldCheck,
  "brick-wall": BrickWall,
  "door-open": DoorOpen,
  hammer: Hammer,
  package: Package,
  "building-2": Building2,
  receipt: Receipt,
  users: Users,
  leaf: Leaf,
  "calendar-check": CalendarCheck,
};

export function Icon({ name, className }: { name: string; className?: string }) {
  const Component = icons[name] ?? CircleHelp;
  return <Component className={className} aria-hidden />;
}
