import NextAuth, { type NextAuthOptions } from 'next-auth'
import type { Provider } from 'next-auth/providers/index'
import CredentialsProvider from 'next-auth/providers/credentials'
import GitHubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'

const providers: Provider[] = [
  CredentialsProvider({
    name: 'Credentials',
    credentials: {
      email: { label: 'Email', type: 'email' },
      password: { label: 'Password', type: 'password' },
    },
    async authorize(credentials) {
      // Demo mode: accept any email/password combination
      if (credentials?.email) {
        return {
          id: credentials.email,
          email: credentials.email,
          name: credentials.email.split('@')[0],
        }
      }
      return null
    },
  }),
]

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  )
}

if (process.env.GITHUB_ID && process.env.GITHUB_SECRET) {
  providers.push(
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    })
  )
}

const authOptions: NextAuthOptions = {
  providers,
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      // Allow all sign-ins for now
      return true
    },
    async redirect({ url, baseUrl }) {
      // Redirect to campaigns after successful login
      if (url.startsWith(baseUrl)) return url
      return `${baseUrl}/campaigns`
    },
    async session({ session, token }) {
      // Add user ID to session
      if (token.sub) {
        session.user = {
          ...session.user,
          id: token.sub,
        }
      }
      return session
    },
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET || 'development-secret-change-in-production',
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
