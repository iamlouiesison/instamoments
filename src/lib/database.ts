/**
 * Database operations and utilities for InstaMoments
 * This file provides typed database operations using Supabase
 */

import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types';

// Create Supabase client with database types
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// ============================================================================
// EVENT OPERATIONS
// ============================================================================

export const eventOperations = {
  /**
   * Create a new event
   */
  async createEvent(eventData: Database['public']['Tables']['events']['Insert']) {
    const { data, error } = await supabase
      .from('events')
      .insert(eventData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Get event by QR code ID
   */
  async getEventByQRCode(qrCodeId: string) {
    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        host_user:profiles!events_host_user_id_fkey(*)
      `)
      .eq('qr_code_id', qrCodeId)
      .eq('status', 'active')
      .is('deleted_at', null)
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Get events hosted by a user
   */
  async getUserEvents(userId: string) {
    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        host_user:profiles!events_host_user_id_fkey(*)
      `)
      .eq('host_user_id', userId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  /**
   * Update event
   */
  async updateEvent(eventId: string, updates: Database['public']['Tables']['events']['Update']) {
    const { data, error } = await supabase
      .from('events')
      .update(updates)
      .eq('id', eventId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Delete event (soft delete)
   */
  async deleteEvent(eventId: string) {
    const { error } = await supabase
      .from('events')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', eventId);

    if (error) throw error;
  }
};

// ============================================================================
// CONTRIBUTOR OPERATIONS
// ============================================================================

export const contributorOperations = {
  /**
   * Register a new contributor for an event
   */
  async registerContributor(contributorData: Database['public']['Tables']['event_contributors']['Insert']) {
    const { data, error } = await supabase
      .from('event_contributors')
      .insert(contributorData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Get contributors for an event
   */
  async getEventContributors(eventId: string) {
    const { data, error } = await supabase
      .from('event_contributors')
      .select('*')
      .eq('event_id', eventId)
      .eq('is_blocked', false)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  /**
   * Block a contributor
   */
  async blockContributor(contributorId: string, reason: string, blockedBy: string) {
    const { error } = await supabase
      .from('event_contributors')
      .update({
        is_blocked: true,
        blocked_reason: reason,
        blocked_at: new Date().toISOString(),
        blocked_by: blockedBy
      })
      .eq('id', contributorId);

    if (error) throw error;
  }
};

// ============================================================================
// PHOTO OPERATIONS
// ============================================================================

export const photoOperations = {
  /**
   * Upload a new photo
   */
  async uploadPhoto(photoData: Database['public']['Tables']['photos']['Insert']) {
    const { data, error } = await supabase
      .from('photos')
      .insert(photoData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Get photos for an event
   */
  async getEventPhotos(eventId: string, status: string = 'approved') {
    const { data, error } = await supabase
      .from('photos')
      .select(`
        *,
        contributor:event_contributors(*)
      `)
      .eq('event_id', eventId)
      .eq('status', status)
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  /**
   * Get photos by contributor
   */
  async getContributorPhotos(contributorId: string) {
    const { data, error } = await supabase
      .from('photos')
      .select('*')
      .eq('contributor_id', contributorId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  /**
   * Update photo status (for moderation)
   */
  async updatePhotoStatus(photoId: string, status: string, moderationNotes?: string, moderatedBy?: string) {
    const updates: Database['public']['Tables']['photos']['Update'] = {
      status: status as Database['public']['Tables']['photos']['Row']['status'],
      moderation_notes: moderationNotes,
      moderated_by: moderatedBy,
      moderated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('photos')
      .update(updates)
      .eq('id', photoId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

// ============================================================================
// VIDEO OPERATIONS
// ============================================================================

export const videoOperations = {
  /**
   * Upload a new video
   */
  async uploadVideo(videoData: Database['public']['Tables']['videos']['Insert']) {
    const { data, error } = await supabase
      .from('videos')
      .insert(videoData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Get videos for an event
   */
  async getEventVideos(eventId: string, status: string = 'approved') {
    const { data, error } = await supabase
      .from('videos')
      .select(`
        *,
        contributor:event_contributors(*)
      `)
      .eq('event_id', eventId)
      .eq('status', status)
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  /**
   * Update video processing status
   */
  async updateVideoProcessingStatus(videoId: string, processingStatus: string) {
    const { data, error } = await supabase
      .from('videos')
      .update({
        processing_status: processingStatus as Database['public']['Tables']['videos']['Row']['processing_status'],
        processing_completed_at: processingStatus === 'completed' ? new Date().toISOString() : null
      })
      .eq('id', videoId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

// ============================================================================
// PAYMENT OPERATIONS
// ============================================================================

export const paymentOperations = {
  /**
   * Create a new payment
   */
  async createPayment(paymentData: Database['public']['Tables']['payments']['Insert']) {
    const { data, error } = await supabase
      .from('payments')
      .insert(paymentData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Get payments for a user
   */
  async getUserPayments(userId: string) {
    const { data, error } = await supabase
      .from('payments')
      .select(`
        *,
        event:events(*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  /**
   * Update payment status
   */
  async updatePaymentStatus(paymentId: string, status: string, webhookData?: unknown) {
    const updates: Database['public']['Tables']['payments']['Update'] = {
      status: status as Database['public']['Tables']['payments']['Row']['status'],
      webhook_received_at: new Date().toISOString(),
      webhook_data: webhookData as Record<string, unknown>,
      processed_at: status === 'completed' ? new Date().toISOString() : undefined
    };

    const { data, error } = await supabase
      .from('payments')
      .update(updates)
      .eq('id', paymentId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

// ============================================================================
// ANALYTICS OPERATIONS
// ============================================================================

export const analyticsOperations = {
  /**
   * Record QR code scan
   */
  async recordQRScan(eventId: string) {
    // Get or create analytics record for today
    const today = new Date().toISOString().split('T')[0];
    
    const { data: existing } = await supabase
      .from('event_analytics')
      .select('*')
      .eq('event_id', eventId)
      .eq('analytics_date', today)
      .single();

    if (existing) {
      // Update existing record
      const { data, error } = await supabase
        .from('event_analytics')
        .update({
          qr_scans: existing.qr_scans + 1,
          unique_visitors: existing.unique_visitors + 1
        })
        .eq('id', existing.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } else {
      // Create new record
      const { data, error } = await supabase
        .from('event_analytics')
        .insert({
          event_id: eventId,
          analytics_date: today,
          qr_scans: 1,
          unique_visitors: 1
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  },

  /**
   * Get event analytics
   */
  async getEventAnalytics(eventId: string, days: number = 30) {
    const { data, error } = await supabase
      .from('event_analytics')
      .select('*')
      .eq('event_id', eventId)
      .gte('analytics_date', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
      .order('analytics_date', { ascending: false });

    if (error) throw error;
    return data;
  }
};

// ============================================================================
// CONTENT MODERATION OPERATIONS
// ============================================================================

export const moderationOperations = {
  /**
   * Report content
   */
  async reportContent(reportData: Database['public']['Tables']['content_reports']['Insert']) {
    const { data, error } = await supabase
      .from('content_reports')
      .insert(reportData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Get content reports for an event
   */
  async getEventReports(eventId: string, status?: string) {
    let query = supabase
      .from('content_reports')
      .select('*')
      .eq('event_id', eventId);

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  /**
   * Resolve content report
   */
  async resolveReport(reportId: string, resolution: string, resolvedBy: string) {
    const { data, error } = await supabase
      .from('content_reports')
      .update({
        status: 'resolved',
        resolution_notes: resolution,
        resolved_by: resolvedBy,
        resolved_at: new Date().toISOString()
      })
      .eq('id', reportId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

// ============================================================================
// STORAGE OPERATIONS
// ============================================================================

export const storageOperations = {
  /**
   * Upload file to storage
   */
  async uploadFile(bucket: string, path: string, file: File) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;
    return data;
  },

  /**
   * Get public URL for file
   */
  getPublicUrl(bucket: string, path: string) {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);

    return data.publicUrl;
  },

  /**
   * Delete file from storage
   */
  async deleteFile(bucket: string, path: string) {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) throw error;
  }
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Generate a unique session ID for anonymous contributors
 */
export function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Check if user can access event content
 */
export function canAccessEventContent(event: Database['public']['Tables']['events']['Row'], userId?: string): boolean {
  if (event.status !== 'active' && event.status !== 'ended') return false;
  if (event.deleted_at) return false;
  if (event.qr_code_expires_at && new Date(event.qr_code_expires_at) < new Date()) return false;
  
  // Host and co-hosts have full access
  if (userId && (event.host_user_id === userId || event.co_hosts?.includes(userId))) return true;
  
  return true;
}

/**
 * Check if user can upload to event
 */
export function canUploadToEvent(event: Database['public']['Tables']['events']['Row']): boolean {
  if (event.status !== 'active') return false;
  if (event.deleted_at) return false;
  
  // Check photo limits
  if ((event.total_photos ?? 0) >= event.max_photos) return false;
  
  return true;
}

/**
 * Check if user can upload videos to event
 */
export function canUploadVideosToEvent(event: Database['public']['Tables']['events']['Row']): boolean {
  if (!event.video_addon_enabled) return false;
  if ((event.total_videos ?? 0) >= event.max_videos) return false;
  
  return true;
}

// Export all operations
export const db = {
  events: eventOperations,
  contributors: contributorOperations,
  photos: photoOperations,
  videos: videoOperations,
  payments: paymentOperations,
  analytics: analyticsOperations,
  moderation: moderationOperations,
  storage: storageOperations,
  utils: {
    generateSessionId,
    canAccessEventContent,
    canUploadToEvent,
    canUploadVideosToEvent
  }
};
