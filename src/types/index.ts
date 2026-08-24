export type ContactType =
  | 'email'
  | 'scholar'
  | 'github'
  | 'twitter'
  | 'wechat'
  | 'cv'
  | 'link';

export interface ContactLink {
  type: ContactType;
  label: string;
  href: string;
  qrcode?: string;
}

export interface Profile {
  nameEn: string;
  nameZh: string;
  photos: string[];
  bio: string;
  contacts: ContactLink[];
}

export interface NewsItem {
  date: string;
  content: string;
}

export interface PublicationLinks {
  paper?: string;
  code?: string;
  project?: string;
  dataset?: string;
}

export interface Publication {
  title: string;
  authors: string[];
  venue: string;
  venueType?: 'conference' | 'journal' | 'preprint';
  tags: string[];
  selected?: boolean;
  thumbnail?: string;
  links: PublicationLinks;
  abstract?: string;
}

export interface ProjectLinks {
  code?: string;
  report?: string;
  demo?: string;
}

export interface Project {
  title: string;
  description: string;
  thumbnail?: string;
  links: ProjectLinks;
}

export interface ServiceGroup {
  heading: string;
  items: string[];
}

export interface Talk {
  date: string;
  title: string;
  host: string;
  replay?: string;
}

export interface NoteLink {
  title: string;
  href: string;
  description?: string;
}

export type CustomSectionLayout = 'cards' | 'list' | 'paragraph';

export interface CustomItem {
  title?: string;
  description?: string;
  thumbnail?: string;
  href?: string;
}

export interface CustomSection {
  id: string;
  title: string;
  layout: CustomSectionLayout;
  items: CustomItem[];
}
