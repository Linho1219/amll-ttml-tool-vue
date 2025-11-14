/// <reference types="vite/client" />

declare const __VERSION__: string

interface NavigatorUAData {
  platform: string;
  brands?: { brand: string; version: string }[];
  mobile?: boolean;
  getHighEntropyValues?: (hints: string[]) => Promise<any>;
}
interface Navigator {
  userAgentData?: NavigatorUAData;
}