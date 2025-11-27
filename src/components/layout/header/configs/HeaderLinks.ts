export type HeaderLink = {
  label: string;
  href?: string;
  children?: { label: string; href: string }[];
};

export const headerLinks: HeaderLink[] = [
  {
    label: "FT Sessions",
    href: "/",
  },
  { label: "FT Command", href: "/fd-command" },
];
