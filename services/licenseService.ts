import { CryptoService } from './cryptoService';

const LICENSE_STORAGE_KEY = 'nl_sys_chk_v1';
const VALIDATION_URL = '/api/validate-key';

export interface LicenseValidationResponse {
    valid: boolean;
    allowedUsers: number;
    offline?: boolean;
}

export class LicenseService {
    private crypto: CryptoService;

    constructor() {
        this.crypto = new CryptoService();
    }

    /**
     * Checks if a license is stored locally.
     * @returns The license key if found, null otherwise.
     */
    async getStoredLicense(): Promise<string | null> {
        const encrypted = localStorage.getItem(LICENSE_STORAGE_KEY);
        if (!encrypted) return null;

        try {
            // Attempt to decrypt
            const decrypted = await this.crypto.decrypt(encrypted);
            // Basic format check
            if (decrypted && typeof decrypted === 'string' && decrypted.length === 25) {
                return decrypted;
            }
            return null;
        } catch (e) {
            console.error("License decryption failed", e);
            localStorage.removeItem(LICENSE_STORAGE_KEY); // Corrupt data
            return null;
        }
    }

    /**
     * Encrypts and saves the license key to local storage.
     * Falls back to plain storage on non-secure contexts (HTTP) where SubtleCrypto is unavailable.
     */
    async saveLicense(key: string): Promise<void> {
        if (!window.crypto?.subtle) {
            localStorage.setItem(LICENSE_STORAGE_KEY, JSON.stringify(key));
            return;
        }
        try {
            const encrypted = await this.crypto.encrypt(key);
            localStorage.setItem(LICENSE_STORAGE_KEY, encrypted);
        } catch (e) {
            console.error("Failed to save license, falling back to plain storage", e);
            localStorage.setItem(LICENSE_STORAGE_KEY, JSON.stringify(key));
        }
    }

    /**
     * Removes the license from storage (used on invalidation).
     */
    clearLicense(): void {
        localStorage.removeItem(LICENSE_STORAGE_KEY);
    }

    /**
     * Validates the license key against the remote webhook.
     * Returns an object containing validity and user limit.
     */
    async validateLicense(key: string): Promise<LicenseValidationResponse> {
        try {
            // We use 'text/plain' as Content-Type to send a "Simple Request" which avoids 
            // the CORS Preflight (OPTIONS) request. Many basic webhooks do not handle 
            // OPTIONS requests correctly, leading to "Failed to fetch" errors.
            // The body is still valid JSON string.
            const response = await fetch(VALIDATION_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain;charset=UTF-8'
                },
                body: JSON.stringify({ licenseKey: key })
            });

            if (response.ok) {
                const text = await response.text();

                // Empty body means the n8n workflow is inactive/deactivated
                if (!text || text.trim().length === 0) {
                    console.warn("License server returned empty response — workflow may be deactivated.");
                    return { valid: false, allowedUsers: 0, offline: true };
                }

                try {
                    const data = JSON.parse(text);
                    // Check for valid status (handling various potential field names for robustness)
                    const isValid = !!(data.valid || data.success || data.result);

                    // Extract allowed_users, default to 2 if not present but valid.
                    // Safely parse string "5" to number 5.
                    let allowedUsers = 2;
                    if (data.allowed_users !== undefined && data.allowed_users !== null) {
                        const parsed = Number(data.allowed_users);
                        if (!isNaN(parsed)) {
                            allowedUsers = parsed;
                        }
                    }

                    return { valid: isValid, allowedUsers };
                } catch (jsonError) {
                    console.warn("Invalid JSON response from license server", jsonError);
                    return { valid: false, allowedUsers: 0, offline: true };
                }
            } else {
                console.warn(`License validation failed with status: ${response.status} ${response.statusText}`);
                return { valid: false, allowedUsers: 0 };
            }
        } catch (e) {
            console.error("License validation network error", e);
            return { valid: false, allowedUsers: 0, offline: true };
        }
    }
}
