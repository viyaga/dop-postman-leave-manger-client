import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { authConfig } from "@/auth.config";
import bcrypt from "bcrypt";
import { z } from "zod";
import prisma from "./lib/prisma";

const login = async (credentials) => {
	const { email, password, subdivisionName } = credentials

	try {
		const user = await prisma.user.findUnique({ where: { email } });

		if (!user) {
			return null;
		}

		const passwordMatch = await bcrypt.compare(password, user.password);
		if (!passwordMatch) {
			return null;
		}

		return user

	} catch (err) {
		return null;
	}
};

export const { signIn, signOut, auth } = NextAuth({
	...authConfig,
	providers: [
		CredentialsProvider({
			async authorize(credentials) {

				let parsedCredentials = null

				// if admin
				if (credentials.subdivisionName) {
					parsedCredentials = z.object({
						email: z.string().email().min(4).max(75),
						password: z.string().min(6).max(20),
						subdivisionName: z.string().min(1).max(75)
					}).safeParse(credentials);
				} else {
					parsedCredentials = z.object({
						email: z.string().min(4).max(20),
						password: z.string().min(6).max(20),
					}).safeParse(credentials);
				}

				if (parsedCredentials?.success) {
					const user = await login(credentials);
					return user;
				}

				return null
			},
		}),
	],
	session: {
		strategy: "jwt",
		maxAge: 60 * 60 * 24 * 1000
	},
	// ADD ADDITIONAL INFORMATION TO SESSION
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.id = user.documentId;
				token.name = user.name;
				token.office = user.officeName;
			}
			return token;
		},
		async session({ session, token }) {
			if (token) {
				session.user.id = token.userId;
				session.user.name = token.name;
				session.user.office = token.office
			}
			return session;
		},
	},
});
