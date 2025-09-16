/// <reference types="vite/client" />

// Extend Window interface for garbage collection
declare global {
  interface Window {
    gc?: () => void;
  }
}
