export async function POST(req) {
  try {
    const { accessToken } = await req.json();
    
    const response = await fetch("http://localhost:8080/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ accessToken }),
    });

    if (!response.ok) {
      throw new Error("백엔드 로그인 요청 실패");
    }

    const userData = await response.json();
    return new Response(JSON.stringify(userData), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
    
  } catch (error) {
    return new Response(JSON.stringify({ error: "카카오 로그인 실패" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
