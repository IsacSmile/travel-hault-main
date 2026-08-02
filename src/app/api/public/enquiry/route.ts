import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      type,
      name,
      email,
      phone,
      message,
      packageId,
      preferredDate,
      arrivalDate,
      departureDate,
      numTravelers,
      hotelType,
      numRooms,
      pickupLocation,
      dropLocation,
      budgetRange,
      destinationsOfInterest,
    } = body;

    if (!name || (!email && !phone)) {
      return NextResponse.json(
        { success: false, error: 'Name and either Phone or Email are required' },
        { status: 400 }
      );
    }

    // Verify packageId exists if provided to prevent foreign key error
    let validPackageId: string | null = null;
    if (packageId && typeof packageId === 'string') {
      const existingPkg = await prisma.package.findUnique({ where: { id: packageId } });
      if (existingPkg) {
        validPackageId = packageId;
      }
    }

    const enquiry = await prisma.enquiry.create({
      data: {
        type: type || 'Contact',
        name: String(name).trim(),
        email: email ? String(email).trim() : 'not-provided@guest.com',
        phone: phone ? String(phone).trim() : 'Not provided',
        message: message ? String(message).trim() : '',
        packageId: validPackageId,
        preferredDate: preferredDate ? String(preferredDate) : null,
        arrivalDate: arrivalDate ? String(arrivalDate) : null,
        departureDate: departureDate ? String(departureDate) : null,
        numTravelers: numTravelers ? String(numTravelers) : null,
        hotelType: hotelType ? String(hotelType) : null,
        numRooms: numRooms ? Number(numRooms) : null,
        pickupLocation: pickupLocation ? String(pickupLocation) : null,
        dropLocation: dropLocation ? String(dropLocation) : null,
        budgetRange: budgetRange ? String(budgetRange) : null,
        destinationsOfInterest: destinationsOfInterest ? String(destinationsOfInterest) : null,
        status: 'New',
      },
    });

    return NextResponse.json({ success: true, enquiryId: enquiry.id });
  } catch (error) {
    console.error('Public Enquiry API submission error:', error);
    const msg = error instanceof Error ? error.message : 'Failed to submit enquiry';
    return NextResponse.json(
      { success: false, error: msg },
      { status: 500 }
    );
  }
}
