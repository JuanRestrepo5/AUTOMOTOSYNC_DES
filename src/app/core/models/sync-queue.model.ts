export interface SyncQueue {
  id?: string;
  collection: string;
  action: 'create' | 'update' | 'delete';
  docId: string;
  data: any;
  timestamp: Date;
  synced: boolean;
}