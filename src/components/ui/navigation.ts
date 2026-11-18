export interface NavigationLink {
  label: string;
  href: string;
  current?: boolean;
}

export interface NavigationItem extends NavigationLink {
  children?: readonly NavigationLink[];
}

export interface NavigationGroup {
  label: string;
  items: readonly NavigationItem[];
}
