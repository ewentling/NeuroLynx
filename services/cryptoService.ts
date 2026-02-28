
export class CryptoService {
  private key: CryptoKey | null = null;

  // Use a fallback for demo, but mark for ENV
  private async getMasterKeyMaterial(): Promise<string> {
    // @ts-ignore
    return (import.meta as any).env?.VITE_NEUROLYNX_MASTER_KEY || "NEUROLYNX_FALLBACK_KEY_SECURE_2026";
  }

  async init(salt: Uint8Array) {
    // We re-init key per encryption/decryption to ensure we use the specific salt
    const enc = new TextEncoder();
    const keyStr = await this.getMasterKeyMaterial();
    const keyMaterial = await window.crypto.subtle.importKey(
      "raw",
      enc.encode(keyStr),
      { name: "PBKDF2" },
      false,
      ["deriveKey"]
    );

    this.key = await window.crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: salt as any,
        iterations: 100000,
        hash: "SHA-256"
      },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      true,
      ["encrypt", "decrypt"]
    );
  }

  async encrypt(data: any): Promise<string> {
    const salt = window.crypto.getRandomValues(new Uint8Array(16));
    await this.init(salt);

    const jsonStr = JSON.stringify(data);
    const enc = new TextEncoder();
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encoded = enc.encode(jsonStr);

    const ciphertext = await window.crypto.subtle.encrypt(
      { name: "AES-GCM", iv: iv },
      this.key!,
      encoded
    );

    // Pack: [Salt (16)] [IV (12)] [Ciphertext]
    const buffer = new Uint8Array(salt.byteLength + iv.byteLength + ciphertext.byteLength);
    buffer.set(salt);
    buffer.set(iv, 16);
    buffer.set(new Uint8Array(ciphertext), 16 + 12);

    let binary = '';
    const len = buffer.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(buffer[i]);
    }

    return 'ENC:' + btoa(binary);
  }

  async decrypt(dataStr: string): Promise<any> {
    if (!dataStr.startsWith('ENC:')) {
      try {
        return JSON.parse(dataStr);
      } catch {
        return dataStr;
      }
    }

    try {
      const base64 = dataStr.slice(4);
      const binary = atob(base64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }

      // Unpack: [Salt (16)] [IV (12)] [Ciphertext]
      const salt = bytes.slice(0, 16);
      const iv = bytes.slice(16, 28);
      const ciphertext = bytes.slice(28);

      await this.init(salt);

      const decrypted = await window.crypto.subtle.decrypt(
        { name: "AES-GCM", iv: iv },
        this.key!,
        ciphertext
      );

      const dec = new TextDecoder();
      return JSON.parse(dec.decode(decrypted));
    } catch (e) {
      console.error("Decryption failed", e);
      return null;
    }
  }
}
