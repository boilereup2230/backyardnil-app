export type ComplianceStatusValue = 'verified' | 'pending' | 'restricted';
export type NilStatus = 'active' | 'pending' | 'prohibited';
export type InquiryStatus = 'new' | 'read' | 'responded' | 'archived';
export interface AthleteProfile {
  id: string;
  owner_id: string;
  slug: string;
  athlete_name: string;
  photo_url: string | null;
  sport: string;
  sport_other: string | null;
  position: string | null;
  grad_year: number | null;
  school_name: string | null;
  state: string;
  bio: string | null;
  gpa: number | null;
  instagram_handle: string | null;
  instagram_followers: number | null;
  tiktok_handle: string | null;
  tiktok_followers: number | null;
  twitter_handle: string | null;
  twitter_followers: number | null;
  engagement_rate: number | null;
  is_published: boolean;
  is_owner_viewing_banner: boolean;
  created_at: string;
  updated_at: string;
}
export interface RateCard {
  id: string;
  athlete_id: string;
  deliverable_type: string;
  description: string | null;
  price: number;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
export interface ComplianceStatus {
  id: string;
  athlete_id: string;
  state: string;
  status: ComplianceStatusValue;
  last_verified_at: string | null;
  created_at: string;
  updated_at: string;
}
export interface StateRule {
  state_code: string;
  state_name: string;
  nil_status: NilStatus;
  effective_date: string | null;
  prohibited_categories: string[] | null;
  requires_ad_notification: boolean;
  summary: string | null;
  last_verified_at: string;
}
// Combined shape for the public profile page
export interface AthleteProfileWithRates extends AthleteProfile {
  rate_cards: RateCard[];
  compliance_status: ComplianceStatus | null;
  state_rule: StateRule | null;
}
export interface Inquiry {
  id: string;
  athlete_id: string;
  brand_name: string;
  contact_name: string | null;
  contact_email: string;
  contact_phone: string | null;
  rate_card_id: string | null;
  message: string;
  status: InquiryStatus;
  created_at: string;
  updated_at: string;
}
