
export async function savedStatus(request: APIRequestContext) {
  const res = await request.get('http://localhost:3001/api/prefs/invoice-status');
  return (await res.json()).value;
}
