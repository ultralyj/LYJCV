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

export interface ProfilePhoto {
  src: string;
  caption: string;
}

export interface Profile {
  nameEn: string;
  nameZh: string;
  photos: ProfilePhoto[];
  bio: string;
  contacts: ContactLink[];
}

export interface NewsItem {
  date: string;
  content: string;
}

/** Topic categories drive the colored tag/filter styling. */
export type TagCategory =
  | 'policy'
  | 'grasping'
  | 'manipulation'
  | 'data'
  | 'other';

export interface Tag {
  label: string;
  category: TagCategory;
}

export type VenueType = 'conference' | 'journal' | 'preprint';

export interface Venue {
  name: string;
  type: VenueType;
}

export interface Author {
  name: string;
  url?: string;
  isOwn?: boolean;
  equalContrib?: boolean;
  corresponding?: boolean;
}

export type PublicationLinkKind =
  | 'paper'
  | 'code'
  | 'project'
  | 'twitter'
  | 'dataset'
  | 'demo'
  | 'report'
  | 'generic';

export interface PublicationLink {
  kind: PublicationLinkKind;
  href: string;
  label?: string;
}

export type Honor = 'oral' | 'best';

export interface Publication {
  title: string;
  authors: Author[];
  venue: Venue;
  tags: Tag[];
  selected?: boolean;
  honor?: Honor;
  thumbnail?: string;
  links: PublicationLink[];
  /** Non-link note shown next to links, e.g. "code coming soon". */
  note?: string;
  abstract?: string;
}

export type ProjectLinkKind = 'code' | 'report' | 'demo' | 'project' | 'generic';

export interface ProjectLink {
  kind: ProjectLinkKind;
  href: string;
  label?: string;
}

export interface Project {
  title: string;
  description: string;
  thumbnail?: string;
  links: ProjectLink[];
}

export interface ServiceGroup {
  heading: string;
  items: string[];
}

export interface Talk {
  date: string;
  title: string;
  host: string;
  hostUrl?: string;
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
