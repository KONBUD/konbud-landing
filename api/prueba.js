// Vercel Serverless Function — recibe una solicitud de "Pruébalo gratis".
// 1. Valida y guarda la fila en Supabase (tabla solicitudes_prueba: solo INSERT anónimo, RLS).
// 2. Avisa a Santiago por email vía SendGrid (si SENDGRID_API_KEY está configurada en Vercel).
// El archivo del presupuesto (opcional) lo sube el navegador directo a Storage; aquí llega su ruta.

const SUPABASE_URL = 'https://cffxuaetnfcgidvkmgnm.supabase.co';
// Clave publicable: es pública por diseño; la tabla solo admite INSERT (ver migración solicitudes_prueba_landing).
const SUPABASE_KEY = 'sb_publishable_folQwFtU2l63O3Aj4NADXA_DSTk9sWh';
const AVISO_A = 'santiago@konbud.net';
const REMITENTE = 'cotizaciones@konbud.net';

const LIMITES = {
  nombre: 120, empresa: 160, email: 200, telefono: 40,
  pais: 40, cuando_compra: 60, mensaje: 2000, archivo_path: 300,
};

function limpiar(v, max) {
  if (typeof v !== 'string') return null;
  const s = v.trim().slice(0, max);
  return s || null;
}

async function avisar(sol) {
  const key = process.env.SENDGRID_API_KEY;
  if (!key) return 'sin_clave';
  const lineas = [
    `Nueva solicitud de prueba gratis en konbud.net`,
    ``,
    `Nombre:   ${sol.nombre}`,
    `Empresa:  ${sol.empresa}`,
    `Email:    ${sol.email}`,
    `Teléfono: ${sol.telefono || '—'}`,
    `País:     ${sol.pais || '—'}`,
    `Compra:   ${sol.cuando_compra || '—'}`,
    `Archivo:  ${sol.archivo_path ? 'solicitudes-prueba/' + sol.archivo_path : 'no adjuntó'}`,
    ``,
    `Mensaje:`,
    sol.mensaje || '—',
    ``,
    `Siguiente paso: responder en <24 h e invitarle desde Supabase Auth → /onboarding.`,
  ];
  const r = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: AVISO_A }] }],
      from: { email: REMITENTE, name: 'KONBUD — Prueba gratis' },
      reply_to: { email: sol.email, name: sol.nombre },
      subject: `🧪 Prueba gratis: ${sol.empresa} (${sol.nombre})`,
      content: [{ type: 'text/plain', value: lineas.join('\n') }],
      tracking_settings: { click_tracking: { enable: false }, open_tracking: { enable: false } },
    }),
  });
  return r.ok ? 'ok' : `error_${r.status}`;
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ ok: false });

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  body = body || {};

  // Honeypot: los humanos no ven este campo.
  if (body.web) return res.status(200).json({ ok: true });

  const sol = {};
  for (const [campo, max] of Object.entries(LIMITES)) sol[campo] = limpiar(body[campo], max);
  sol.origen = 'landing';

  if (!sol.nombre || sol.nombre.length < 2 || !sol.empresa || sol.empresa.length < 2 ||
      !sol.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(sol.email)) {
    return res.status(400).json({ ok: false, error: 'datos' });
  }
  if (sol.archivo_path && !/^landing\/[\w.\-]+$/.test(sol.archivo_path)) sol.archivo_path = null;

  const r = await fetch(`${SUPABASE_URL}/rest/v1/solicitudes_prueba`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify(sol),
  });
  if (!r.ok) return res.status(502).json({ ok: false, error: 'guardar' });

  let aviso = 'no';
  try { aviso = await avisar(sol); } catch { aviso = 'error'; }
  return res.status(200).json({ ok: true, aviso });
}
