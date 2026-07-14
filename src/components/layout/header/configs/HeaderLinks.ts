export type HeaderLink = {
  label: string;
  href?: string;
  children?: { label: string; href: string }[];
};

export const headerLinks: HeaderLink[] = [
  { label: "Paperwork", href: "/paperwork" },
  {
    label: "FT Sessions",
    href: "/",
  },
  { label: "FT Command", href: "/fd-command" },
  { label: "Change Log", href: "/change-log" },
];
