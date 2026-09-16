import { PrismaClient } from '@prisma/client'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import NextAuth, { type NextAuthOptions, type DefaultSession, type DefaultUser } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export interface ExtendedUser extends DefaultUser {
  role?: string
  entity?: string
  country?: string
  department?: string
  mfaEnabled?: boolean
  requiresMFA?: boolean
}

declare module 'next-auth' {
  interface Session {
    user: ExtendedUser & DefaultSession['user']
  }
  interface User extends ExtendedUser {}
}

declare module 'next-auth/jwt' {
  interface JWT extends ExtendedUser {}
}

const ROLE_HIERARCHY: Record<string, string[]> = {
  KARYAWAN: ['KARYAWAN'],
  MAGANG: ['MAGANG', 'KARYAWAN'],
  KONTRAK: ['KONTRAK', 'KARYAWAN'],
  KONTRAKTOR: ['KONTRAKTOR', 'KARYAWAN'],
  MANAJER: ['MANAJER', 'KARYAWAN'],
  HR_BP: ['HR_BP', 'MANAJER', 'KARYAWAN'],
  PAYROLL_SPECIALIST: ['PAYROLL_SPECIALIST', 'KARYAWAN'],
  FINANCE_CONTROLLER: ['FINANCE_CONTROLLER', 'KARYAWAN'],
  LEGAL_COUNSEL: ['LEGAL_COUNSEL', 'KARYAWAN'],
  IT_ADMIN: ['IT_ADMIN', 'KARYAWAN'],
  AUDITOR: ['AUDITOR', 'KARYAWAN'],
}

const roleCache = new Map<string, Set<string>>()

export function hasRole(userRole: string, allowed: string[]): boolean {
  return allowed.some((role) => {
    let set = roleCache.get(role)
    if (!set) {
      set = new Set(ROLE_HIERARCHY[role] ?? [role])
      roleCache.set(role, set)
    }
    return set.has(userRole)
  })
}

export function canAccessField(userRole: string, _field: 'gaji' | 'nik' | 'npwp' | 'bpjs' | 'bank' | 'account' | 'health'): boolean {
  const sensitiveRoles = ['HR_BP', 'PAYROLL_SPECIALIST', 'FINANCE_CONTROLLER', 'IT_ADMIN', 'AUDITOR']
  return sensitiveRoles.includes(userRole)
}

export function isBreakGlass(userRole: string): boolean {
  return userRole === 'IT_ADMIN'
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'database',
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },
  pages: {
    signIn: '/masuk',
    signOut: '/masuk',
    error: '/masuk',
    verifyRequest: '/verifikasi',
  },
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Kredensial',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Kata sandi', type: 'password' },
        mfaToken: { label: 'Kode MFA', type: 'text' },
      },
      async authorize(credentials, _req) {
        if (!credentials?.email || !credentials?.password) return null

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user || !user.password) return null

        const passwordValid = await bcrypt.compare(credentials.password, user.password)
        if (!passwordValid) return null

        // MFA wajib untuk HR, Payroll, Admin
        const mfaRequiredRoles = ['HR_BP', 'PAYROLL_SPECIALIST', 'FINANCE_CONTROLLER', 'IT_ADMIN']
        if (user.mfaEnabled || mfaRequiredRoles.includes(user.role)) {
          if (!credentials.mfaToken) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
              requiresMFA: true,
            } as unknown as ExtendedUser
          }
          const mfaValid = await verifyMfaToken(user.id, credentials.mfaToken)
          if (!mfaValid) return null
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          entity: user.entity,
          country: user.country,
          department: user.department,
          mfaEnabled: user.mfaEnabled,
          image: user.image,
        } as ExtendedUser
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as ExtendedUser).role
        token.entity = (user as ExtendedUser).entity
        token.country = (user as ExtendedUser).country
        token.department = (user as ExtendedUser).department
        token.mfaEnabled = (user as ExtendedUser).mfaEnabled
        token.requiresMFA = (user as ExtendedUser).requiresMFA ?? false
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.entity = token.entity as string
        session.user.country = token.country as string
        session.user.department = token.department as string
        session.user.mfaEnabled = token.mfaEnabled as boolean
        session.user.requiresMFA = token.requiresMFA as boolean
      }
      return session
    },
    async signIn({ user }) {
      // Catat login ke audit log
      try {
        await prisma.auditLog.create({
          data: {
            actorId: user.id,
            action: 'LOGIN',
            target: 'Sesi pengguna',
            field: 'Status',
            before: 'Tidak terautentikasi',
            after: 'Terautentikasi',
            reason: 'Login dengan kredensial',
          },
        })
      } catch {
        // Audit log gagal tidak boleh mencegah login
      }
      return true
    },
  },
  events: {
    async signOut({ token }) {
      try {
        if (token.id) {
          await prisma.auditLog.create({
            data: {
              actorId: token.id as string,
              action: 'LOGOUT',
              target: 'Sesi pengguna',
              field: 'Status',
              before: 'Terautentikasi',
              after: 'Tidak terautentikasi',
              reason: 'Logout pengguna',
            },
          })
        }
      } catch {
        // Biarkan diam
      }
    },
  },
}

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions)

async function verifyMfaToken(userId: string, token: string): Promise<boolean> {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user || !user.mfaSecret) return false
  // Placeholder untuk development — di produksi gunakan otplib
  return token === '123456'
}
