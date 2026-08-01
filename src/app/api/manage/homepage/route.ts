import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
  const [slides, trustBadges, faqs, testimonials] = await Promise.all([
    prisma.heroSlide.findMany({ orderBy: { order: 'asc' } }),
    prisma.trustBadge.findMany({ orderBy: { order: 'asc' } }),
    prisma.fAQItem.findMany({ orderBy: { order: 'asc' } }),
    prisma.testimonial.findMany({ orderBy: { createdAt: 'desc' } }),
  ]);

  return NextResponse.json({ slides, trustBadges, faqs, testimonials });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const { section, action, data } = body;

    if (section === 'slide') {
      if (action === 'create') await prisma.heroSlide.create({ data });
      if (action === 'update') await prisma.heroSlide.update({ where: { id: data.id }, data });
      if (action === 'delete') await prisma.heroSlide.delete({ where: { id: data.id } });
    } else if (section === 'trustBadge') {
      if (action === 'create') await prisma.trustBadge.create({ data });
      if (action === 'update') await prisma.trustBadge.update({ where: { id: data.id }, data });
      if (action === 'delete') await prisma.trustBadge.delete({ where: { id: data.id } });
    } else if (section === 'faq') {
      if (action === 'create') await prisma.fAQItem.create({ data });
      if (action === 'update') await prisma.fAQItem.update({ where: { id: data.id }, data });
      if (action === 'delete') await prisma.fAQItem.delete({ where: { id: data.id } });
    } else if (section === 'testimonial') {
      if (action === 'create') await prisma.testimonial.create({ data });
      if (action === 'update') await prisma.testimonial.update({ where: { id: data.id }, data });
      if (action === 'delete') await prisma.testimonial.delete({ where: { id: data.id } });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error' }, { status: 500 });
  }
}
