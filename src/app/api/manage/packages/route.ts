import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (id) {
    const pkg = await prisma.package.findUnique({
      where: { id },
      include: {
        themes: { include: { theme: true } },
        destinations: { include: { destination: true }, orderBy: { order: 'asc' } },
        variants: { include: { itineraryDays: { orderBy: { dayNumber: 'asc' } } } },
      },
    });
    return NextResponse.json(pkg);
  }

  const packages = await prisma.package.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      themes: { include: { theme: true } },
      destinations: { include: { destination: true }, orderBy: { order: 'asc' } },
      variants: { include: { itineraryDays: true } },
    },
  });

  return NextResponse.json(packages);
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const {
      title,
      slug,
      type,
      tripCode,
      shortDescription,
      longDescription,
      images,
      destinationsCount,
      groupSizeMax,
      groupSizeAvg,
      tourStyle,
      accommodationType,
      highlights,
      inclusions,
      exclusions,
      importantNotes,
      featured,
      themeIds,
      destinationIds,
      variants,
    } = body;

    if (!title || !slug || !type) {
      return NextResponse.json({ error: 'Title, slug, and type are required' }, { status: 400 });
    }

    const createdPkg = await prisma.package.create({
      data: {
        title,
        slug,
        type,
        tripCode: tripCode || `TH-${slug.slice(0, 3).toUpperCase()}-01`,
        shortDescription: shortDescription || '',
        longDescription: longDescription || '',
        imagesJson: JSON.stringify(images || []),
        destinationsCount: destinationsCount || 1,
        groupSizeMax: groupSizeMax || 12,
        groupSizeAvg: groupSizeAvg || 6,
        tourStyle: tourStyle || 'Guided Tour',
        accommodationType: accommodationType || '4 Star / Boutique',
        highlightsJson: JSON.stringify(highlights || []),
        inclusionsJson: JSON.stringify(inclusions || []),
        exclusionsJson: JSON.stringify(exclusions || []),
        importantNotesJson: JSON.stringify(importantNotes || []),
        featured: featured || false,
        themes: {
          create: (themeIds || []).map((tId: string) => ({
            theme: { connect: { id: tId } },
          })),
        },
        destinations: {
          create: (destinationIds || []).map((dId: string, idx: number) => ({
            order: idx,
            destination: { connect: { id: dId } },
          })),
        },
      },
    });

    // Create Duration Variants & Itineraries
    if (variants && Array.isArray(variants)) {
      for (const v of variants) {
        const createdVariant = await prisma.packageVariant.create({
          data: {
            packageId: createdPkg.id,
            label: v.label || 'Default Duration',
            subtitle: v.subtitle || '',
            slug: v.slug || '',
          },
        });

        if (v.itineraryDays && Array.isArray(v.itineraryDays)) {
          for (const day of v.itineraryDays) {
            await prisma.itineraryDay.create({
              data: {
                variantId: createdVariant.id,
                dayNumber: day.dayNumber || 1,
                title: day.title || '',
                description: day.description || '',
                imagesJson: JSON.stringify(day.images || []),
              },
            });
          }
        }
      }
    }

    return NextResponse.json(createdPkg);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message || 'Failed to create package' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const {
      id,
      title,
      slug,
      type,
      tripCode,
      shortDescription,
      longDescription,
      images,
      destinationsCount,
      groupSizeMax,
      groupSizeAvg,
      tourStyle,
      accommodationType,
      highlights,
      inclusions,
      exclusions,
      importantNotes,
      featured,
      themeIds,
      destinationIds,
      variants,
    } = body;

    if (!id) return NextResponse.json({ error: 'Package ID required' }, { status: 400 });

    // Clean up existing relations
    await prisma.packageTheme.deleteMany({ where: { packageId: id } });
    await prisma.packageDestination.deleteMany({ where: { packageId: id } });
    await prisma.packageVariant.deleteMany({ where: { packageId: id } });

    const updatedPkg = await prisma.package.update({
      where: { id },
      data: {
        title,
        slug,
        type,
        tripCode,
        shortDescription,
        longDescription,
        imagesJson: JSON.stringify(images || []),
        destinationsCount,
        groupSizeMax,
        groupSizeAvg,
        tourStyle,
        accommodationType,
        highlightsJson: JSON.stringify(highlights || []),
        inclusionsJson: JSON.stringify(inclusions || []),
        exclusionsJson: JSON.stringify(exclusions || []),
        importantNotesJson: JSON.stringify(importantNotes || []),
        featured,
        themes: {
          create: (themeIds || []).map((tId: string) => ({
            theme: { connect: { id: tId } },
          })),
        },
        destinations: {
          create: (destinationIds || []).map((dId: string, idx: number) => ({
            order: idx,
            destination: { connect: { id: dId } },
          })),
        },
      },
    });

    // Re-create Duration Variants & Itineraries
    if (variants && Array.isArray(variants)) {
      for (const v of variants) {
        const createdVariant = await prisma.packageVariant.create({
          data: {
            packageId: updatedPkg.id,
            label: v.label || 'Default Duration',
            subtitle: v.subtitle || '',
            slug: v.slug || '',
          },
        });

        if (v.itineraryDays && Array.isArray(v.itineraryDays)) {
          for (const day of v.itineraryDays) {
            await prisma.itineraryDay.create({
              data: {
                variantId: createdVariant.id,
                dayNumber: day.dayNumber || 1,
                title: day.title || '',
                description: day.description || '',
                imagesJson: JSON.stringify(day.images || []),
              },
            });
          }
        }
      }
    }

    return NextResponse.json(updatedPkg);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message || 'Failed to update package' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    await prisma.package.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete package' }, { status: 500 });
  }
}
