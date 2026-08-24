export type HeaderLink = {
  label: string;
  href?: string;
  children?: { label: string; href: string }[];
};

export const headerLinks: HeaderLink[] = [
  { label: "Paperwork", href: "/paperwork?tab=normal" },
  {
    label: "FT Sessions",
    href: "/",
  },
  { label: "FT Command", href: "/fd-command" },
  { label: "FTI", href: "/fti" },
  { label: "Change Log", href: "/change-log" },
];
