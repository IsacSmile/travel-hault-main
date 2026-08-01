import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (id) {
    const dest = await prisma.destination.findUnique({
      where: { id },
      include: { attractions: true },
    });
    return NextResponse.json(dest);
  }

  const destinations = await prisma.destination.findMany({
    orderBy: { name: 'asc' },
    include: { attractions: true },
  });

  return NextResponse.json(destinations);
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const {
      name,
      slug,
      stateOrCountry,
      categoryBadge,
      heroImage,
      aboutText,
      bestTimeToVisit,
      climate,
      attractions,
    } = body;

    if (!name || !slug) {
      return NextResponse.json({ error: 'Name and slug are required' }, { status: 400 });
    }

    const created = await prisma.destination.create({
      data: {
        name,
        slug,
        stateOrCountry: stateOrCountry || '',
        categoryBadge: categoryBadge || 'Explore',
        heroImage: heroImage || '',
        aboutText: aboutText || '',
        bestTimeToVisit: bestTimeToVisit || '',
        climate: climate || '',
        attractions: {
          create: (attractions || []).map((att: any) => ({
            name: att.name || '',
            image: att.image || '',
            description: att.description || '',
          })),
        },
      },
    });

    return NextResponse.json(created);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create destination' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const {
      id,
      name,
      slug,
      stateOrCountry,
      categoryBadge,
      heroImage,
      aboutText,
      bestTimeToVisit,
      climate,
      attractions,
    } = body;

    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    await prisma.attractedItem.deleteMany({ where: { destinationId: id } });

    const updated = await prisma.destination.update({
      where: { id },
      data: {
        name,
        slug,
        stateOrCountry,
        categoryBadge,
        heroImage,
        aboutText,
        bestTimeToVisit,
        climate,
        attractions: {
          create: (attractions || []).map((att: any) => ({
            name: att.name || '',
            image: att.image || '',
            description: att.description || '',
          })),
        },
      },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update destination' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    await prisma.destination.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete destination' }, { status: 500 });
  }
}
