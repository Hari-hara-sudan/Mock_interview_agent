import { auth } from "@/firebase/admin";

export async function getUidFromAuthHeader(request: Request): Promise<string | null> {
  try {
    const header = request.headers.get("authorization") || request.headers.get("Authorization") || "";
    if (!header) return null;
    const parts = header.split(" ");
    if (parts.length !== 2) return null;
    const scheme = parts[0];
    const token = parts[1];
    if (!/^Bearer$/i.test(scheme) || !token) return null;

    const decoded = await auth.verifyIdToken(token);
    if (decoded && decoded.uid) return decoded.uid;
    return null;
  } catch (err) {
    console.warn("getUidFromAuthHeader: token verification failed", err);
    return null;
  }
}

export default getUidFromAuthHeader;
