import Elysia, { t } from "elysia";
import { User } from "../models/User";
import { JWTProvider } from "../providers/jwt.provider";
import { password as ps } from "bun";
import { AuthMiddleware } from "../middleware/auth.middleware";
import { AuthSchema } from "../shcemas/auth.schema";
import { ErrorReponse } from "../shcemas/_helpers";
import { autoCorrelate } from "../utils/pitch";
import meyda from "meyda";

export const AuthRoutes = new Elysia({
	prefix: "/auth",
})
	.use(JWTProvider)
	.use(AuthSchema)
	.post(
		"/login",
		async ({ body, set, jwt, status }) => {
			const { email, password } = body;

			// Find user by email
			const user = await User.findOne({ email });

			if (!user) {
				return status(401, {
					message: "Invalid credentials",
				});
			}

			// Verify password
			const isPasswordValid = await ps.verify(password, user.password);
			if (!isPasswordValid) {
				status(401, {
					message: "Invalid Password",
				});
			}

			// Generate JWT token
			const token = await jwt.sign({ userId: user._id.toString() });

			return {
				message: "Login successful",
				token,
				user,
			};
		},
		{
			body: "auth.login",
			response: {
				200: "auth.response",
				401: ErrorReponse(),
			},
		},
	)
	.post(
		"/register",
		async ({ body, set, jwt, status }) => {
			const { name, email, password } = body;

			// Check if user already exists
			const existingUser = await User.findOne({ email });
			if (existingUser) {
				status(400, {
					message: "Email already in use",
				});
			}

			// Hash password
			const hashedPassword = await ps.hash(password);

			// Create new user
			const user = new User({
				name,
				email,
				password: hashedPassword,
				balance: 0,
			});

			await user.save();

			// Generate JWT token
			const token = await jwt.sign({ userId: user._id.toString() });

			return {
				message: "User registered successfully",
				token,
				user,
			};
		},

		{
			body: "auth.register",
			response: {
				200: "auth.response",
				400: ErrorReponse(),
			},
		},
	)
	.use(AuthMiddleware)
	.post(
		"/enroll",
		async ({ user, body, set }) => {
			const { voice } = body;

			const features = meyda.extract(
				["rms"],
				new Float32Array(await voice.arrayBuffer()),
			);

			if (features) {
				console.log(features);
			}

			const pitch = autoCorrelate(
				new Float32Array(await voice.arrayBuffer()),
				44100,
			);

			user.pitch = pitch;
			await user.save();

			return {
				message: "Enrolled successfully",
			};
		},
		{
			body: "auth.enroll",
			response: {
				400: ErrorReponse(),
			},
		},
	)
	.get("/profile", async ({ user }) => user);
