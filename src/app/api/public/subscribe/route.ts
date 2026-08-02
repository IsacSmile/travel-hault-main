import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isValidEmail } from '@/lib/validation';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    const trimmedEmail = email ? String(email).trim().toLowerCase() : '';

    if (!trimmedEmail || !isValidEmail(trimmedEmail)) {
      return NextResponse.json({ error: 'Please enter a valid email address (e.g. name@domain.com)' }, { status: 400 });
    }

    // Check existing
    const existing = await prisma.subscriber.findUnique({ where: { email: trimmedEmail } });
    if (existing) {
      return NextResponse.json({ success: true, message: 'Already subscribed' });
    }

    await prisma.subscriber.create({
      data: { email: trimmedEmail },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Subscription failed' }, { status: 500 });
  }
}
