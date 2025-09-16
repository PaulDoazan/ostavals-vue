/// <reference types="vite/client" />

// Extend Window interface for garbage collection
declare global {
  interface Window {
    gc?: () => void;
  }
  
  // Extend Performance interface for memory information
  interface Performance {
    memory?: {
      usedJSHeapSize: number;
      totalJSHeapSize: number;
      jsHeapSizeLimit: number;
    };
  }
}
