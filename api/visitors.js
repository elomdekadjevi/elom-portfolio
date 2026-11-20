export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  const token = process.env.VERCEL_TOKEN;
  const projectId = process.env.VERCEL_PROJECT_ID;

  if (!token || !projectId) {
    return res.status(500).json({
      error: "Configuration Vercel manquante",
    });
  }

  try {
    const params = new URLSearchParams({
      projectId,
    });

    const response = await fetch(
      `https://api.vercel.com/v1/query/web-analytics/visits/count?${params}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      const details = await response.text();
      console.error("Vercel API:", details);

      return res.status(response.status).json({
        error: "Impossible de récupérer les statistiques",
      });
    }

    const result = await response.json();

    res.setHeader(
      "Cache-Control",
      "public, s-maxage=300, stale-while-revalidate=600",
    );

    return res.status(200).json({
      visitors: result.data?.visitors ?? 0,
      pageviews: result.data?.pageviews ?? 0,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Erreur interne du serveur",
    });
  }
}
