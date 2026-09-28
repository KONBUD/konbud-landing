// "Pruébalo gratis" — envío del formulario.
// El presupuesto (opcional) se sube directo a Supabase Storage (bucket privado, solo INSERT en landing/),
// y la solicitud va a /api/prueba, que la guarda y avisa por email.
(function () {
  const form = document.getElementById('trial-form');
  if (!form) return;

  const SUPABASE_URL = 'https://cffxuaetnfcgidvkmgnm.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_folQwFtU2l63O3Aj4NADXA_DSTk9sWh';
  const MAX_BYTES = 25 * 1024 * 1024;

  const status = form.querySelector('.trial-status');
  const submit = form.querySelector('.trial-submit');
  const fileInput = form.querySelector('input[name="archivo"]');
  const fileName = form.querySelector('.trial-file-name');
  const fileHint = fileName.textContent;

  fileInput.addEventListener('change', () => {
    const f = fileInput.files[0];
    fileName.textContent = f ? f.name : fileHint;
    form.querySelector('.trial-file').classList.toggle('has-file', !!f);
  });

  function setStatus(msg, isError) {
    status.textContent = msg;
    status.classList.toggle('is-error', !!isError);
  }

  async function subirArchivo(f) {
    const limpio = f.name.normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^\w.\-]+/g, '_').slice(-80);
    const id = (crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random().toString(16).slice(2));
    const path = `landing/${id}-${limpio}`;
    const r = await fetch(`${SUPABASE_URL}/storage/v1/object/solicitudes-prueba/${path}`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        'Content-Type': f.type || 'application/octet-stream',
      },
      body: f,
    });
    if (!r.ok) throw new Error('archivo');
    return path;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;

    const f = fileInput.files[0];
    if (f && f.size > MAX_BYTES) {
      setStatus('El archivo pasa de 25 MB. Envíalo sin adjunto y te lo pedimos por correo.', true);
      return;
    }

    submit.disabled = true;
    setStatus(f ? 'Subiendo tu presupuesto…' : 'Enviando…');

    const data = Object.fromEntries(new FormData(form).entries());
    delete data.archivo;
    delete data.consent;

    try {
      if (f) data.archivo_path = await subirArchivo(f);
      setStatus('Enviando…');
      const r = await fetch('/api/prueba', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const out = await r.json().catch(() => ({}));
      if (!r.ok || !out.ok) throw new Error(out.error || 'envio');

      form.querySelector('.trial-form-body').hidden = true;
      form.querySelector('.trial-done').hidden = false;
    } catch (err) {
      submit.disabled = false;
      setStatus(
        err.message === 'datos'
          ? 'Revisa el nombre, la empresa y el email.'
          : 'No se pudo enviar. Escríbenos a santiago@konbud.net y lo montamos igual.',
        true
      );
    }
  });
})();
