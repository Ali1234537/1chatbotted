import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function GET() {
  try {
    const models = await groq.models.list();

    return Response.json({
      success: true,
      models: models.data.map((model) => ({
        id: model.id,
        owned_by: model.owned_by,
      })),
    });
  } catch (error) {
    console.error("MODEL LIST ERROR:", error);

    return Response.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Could not get models",
      },
      {
        status: 500,
      }
    );
  }
}