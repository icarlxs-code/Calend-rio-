/* Ponte por SMS: o único caminho que passa pela torre sem internet, sem Wi-Fi e sem dados.
   O navegador não envia SMS sozinho (e nem lê) — isso é trancado pelo sistema. O que dá para fazer,
   e é honesto, é abrir o aplicativo de SMS do próprio celular com a mensagem já escrita; a pessoa
   confere e envia. O número não é guardado pelo Lembra (privacidade), então o destinatário é
   escolhido no próprio app de SMS, onde o contato já está salvo. */

const ios = () => /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

/** monta o link sms: que funciona no iPhone e no Android.
   O truque `?&body=` é entendido pelos dois: no Android é o parâmetro de consulta, no iOS é o corpo. */
export function linkSMS(texto, numero = '') {
  const n = String(numero || '').replace(/[^\d+]/g, '');
  const corpo = encodeURIComponent(String(texto || '').slice(0, 1200));
  // iOS aceita `&body=`, Android aceita `?body=`; `?&body=` cobre os dois
  return `sms:${n}${ios() ? '&' : '?&'}body=${corpo}`;
}

/** abre o app de SMS com a mensagem pronta. Devolve false se o aparelho não tem como. */
export function abreSMS(texto, numero = '') {
  if (!texto) return false;
  try {
    const url = linkSMS(texto, numero);
    // um clique real abre o app de mensagens; se o navegador bloquear, cai no location
    const a = document.createElement('a');
    a.href = url; a.style.display = 'none';
    document.body.appendChild(a); a.click(); a.remove();
    return true;
  } catch {
    try { location.href = linkSMS(texto, numero); return true; } catch { return false; }
  }
}
export const temSMS = () => /Android|iPhone|iPad|iPod/.test(navigator.userAgent);
