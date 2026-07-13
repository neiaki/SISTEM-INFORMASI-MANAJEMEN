import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
    updateAge: 30 * 60,   // 30 minutes
  },
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "NIM / NIDN / Email", type: "text" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        const username = credentials.username as string;
        const password = credentials.password as string;
        const requestedRole = credentials.role as string;

        const user = await prisma.user.findUnique({
          where: { username },
          include: {
            mahasiswa: true,
            dosen: true,
            adminCampus: true,
            staffTU: true,
          },
        });

        if (!user || !user.passwordHash) {
          return null;
        }

        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) {
          return null;
        }

        // Cocokkan visual atau case-insensitive role
        if (user.role.toLowerCase() !== requestedRole.toLowerCase()) {
          return null;
        }

        let name = user.username;
        let email = "";

        if (user.role === "MAHASISWA" && user.mahasiswa) {
          name = user.mahasiswa.nama;
          email = user.mahasiswa.email;
        } else if (user.role === "DOSEN" && user.dosen) {
          name = user.dosen.nama;
          email = user.dosen.email;
        } else if (user.role === "ADMIN" && user.adminCampus) {
          name = user.adminCampus.nama;
          email = user.adminCampus.email;
        } else if (user.role === "STAFF_TU" && user.staffTU) {
          name = user.staffTU.nama;
          email = user.staffTU.email;
        }

        return {
          id: user.id,
          name,
          email,
          role: user.role,
          username: user.username,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === "google") {
        if (!profile?.email) return false;

        const email = profile.email;
        const linkedUser = await prisma.user.findFirst({
          where: {
            OR: [
              { mahasiswa: { email } },
              { dosen: { email } },
              { adminCampus: { email } },
              { staffTU: { email } },
            ]
          },
        });

        if (!linkedUser) {
          return "/auth/login?error=EmailNotRegistered";
        }
      }
      return true;
    },
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.role = (user as any).role;
        token.id = user.id;
        token.username = (user as any).username;
      }

      if (account?.provider === "google" && profile?.email) {
        const dbUser = await prisma.user.findFirst({
          where: {
            OR: [
              { mahasiswa: { email: profile.email } },
              { dosen: { email: profile.email } },
              { adminCampus: { email: profile.email } },
              { staffTU: { email: profile.email } },
            ]
          },
          include: {
            mahasiswa: true,
            dosen: true,
            adminCampus: true,
            staffTU: true,
          }
        });

        if (dbUser) {
          token.id = dbUser.id;
          token.role = dbUser.role;
          token.username = dbUser.username;

          if (dbUser.role === "MAHASISWA" && dbUser.mahasiswa) {
            token.name = dbUser.mahasiswa.nama;
          } else if (dbUser.role === "DOSEN" && dbUser.dosen) {
            token.name = dbUser.dosen.nama;
          } else if (dbUser.role === "ADMIN" && dbUser.adminCampus) {
            token.name = dbUser.adminCampus.nama;
          } else if (dbUser.role === "STAFF_TU" && dbUser.staffTU) {
            token.name = dbUser.staffTU.nama;
          }
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        (session.user as any).id = token.id as string;
        (session.user as any).role = token.role as string;
        (session.user as any).username = token.username as string;
        if (token.name) {
          session.user.name = token.name as string;
        }
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
});
