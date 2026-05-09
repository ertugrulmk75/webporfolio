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

function escapeMarkdown(s: string) {
  return s.replace(/[_*[\]()~`>#+=|{}.!\\-]/g, (c) => `\\${c}`);
}

async function notifyTelegram(text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return { ok: false, skipped: true as const };

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: 'MarkdownV2',
      disable_web_page_preview: true,
    }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    return { ok: false as const, error: body };
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
    '*🆕 Yeni Rezervasyon Talebi*',
    '',
    `*Ad:* ${escapeMarkdown(name)}`,
    `*Telefon:* ${escapeMarkdown(phone)}`,
    `*E-posta:* ${escapeMarkdown(email)}`,
    `*Hizmetler:* ${escapeMarkdown(serviceText)}`,
    `*Mülk:* ${escapeMarkdown(propertyText)}${
      typeof payload.meters === 'number' ? ` · ${payload.meters} m²` : ''
    }`,
    `*Konum:* ${escapeMarkdown(payload.city || '—')}`,
  ];
  if (isNonEmpty(payload.notes)) {
    lines.push('', `*Not:*\n${escapeMarkdown(payload.notes!)}`);
  }
  const text = lines.join('\n');

  const tg = await notifyTelegram(text).catch((err) => ({
    ok: false as const,
    error: err instanceof Error ? err.message : 'telegram error',
  }));
  if ('error' in tg && tg.error) {
    console.error('[bookings] telegram failed:', tg.error);
  }

  return NextResponse.json({ ok: true, id: createdId });
}
