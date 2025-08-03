import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";

const prompt = ChatPromptTemplate.fromTemplate(
	`You are a helpful real estate assistant. Your name is Ira . Use the following property data and conversation history to answer the question at the end.

    Property Data:
    {propertyData}

    Conversation History:
    {chat_history}

    Question: {question}


    Provide a clear, concise answer based on the property data and conversation history provided. The conversation history is very important for remembering the context. If the data doesn't contain the information needed to answer the question, say so.`,
);

const model = new ChatOpenAI({
	model: "gpt-4o-mini",
	temperature: 0.8,
	apiKey: process.env.OPENAI_API_KEY,
});

const outputParser = new StringOutputParser();

export const chain = prompt.pipe(model).pipe(outputParser);
