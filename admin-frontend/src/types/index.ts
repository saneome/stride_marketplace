export interface User {
  id: string
  email: string
  phone: string | null
  display_name: string
  avatar_url: string | null
  role: 'user' | 'moderator' | 'admin'
  is_active: boolean
  totp_enabled: boolean
  created_at: string
  updated_at: string
  listings_count: number
}

export interface ListingImage {
  id: string
  url: string
  thumbnail_url: string | null
  sort_order: number
  is_cover: boolean
}

export interface ListingAuthor {
  id: string
  email: string
  display_name: string
}

export interface CategoryBrief {
  id: number
  name: string
  slug: string
}

export interface Listing {
  id: string
  title: string
  description: string
  price: string
  currency: string
  condition: string
  status: string
  reject_reason: string | null
  location: string
  views_count: number
  created_at: string
  updated_at: string
  published_at: string | null
  author: ListingAuthor
  category: CategoryBrief
  images: ListingImage[]
}

export interface Category {
  id: number
  name: string
  slug: string
  description: string | null
  parent_id: number | null
  icon: string | null
  sort_order: number
  is_active: boolean
  listings_count: number
}

export interface AuditLogEntry {
  id: string
  user_id: string
  action: string
  entity_type: string
  entity_id: string
  details: Record<string, unknown> | null
  ip_address: string | null
  created_at: string
  user: { id: string; email: string; display_name: string } | null
}

export interface PaginationMeta {
  page: number
  per_page: number
  total: number
  total_pages: number
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: PaginationMeta
}

export interface ListingsByStatus {
  draft: number
  moderation: number
  active: number
  rejected: number
  sold: number
  archived: number
}

export interface PeriodStats {
  today: number
  week: number
  month: number
}

export interface TopCategory {
  id: number
  name: string
  slug: string
  count: number
}

export interface DashboardStats {
  listings_by_status: ListingsByStatus
  new_users: PeriodStats
  new_listings: PeriodStats
  total_users: number
  total_listings: number
  top_categories: TopCategory[]
}
