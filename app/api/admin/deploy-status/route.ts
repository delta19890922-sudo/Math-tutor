export async function GET() {
  const token = process.env.VERCEL_TOKEN;
  if (!token) {
    return Response.json({ connected: false, error: "未配置 VERCEL_TOKEN" });
  }

  try {
    const res = await fetch(
      "https://api.vercel.com/v1/deployments?projectId=prj_2dmi2cjZHNwI9ve6bEEqUxcIpTqL&limit=1",
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const data = await res.json();
    const dep = data.deployments?.[0];
    return Response.json({
      connected: true,
      state: dep?.readyState || "unknown",
      url: dep?.url || null,
    });
  } catch {
    return Response.json({ connected: true, state: "unknown" });
  }
}
