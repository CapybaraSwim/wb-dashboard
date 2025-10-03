export default async (req: Request) => {
  const url = new URL(req.url);
  const path = url.pathname.replace('/api', '');
  const target = `http://109.73.206.144:6969${path}${url.search}`;

  const targetUrl = new URL(target);
  targetUrl.searchParams.set('key', 'E6kUTYrYwZq2tN4QEtyzsbEBk3ie');

  const res = await fetch(targetUrl.toString());
  return new Response(res.body, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
};