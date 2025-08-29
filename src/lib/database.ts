import { supabase } from './supabase/client';
import { createClient } from './supabase/server';
import { Event, Photo, Video, Profile, EventContributor } from '@/types';

export interface DatabaseError {
  message: string;
  code?: string;
  details?: string;
}

export interface DatabaseResult<T> {
  data: T | null;
  error: DatabaseError | null;
}

// Generic database operations
export const db = {
  // Generic insert function
  async insert<T>(
    table: string, 
    data: any, 
    select?: string
  ): Promise<DatabaseResult<T>> {
    try {
      let query = supabase.from(table).insert(data);
      
      if (select) {
        query = query.select(select);
      }

      const { data: result, error } = await query;

      if (error) {
        return { 
          data: null, 
          error: { 
            message: error.message, 
            code: error.code,
            details: error.details 
          } 
        };
      }

      return { data: result as T, error: null };
    } catch (error) {
      return { 
        data: null, 
        error: { 
          message: error instanceof Error ? error.message : 'An unexpected error occurred' 
        } 
      };
    }
  },

  // Generic select function
  async select<T>(
    table: string, 
    select?: string, 
    filters?: Record<string, any>
  ): Promise<DatabaseResult<T[]>> {
    try {
      let query = supabase.from(table);
      
      if (select) {
        query = query.select(select);
      }

      // Apply filters
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            query = query.eq(key, value);
          }
        });
      }

      const { data, error } = await query;

      if (error) {
        return { 
          data: null, 
          error: { 
            message: error.message, 
            code: error.code,
            details: error.details 
          } 
        };
      }

      return { data: data as T[], error: null };
    } catch (error) {
      return { 
        data: null, 
        error: { 
          message: error instanceof Error ? error.message : 'An unexpected error occurred' 
        } 
      };
    }
  },

  // Generic update function
  async update<T>(
    table: string, 
    id: string, 
    updates: any, 
    select?: string
  ): Promise<DatabaseResult<T>> {
    try {
      let query = supabase
        .from(table)
        .update(updates)
        .eq('id', id);
      
      if (select) {
        query = query.select(select);
      }

      const { data, error } = await query;

      if (error) {
        return { 
          data: null, 
          error: { 
            message: error.message, 
            code: error.code,
            details: error.details 
          } 
        };
      }

      return { data: data?.[0] as T || null, error: null };
    } catch (error) {
      return { 
        data: null, 
        error: { 
          message: error instanceof Error ? error.message : 'An unexpected error occurred' 
        } 
      };
    }
  },

  // Generic delete function
  async delete(
    table: string, 
    id: string
  ): Promise<DatabaseResult<void>> {
    try {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id);

      if (error) {
        return { 
          data: null, 
          error: { 
            message: error.message, 
            code: error.code,
            details: error.details 
          } 
        };
      }

      return { data: undefined, error: null };
    } catch (error) {
      return { 
        data: null, 
        error: { 
          message: error instanceof Error ? error.message : 'An unexpected error occurred' 
        } 
      };
    }
  },
};

// Event-specific operations
export const events = {
  // Create a new event
  async create(eventData: Omit<Event, 'id' | 'created_at' | 'updated_at'>): Promise<DatabaseResult<Event>> {
    return db.insert<Event>('events', {
      ...eventData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }, '*');
  },

  // Get event by ID
  async getById(id: string): Promise<DatabaseResult<Event>> {
    const result = await db.select<Event>('events', '*', { id });
    if (result.data && result.data.length > 0) {
      return { data: result.data[0], error: null };
    }
    return { data: null, error: { message: 'Event not found' } };
  },

  // Get events by user ID
  async getByUserId(userId: string): Promise<DatabaseResult<Event[]>> {
    return db.select<Event>('events', '*', { host_user_id: userId });
  },

  // Get event by QR code ID
  async getByQRCode(qrCodeId: string): Promise<DatabaseResult<Event>> {
    const result = await db.select<Event>('events', '*', { qr_code_id: qrCodeId });
    if (result.data && result.data.length > 0) {
      return { data: result.data[0], error: null };
    }
    return { data: null, error: { message: 'Event not found' } };
  },

  // Update event
  async update(id: string, updates: Partial<Event>): Promise<DatabaseResult<Event>> {
    return db.update<Event>('events', id, {
      ...updates,
      updated_at: new Date().toISOString(),
    }, '*');
  },

  // Delete event
  async delete(id: string): Promise<DatabaseResult<void>> {
    return db.delete('events', id);
  },
};

