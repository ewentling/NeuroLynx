
// This service manages the connection to real Google APIs
// Note: In a real deployment, you need to configure OAuth2 Client ID in Google Cloud Console.

const DISCOVERY_DOCS = [
    'https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest',
    'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest',
    'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'
];
const SCOPES = 'https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/drive.readonly https://www.googleapis.com/auth/calendar';

export class GoogleWorkspaceService {
    private gapi: any;
    private tokenClient: any;
    private initialized = false;
    private authError: string | null = null;

    constructor() {
        if (typeof window !== 'undefined') {
            // Load scripts dynamically if not present
            if (!document.getElementById('gapi-script')) {
                const script = document.createElement('script');
                script.id = 'gapi-script';
                script.src = 'https://apis.google.com/js/api.js';
                script.onload = () => this.initializeGapi();
                script.onerror = () => { this.authError = "Failed to load GAPI script"; console.error(this.authError); };
                document.body.appendChild(script);
            }
            if (!document.getElementById('gis-script')) {
                const script = document.createElement('script');
                script.id = 'gis-script';
                script.src = 'https://accounts.google.com/gsi/client';
                script.onload = () => this.initializeGis();
                script.onerror = () => { this.authError = "Failed to load GIS script"; console.error(this.authError); };
                document.body.appendChild(script);
            }
        }
    }

    initializeGapi() {
        if (!(window as any).gapi) return;
        (window as any).gapi.load('client', () => {
            console.log('GAPI client loaded');
        });
    }

    initializeGis() {
        console.log('GIS loaded');
    }

    async authenticate(clientId: string, apiKey: string) {
        if (!clientId || !apiKey) {
            this.authError = "Missing Google Client ID or API Key";
            throw new Error(this.authError);
        }
        
        try {
            await new Promise<void>((resolve, reject) => {
                const gapi = (window as any).gapi;
                if (!gapi || !gapi.client) {
                    reject(new Error("GAPI not loaded yet"));
                    return;
                }
                gapi.client.init({
                    apiKey: apiKey,
                    discoveryDocs: DISCOVERY_DOCS,
                }).then(() => resolve()).catch((e:any) => reject(e));
            });

            const google = (window as any).google;
            if (!google || !google.accounts || !google.accounts.oauth2) {
                throw new Error("GIS not loaded yet");
            }

            this.tokenClient = google.accounts.oauth2.initTokenClient({
                client_id: clientId,
                scope: SCOPES,
                callback: '', // defined at request time
            });
            
            this.initialized = true;
            this.authError = null;
        } catch (e: any) {
            this.authError = `Auth Initialization Failed: ${e.message || e}`;
            this.initialized = false;
            throw new Error(this.authError);
        }
    }

    getInitialiationStatus() {
        return { initialized: this.initialized, error: this.authError };
    }

    async signIn(): Promise<boolean> {
        if (!this.initialized) throw new Error("Google Service not initialized");
        
        return new Promise((resolve, reject) => {
            this.tokenClient.callback = async (resp: any) => {
                if (resp.error) reject(resp);
                resolve(true);
            };
            
            if ((window as any).gapi.client.getToken() === null) {
                // Prompt the user to select a Google Account and ask for consent to share their data
                this.tokenClient.requestAccessToken({prompt: 'consent'});
            } else {
                // Skip display of account chooser and consent dialog for an existing session
                this.tokenClient.requestAccessToken({prompt: ''});
            }
        });
    }

    // --- API WRAPPERS ---

    async listEmails(query: string = '') {
        if (!this.initialized) return [];
        try {
            const response = await (window as any).gapi.client.gmail.users.messages.list({
                'userId': 'me',
                'q': query,
                'maxResults': 10
            });
            const messages = response.result.messages || [];
            // Hydrate snippets
            const details = await Promise.all(messages.map(async (msg: any) => {
                const res = await (window as any).gapi.client.gmail.users.messages.get({ 'userId': 'me', 'id': msg.id });
                return {
                    id: res.result.id,
                    type: 'email',
                    title: res.result.snippet.substring(0, 50),
                    snippet: res.result.snippet,
                    date: new Date(Number(res.result.internalDate)).toLocaleDateString(),
                    link: `https://mail.google.com/mail/u/0/#inbox/${res.result.id}`
                };
            }));
            return details;
        } catch (e) {
            console.error("Gmail Fetch Error", e);
            return [];
        }
    }

    async listDriveFiles(query: string = '') {
        if (!this.initialized) return [];
        try {
            const response = await (window as any).gapi.client.drive.files.list({
                'pageSize': 10,
                'fields': "nextPageToken, files(id, name, mimeType, webViewLink, createdTime)",
                'q': query ? `name contains '${query}'` : undefined
            });
            return response.result.files.map((f: any) => ({
                id: f.id,
                type: f.mimeType.includes('spreadsheet') ? 'sheet' : 'doc',
                title: f.name,
                snippet: `Google Drive File (${f.mimeType})`,
                date: new Date(f.createdTime).toLocaleDateString(),
                link: f.webViewLink
            }));
        } catch (e) {
            console.error("Drive Fetch Error", e);
            return [];
        }
    }

    async listEvents() {
        if (!this.initialized) return [];
        try {
            const response = await (window as any).gapi.client.calendar.events.list({
                'calendarId': 'primary',
                'timeMin': (new Date()).toISOString(),
                'showDeleted': false,
                'singleEvents': true,
                'maxResults': 10,
                'orderBy': 'startTime'
            });
            return response.result.items.map((e: any) => ({
                id: e.id,
                title: e.summary,
                start: e.start.dateTime || e.start.date,
                end: e.end.dateTime || e.end.date,
                link: e.htmlLink
            }));
        } catch (e) {
            console.error("Calendar Fetch Error", e);
            return [];
        }
    }
}