import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const faqs = await prisma.fAQItem.findMany({
      orderBy: { order: 'asc' },
    });
    return NextResponse.json({ success: true, data: faqs });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { question, answer, category, showOnHomepage, order } = body;

    if (!question || !answer) {
      return NextResponse.json(
        { success: false, error: 'Question and Answer are required' },
        { status: 400 }
      );
    }

    const newFaq = await prisma.fAQItem.create({
      data: {
        question,
        answer,
        category: category || 'General',
        showOnHomepage: showOnHomepage ?? true,
        order: order || 0,
      },
    });

    return NextResponse.json({ success: true, data: newFaq });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, question, answer, category, showOnHomepage, order } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 });
    }

    const updated = await prisma.fAQItem.update({
      where: { id },
      data: {
        question,
        answer,
        category,
        showOnHomepage,
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

    await prisma.fAQItem.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
