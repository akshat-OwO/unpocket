import {
    getMetaTags,
    getOGTags,
    getTwitterTags,
} from "https://deno.land/x/opengraph@v1.0.0/mod.ts";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
        "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        const { url } = await req.json();
        if (!url) {
            return new Response(
                JSON.stringify({ error: "Missing url" }),
                {
                    status: 400,
                    headers: {
                        ...corsHeaders,
                        "Content-Type": "application/json",
                    },
                },
            );
        }

        const og = await getOGTags(url);
        const twitter = await getTwitterTags(url);
        const meta = await getMetaTags(url);
        return new Response(
            JSON.stringify({ data: { og, twitter, meta } }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
    } catch (e) {
        return new Response(
            JSON.stringify({ error: e.message }),
            {
                status: 500,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            },
        );
    }
});
