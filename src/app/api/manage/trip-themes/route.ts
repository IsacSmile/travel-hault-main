import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
  const themes = await prisma.theme.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { packages: true } } },
  });
  return NextResponse.json(themes);
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const { name, slug, bannerImage, description } = body;

    if (!name || !slug) return NextResponse.json({ error: 'Name and slug required' }, { status: 400 });

    const theme = await prisma.theme.create({
      data: {
        name,
        slug,
        bannerImage: bannerImage || '',
        description: description || '',
      },
    });

    return NextResponse.json(theme);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const { id, name, slug, bannerImage, description } = body;

    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    const updated = await prisma.theme.update({
      where: { id },
      data: { name, slug, bannerImage, description },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    await prisma.theme.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete theme' }, { status: 500 });
  }
}
