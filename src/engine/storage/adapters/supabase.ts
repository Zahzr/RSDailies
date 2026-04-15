/**
 * Supabase Storage Adapter (Phase 2 Placeholder)
 * 
 * This is a skeleton implementation for Phase 2 (cloud sync).
 * Currently throws "not implemented" for all operations.
 * Will be integrated in a future release.
 */

import { IStorageAdapter, StorageWatchCallback } from '../interface'

export class SupabaseAdapter implements IStorageAdapter {
  constructor(supabaseUrl: string, supabaseKey: string) {
    // Phase 2: Initialize Supabase client
    console.warn('SupabaseAdapter is a Phase 2 placeholder. Using localStorage fallback.')
  }

  async get(key: string): Promise<string | null> {
    throw new Error('SupabaseAdapter: not implemented (Phase 2)')
  }

  async set(key: string, value: string): Promise<void> {
    throw new Error('SupabaseAdapter: not implemented (Phase 2)')
  }

  async remove(key: string): Promise<void> {
    throw new Error('SupabaseAdapter: not implemented (Phase 2)')
  }

  async clear(): Promise<void> {
    throw new Error('SupabaseAdapter: not implemented (Phase 2)')
  }

  async keys(): Promise<string[]> {
    throw new Error('SupabaseAdapter: not implemented (Phase 2)')
  }

  watch(callback: StorageWatchCallback): () => void {
    throw new Error('SupabaseAdapter: not implemented (Phase 2)')
  }
}
