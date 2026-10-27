export function GET() {
  return Response.json({
    ok: true,
    service: "vision",
    phase: 1,
  });
}
