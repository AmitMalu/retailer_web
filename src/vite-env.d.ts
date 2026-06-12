/// <reference types="vite/client" />

declare global {
  interface Window {
    DigiboostSdk: (options: {
      gateway: string;
      token: string;
      selector: string;
      onSuccess: (data: any) => void;
      onFailure: (error: any) => void;
    }) => void;
  }
}

export {};
