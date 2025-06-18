// src/common/interfaces/wompi-error.interface.ts
export interface WompiError {
    type: string;
    messages: string[];
    fields?: Record<string, string>;
    code?: string;
  }