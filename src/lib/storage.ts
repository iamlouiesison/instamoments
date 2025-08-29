import { supabase } from './supabase/client';
import { createClient } from './supabase/server';

export interface StorageError {
  message: string;
  code?: string;
  details?: string;
}

export interface StorageResult<T> {
  data: T | null;
  error: StorageError | null;
}

export interface UploadOptions {
  contentType?: string;
  cacheControl?: string;
  upsert?: boolean;
}

export interface FileMetadata {
  name: string;
  size: number;
  type: string;
  lastModified?: number;
}

// Storage bucket names
export const STORAGE_BUCKETS = {
  PHOTOS: 'event-photos',
  VIDEOS: 'event-videos',
  THUMBNAILS: 'thumbnails',
  AVATARS: 'user-avatars',
} as const;

// Storage utility functions
export const storage = {
  // Upload file to storage
  async uploadFile(
    bucket: string,
    path: string,
    file: File | Blob,
    options: UploadOptions = {}
  ): Promise<StorageResult<{ path: string; url: string }>> {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(path, file, {
          cacheControl: options.cacheControl || '3600',
          upsert: options.upsert || false,
          contentType: options.contentType || file.type,
        });

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

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(path);

      return { 
        data: { 
          path: data.path, 
          url: urlData.publicUrl 
        }, 
        error: null 
      };
    } catch (error) {
      return { 
        data: null, 
        error: { 
          message: error instanceof Error ? error.message : 'An unexpected error occurred' 
        } 
      };
    }
  },

  // Download file from storage
  async downloadFile(
    bucket: string,
    path: string
  ): Promise<StorageResult<Blob>> {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .download(path);

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

      return { data, error: null };
    } catch (error) {
      return { 
        data: null, 
        error: { 
          message: error instanceof Error ? error.message : 'An unexpected error occurred' 
        } 
      };
    }
  },

  // Delete file from storage
  async deleteFile(
    bucket: string,
    path: string
  ): Promise<StorageResult<void>> {
    try {
      const { error } = await supabase.storage
        .from(bucket)
        .remove([path]);

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

  // Get public URL for file
  getPublicUrl(bucket: string, path: string): string {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);
    
    return data.publicUrl;
  },

  // List files in bucket/folder
  async listFiles(
    bucket: string,
    folder?: string
  ): Promise<StorageResult<{ name: string; size: number; updated_at: string }[]>> {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .list(folder || '');

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

      return { 
        data: data.map(item => ({
          name: item.name,
          size: item.metadata?.size || 0,
          updated_at: item.updated_at || '',
        })), 
        error: null 
      };
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

// Photo-specific storage operations
export const photoStorage = {
  // Upload photo with thumbnail generation
  async uploadPhoto(
    eventId: string,
    file: File,
    contributorId: string
  ): Promise<StorageResult<{ 
    originalPath: string; 
    thumbnailPath: string; 
    originalUrl: string; 
    thumbnailUrl: string; 
  }>> {
    try {
      // Generate unique filename
      const timestamp = Date.now();
      const fileExtension = file.name.split('.').pop();
      const filename = `${timestamp}_${contributorId}.${fileExtension}`;
      
      // Upload original photo
      const originalPath = `${eventId}/original/${filename}`;
      const originalResult = await storage.uploadFile(
        STORAGE_BUCKETS.PHOTOS,
        originalPath,
        file
      );

      if (originalResult.error) {
        return { data: null, error: originalResult.error };
      }

      // Generate thumbnail (you might want to do this on the server side)
      // For now, we'll just return the original path
      const thumbnailPath = `${eventId}/thumbnails/${filename}`;
      const thumbnailUrl = storage.getPublicUrl(STORAGE_BUCKETS.THUMBNAILS, thumbnailPath);

      return {
        data: {
          originalPath: originalResult.data!.path,
          thumbnailPath,
          originalUrl: originalResult.data!.url,
          thumbnailUrl,
        },
        error: null,
      };
    } catch (error) {
      return { 
        data: null, 
        error: { 
          message: error instanceof Error ? error.message : 'An unexpected error occurred' 
        } 
      };
    }
  },

  // Delete photo and its thumbnail
  async deletePhoto(
    eventId: string,
    filename: string
  ): Promise<StorageResult<void>> {
    try {
      const originalPath = `${eventId}/original/${filename}`;
      const thumbnailPath = `${eventId}/thumbnails/${filename}`;

      // Delete original photo
      const originalResult = await storage.deleteFile(STORAGE_BUCKETS.PHOTOS, originalPath);
      if (originalResult.error) {
        console.warn('Failed to delete original photo:', originalResult.error);
      }

      // Delete thumbnail
      const thumbnailResult = await storage.deleteFile(STORAGE_BUCKETS.THUMBNAILS, thumbnailPath);
      if (thumbnailResult.error) {
        console.warn('Failed to delete thumbnail:', thumbnailResult.error);
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

// Video-specific storage operations
export const videoStorage = {
  // Upload video with thumbnail
  async uploadVideo(
    eventId: string,
    file: File,
    contributorId: string,
    thumbnailBlob?: Blob
  ): Promise<StorageResult<{ 
    originalPath: string; 
    thumbnailPath: string; 
    originalUrl: string; 
    thumbnailUrl: string; 
  }>> {
    try {
      // Generate unique filename
      const timestamp = Date.now();
      const fileExtension = file.name.split('.').pop();
      const filename = `${timestamp}_${contributorId}.${fileExtension}`;
      
      // Upload original video
      const originalPath = `${eventId}/original/${filename}`;
      const originalResult = await storage.uploadFile(
        STORAGE_BUCKETS.VIDEOS,
        originalPath,
        file
      );

      if (originalResult.error) {
        return { data: null, error: originalResult.error };
      }

      // Upload thumbnail if provided
      let thumbnailPath = '';
      let thumbnailUrl = '';
      
      if (thumbnailBlob) {
        const thumbnailFilename = `${timestamp}_${contributorId}_thumb.jpg`;
        thumbnailPath = `${eventId}/thumbnails/${thumbnailFilename}`;
        
        const thumbnailResult = await storage.uploadFile(
          STORAGE_BUCKETS.THUMBNAILS,
          thumbnailPath,
          thumbnailBlob,
          { contentType: 'image/jpeg' }
        );

        if (thumbnailResult.error) {
          console.warn('Failed to upload thumbnail:', thumbnailResult.error);
        } else {
          thumbnailUrl = thumbnailResult.data!.url;
        }
      }

      return {
        data: {
          originalPath: originalResult.data!.path,
          thumbnailPath,
          originalUrl: originalResult.data!.url,
          thumbnailUrl,
        },
        error: null,
      };
    } catch (error) {
      return { 
        data: null, 
        error: { 
          message: error instanceof Error ? error.message : 'An unexpected error occurred' 
        } 
      };
    }
  },

  // Delete video and its thumbnail
  async deleteVideo(
    eventId: string,
    filename: string
  ): Promise<StorageResult<void>> {
    try {
      const originalPath = `${eventId}/original/${filename}`;
      const thumbnailPath = `${eventId}/thumbnails/${filename}`;

      // Delete original video
      const originalResult = await storage.deleteFile(STORAGE_BUCKETS.VIDEOS, originalPath);
      if (originalResult.error) {
        console.warn('Failed to delete original video:', originalResult.error);
      }

      // Delete thumbnail
      const thumbnailResult = await storage.deleteFile(STORAGE_BUCKETS.THUMBNAILS, thumbnailPath);
      if (thumbnailResult.error) {
        console.warn('Failed to delete thumbnail:', thumbnailResult.error);
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

// Avatar storage operations
export const avatarStorage = {
  // Upload user avatar
  async uploadAvatar(
    userId: string,
    file: File
  ): Promise<StorageResult<{ path: string; url: string }>> {
    try {
      const fileExtension = file.name.split('.').pop();
      const filename = `${userId}.${fileExtension}`;
      const path = `avatars/${filename}`;

      const result = await storage.uploadFile(
        STORAGE_BUCKETS.AVATARS,
        path,
        file,
        { upsert: true }
      );

      return result;
    } catch (error) {
      return { 
        data: null, 
        error: { 
          message: error instanceof Error ? error.message : 'An unexpected error occurred' 
        } 
      };
    }
  },

  // Delete user avatar
  async deleteAvatar(userId: string): Promise<StorageResult<void>> {
    try {
      const path = `avatars/${userId}.jpg`; // Assuming JPG format
      return await storage.deleteFile(STORAGE_BUCKETS.AVATARS, path);
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

// Server-side storage operations
export const serverStorage = {
  // Get file metadata on server side
  async getFileMetadata(
    bucket: string,
    path: string
  ): Promise<StorageResult<{ size: number; updated_at: string }>> {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase.storage
        .from(bucket)
        .list(path.split('/').slice(0, -1).join('/'));

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

      const filename = path.split('/').pop();
      const file = data.find(item => item.name === filename);

      if (!file) {
        return { 
          data: null, 
          error: { message: 'File not found' } 
        };
      }

      return {
        data: {
          size: file.metadata?.size || 0,
          updated_at: file.updated_at || '',
        },
        error: null,
      };
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
