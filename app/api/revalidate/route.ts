import { revalidatePath } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';
import { parseBody } from 'next-sanity/webhook';

type Body = { _type: string; slug?: { current?: string }; _id?: string };

export async function POST(req: NextRequest) {
  try {
    const { isValidSignature, body } = await parseBody<Body>(
      req,
      process.env.SANITY_REVALIDATE_SECRET
    );
    if (!isValidSignature) {
      return NextResponse.json({ message: 'Invalid signature' }, { status: 401 });
    }
    if (!body?._type) {
      return NextResponse.json({ message: 'Bad request' }, { status: 400 });
    }
    // Strategy: revalidate the relevant route(s) by document type
    const t = body._type;
    if (t === 'blogPost') {
      revalidatePath('/blog');
      if (body.slug?.current) revalidatePath(`/blog/${body.slug.current}`);
    } else if (t === 'portfolioProject' || t === 'portfolioCategory') {
      revalidatePath('/portfolyo');
      revalidatePath('/'); // featured ones may be on home
    } else if (t === 'siteSettings') {
      revalidatePath('/', 'layout');
    } else {
      // home-touching types
      revalidatePath('/');
    }
    return NextResponse.json({ status: 'revalidated', type: t });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'error';
    return NextResponse.json({ message }, { status: 500 });
  }
}
