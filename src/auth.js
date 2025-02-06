import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { authConfig } from "@/auth.config";
import { connectDB } from "@/lib/actions/admin";
import { Admin, Employee } from "@/lib/models";
import bcrypt from "bcrypt";
import { z } from "zod";
import axios from "axios";

const login = async (credentials) => {
	const { userName, password, subdivisionName } = credentials
	const SERVER_ONE = process.env.SERVER_ONE
	const API_TOKEN = process.env.API_TOKEN

	try {

		const res = await axios.post(`${SERVER_ONE}/auth/local`, { identifier: userName, password })
		const userData = res?.data?.user
		// if (!userData) return null

		const userOfficeData = await axios.get(`${SERVER_ONE}/users/${userData?.id}?fields=id&populate=office`, { headers: { Authorization: API_TOKEN } })
		const office = userOfficeData?.data?.office
		// if (!office?.name) return null

		const user = { ...userData, office }

		return user;

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
						userName: z.string().email().min(4).max(75),
						password: z.string().min(6).max(20),
						subdivisionName: z.string().min(1).max(75)
					}).safeParse(credentials);
				} else {
					parsedCredentials = z.object({
						userName: z.string().min(4).max(20),
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
				token.office = user.office
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
