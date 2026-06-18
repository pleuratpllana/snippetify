// Supabase Edge Function - Ask AI
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Max-Age": "86400",
};

Deno.serve(async (req) => {
  try {
    if (req.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    if (req.method !== "POST") {
      return new Response(JSON.stringify({ result: "// Method not allowed" }), {
        status: 405,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      });
    }

    const authHeader = req.headers.get("Authorization");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");

    if (!authHeader || !SUPABASE_URL || !SUPABASE_ANON_KEY) {
      return new Response(JSON.stringify({ result: "// Unauthorized" }), {
        status: 401,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      });
    }

    const userResponse = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: {
        Authorization: authHeader,
        apikey: SUPABASE_ANON_KEY,
      },
    });

    if (!userResponse.ok) {
      return new Response(JSON.stringify({ result: "// Unauthorized" }), {
        status: 401,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      });
    }

    const user = await userResponse.json();
    if (!user?.id || !user?.email_confirmed_at) {
      return new Response(
        JSON.stringify({ result: "// Email confirmation required" }),
        {
          status: 403,
          headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
        }
      );
    }

    let body: { prompt?: unknown };
    try {
      body = await req.json();
    } catch {
      return new Response(JSON.stringify({ result: "// Invalid JSON body" }), {
        status: 400,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      });
    }

    const prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";
    if (!prompt) {
      return new Response(JSON.stringify({ result: "// No prompt provided" }), {
        status: 400,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      });
    }

    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    if (!GEMINI_API_KEY) {
      return new Response(
        JSON.stringify({
          result: "// GEMINI_API_KEY missing. Set it in Supabase Edge Function secrets.",
        }),
        {
          status: 500,
          headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
        }
      );
    }

    let generatedText = "// No response from AI";

    try {
      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent",
        {
          method: "POST",
          headers: {
            "x-goog-api-key": GEMINI_API_KEY,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 512,
            },
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        generatedText =
          data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
          "// No response from AI";
      } else {
        const errText = await response.text();
        console.error("Gemini API error:", errText);
        generatedText = `// Gemini API call failed (${response.status}). Check GEMINI_API_KEY, billing, model access, and Edge Function logs.`;
      }
    } catch (apiErr) {
      console.error("Gemini fetch error:", apiErr);
      generatedText = "// Failed to fetch AI response";
    }

    return new Response(JSON.stringify({ result: generatedText }), {
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("Critical Error:", err.message);
    return new Response(
      JSON.stringify({ result: "// Critical server error. Check logs." }),
      {
        status: 500,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      }
    );
  }
});
