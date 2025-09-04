import { GoogleOAuthProvider } from '@react-oauth/google'

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

if (!googleClientId) {
  throw new Error("Missing VITE_GOOGLE_CLIENT_ID in .env file");
}

export function OAuthProvider({ children }: { children: React.ReactNode }) {

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
        {children}
    </GoogleOAuthProvider>
  )
}