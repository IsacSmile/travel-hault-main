import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Cleaning up existing data...');
  await prisma.region.deleteMany();
  await prisma.enquiry.deleteMany();
  await prisma.subscriber.deleteMany();
  await prisma.itineraryDay.deleteMany();
  await prisma.packageVariant.deleteMany();
  await prisma.packageDestination.deleteMany();
  await prisma.packageTheme.deleteMany();
  await prisma.attractedItem.deleteMany();
  await prisma.package.deleteMany();
  await prisma.destination.deleteMany();
  await prisma.theme.deleteMany();
  await prisma.galleryImage.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.fAQItem.deleteMany();
  await prisma.trustBadge.deleteMany();
  await prisma.heroSlide.deleteMany();
  await prisma.adminUser.deleteMany();
  await prisma.siteSettings.deleteMany();

  console.log('Seeding Regions...');
  await prisma.region.createMany({
    data: [
      {
        slug: 'north-india',
        name: 'North India',
        badgesJson: JSON.stringify(['ALL ADVENTURES', 'DEALS']),
        states: 'Ladakh, Delhi, Uttar Pradesh, Uttarakhand, Himachal Pradesh, Punjab, Jammu & Kashmir',
        destinationCount: '+ 20 destinations',
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
        order: 1,
      },
      {
        slug: 'south-india',
        name: 'South India',
        badgesJson: JSON.stringify(['NATURE', 'WELLNESS']),
        states: 'Kerala, Tamil Nadu, Karnataka',
        destinationCount: '+ 10 destinations',
        image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
        order: 2,
      },
      {
        slug: 'west-india',
        name: 'West India',
        badgesJson: JSON.stringify(['BEACHES', 'HERITAGE']),
        states: 'Rajasthan, Goa',
        destinationCount: '+ 9 destinations',
        image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
        order: 3,
      },
      {
        slug: 'east-india',
        name: 'East India',
        badgesJson: JSON.stringify(['HILLS', 'TEA GARDENS']),
        states: 'West Bengal',
        destinationCount: '+ 1 destinations',
        image: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=800&q=80',
        order: 4,
      },
      {
        slug: 'central-india',
        name: 'Central India',
        badgesJson: JSON.stringify(['CULTURE', 'HISTORY']),
        states: 'Madhya Pradesh',
        destinationCount: '+ 1 destinations',
        image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
        order: 5,
      },
      {
        slug: 'northeast-india',
        name: 'Northeast India',
        badgesJson: JSON.stringify(['MONASTERIES', 'SCENIC']),
        states: 'Sikkim',
        destinationCount: '+ 2 destinations',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
        order: 6,
      },
    ],
  });

  console.log('Seeding Admin User...');
  const passwordHash = await bcrypt.hash('admin123', 10);
  await prisma.adminUser.create({
    data: {
      username: 'admin',
      passwordHash,
    },
  });

  console.log('Seeding Site Settings...');
  await prisma.siteSettings.create({
    data: {
      id: 'singleton',
      phoneNumbersJson: JSON.stringify(['+91 98765 43210', '+91 98765 43211']),
      email: 'hello@travelhault.com',
      address: 'Suite 402, Signature Towers, MG Road, New Delhi, India 110001',
      workingHours: 'Mon - Sat: 9:30 AM - 7:00 PM (IST)',
      socialLinksJson: JSON.stringify({
        instagram: 'https://instagram.com/travelhault',
        facebook: 'https://facebook.com/travelhault',
        twitter: 'https://twitter.com/travelhault',
        youtube: 'https://youtube.com/travelhault',
      }),
      legalPagesJson: JSON.stringify({
        privacy: `
          <h2>Privacy Policy</h2>
          <p>Welcome to Travel & Hault. We respect your privacy and are committed to protecting your personal data.</p>
          <h3>1. Information We Collect</h3>
          <p>We collect information you provide directly through our enquiry forms, such as your full name, email address, phone number, travel dates, and trip preferences.</p>
          <h3>2. How We Use Your Data</h3>
          <p>Your details are strictly used by our travel specialists to create custom itineraries and respond to your enquiries. We do not sell or rent your data to third parties.</p>
        `,
        terms: `
          <h2>Terms of Service</h2>
          <p>By using Travel & Hault, you agree to comply with our terms of service regarding travel enquiries and bookings.</p>
          <h3>1. Service Scope</h3>
          <p>Travel & Hault is a boutique travel marketing and enquiry platform. Confirmed bookings are executed following explicit confirmation and contract agreement with our specialists.</p>
        `,
        cancellation: `
          <h2>Cancellation & Refund Policy</h2>
          <p>We strive to offer maximum flexibility for our travelers.</p>
          <ul>
            <li>30 days or more prior to travel: 90% refund of deposit</li>
            <li>15-29 days prior to travel: 50% refund of deposit</li>
            <li>Less than 15 days: Non-refundable due to vendor commitments</li>
          </ul>
        `,
        cookie: `
          <h2>Cookie Policy</h2>
          <p>We use essential cookies and local browser storage (such as for your Wishlist) to enhance your browsing experience. No tracking cookies are stored without consent.</p>
        `,
      }),
      trustTitle: 'Why Travel & Hault?',
      trustSubtext: 'We deliver peace of mind, seamless itineraries, and unforgettable handcrafted memories.',
    },
  });

  console.log('Seeding Themes...');
  const themesData = [
    {
      slug: 'honeymoon-special',
      name: 'Honeymoon Special',
      bannerImage: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=1600&q=80',
      description: 'Romantic escapes, private villas, candlelit dinners, and serene landscapes crafted for unforgettable memories.',
    },
    {
      slug: 'beach-getaways',
      name: 'Beach Getaways',
      bannerImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80',
      description: 'Sun-kissed sands, turquoise oceans, water sports, and tranquil coastal resorts around the globe.',
    },
    {
      slug: 'luxury-tours',
      name: 'Luxury Tours',
      bannerImage: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1600&q=80',
      description: 'First-class travel, 5-star accommodations, private transfers, and exclusive VIP concierge services.',
    },
    {
      slug: 'spiritual-journeys',
      name: 'Spiritual Journeys',
      bannerImage: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1600&q=80',
      description: 'Soulful retreats, ancient temples, yoga sanctuaries, and peaceful heritage pilgrimage routes.',
    },
    {
      slug: 'wildlife-nature',
      name: 'Wildlife & Nature',
      bannerImage: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1600&q=80',
      description: 'Thrilling safaris, national parks, flora and fauna explorations led by expert naturalists.',
    },
    {
      slug: 'budget-travel',
      name: 'Budget Travel',
      bannerImage: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1600&q=80',
      description: 'Smart, high-value itineraries designed for maximum experiences without breaking the bank.',
    },
    {
      slug: 'weekend-trips',
      name: 'Weekend Trips',
      bannerImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80',
      description: 'Quick 2-to-3 day refreshers away from city hustle, perfect for busy professionals.',
    },
  ];

  const createdThemes: Record<string, any> = {};
  for (const item of themesData) {
    const theme = await prisma.theme.create({ data: item });
    createdThemes[item.slug] = theme;
  }

  console.log('Seeding Destinations...');
  const destinationsData = [
    {
      slug: 'kashmir',
      name: 'Kashmir',
      stateOrCountry: 'India',
      categoryBadge: 'Hills & Lakes',
      heroImage: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1600&q=80',
      aboutText: 'Known as Paradise on Earth, Kashmir enchants travelers with snow-capped peaks, serene Dal Lake shikara rides, vibrant Mughal gardens, and warm Kashmiri hospitality.',
      bestTimeToVisit: 'April to October (Spring/Summer), Dec to Feb (Snow/Skiing)',
      climate: 'Cool Spring (15°C), Pleasant Summer (25°C), Cold Snowy Winter (-2°C)',
      attractions: [
        {
          name: 'Dal Lake & Houseboats',
          image: 'https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&w=800&q=80',
          description: 'Iconic shikara rides, floating vegetable markets, and traditional carved wooden houseboats.',
        },
        {
          name: 'Gulmarg Gondola',
          image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80',
          description: 'Asia’s highest cable car taking you to Apharwat Peak for breathtaking views and skiing.',
        },
        {
          name: 'Pahalgam Valley',
          image: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=800&q=80',
          description: 'Lush green meadows, Betaab Valley, and pine forests along the Lidder River.',
        },
      ],
    },
    {
      slug: 'kerala',
      name: 'Kerala',
      stateOrCountry: 'India',
      categoryBadge: 'Backwaters & Nature',
      heroImage: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1600&q=80',
      aboutText: 'God’s Own Country boasts tranquil backwaters, rolling tea gardens of Munnar, exotic spice plantations, and pristine palm-fringed beaches.',
      bestTimeToVisit: 'September to March (Pleasant & Cool)',
      climate: 'Tropical Monsoon, Warm & Humid Coastal, Cool Mountain Valleys (18-28°C)',
      attractions: [
        {
          name: 'Alleppey Backwaters',
          image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
          description: 'Overnight luxury houseboat cruise along palm-lined canals and lagoons.',
        },
        {
          name: 'Munnar Tea Gardens',
          image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80',
          description: 'Endless emerald green tea estates, misty valleys, and Eravikulam National Park.',
        },
        {
          name: 'Kovalam Beach',
          image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
          description: 'Famous crescent beach with lighthouse views, sunset dining, and Ayurvedic spas.',
        },
      ],
    },
    {
      slug: 'bali',
      name: 'Bali',
      stateOrCountry: 'Indonesia',
      categoryBadge: 'Tropical Island',
      heroImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1600&q=80',
      aboutText: 'A tropical paradise celebrated for volcanic mountains, iconic rice terraces, vibrant coral reefs, and sacred cliffside sea temples.',
      bestTimeToVisit: 'April to October (Dry Season)',
      climate: 'Warm Tropical Climate (26°C - 31°C year-round)',
      attractions: [
        {
          name: 'Ubud Rice Terraces',
          image: 'https://images.unsplash.com/photo-1512641406448-6574e777bec6?auto=format&fit=crop&w=800&q=80',
          description: 'Tegallalang emerald rice fields, jungle swings, and traditional artisan villages.',
        },
        {
          name: 'Uluwatu Temple Sunset',
          image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
          description: 'Majestic cliffside temple perched high above ocean waves featuring Kecak Fire Dance.',
        },
        {
          name: 'Nusa Penida Island',
          image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80',
          description: 'Dramatic Kelingking T-Rex beach cliff and crystal clear snorkeling spots.',
        },
      ],
    },
    {
      slug: 'rajasthan',
      name: 'Rajasthan',
      stateOrCountry: 'India',
      categoryBadge: 'Heritage & Royalty',
      heroImage: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1600&q=80',
      aboutText: 'The Land of Kings showcases majestic hill forts, opulent palaces, Thar desert sand dunes, and vibrant folk culture.',
      bestTimeToVisit: 'October to March (Pleasant Winters)',
      climate: 'Hot Summer (38°C), Cool Crisp Winter (10°C - 24°C)',
      attractions: [
        {
          name: 'Jaipur Amber Fort',
          image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=80',
          description: 'Stunning yellow sandstone palace with mirror halls and sweeping hill views.',
        },
        {
          name: 'Udaipur City Palace & Lake Pichola',
          image: 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=800&q=80',
          description: 'Venice of the East featuring royal palace museums and sunset lake cruises.',
        },
        {
          name: 'Jaisalmer Desert Safari',
          image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80',
          description: 'Sam Sand Dunes camel rides, luxury tent stays, and Rajasthani cultural dance nights.',
        },
      ],
    },
    {
      slug: 'dubai',
      name: 'Dubai',
      stateOrCountry: 'UAE',
      categoryBadge: 'Modern Luxury',
      heroImage: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1600&q=80',
      aboutText: 'A futuristic city where ultra-modern architecture meets Arabian hospitality, featuring the world’s tallest tower and mega shopping paradises.',
      bestTimeToVisit: 'November to April (Mild & Sunny)',
      climate: 'Warm Winter (24°C), Hot Summer (40°C+)',
      attractions: [
        {
          name: 'Burj Khalifa & Dubai Mall',
          image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
          description: '124th floor observation deck, Dubai Fountain show, and world-class shopping.',
        },
        {
          name: 'Arabian Desert Safari',
          image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
          description: 'Dune bashing 4x4, quad biking, dune sunset photos, and BBQ dinner show.',
        },
        {
          name: 'Palm Jumeirah & Atlantis',
          image: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=800&q=80',
          description: 'Man-made palm island, Aquaventure waterpark, and beach clubs.',
        },
      ],
    },
    {
      slug: 'switzerland',
      name: 'Switzerland',
      stateOrCountry: 'Switzerland',
      categoryBadge: 'Alpine Splendor',
      heroImage: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1600&q=80',
      aboutText: 'Postcard-perfect landscapes of snow-capped Alps, crystal clear alpine lakes, scenic train rides, and charming mountain chalets.',
      bestTimeToVisit: 'May to September (Summer Hiking) & Dec to March (Skiing)',
      climate: 'Alpine European: Cool Summer (20°C), Snowy Winter (-5°C)',
      attractions: [
        {
          name: 'Jungfraujoch - Top of Europe',
          image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80',
          description: 'High-altitude cogwheel train to glacier ice palace at 3,454m height.',
        },
        {
          name: 'Interlaken & Lake Thun',
          image: 'https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=800&q=80',
          description: 'Adventure sports hub surrounded by twin alpine lakes and mountain peaks.',
        },
        {
          name: 'Lucerne & Mount Titlis',
          image: 'https://images.unsplash.com/photo-1541370976299-4d24ebbcbe5c?auto=format&fit=crop&w=800&q=80',
          description: 'Historical Chapel Bridge, lake cruises, and Rotair revolving cable car.',
        },
      ],
    },
  ];

  const createdDestinations: Record<string, any> = {};
  for (const item of destinationsData) {
    const { attractions, ...destInfo } = item;
    const dest = await prisma.destination.create({
      data: {
        ...destInfo,
        attractions: {
          create: attractions,
        },
      },
    });
    createdDestinations[item.slug] = dest;
  }

  console.log('Seeding Packages & Variants...');
  const packagesData = [
    {
      slug: 'magical-kashmir-paradise',
      title: 'Magical Kashmir: Lakes, Meadows & Snow Peaks',
      type: 'Domestic',
      tripCode: 'TH-KAS-01',
      shortDescription: 'Experience the enchantment of Srinagar houseboats, Gulmarg snow slopes, and Pahalgam river valleys on an unforgettable mountain getaway.',
      longDescription: 'Immerse yourself in the timeless beauty of the Kashmir Valley. Cruise peacefully on Dal Lake in a painted Shikara, ascend above the clouds on the Gulmarg Gondola, and stroll along Lidder River in Pahalgam. Handcrafted for couples, families, and nature enthusiasts seeking peace and tranquility.',
      imagesJson: JSON.stringify([
        'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80',
      ]),
      destinationsCount: 3,
      groupSizeMax: 12,
      groupSizeAvg: 4,
      tourStyle: 'Private Customized / Small Group',
      accommodationType: 'Luxury Houseboat & 4-Star Mountain Resorts',
      highlightsJson: JSON.stringify([
        'Shikara ride on Dal Lake at sunset with floating market stop',
        'Gondola cable car ride in Gulmarg up to Apharwat Phase 2',
        'Day excursion to Betaab & Aru Valleys in Pahalgam',
        'Traditional Wazwan dinner experience',
        'Personalized private chauffeur transfers',
      ]),
      inclusionsJson: JSON.stringify([
        'Accommodation on twin-sharing basis',
        'Daily breakfast & dinner',
        'Private AC vehicle for all transfers & sightseeings',
        '1 Night stay in Premium Dal Lake Houseboat',
        '1 Hour complimentary Shikara Ride',
        'All toll, fuel, driver allowances & taxes',
      ]),
      exclusionsJson: JSON.stringify([
        'Airfare / Train tickets to/from Srinagar',
        'Gondola tickets / Pony rides / Snow jeep charges',
        'Personal expenses, laundry, tips, and drinks',
        'Travel insurance',
      ]),
      importantNotesJson: JSON.stringify([
        'Valid photo ID (Aadhaar / Passport / Voter ID) required during check-in.',
        'Local union vehicles are mandatory in Pahalgam for Aru/Betaab valley sightseeings.',
      ]),
      featured: true,
      destinations: ['kashmir'],
      themes: ['honeymoon-special', 'luxury-tours', 'weekend-trips'],
      variants: [
        {
          label: '4 Nights / 5 Days',
          subtitle: 'Essential Kashmir Getaway',
          slug: '4n-5d',
          itinerary: [
            {
              dayNumber: 1,
              title: 'Arrival in Srinagar & Dal Lake Houseboat Check-in',
              description: 'On arrival at Srinagar Airport, receive a warm welcome from our driver partner. Transfer to your luxury houseboat on Dal Lake. In the evening, enjoy a 1-hour sunset Shikara ride.',
              imagesJson: JSON.stringify(['https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&w=800&q=80']),
            },
            {
              dayNumber: 2,
              title: 'Srinagar to Gulmarg Meadows (50 km / 2 Hours)',
              description: 'Drive through pine forests to Gulmarg. Take the world-famous Gondola Ride (Phase 1 & 2) for panoramic views of Nanga Parbat. Over-night stay in Gulmarg resort.',
              imagesJson: JSON.stringify(['https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80']),
            },
            {
              dayNumber: 3,
              title: 'Gulmarg to Pahalgam - Valley of Shepherds',
              description: 'Proceed to Pahalgam, visiting saffron fields and Avantipur ruins enroute. Walk alongside Lidder River and soak in the fresh mountain air.',
              imagesJson: JSON.stringify(['https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=800&q=80']),
            },
            {
              dayNumber: 4,
              title: 'Pahalgam Local Exploration & Return to Srinagar',
              description: 'Explore Betaab Valley and Aru Valley. Post lunch, drive back to Srinagar for Mughal Gardens tour (Nishat & Shalimar Bagh).',
              imagesJson: JSON.stringify(['https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=800&q=80']),
            },
            {
              dayNumber: 5,
              title: 'Srinagar Departure',
              description: 'After breakfast, shop for authentic Kashmiri pashminas and dry fruits before your transfer to Srinagar Airport for your onward journey.',
            },
          ],
        },
        {
          label: '6 Nights / 7 Days',
          subtitle: 'Grand Kashmir & Sonamarg Explorer',
          slug: '6n-7d',
          itinerary: [
            {
              dayNumber: 1,
              title: 'Srinagar Arrival & Houseboat Stay',
              description: 'Arrive in Srinagar and relax on Dal Lake houseboat with complimentary evening Shikara ride.',
            },
            {
              dayNumber: 2,
              title: 'Sonamarg Excursion (Meadow of Gold)',
              description: 'Full day excursion to Sonamarg at 2,740m altitude. Visit Thajiwas Glacier on ponies.',
            },
            {
              dayNumber: 3,
              title: 'Srinagar to Gulmarg',
              description: 'Drive to Gulmarg, Gondola cable car ride, and evening stroll in golf course meadows.',
            },
            {
              dayNumber: 4,
              title: 'Gulmarg to Pahalgam',
              description: 'Scenic journey to Pahalgam with stops at Pampore saffron fields.',
            },
            {
              dayNumber: 5,
              title: 'Pahalgam Valleys & Chandanwari',
              description: 'Full day exploration of Betaab Valley, Aru Valley, and Chandanwari.',
            },
            {
              dayNumber: 6,
              title: 'Pahalgam to Srinagar Heritage Tour',
              description: 'Return to Srinagar. Visit Jamia Masjid, Shankaracharya Temple, and Old City bazaars.',
            },
            {
              dayNumber: 7,
              title: 'Departure from Srinagar',
              description: 'Breakfast and airport drop-off.',
            },
          ],
        },
      ],
    },
    {
      slug: 'exotic-bali-tropical-escape',
      title: 'Exotic Bali: Ubud Villas, Sea Temples & Beach Clubs',
      type: 'International',
      tripCode: 'TH-BAL-02',
      shortDescription: 'Unwind in tropical paradise featuring private pool villas, Bali swings, cliffside Uluwatu sunset dances, and Nusa Penida island hopping.',
      longDescription: 'Escape to the Enchanted Island of Bali. Indulge in private jungle luxury in Ubud, marvel at Sacred Monkey Forests and emerald rice terraces, and catch world-class ocean sunsets at Tanah Lot & Uluwatu. Perfectly curated for couples and leisure seekers.',
      imagesJson: JSON.stringify([
        'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1512641406448-6574e777bec6?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80',
      ]),
      destinationsCount: 2,
      groupSizeMax: 10,
      groupSizeAvg: 2,
      tourStyle: 'Private Luxury Tour',
      accommodationType: '4-Star Beach Resort & Private Pool Villa in Ubud',
      highlightsJson: JSON.stringify([
        'Private Pool Villa stay in Ubud with floating breakfast option',
        'Full day Nusa Penida West Island tour (Kelingking Beach & Broken Beach)',
        'Uluwatu Sunset Temple entry with iconic Kecak & Fire Dance show',
        'Tegallalang Rice Terrace swing and Luwak Coffee tasting',
        'Sunset dinner cruise at Jimbaran Bay',
      ]),
      inclusionsJson: JSON.stringify([
        '5 Nights accommodations (3N Kuta/Seminyak + 2N Ubud Pool Villa)',
        'Daily breakfast at hotel/villa',
        'Fast boat tickets to Nusa Penida round-trip',
        'Private English-speaking driver guide for all sightseeings',
        'All entrance tickets and park fees',
      ]),
      exclusionsJson: JSON.stringify([
        'International airfares',
        'Indonesia Visa on Arrival (VoA ~ $35)',
        'Personal expenses and extra activities (water sports/spa)',
      ]),
      importantNotesJson: JSON.stringify([
        'Passport must be valid for at least 6 months from travel date.',
      ]),
      featured: true,
      destinations: ['bali'],
      themes: ['honeymoon-special', 'beach-getaways', 'luxury-tours'],
      variants: [
        {
          label: '5 Nights / 6 Days',
          subtitle: 'Tropical Island Highlights',
          slug: '5n-6d',
          itinerary: [
            {
              dayNumber: 1,
              title: 'Arrival in Bali & Seminyak Check-in',
              description: 'Warm Balinese greeting at Denpasar Airport. Transfer to your Seminyak beach resort. Relax and explore beach clubs.',
              imagesJson: JSON.stringify(['https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80']),
            },
            {
              dayNumber: 2,
              title: 'Kintamani Volcano & Ubud Cultural Tour',
              description: 'Visit Celuk artisan village, Tegallalang Rice Terrace swing, Luwak coffee plant, and view Mount Batur volcano.',
              imagesJson: JSON.stringify(['https://images.unsplash.com/photo-1512641406448-6574e777bec6?auto=format&fit=crop&w=800&q=80']),
            },
            {
              dayNumber: 3,
              title: 'Nusa Penida Island Speedboat Day Tour',
              description: 'Take morning fast boat to Nusa Penida. Visit Kelingking Beach, Broken Beach, Angel Billabong, and Crystal Bay.',
              imagesJson: JSON.stringify(['https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80']),
            },
            {
              dayNumber: 4,
              title: 'Tanah Lot Temple & Transfer to Ubud Private Villa',
              description: 'Morning visit to ocean temple Tanah Lot. Transfer to your luxury private pool villa in Ubud.',
            },
            {
              dayNumber: 5,
              title: 'Uluwatu Sunset Temple & Jimbaran Seafood Dinner',
              description: 'Visit Watersport haven in Benoa, followed by cliffside Uluwatu Kecak Fire Dance and romantic Jimbaran beach dinner.',
            },
            {
              dayNumber: 6,
              title: 'Spa & Departure',
              description: 'Enjoy a 60-minute Balinese massage before transfer to airport.',
            },
          ],
        },
      ],
    },
    {
      slug: 'kerala-backwaters-and-misty-hills',
      title: 'Kerala Serenade: Houseboats, Spice Hills & Oceans',
      type: 'Domestic',
      tripCode: 'TH-KER-03',
      shortDescription: 'Immerse in the green tranquil backwaters of Alleppey, tea plantations of Munnar, and wildlife safaris of Thekkady.',
      longDescription: 'Traverse God’s Own Country on a rich sensory journey. Breathe in fresh mountain air amidst Munnar’s endless tea estates, spot wild elephants in Periyar, and glide lazily through Alleppey backwaters on your private luxury houseboat.',
      imagesJson: JSON.stringify([
        'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
      ]),
      destinationsCount: 3,
      groupSizeMax: 15,
      groupSizeAvg: 4,
      tourStyle: 'Customized Private Tour',
      accommodationType: 'Nature Resorts & Private AC Houseboat',
      highlightsJson: JSON.stringify([
        'Overnight Alleppey Houseboat stay with all meals served onboard',
        'Munnar Tea Museum visit & tea tasting session',
        'Spice plantation guided walk in Thekkady',
        'Athirappilly Waterfalls visit (Niagara of India)',
        'Kathakali cultural dance & Kalaripayattu martial art show',
      ]),
      inclusionsJson: JSON.stringify([
        '5 Nights accommodations on twin sharing',
        'Full board on Houseboat (Breakfast, Lunch, Dinner)',
        'Daily breakfast at Munnar & Thekkady hotels',
        'Private AC Sedan/SUV with professional driver',
      ]),
      exclusionsJson: JSON.stringify([
        'Flight/Train bookings',
        'Personal laundry & drinks',
        'Boating charges in Periyar Lake',
      ]),
      importantNotesJson: JSON.stringify([
        'AC on Deluxe houseboats operates from 9:00 PM to 6:00 AM.',
      ]),
      featured: true,
      destinations: ['kerala'],
      themes: ['beach-getaways', 'spiritual-journeys', 'wildlife-nature', 'budget-travel'],
      variants: [
        {
          label: '5 Nights / 6 Days',
          subtitle: 'Munnar, Thekkady & Alleppey Circuit',
          slug: '5n-6d',
          itinerary: [
            {
              dayNumber: 1,
              title: 'Cochin Arrival & Transfer to Munnar (130 km / 4 hrs)',
              description: 'Pick up from Cochin Airport/Railway Station. Enroute visit Cheeyappara and Valara waterfalls. Check in to Munnar mountain resort.',
              imagesJson: JSON.stringify(['https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80']),
            },
            {
              dayNumber: 2,
              title: 'Munnar Tea Estates & Mattupetty Dam',
              description: 'Visit Eravikulam National Park (home to Nilgiri Tahr), Tea Museum, Mattupetty Dam, and Echo Point.',
            },
            {
              dayNumber: 3,
              title: 'Munnar to Thekkady Spice Sanctuary (110 km / 3 hrs)',
              description: 'Drive through cardamom hills. Visit Periyar Spice Plantation and enjoy boat safari on Periyar Lake.',
            },
            {
              dayNumber: 4,
              title: 'Thekkady to Alleppey Houseboat (140 km / 3.5 hrs)',
              description: 'Board your private luxury houseboat at noon. Cruise through village canals, palm trees, and paddy fields. Traditional Kerala lunch and dinner served on board.',
              imagesJson: JSON.stringify(['https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80']),
            },
            {
              dayNumber: 5,
              title: 'Alleppey to Kovalam Beach Resort',
              description: 'Disembark houseboat after breakfast and drive to Kovalam. Relax at Lighthouse Beach.',
            },
            {
              dayNumber: 6,
              title: 'Trivandrum Sightseeing & Departure',
              description: 'Visit Padmanabhaswamy Temple before drop-off at Trivandrum Airport.',
            },
          ],
        },
      ],
    },
    {
      slug: 'royal-rajasthan-forts-and-desert-dunes',
      title: 'Royal Rajasthan: Palaces, Forts & Desert Safaris',
      type: 'Domestic',
      tripCode: 'TH-RAJ-04',
      shortDescription: 'Step back into royal history across Jaipur, Udaipur, and Jaisalmer with fort tours, lake boat rides, and desert camps.',
      longDescription: 'Experience the regal magnificence of Rajasthan. Tour Jaipur’s grand Amber Fort, sail across Udaipur’s dreamy Lake Pichola, and sleep under desert stars in luxury tents at Jaisalmer dunes.',
      imagesJson: JSON.stringify([
        'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80',
      ]),
      destinationsCount: 3,
      groupSizeMax: 20,
      groupSizeAvg: 6,
      tourStyle: 'Cultural Heritage Private Tour',
      accommodationType: 'Heritage Haveli Hotels & Luxury Desert Camp',
      highlightsJson: JSON.stringify([
        'Elephant / Jeep ride up to Amber Fort in Jaipur',
        'Boat cruise on Lake Pichola in Udaipur with Jagmandir Palace view',
        'Sunset camel safari & folk music show in Jaisalmer Sam Sand Dunes',
        'Visit to Mehrangarh Fort in Jodhpur',
      ]),
      inclusionsJson: JSON.stringify([
        '6 Nights stays in handpicked heritage hotels',
        'Daily breakfast & dinner',
        'Private chauffeur-driven AC Sedan / SUV',
        'Camel ride and cultural program in desert camp',
      ]),
      exclusionsJson: JSON.stringify([
        'Monument entry fees and camera charges',
        'Personal shopping expenses',
        'Air/Rail fare',
      ]),
      importantNotesJson: JSON.stringify([
        'Desert night stay includes traditional Rajasthani buffet dinner.',
      ]),
      featured: true,
      destinations: ['rajasthan'],
      themes: ['luxury-tours', 'spiritual-journeys', 'budget-travel'],
      variants: [
        {
          label: '6 Nights / 7 Days',
          subtitle: 'Golden Triangle & Lakes Heritage',
          slug: '6n-7d',
          itinerary: [
            {
              dayNumber: 1,
              title: 'Arrival in Jaipur (The Pink City)',
              description: 'Pick up from Jaipur airport/station. Check in to hotel. Visit Birla Temple and Chokhi Dhani ethnic village.',
              imagesJson: JSON.stringify(['https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=80']),
            },
            {
              dayNumber: 2,
              title: 'Jaipur Full Day Forts & Palaces Tour',
              description: 'Visit Amber Fort, Hawa Mahal, City Palace, and Jantar Mantar observatory.',
            },
            {
              dayNumber: 3,
              title: 'Jaipur to Jodhpur (Blue City)',
              description: 'Drive to Jodhpur (330 km). Visit Mehrangarh Fort, Jaswant Thada, and Umaid Bhawan Palace.',
            },
            {
              dayNumber: 4,
              title: 'Jodhpur to Jaisalmer Golden Dunes',
              description: 'Proceed to Jaisalmer. Check in to desert camp. Enjoy sunset camel safari, Kalbeliya folk dance, and campfire.',
              imagesJson: JSON.stringify(['https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80']),
            },
            {
              dayNumber: 5,
              title: 'Jaisalmer Golden Fort & Patwon Ki Haveli',
              description: 'Tour Jaisalmer Fort (Sonray Kella) and beautiful hand-carved havelis.',
            },
            {
              dayNumber: 6,
              title: 'Jaisalmer to Udaipur (Venice of East)',
              description: 'Scenic journey to Udaipur with enroute stop at Ranakpur Jain Temples.',
              imagesJson: JSON.stringify(['https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=800&q=80']),
            },
            {
              dayNumber: 7,
              title: 'Udaipur City Palace & Departure',
              description: 'Visit Udaipur City Palace and take a boat cruise on Lake Pichola before drop-off at airport.',
            },
          ],
        },
      ],
    },
    {
      slug: 'futuristic-dubai-skylines-and-safari',
      title: 'Futuristic Dubai: Skyscrapers, Desert Dunes & Marina Cruises',
      type: 'International',
      tripCode: 'TH-DUB-05',
      shortDescription: 'Witness Burj Khalifa high-rise views, thrilling desert safari 4x4 dune bashing, and luxury marina yacht dinners.',
      longDescription: 'Immerse yourself in the world capital of glamour and modern architectural wonders. Experience top-floor Burj Khalifa panoramas, high-adrenaline desert quad biking, and magical dinner cruises along Dubai Marina.',
      imagesJson: JSON.stringify([
        'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=1200&q=80',
      ]),
      destinationsCount: 1,
      groupSizeMax: 12,
      groupSizeAvg: 4,
      tourStyle: 'Urban & Adventure Tour',
      accommodationType: '4-Star Downtown / Marina City Hotel',
      highlightsJson: JSON.stringify([
        'Burj Khalifa 124th & 125th Floor Observatory tickets',
        'Desert Safari 4x4 dune bashing with belly dance & BBQ dinner',
        'Dubai Marina Dhow Cruise with international buffet dinner',
        'Miracle Garden & Global Village entry',
        'Half-day Abu Dhabi Tour with Sheikh Zayed Grand Mosque',
      ]),
      inclusionsJson: JSON.stringify([
        '4 Nights accommodation in 4-Star hotel with breakfast',
        'Return Dubai International Airport transfers',
        'All sightseeings on shared / private basis as selected',
        'Tourism Dirham fees included',
      ]),
      exclusionsJson: JSON.stringify([
        'UAE Tourist Visa fees (~ $90)',
        'International flight tickets',
        'Expenses of personal nature',
      ]),
      importantNotesJson: JSON.stringify([
        'Dress code mandatory for Sheikh Zayed Grand Mosque (covered shoulders and knees, scarves for women).',
      ]),
      featured: true,
      destinations: ['dubai'],
      themes: ['luxury-tours', 'honeymoon-special', 'weekend-trips'],
      variants: [
        {
          label: '4 Nights / 5 Days',
          subtitle: 'Dubai Glitz & Desert Adventure',
          slug: '4n-5d',
          itinerary: [
            {
              dayNumber: 1,
              title: 'Arrival in Dubai & Marina Dhow Dinner Cruise',
              description: 'Land at Dubai International Airport. Driver pick-up and check-in. In the evening, board a traditional glass-enclosed Dhow cruise.',
              imagesJson: JSON.stringify(['https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80']),
            },
            {
              dayNumber: 2,
              title: 'Dubai City Tour & Burj Khalifa 124th Floor',
              description: 'Guided city tour passing Jumeirah Mosque, Burj Al Arab photo stop, Dubai Mall, and 124th floor view of Burj Khalifa.',
            },
            {
              dayNumber: 3,
              title: 'Desert Safari with BBQ & Fire Show',
              description: 'Morning at leisure. Afternoon 4x4 pickup for desert dune bashing, camel rides, henna tattoo, and live cultural shows.',
              imagesJson: JSON.stringify(['https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80']),
            },
            {
              dayNumber: 4,
              title: 'Abu Dhabi Grand Mosque & Louvre Day Tour',
              description: 'Full day excursion to Abu Dhabi. Visit breathtaking Sheikh Zayed Mosque and Corniche skyline.',
            },
            {
              dayNumber: 5,
              title: 'Shopping at Gold Souk & Departure',
              description: 'Explore traditional Deira Gold & Spice Souk before airport departure.',
            },
          ],
        },
      ],
    },
    {
      slug: 'switzerland-alpine-dream-and-lakes',
      title: 'Switzerland Alpine Odyssey: Jungfrau, Lucerne & Glacier Express',
      type: 'International',
      tripCode: 'TH-SWI-06',
      shortDescription: 'Ascend Jungfraujoch Top of Europe, sail on Lake Lucerne, and marvel at Matterhorn vistas on a majestic Swiss dream holiday.',
      longDescription: 'Fulfill your ultimate European dream across Switzerland’s legendary peaks and lakes. Take high-altitude mountain railways, stroll wooden chapel bridges, taste Swiss chocolates, and ride legendary scenic express trains.',
      imagesJson: JSON.stringify([
        'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1541370976299-4d24ebbcbe5c?auto=format&fit=crop&w=1200&q=80',
      ]),
      destinationsCount: 3,
      groupSizeMax: 8,
      groupSizeAvg: 2,
      tourStyle: 'First Class Rail & Private Excursion Tour',
      accommodationType: '4-Star Alpine Chalet Hotels with Breakfast',
      highlightsJson: JSON.stringify([
        '8-Day Swiss Travel Pass (Unlimited trains, boats, buses & museum access)',
        'Excursion to Jungfraujoch - Top of Europe (3,454m)',
        'Mount Titlis cable car with Rotair 360 & Cliff Walk',
        'Scenic cruise on Lake Lucerne',
        'Interlaken & Grindelwald First cliffwalk experience',
      ]),
      inclusionsJson: JSON.stringify([
        '6 Nights accommodation in Zurich, Interlaken & Lucerne',
        'Daily buffet breakfast',
        'Swiss Travel Pass consecutive days',
        'Jungfraujoch excursion voucher',
      ]),
      exclusionsJson: JSON.stringify([
        'Schengen Visa fees',
        'International flights',
        'Lunch, dinners & city tourist tax (~ CHF 4/person/night)',
      ]),
      importantNotesJson: JSON.stringify([
        'Warm windproof winter clothing recommended even in summer for glacier mountain tops.',
      ]),
      featured: true,
      destinations: ['switzerland'],
      themes: ['luxury-tours', 'honeymoon-special', 'wildlife-nature'],
      variants: [
        {
          label: '6 Nights / 7 Days',
          subtitle: 'Grand Swiss Alpine Explorer',
          slug: '6n-7d',
          itinerary: [
            {
              dayNumber: 1,
              title: 'Arrival in Zurich & Old Town Stroll',
              description: 'Land at Zurich Airport. Validate your Swiss Travel Pass and board train to hotel. Explore Bahnhofstrasse and Limmat river promenade.',
              imagesJson: JSON.stringify(['https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80']),
            },
            {
              dayNumber: 2,
              title: 'Zurich to Lucerne & Lake Cruise',
              description: 'Short 45-min train to Lucerne. Visit Chapel Bridge, Lion Monument, and take scenic Lake Lucerne steamboat cruise.',
            },
            {
              dayNumber: 3,
              title: 'Mount Titlis Snow Mountain Adventure',
              description: 'Train to Engelberg, ride Rotair revolving cable car to Mt. Titlis glacier ice cave and Cliff Walk bridge.',
              imagesJson: JSON.stringify(['https://images.unsplash.com/photo-1541370976299-4d24ebbcbe5c?auto=format&fit=crop&w=800&q=80']),
            },
            {
              dayNumber: 4,
              title: 'Lucerne to Interlaken Alpine Resort',
              description: 'Take Luzern-Interlaken Express train over Brünig Pass. Check in to Interlaken hotel between Lake Thun & Brienz.',
              imagesJson: JSON.stringify(['https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=800&q=80']),
            },
            {
              dayNumber: 5,
              title: 'Jungfraujoch - Top of Europe Excursion',
              description: 'Cogwheel train via Lauterbrunnen and Kleine Scheidegg to Sphinx Observatory and Ice Palace at 3,454m.',
            },
            {
              dayNumber: 6,
              title: 'Grindelwald First & Lake Thun Cruise',
              description: 'Explore Grindelwald First mountain carting or cliffwalk, followed by sunset cruise on Lake Thun.',
            },
            {
              dayNumber: 7,
              title: 'Return to Zurich & Airport Departure',
              description: 'Breakfast and train back to Zurich Airport for onward flight.',
            },
          ],
        },
      ],
    },
  ];

  for (const pkg of packagesData) {
    const { destinations, themes, variants, ...pkgDetails } = pkg;

    const createdPkg = await prisma.package.create({
      data: {
        ...pkgDetails,
        themes: {
          create: themes.map((tSlug) => ({
            theme: { connect: { id: createdThemes[tSlug].id } },
          })),
        },
        destinations: {
          create: destinations.map((dSlug, idx) => ({
            order: idx,
            destination: { connect: { id: createdDestinations[dSlug].id } },
          })),
        },
      },
    });

    for (const v of variants) {
      const { itinerary, ...variantDetails } = v;
      const createdVariant = await prisma.packageVariant.create({
        data: {
          ...variantDetails,
          packageId: createdPkg.id,
        },
      });

      for (const day of itinerary) {
        await prisma.itineraryDay.create({
          data: {
            ...day,
            variantId: createdVariant.id,
          },
        });
      }
    }
  }

  console.log('Seeding Hero Slides...');
  await prisma.heroSlide.createMany({
    data: [
      {
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80',
        locationTag: 'Maldives & Bali Tropics',
        headline: 'Escape the City, Find Your Peace',
        subtext: 'Handcrafted luxury vacations, bespoke honeymoons, and mountain retreats tailored for discerning travelers.',
        order: 1,
      },
      {
        image: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1920&q=80',
        locationTag: 'Kashmir Valley, India',
        headline: 'Paradise Awakens on Snow-Capped Horizons',
        subtext: 'Glide along glassy alpine lakes, stay in hand-carved houseboats, and rediscover quiet solitude.',
        order: 2,
      },
      {
        image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1920&q=80',
        locationTag: 'Swiss Alps & Interlaken',
        headline: 'Alpine Wonders & World-Class Journeys',
        subtext: 'Traverse scenic railways, snow peaks, and majestic European heritage landscapes.',
        order: 3,
      },
    ],
  });

  console.log('Seeding Trust Badges...');
  await prisma.trustBadge.createMany({
    data: [
      {
        icon: 'Compass',
        title: 'Bespoke Itineraries',
        description: 'Custom-tailored travel routes designed around your pace, preferences, and personal style.',
        order: 1,
      },
      {
        icon: 'ShieldCheck',
        title: 'Guaranteed Comfort',
        description: 'Handpicked 4 & 5-star hotels, verified private chauffeur transfers, and top-rated local guides.',
        order: 2,
      },
      {
        icon: 'Headphones',
        title: '24/7 On-Trip Assistance',
        description: 'Dedicated travel manager available round-the-clock via phone & WhatsApp during your trip.',
        order: 3,
      },
      {
        icon: 'Award',
        title: 'Transparent Pricing',
        description: 'Clear inclusions and zero hidden fees. Detailed breakdowns provided before you confirm.',
        order: 4,
      },
    ],
  });

  console.log('Seeding Testimonials...');
  await prisma.testimonial.createMany({
    data: [
      {
        name: 'Rohan & Ananya Sharma',
        reviewText: 'Our Kashmir honeymoon organized by Travel & Hault was pure magic! The Gulmarg resort view and private Dal Lake houseboat stay exceeded all expectations. Everything was seamless.',
        sourceLabel: 'Google Verified Review',
        rating: 5,
      },
      {
        name: 'Dr. Vikramaditya Rao',
        reviewText: 'Traveled to Switzerland with my parents. Travel & Hault crafted a comfortably paced itinerary with Swiss Travel Passes pre-arranged. Outstanding professionalism and assistance.',
        sourceLabel: 'TripAdvisor Review',
        rating: 5,
      },
      {
        name: 'Priya & Friends',
        reviewText: 'Our Bali trip was incredible! The private pool villa in Ubud and Nusa Penida boat tour were highlights of a lifetime. Can not wait to plan our next vacation with them!',
        sourceLabel: 'Google Verified Review',
        rating: 5,
      },
    ],
  });

  console.log('Seeding FAQs...');
  await prisma.fAQItem.createMany({
    data: [
      {
        question: 'How do I book a tour package on Travel & Hault?',
        answer: 'You can browse any package or destination on our website and click "Enquire Now" or "Plan My Trip". Submit your preferred dates and group size. A dedicated travel specialist will contact you within 2-4 business hours via phone or WhatsApp with a detailed custom proposal.',
        order: 1,
      },
      {
        question: 'Can all tour packages be customized to our preferences?',
        answer: 'Yes, absolutely! Every package listed on Travel & Hault is 100% customizable. You can adjust duration, add extra destinations, upgrade hotel categories, or request specific meal preferences.',
        order: 2,
      },
      {
        question: 'What is included in the "Price On Request" quote?',
        answer: 'Our quotes typically include boutique hotel accommodations, daily breakfast/meals as specified, private chauffeur transfers, airport pickups, entrance tickets, and local tour guide fees. Airfares and visas can also be included upon request.',
        order: 3,
      },
      {
        question: 'How does the Wishlist feature work?',
        answer: 'Click the heart icon on any package or destination to save it to your Wishlist. You can revisit your Wishlist anytime to compare saved items and send a single bulk enquiry for all your favorited trips.',
        order: 4,
      },
    ],
  });

  console.log('Seeding Gallery Images...');
  await prisma.galleryImage.createMany({
    data: [
      {
        image: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1000&q=80',
        locationTag: 'Srinagar, Kashmir',
        caption: 'Traditional painted Shikaras floating gently across Dal Lake at golden hour.',
        category: 'Mountains',
      },
      {
        image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1000&q=80',
        locationTag: 'Uluwatu, Bali',
        caption: 'Majestic waves crashing against the sacred cliffside temple at sunset.',
        category: 'Beaches',
      },
      {
        image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1000&q=80',
        locationTag: 'Alleppey, Kerala',
        caption: 'Cruising through lush palm-lined backwater canals on a traditional houseboat.',
        category: 'Nature',
      },
      {
        image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1000&q=80',
        locationTag: 'Jaipur, Rajasthan',
        caption: 'The golden hues of Amber Fort rising grandly above Maota Lake.',
        category: 'Heritage',
      },
      {
        image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1000&q=80',
        locationTag: 'Downtown Dubai',
        caption: 'The sparkling futuristic skyline surrounding the iconic Burj Khalifa tower.',
        category: 'Cityscapes',
      },
      {
        image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1000&q=80',
        locationTag: 'Jungfraujoch, Switzerland',
        caption: 'High-altitude mountain railways traversing pristine alpine snow peaks.',
        category: 'Mountains',
      },
    ],
  });

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
