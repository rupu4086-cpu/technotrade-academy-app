// Fresh Supabase data layer - written for this app only.
// Reads/writes the same Supabase tables as the website (users, courses,
// course_modules, course_lessons, enrollments, lesson_progress, orders,
// payments, promo_codes, promo_redemptions, webhook_events, enquiries,
// settings, ads, community_posts, subscriptions, device_tokens).
// Uses the anon key only, so RLS applies: public can read published
// courses, modules, lessons, active promo codes and community posts.
// Users / orders / payments have no public policy - those calls must go
// through the signed-in session / server. Never put the service-role key here.
import { createClient } from '@supabase/supabase-js';
import { CONFIG } from './config';

export const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY || 'missing-key');

export type Course = {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  level: string;
  price_paise: number;
  thumbnail_url?: string | null;
  banner_url?: string | null;
  status: string;
};

export type Lesson = {
  id: string;
  course_id: string;
  title: string;
  video_url?: string | null;
  video_type?: string | null;
  is_free_preview?: boolean;
  duration_seconds?: number | null;
  position: number;
};

export type SubscriptionPlan = {
  id: string;
  name: string;
  price_paise: number;
  duration_days: number;
  course_id?: string | null;
  course_title?: string | null;
  is_advanced: boolean;
  description: string;
  is_active: boolean;
};

// Built-in plans the owner asked for. The admin can create/change plans;
// these defaults match: Rs.999 / 1 month (1 course) and
// Rs.2,999 / 1 year (Advanced - big traders' strategies and formulas).
export const DEFAULT_PLANS: SubscriptionPlan[] = [
  {
    id: 'plan-monthly-999',
    name: 'Monthly',
    price_paise: 99900,
    duration_days: 30,
    is_advanced: false,
    description: '1 course access for 1 month.',
    is_active: true,
  },
  {
    id: 'plan-yearly-2999',
    name: 'Advanced Yearly',
    price_paise: 299900,
    duration_days: 365,
    is_advanced: true,
    description: "Advanced course for 1 year - big traders' strategies and formulas.",
    is_active: true,
  },
];

export async function fetchPublishedCourses(): Promise<Course[]> {
  const { data, error } = await supabase
    .from('courses')
    .select('id,title,slug,description,category,level,price_paise,thumbnail_url,banner_url,status')
    .eq('status', 'published')
    .order('title');
  if (error) throw error;
  return (data ?? []) as Course[];
}

export async function fetchCourseLessons(courseId: string): Promise<Lesson[]> {
  const { data, error } = await supabase
    .from('course_lessons')
    .select('id,course_id,title,video_url,video_type,is_free_preview,duration_seconds,position')
    .eq('course_id', courseId)
    .order('position');
  if (error) throw error;
  return (data ?? []) as Lesson[];
}

export async function fetchPlans(): Promise<SubscriptionPlan[]> {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('is_active', true)
    .order('price_paise');
  if (error || !data || data.length === 0) return DEFAULT_PLANS;
  return data as SubscriptionPlan[];
}

// Free users see thumbnail + title + price + description ONLY.
// Detail, curriculum and lessons are fetched only for an owner (bought /
// subscribed) - the screen enforces this, see CourseDetailScreen.
export async function hasAccess(userId: string, courseId: string): Promise<boolean> {
  const { data } = await supabase
    .from('enrollments')
    .select('id')
    .eq('user_id', userId)
    .eq('course_id', courseId)
    .limit(1);
  return (data ?? []).length > 0;
}

// Checkout: create a PENDING order first. The course/subscription unlocks
// only after a verified captured Razorpay payment (server/webhook).
// Never mark paid from the app.
export async function createPendingOrder(input: {
  userId: string;
  courseId?: string;
  planId?: string;
  amountPaise: number;
  promoCode?: string;
}) {
  const { data, error } = await supabase
    .from('orders')
    .insert({
      user_id: input.userId,
      course_id: input.courseId ?? null,
      amount_paise: input.amountPaise,
      status: 'pending',
      promo_code: input.promoCode ?? null,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}
