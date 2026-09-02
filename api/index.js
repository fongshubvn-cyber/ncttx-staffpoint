export default async function handler(req, res) {
    try {
        if (req.method !== "POST") {
            return res.status(405).json({
                ok: false,
                error: "Method not allowed"
            });
        }

        const response = await fetch(process.env.GAS_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "text/plain;charset=utf-8"
            },
            body: JSON.stringify(req.body)
        });

        const text = await response.text();

        res
            .status(response.status)
            .setHeader("Content-Type", "application/json")
            .send(text);

    } catch (error) {

        res.status(500).json({
            ok: false,
            error: error.message
        });

    }
}
