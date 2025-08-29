import { supabase } from './supabase/client';
import { Event, Profile, Photo, Video } from '@/types';

export interface DatabaseError {
  message: string;
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
    data: Record<string, unknown>, 
    select?: string
  ): Promise<DatabaseResult<T>> {
    try {
      const { data: result, error } = select 
        ? await supabase.from(table).insert(data).select(select)
        : await supabase.from(table).insert(data);

      if (error) {
        return { 
          data: null, 
          error: { 
            message: error.message
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

  // Generic select function - simplified to avoid type issues
  async select<T>(
    table: string, 
    select?: string, 
    filters?: Record<string, unknown>
  ): Promise<DatabaseResult<T[]>> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let query: any = supabase.from(table);
      
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
            message: error.message
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
    updates: Record<string, unknown>, 
    select?: string
  ): Promise<DatabaseResult<T>> {
    try {
      const { data, error } = select 
        ? await supabase.from(table).update(updates).eq('id', id).select(select)
        : await supabase.from(table).update(updates).eq('id', id);

      if (error) {
        return { 
          data: null, 
          error: { 
            message: error.message
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
            message: error.message
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

  // Get public events
  async getPublic(): Promise<DatabaseResult<Event[]>> {
    return db.select<Event>('events', '*', { status: 'active' });
  },
};

// Profile-specific operations
export const profiles = {
  // Create user profile
  async create(profileData: Omit<Profile, 'id' | 'created_at' | 'updated_at'>): Promise<DatabaseResult<Profile>> {
    return db.insert<Profile>('profiles', {
      ...profileData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }, '*');
  },

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

  // Delete profile
  async delete(userId: string): Promise<DatabaseResult<void>> {
    return db.delete('profiles', userId);
  },
};

// Photo-specific operations
export const photos = {
  // Create a new photo
  async create(photoData: Omit<Photo, 'id' | 'created_at'>): Promise<DatabaseResult<Photo>> {
    return db.insert<Photo>('photos', {
      ...photoData,
      created_at: new Date().toISOString(),
    }, '*');
  },

  // Get photos by event ID
  async getByEventId(eventId: string): Promise<DatabaseResult<Photo[]>> {
    return db.select<Photo>('photos', '*', { event_id: eventId });
  },

  // Get photos by user ID
  async getByUserId(userId: string): Promise<DatabaseResult<Photo[]>> {
    return db.select<Photo>('photos', '*', { contributor_id: userId });
  },

  // Update photo
  async update(id: string, updates: Partial<Photo>): Promise<DatabaseResult<Photo>> {
    return db.update<Photo>('photos', id, updates, '*');
  },

  // Delete photo
  async delete(id: string): Promise<DatabaseResult<void>> {
    return db.delete('photos', id);
  },

  // Get public photos for an event
  async getPublicByEventId(eventId: string): Promise<DatabaseResult<Photo[]>> {
    return db.select<Photo>('photos', '*', { event_id: eventId, status: 'approved' });
  },
};

// Video-specific operations
export const videos = {
  // Create a new video
  async create(videoData: Omit<Video, 'id' | 'created_at'>): Promise<DatabaseResult<Video>> {
    return db.insert<Video>('videos', {
      ...videoData,
      created_at: new Date().toISOString(),
    }, '*');
  },

  // Get videos by event ID
  async getByEventId(eventId: string): Promise<DatabaseResult<Video[]>> {
    return db.select<Video>('videos', '*', { event_id: eventId });
  },

  // Get videos by user ID
  async getByUserId(userId: string): Promise<DatabaseResult<Video[]>> {
    return db.select<Video>('videos', '*', { contributor_id: userId });
  },

  // Update video
  async update(id: string, updates: Partial<Video>): Promise<DatabaseResult<Video>> {
    return db.update<Video>('videos', id, updates, '*');
  },

  // Delete video
  async delete(id: string): Promise<DatabaseResult<void>> {
    return db.delete('videos', id);
  },

  // Get public videos for an event
  async getPublicByEventId(eventId: string): Promise<DatabaseResult<Video[]>> {
    return db.select<Video>('videos', '*', { event_id: eventId, status: 'approved' });
  },
};

// Export all operations
const databaseOperations = {
  db,
  events,
  profiles,
  photos,
  videos,
};

export default databaseOperations;
