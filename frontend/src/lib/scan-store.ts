import { ScanResult, mockScanHistory } from "./mock-data";

const STORAGE_KEY = "hawkeye_scans";

/** Get all scans (combining local storage and mock data) */
export function getAllScans(): ScanResult[] {
  if (typeof window === "undefined") return mockScanHistory;
  
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const localScans: ScanResult[] = raw ? JSON.parse(raw) : [];
    
    // Combine local user-generated scans with the default mock scans
    // Local scans go first so they appear at the top
    return [...localScans, ...mockScanHistory];
  } catch {
    return mockScanHistory;
  }
}

/** Get a specific scan by ID */
export function getScanById(id: string): ScanResult | undefined {
  const scans = getAllScans();
  return scans.find((s) => s.id === id);
}

/** Save a new scan to local storage */
export function saveScan(scan: ScanResult): void {
  if (typeof window === "undefined") return;
  
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const localScans: ScanResult[] = raw ? JSON.parse(raw) : [];
    
    localScans.unshift(scan); // Add to beginning
    localStorage.setItem(STORAGE_KEY, JSON.stringify(localScans));
  } catch (err) {
    console.error("Failed to save scan:", err);
  }
}

/** Generate a unique ID for new scans */
export function generateScanId(): string {
  return `scan-${Math.random().toString(36).substring(2, 9)}-${Date.now()}`;
}
