import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const regions = await prisma.region.findMany({
      orderBy: { order: 'asc' },
    });
    return NextResponse.json({ success: true, data: regions });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, slug, badges, states, destinationCount, image, order } = body;

    if (!name || !image) {
      return NextResponse.json(
        { success: false, error: 'Name and image are required' },
        { status: 400 }
      );
    }

    const regionSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const newRegion = await prisma.region.create({
      data: {
        name,
        slug: regionSlug,
        badgesJson: JSON.stringify(badges || []),
        states: states || '',
        destinationCount: destinationCount || '+ 0 destinations',
        image,
        order: order || 0,
      },
    });

    return NextResponse.json({ success: true, data: newRegion });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, name, slug, badges, states, destinationCount, image, order } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 });
    }

    const updated = await prisma.region.update({
      where: { id },
      data: {
        name,
        slug,
        badgesJson: JSON.stringify(badges || []),
        states,
        destinationCount,
        image,
        order,
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 });
    }

    await prisma.region.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
