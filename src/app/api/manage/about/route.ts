import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
  let about = await prisma.aboutPageContent.findUnique({
    where: { id: 'singleton' },
  });

  if (!about) {
    about = await prisma.aboutPageContent.create({
      data: {
        id: 'singleton',
        heroHeading: 'Crafting Unforgettable Journeys Together',
        heroText: 'At Travel & Hault, we believe in the magic of exploration and the power of personalized travel. With a dedicated team of tourism experts and a deep commitment to excellence, we curate tours that bring your dream vacations to life.',
        heroImage: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80',
        
        statsStatementText: 'At Travel & Hault we are committed to delivering reliable, high-quality travel solutions. With over two decades of experience, we combine local expertise, premium stays, and customer-centric planning to bring your travel dreams to life.',
        statsJson: JSON.stringify([
          { number: '20+', label: 'YEARS EXPERIENCE' },
          { number: '10k+', label: 'HAPPY TRAVELERS' },
          { number: '500+', label: 'CORPORATE & SCHOOL GROUPS' },
          { number: '50+', label: 'INDIAN DESTINATIONS' },
        ]),

        missionHeading: 'Our Mission',
        missionText: 'We are committed to establishing a brand quality that is trusted. We provide reliable and quality travel solutions to meet all implied needs of our clients and achieve client satisfaction through highly motivated workforce involvement and a quality management system.',
        missionImageBg: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80',
        missionImageFg: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=600&q=80',
        missionPointsJson: JSON.stringify([
          'Establishing Brand Quality & Trust',
          'Exceeding Client Expectations at Every Step',
          'Authentic Travel Experiences Across India',
          'Continuous Workforce Growth & Development',
        ]),

        visionHeading: 'Our Vision',
        visionText: 'We seek a client-oriented organization that demonstrates care, anticipation of client needs, attention to detail, distinctive excellence, and client support with care and clarity.',
        visionImageBg: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
        visionImageFg: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=600&q=80',
        visionPointsJson: JSON.stringify([
          'Anticipating and Exceeding Traveler Needs',
          'Pioneering Sustainable & Green Tourism in India',
          'Empowering Local Communities via Travel',
          'Integrating User-Friendly Booking Technology',
        ]),

        strengthHeading: 'Our Strength & Team',
        strengthText: 'Supported by a dedicated team of experts including tourism experts, quality controllers, R&D personnel, tour planners, ticketing agents, travel guides, and drivers.',
        strengthImageBg: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=800&q=80',
        strengthImageFg: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80',
        strengthPointsJson: JSON.stringify([
          'Competitive Prices & No Hidden Charges',
          'Highly Experienced Tour Planners & Guides',
          'Best Transport & Quality Hotel Services',
          '24/7 Ground Coordination & Care',
        ]),

        videoHeading: 'How We Do Work',
        videoSubtext: 'Being a quality-oriented organization, we provide a wide array of high-standard services following the guidelines of the travel industry.',
        videoThumbnail: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // Placeholder
      },
    });
  }

  return NextResponse.json(about);
}

export async function PUT(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    
    const updated = await prisma.aboutPageContent.upsert({
      where: { id: 'singleton' },
      create: {
        id: 'singleton',
        heroHeading: body.heroHeading || '',
        heroText: body.heroText || '',
        heroImage: body.heroImage || '',
        statsStatementText: body.statsStatementText || '',
        statsJson: typeof body.stats === 'string' ? body.stats : JSON.stringify(body.stats || []),
        missionHeading: body.missionHeading || '',
        missionText: body.missionText || '',
        missionImageBg: body.missionImageBg || '',
        missionImageFg: body.missionImageFg || '',
        missionPointsJson: typeof body.missionPoints === 'string' ? body.missionPoints : JSON.stringify(body.missionPoints || []),
        visionHeading: body.visionHeading || '',
        visionText: body.visionText || '',
        visionImageBg: body.visionImageBg || '',
        visionImageFg: body.visionImageFg || '',
        visionPointsJson: typeof body.visionPoints === 'string' ? body.visionPoints : JSON.stringify(body.visionPoints || []),
        strengthHeading: body.strengthHeading || '',
        strengthText: body.strengthText || '',
        strengthImageBg: body.strengthImageBg || '',
        strengthImageFg: body.strengthImageFg || '',
        strengthPointsJson: typeof body.strengthPoints === 'string' ? body.strengthPoints : JSON.stringify(body.strengthPoints || []),
        videoHeading: body.videoHeading || '',
        videoSubtext: body.videoSubtext || '',
        videoThumbnail: body.videoThumbnail || '',
        videoUrl: body.videoUrl || '',
      },
      update: {
        heroHeading: body.heroHeading,
        heroText: body.heroText,
        heroImage: body.heroImage,
        statsStatementText: body.statsStatementText,
        statsJson: typeof body.stats === 'string' ? body.stats : JSON.stringify(body.stats || []),
        missionHeading: body.missionHeading,
        missionText: body.missionText,
        missionImageBg: body.missionImageBg,
        missionImageFg: body.missionImageFg,
        missionPointsJson: typeof body.missionPoints === 'string' ? body.missionPoints : JSON.stringify(body.missionPoints || []),
        visionHeading: body.visionHeading,
        visionText: body.visionText,
        visionImageBg: body.visionImageBg,
        visionImageFg: body.visionImageFg,
        visionPointsJson: typeof body.visionPoints === 'string' ? body.visionPoints : JSON.stringify(body.visionPoints || []),
        strengthHeading: body.strengthHeading,
        strengthText: body.strengthText,
        strengthImageBg: body.strengthImageBg,
        strengthImageFg: body.strengthImageFg,
        strengthPointsJson: typeof body.strengthPoints === 'string' ? body.strengthPoints : JSON.stringify(body.strengthPoints || []),
        videoHeading: body.videoHeading,
        videoSubtext: body.videoSubtext,
        videoThumbnail: body.videoThumbnail,
        videoUrl: body.videoUrl,
      },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error updating About page content' }, { status: 500 });
  }
}
