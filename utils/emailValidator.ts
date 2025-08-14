let cachedTLDs: Set<string> | null = null;
let lastFetched = 0;
const ONE_WEEK = 7 * 24 * 60 * 60 * 1000;

const FALLBACK_TLDS = new Set(["COM", "NET", "ORG", "IO", "CO", "UK"]);

async function fetchTLDs(): Promise<Set<string>> {
    const now = Date.now();

    if (cachedTLDs && now - lastFetched < ONE_WEEK) {
        return cachedTLDs;
    }

    try {
        const res = await fetch("https://data.iana.org/TLD/tlds-alpha-by-domain.txt");
        const text = await res.text();

        const tlds = text
            .split("\n")
            .filter(line => line && !line.startsWith("#"))
            .map(tld => tld.trim().toUpperCase());

        cachedTLDs = new Set(tlds);
        lastFetched = now;

    } catch (err) {
        console.warn("⚠️ Could not fetch TLDs, using fallback", err);
        if (!cachedTLDs) {
            cachedTLDs = FALLBACK_TLDS;
            lastFetched = now;
        }
    }

    return cachedTLDs!;
}

const emailRegex = new RegExp(
    "^(?![0-9])[\\w!#$%&'*+/=?`{|}~^\\-]+" +
    "(?:\\.[\\w!#$%&'*+/=?`{|}~^\\-]+)*" +
    "@" +
    "(?:(?![0-9])[A-Za-z0-9-]+\\.)+" +
    "([A-Za-z]{2,63})$",
    "i"
);

export async function validateEmail(email: string): Promise<boolean> {
    const validTLDs = await fetchTLDs();

    const match = email.match(emailRegex);
    if (!match) return false;

    const tld = match[1].toUpperCase();
    return validTLDs.has(tld);
}
