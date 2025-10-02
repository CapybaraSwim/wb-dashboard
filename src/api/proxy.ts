export default async (req: Request) => {
  const url = new URL(req.url)
  const target = `http://109.73.206.144:6969${url.pathname}${url.search}`
  const res = await fetch(target)
  return new Response(res.body, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  })
}