import { NextResponse, type NextRequest } from 'next/server';
import { writeClient } from '@/sanity/lib/client';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const SERVICE_LABELS: Record<string, string> = {
  photo: 'Fotoğraf Çekimi',
  drone: 'Drone & Hava Çekimi',
  tour: '360° Sanal Tur',
  video: 'Tanıtım Videosu',
  plan: 'Kat Planı',
  stage: 'Sanal Staging',
};

const PROPERTY_LABELS: Record<string, string> = {
  apt: 'Daire',
  villa: 'Villa',
  duplex: 'Dubleks / Triplex',
  office: 'Ofis & Ticari',
};

interface BookingPayload {
  name?: string;
  phone?: string;
  email?: string;
  services?: string[];
  propertyType?: string;
  meters?: number;
  city?: string;
  notes?: string;
}

function isNonEmpty(s: unknown): s is string {
  return typeof s === 'string' && s.trim().length > 0;
}

async function notifyTelegram(text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    console.warn('[bookings] Telegram env vars missing', {
      hasToken: !!token,
      hasChatId: !!chatId,
    });
    return { ok: false as const, skipped: true as const };
  }

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      disable_web_page_preview: true,
    }),
  });
  const body = await res.text().catch(() => '');
  if (!res.ok) {
    return { ok: false as const, error: `${res.status} ${body}` };
  }
  return { ok: true as const };
}

export async function POST(req: NextRequest) {
  let payload: BookingPayload;
  try {
    payload = (await req.json()) as BookingPayload;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const name = payload.name?.trim();
  const phone = payload.phone?.trim();
  const email = payload.email?.trim();

  if (!isNonEmpty(name) || !isNonEmpty(phone) || !isNonEmpty(email)) {
    return NextResponse.json(
      { error: 'name, phone ve email zorunlu' },
      { status: 400 }
    );
  }

  const services = Array.isArray(payload.services)
    ? payload.services.filter(isNonEmpty)
    : [];

  const submittedAt = new Date().toISOString();

  const doc = {
    _type: 'booking',
    status: 'new',
    submittedAt,
    name,
    phone,
    email,
    services,
    propertyType: payload.propertyType,
    meters: typeof payload.meters === 'number' ? payload.meters : undefined,
    city: payload.city?.trim(),
    notes: payload.notes?.trim(),
  };

  let createdId: string | undefined;
  try {
    const created = await writeClient.create(doc);
    createdId = created._id;
  } catch (err) {
    const message = err instanceof Error ? err.message : 'sanity write failed';
    console.error('[bookings] sanity write failed:', message);
    return NextResponse.json({ error: 'Kayıt oluşturulamadı' }, { status: 500 });
  }

  const serviceText = services.map((s) => SERVICE_LABELS[s] ?? s).join(', ') || '—';
  const propertyText = payload.propertyType
    ? PROPERTY_LABELS[payload.propertyType] ?? payload.propertyType
    : '—';

  const lines = [
    '🆕 Yeni Rezervasyon Talebi',
    '',
    `Ad: ${name}`,
    `Telefon: ${phone}`,
    `E-posta: ${email}`,
    `Hizmetler: ${serviceText}`,
    `Mülk: ${propertyText}${
      typeof payload.meters === 'number' ? ` · ${payload.meters} m²` : ''
    }`,
    `Konum: ${payload.city || '—'}`,
  ];
  if (isNonEmpty(payload.notes)) {
    lines.push('', `Not:`, payload.notes!);
  }
  const text = lines.join('\n');

  const tg = await notifyTelegram(text).catch((err) => ({
    ok: false as const,
    error: err instanceof Error ? err.message : 'telegram error',
  }));
  if ('ok' in tg && tg.ok) {
    console.log('[bookings] ✅ telegram sent');
  } else if ('error' in tg && tg.error) {
    console.error('[bookings] ❌ telegram failed:', tg.error);
  } else if ('skipped' in tg && tg.skipped) {
    console.warn('[bookings] ⚠️ telegram skipped (env vars missing)');
  }

  console.log('[bookings] ✅ sanity write ok, id:', createdId);

  return NextResponse.json({
    ok: true,
    id: createdId,
    telegram: 'ok' in tg && tg.ok ? 'sent' : 'skipped',
  });
}
