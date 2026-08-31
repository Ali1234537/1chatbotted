import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: Request) {
  try {
    if (!process.env.GROQ_API_KEY) {
      return Response.json(
        {
          error: "GROQ_API_KEY is missing.",
        },
        {
          status: 500,
        }
      );
    }

    const body = await request.json();

    const messages = body.messages;

    if (!Array.isArray(messages)) {
      return Response.json(
        {
          error: "Messages must be an array.",
        },
        {
          status: 400,
        }
      );
    }

    const completion =
      await groq.chat.completions.create({
        model: "openai/gpt-oss-20b",

        messages: [
          {
            role: "system",
            content: `
You are a helpful, accurate and clear AI assistant.

IMPORTANT RESPONSE FORMATTING RULES:

1. Normal questions:
Use a clear heading when appropriate, followed by normal paragraphs.

2. Questions asking for steps, multiple items, advantages, disadvantages, features, reasons, or lists:
Use bullet points or numbered points.

3. Only create a Markdown table when a table genuinely makes the information easier to understand.
Examples:
- comparison between multiple things
- structured data
- multiple items with the same attributes
- side-by-side comparisons

Do NOT create a table for every answer.

4. Programming questions:
Use proper Markdown fenced code blocks.
Always include the programming language.

Example:

\`\`\`javascript
const name = "Ali";
console.log(name);
\`\`\`

5. Never repeat table rows.

6. Never duplicate Markdown content.

7. Never create malformed Markdown tables.

8. Keep answers organized and easy to read.

9. Do not put every sentence inside a bullet point.

10. Do not use a table when a normal paragraph is more natural.

11. If the user asks a simple question, give a simple answer.

12. Answer the actual question instead of unnecessarily adding unrelated information.
            `,
          },
          ...messages,
        ],

        temperature: 0.7,

        max_tokens: 3000,

        stream: true,
      });

    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of completion) {
            const content =
              chunk.choices[0]?.delta?.content;

            if (content) {
              controller.enqueue(
                encoder.encode(content)
              );
            }
          }

          controller.close();
        } catch (error) {
          console.error(
            "Groq streaming error:",
            error
          );

          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      status: 200,

      headers: {
        "Content-Type":
          "text/plain; charset=utf-8",

        "Cache-Control":
          "no-cache, no-transform",

        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error(
      "Groq API error:",
      error
    );

    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Something went wrong.",
      },
      {
        status: 500,
      }
    );
  }
}