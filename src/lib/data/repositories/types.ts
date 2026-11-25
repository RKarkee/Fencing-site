import type {
  Booking,
  BookingInput,
  Enquiry,
  EnquiryInput,
  Faq,
  Location,
  Navigation,
  Page,
  Pricing,
  Project,
  Review,
  Service,
  Site,
  TeamMember,
} from "@/lib/schemas";

/**
 * Everything the UI needs, behind one interface.
 * Today it's backed by JSON files; swap DATA_SOURCE=api to use a REST backend or CMS.
 */
export interface ContentRepository {
  getSite(): Promise<Site>;
  getNavigation(): Promise<Navigation>;
  getPage(slug: string): Promise<Page | null>;
  getServices(): Promise<Service[]>;
  getServiceBySlug(slug: string): Promise<Service | null>;
  getPricing(): Promise<Pricing[]>;
  getLocations(): Promise<Location[]>;
  getLocationBySlug(slug: string): Promise<Location | null>;
  getReviews(): Promise<Review[]>;
  getProjects(): Promise<Project[]>;
  getProjectBySlug(slug: string): Promise<Project | null>;
  getFaqs(): Promise<Faq[]>;
  getTeam(): Promise<TeamMember[]>;
}

export interface BookingRepository {
  create(input: BookingInput, slotLabel: string): Promise<Booking>;
  list(): Promise<Booking[]>;
  isSlotTaken(slotId: string, region: string): Promise<boolean>;
}

export interface EnquiryRepository {
  create(input: EnquiryInput): Promise<Enquiry>;
}
