import { Elysia, t } from "elysia";
import OpenAI from "openai";
import fs from "node:fs";
import { OPENAI_API_KEY } from "../config";

const openai = new OpenAI({
	apiKey: OPENAI_API_KEY,
});

export const AIRoutes = new Elysia({ prefix: "/ai" })
	.get("/test", async ({ status }) => {
		const result = await openai.audio.transcriptions.create({
			model: "gpt-4o-transcribe",
			file: fs.createReadStream(`${__dirname}/test.mp3`),
			language: "en",
			prompt:
				"The person has a nigerian accent most likely, Use that to transcribe",
		});

		console.log(result.text);
	})
	.post(
		"/speech",
		async ({ body }) => {
			const result = await openai.audio.transcriptions.create({
				model: "gpt-4o-transcribe",
				file: body.audio,
				language: "en",
				prompt:
					"The person has a nigerian accent most likely, Use that to transcribe",
			});

			const reply = await openai.audio.speech.create({
				model: "gpt-4o",
				voice: "ballad",
				input: result.text,
				response_format: "mp3",
				instructions:
					"The person has a nigerian accent most likely, Be calm professional and ask to be sure about their intent",
			});

			return {
				result: {
					audio: await reply.arrayBuffer(),
					text: result.text,
				},
			};
		},
		{
			body: t.Object({
				audio: t.File({
					type: "audio/*",
				}),
			}),
			response: {
				200: t.Object({
					result: t.Object({
						audio: t.Unsafe<ArrayBuffer>(),
						text: t.String(),
					}),
				}),
			},
		},
	)
	.post("/", ({ status }) => {
		return status("OK");
	});
