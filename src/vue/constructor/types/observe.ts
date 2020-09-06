export interface UserWatcherOptions {
  immediate?: boolean
  cache?: boolean
  handler?(val: any, oldVal: any): void
}
export interface WatcherCotrOptions extends UserWatcherOptions {
  deep?: boolean;
  user?: boolean;
  lazy?: boolean;
  sync?: boolean;
  before?(): Function;
}

export interface WatcherOptions extends WatcherCotrOptions {}
