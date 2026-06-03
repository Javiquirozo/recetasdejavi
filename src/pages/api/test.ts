export const GET = () => {
  return new Response(JSON.stringify({ test: 'ok' }), {
    headers: { 'Content-Type': 'application/json' }
  });
};
