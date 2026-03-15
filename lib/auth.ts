import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        })

        if (!user || !user.passwordHash) return null

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash
        )

        if (!isValid) return null

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: (user as any).image ?? null,
          onboarded: user.onboarded,
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      try {
        // Handle Google sign-in: upsert user in DB
        if (account?.provider === 'google') {
          const existing = await prisma.user.findUnique({
            where: { email: user.email! },
          })
          if (!existing) {
            await (prisma.user.create as any)({
              data: {
                name: user.name || 'Google User',
                email: user.email!,
                image: user.image ?? null,
                passwordHash: null,
              },
            })
          } else if ((user as any).image && !(existing as any).image) {
            await (prisma.user.update as any)({
              where: { email: user.email! },
              data: { image: user.image ?? null },
            })
          }
        }
        return true
      } catch (error) {
        console.error("NextAuth signIn error:", error)
        return false // Still deny access but we'll see the error in the console
      }
    },
    async jwt({ token, user, account, trigger, session }) {
      if (user) {
        token.id = user.id
        token.onboarded = (user as any).onboarded ?? false
      }

      // For Google sign-in, fetch onboarded status from DB
      if (account?.provider === 'google' && user?.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email },
          select: { id: true, onboarded: true },
        })
        if (dbUser) {
          token.id = dbUser.id
          token.onboarded = dbUser.onboarded
        }
      }

      if (trigger === 'update' && session?.onboarded !== undefined) {
        token.onboarded = session.onboarded
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.onboarded = token.onboarded as boolean
      }
      return session
    },
  },
  pages: {
    signIn: '/sign-in',
  },
  session: { strategy: 'jwt' },
})