// Photo-specific operations
export const photos = {
  // Upload photo metadata
  async create(photoData: Omit<Photo, 'id' | 'created_at' | 'updated_at'>): Promise<DatabaseResult<Photo>> {
    return db.insert<Photo>('photos', {
      ...photoData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }, '*');
  },

  // Get photos by event ID
  async getByEventId(eventId: string): Promise<DatabaseResult<Photo[]>> {
    return db.select<Photo>('photos', '*', { event_id: eventId });
  },

  // Get photo by ID
  async getById(id: string): Promise<DatabaseResult<Photo>> {
    const result = await db.select<Photo>('photos', '*', { id });
    if (result.data && result.data.length > 0) {
      return { data: result.data[0], error: null };
    }
    return { data: null, error: { message: 'Photo not found' } };
  },

  // Update photo
  async update(id: string, updates: Partial<Photo>): Promise<DatabaseResult<Photo>> {
    return db.update<Photo>('photos', id, {
      ...updates,
      updated_at: new Date().toISOString(),
    }, '*');
  },

  // Delete photo
  async delete(id: string): Promise<DatabaseResult<void>> {
    return db.delete('photos', id);
  },
};

// Video-specific operations
export const videos = {
  // Upload video metadata
  async create(videoData: Omit<Video, 'id' | 'created_at' | 'updated_at'>): Promise<DatabaseResult<Video>> {
    return db.insert<Video>('videos', {
      ...videoData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }, '*');
  },

  // Get videos by event ID
  async getByEventId(eventId: string): Promise<DatabaseResult<Video[]>> {
    return db.select<Video>('videos', '*', { event_id: eventId });
  },

  // Get video by ID
  async getById(id: string): Promise<DatabaseResult<Video>> {
    const result = await db.select<Video>('videos', '*', { id });
    if (result.data && result.data.length > 0) {
      return { data: result.data[0], error: null };
    }
    return { data: null, error: { message: 'Video not found' } };
  },

  // Update video
  async update(id: string, updates: Partial<Video>): Promise<DatabaseResult<Video>> {
    return db.update<Video>('videos', id, {
      ...updates,
      updated_at: new Date().toISOString(),
    }, '*');
  },

  // Delete video
  async delete(id: string): Promise<DatabaseResult<void>> {
    return db.delete('videos', id);
  },
};

// Profile-specific operations
export const profiles = {
  // Get profile by user ID
  async getByUserId(userId: string): Promise<DatabaseResult<Profile>> {
    const result = await db.select<Profile>('profiles', '*', { id: userId });
    if (result.data && result.data.length > 0) {
      return { data: result.data[0], error: null };
    }
    return { data: null, error: { message: 'Profile not found' } };
  },

  // Update profile
  async update(userId: string, updates: Partial<Profile>): Promise<DatabaseResult<Profile>> {
    return db.update<Profile>('profiles', userId, {
      ...updates,
      updated_at: new Date().toISOString(),
    }, '*');
  },
};

// Event contributor operations
export const contributors = {
  // Add contributor to event
  async add(contributorData: Omit<EventContributor, 'id' | 'created_at' | 'updated_at'>): Promise<DatabaseResult<EventContributor>> {
    return db.insert<EventContributor>('event_contributors', {
      ...contributorData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }, '*');
  },

  // Get contributors by event ID
  async getByEventId(eventId: string): Promise<DatabaseResult<EventContributor[]>> {
    return db.select<EventContributor>('event_contributors', '*', { event_id: eventId });
  },

  // Update contributor
  async update(id: string, updates: Partial<EventContributor>): Promise<DatabaseResult<EventContributor>> {
    return db.update<EventContributor>('event_contributors', id, {
      ...updates,
      updated_at: new Date().toISOString(),
    }, '*');
  },

  // Remove contributor
  async remove(id: string): Promise<DatabaseResult<void>> {
    return db.delete('event_contributors', id);
  },
};

// Server-side database operations
export const serverDb = {
  // Get events with server-side client
  async getEventsByUserId(userId: string): Promise<DatabaseResult<Event[]>> {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('host_user_id', userId);

      if (error) {
        return { 
          data: null, 
          error: { 
            message: error.message, 
            code: error.code,
            details: error.details 
          } 
        };
      }

      return { data: data as Event[], error: null };
    } catch (error) {
      return { 
        data: null, 
        error: { 
          message: error instanceof Error ? error.message : 'An unexpected error occurred' 
        } 
      };
    }
  },

  // Get event with server-side client
  async getEventById(id: string): Promise<DatabaseResult<Event>> {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        return { 
          data: null, 
          error: { 
            message: error.message, 
            code: error.code,
            details: error.details 
          } 
        };
      }

      return { data: data as Event, error: null };
    } catch (error) {
      return { 
        data: null, 
        error: { 
          message: error instanceof Error ? error.message : 'An unexpected error occurred' 
        } 
      };
    }
  },
};
