// Vercel Serverless Function — devuelve el país del visitante.
// Vercel inyecta la cabecera `x-vercel-ip-country` en cada request (todos los planes).
// La landing la usa para elegir la moneda: COP en Colombia, EUR en el resto.
// No cachear: la respuesta depende de la IP de quien llama.
export default function handler(req, res) {
  const country =
    req.headers['x-vercel-ip-country'] ||
    req.headers['x-country'] ||
    '';
  res.setHeader('Cache-Control', 'no-store');
  res.status(200).json({ country: String(country).toUpperCase() });
}
