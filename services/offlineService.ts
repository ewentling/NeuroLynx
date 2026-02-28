
export class OfflineService {
    private swRegistration: ServiceWorkerRegistration | null = null;

    async register() {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('/sw.js');
                this.swRegistration = registration;
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
                return true;
            } catch (err) {
                console.error('ServiceWorker registration failed: ', err);
                return false;
            }
        }
        return false;
    }

    async unregister() {
        if (this.swRegistration) {
            await this.swRegistration.unregister();
            this.swRegistration = null;
        }
    }

    isOnline(): boolean {
        return navigator.onLine;
    }

    onOnline(callback: () => void) {
        window.addEventListener('online', callback);
    }

    onOffline(callback: () => void) {
        window.addEventListener('offline', callback);
    }
}
