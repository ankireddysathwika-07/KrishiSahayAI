import {
  EquipmentListing,
  EquipmentBooking,
  EquipmentReview,
  EquipmentCategory,
  BookingStatus,
  MatchmakerFilter,
  MatchmakerRecommendation,
} from '../types/equipment';

const STORAGE_KEYS = {
  LISTINGS: 'krishisahay_equipment_listings_v1',
  BOOKINGS: 'krishisahay_equipment_bookings_v1',
  REVIEWS: 'krishisahay_equipment_reviews_v1',
};

// Realistic seed listings with verified Indian agricultural machinery
export const INITIAL_EQUIPMENT_SEED: EquipmentListing[] = [
  {
    id: 'eq_1',
    name: 'Mahindra 575 DI XP Plus (47 HP Tractor)',
    category: 'Tractors',
    ownerName: 'Ramesh Reddy',
    ownerPhone: '+91 98480 12345',
    ownerId: 'user_default_1',
    isVerifiedOwner: true,
    location: 'Narsampet Road, Warangal',
    mandal: 'Narsampet',
    district: 'Warangal',
    dailyRate: 900,
    hourlyRate: 150,
    condition: 'Good Condition',
    available: true,
    icon: '🚜',
    imageUrl: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80',
    specs: '47 HP 4-Cylinder ELS Engine, Dual Clutch, 8 Forward + 2 Reverse gears, Power Steering',
    attachments: ['Rotavator (42 Blades)', '9-Tyne Cultivator', '3-MB Reversible Plough', 'Leveler Board'],
    description: 'Heavy duty tractor in top mechanical condition. Excellent for deep primary tillage, puddle preparation for paddy, and post-harvest residue mixing. Low fuel consumption.',
    terms: {
      operatorIncluded: false,
      dieselPolicy: 'Renter Pays Diesel',
      securityDepositInr: 0,
      deliveryAvailable: true,
    },
    rating: 4.8,
    reviewCount: 12,
    isSample: true,
    createdAt: '2026-03-01T09:00:00Z',
  },
  {
    id: 'eq_2',
    name: 'Kubota DC-68G Multi-Crop Combine Harvester',
    category: 'Combine Harvesters',
    ownerName: 'Kisan Seva Kendra',
    ownerPhone: '+91 94401 56789',
    ownerId: 'owner_seva_kendra',
    isVerifiedOwner: true,
    location: 'Hasanparthy, Warangal Urban',
    mandal: 'Hasanparthy',
    district: 'Warangal',
    dailyRate: 2400,
    hourlyRate: 850,
    condition: 'Like New (Under 1 Yr)',
    available: true,
    icon: '🌾',
    imageUrl: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=800&q=80',
    specs: '68 HP Water-Cooled Turbo Diesel, 2.0m Cutter Bar, Rubber Crawler Track for Wet Mud',
    attachments: ['Paddy Cutter Bar', 'Grain Tank Unloader', 'Straw Spreader Chopper'],
    description: 'Full-track paddy combine harvester. Operates effortlessly in flooded or damp delta soils where wheeled harvesters sink. Grain loss under 1.2%. High cleaning blower.',
    terms: {
      operatorIncluded: true,
      dieselPolicy: 'Renter Pays Diesel',
      securityDepositInr: 1000,
      deliveryAvailable: true,
    },
    rating: 4.9,
    reviewCount: 18,
    isSample: true,
    createdAt: '2026-02-15T11:30:00Z',
  },
  {
    id: 'eq_3',
    name: 'VST Shakti 130 DI Power Tiller (13 HP)',
    category: 'Power Tillers & Weeders',
    ownerName: 'Suresh Patel',
    ownerPhone: '+91 98200 45678',
    ownerId: 'owner_suresh_p',
    isVerifiedOwner: true,
    location: 'Manakondur, Karimnagar',
    mandal: 'Manakondur',
    district: 'Karimnagar',
    dailyRate: 450,
    hourlyRate: 80,
    condition: 'Good Condition',
    available: true,
    icon: '⚙️',
    imageUrl: 'https://images.unsplash.com/photo-1589834390005-5d4fb9bf3d32?auto=format&fit=crop&w=800&q=80',
    specs: '13 HP Direct Injection Diesel, 16-Blade Rotary Tiller, High Lug Mud Tires',
    attachments: ['Rotary Tiller Blades', 'Ridger for Furrows', 'Small Cart Hitch'],
    description: 'Versatile walk-behind tiller suited for smallholder farms (1 to 3 acres), vegetable beds, chilli inter-culture, and orchard weeding where full tractors cannot enter.',
    terms: {
      operatorIncluded: false,
      dieselPolicy: 'Renter Pays Diesel',
      securityDepositInr: 0,
      deliveryAvailable: false,
    },
    rating: 4.6,
    reviewCount: 8,
    isSample: true,
    createdAt: '2026-03-05T14:20:00Z',
  },
  {
    id: 'eq_4',
    name: 'Precision Laser Land Leveller (Spectra 800)',
    category: 'Land Levellers',
    ownerName: 'Precision Agri Hub',
    ownerPhone: '+91 97000 88990',
    ownerId: 'owner_precision_hub',
    isVerifiedOwner: true,
    location: 'Miryalaguda, Nalgonda',
    mandal: 'Miryalaguda',
    district: 'Nalgonda',
    dailyRate: 750,
    hourlyRate: 120,
    condition: 'Like New (Under 1 Yr)',
    available: true,
    icon: '📐',
    imageUrl: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=800&q=80',
    specs: '±2mm Grade slope accuracy laser mast transmitter, 7-foot heavy alloy scraper bucket',
    attachments: ['Dual Laser Receiver Mast', '7-Foot Heavy Scraper Bucket', 'Control Box with Solenoid Valve'],
    description: 'Automated laser leveling ensures flat fields. Saves 25% to 30% irrigation water, improves seed germination by 18%, and eliminates puddles that breed root rot.',
    terms: {
      operatorIncluded: true,
      dieselPolicy: 'Renter Pays Diesel',
      securityDepositInr: 500,
      deliveryAvailable: true,
    },
    rating: 4.7,
    reviewCount: 9,
    isSample: true,
    createdAt: '2026-02-20T10:00:00Z',
  },
  {
    id: 'eq_5',
    name: 'Garuda Kisan Hexacopter Drone Sprayer (16L)',
    category: 'Sprayers & Agri-Drones',
    ownerName: 'V-Drones Tech Solutions',
    ownerPhone: '+91 99887 76655',
    ownerId: 'owner_vdrones',
    isVerifiedOwner: true,
    location: 'Wyra Road, Khammam',
    mandal: 'Wyra',
    district: 'Khammam',
    dailyRate: 1400,
    hourlyRate: 250,
    condition: 'Like New (Under 1 Yr)',
    available: true,
    icon: '🚁',
    imageUrl: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=800&q=80',
    specs: '16-Litre chemical tank, 4 Centrifugal nozzles, Terrain-following radar, DGCA Certified Pilot',
    attachments: ['Fast Charging Station (3 Smart Battery Packs)', 'Ultra-Low Volume Micron Nozzles', 'GPS RTK Base'],
    description: 'Ultra-fast aerial crop protection. Sprays 1 acre in 7-9 minutes with uniform canopy penetration. Eliminates manual exposure to hazardous chemicals and stops soil trampling in tall cotton & chilli.',
    terms: {
      operatorIncluded: true,
      dieselPolicy: 'Owner Supplies Diesel (Inclusive)',
      securityDepositInr: 0,
      deliveryAvailable: true,
    },
    rating: 4.9,
    reviewCount: 22,
    isSample: true,
    createdAt: '2026-03-10T16:00:00Z',
  },
  {
    id: 'eq_6',
    name: 'Shaktiman Pneumatic Planter (4-Row Precision)',
    category: 'Sowing & Planters',
    ownerName: 'Anjaneyulu Naidu',
    ownerPhone: '+91 93901 23456',
    ownerId: 'owner_anjaneyulu',
    isVerifiedOwner: true,
    location: 'Sangareddy, Medak',
    mandal: 'Sangareddy',
    district: 'Medak',
    dailyRate: 650,
    hourlyRate: 110,
    condition: 'Good Condition',
    available: true,
    icon: '🌱',
    imageUrl: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=800&q=80',
    specs: '4-Row Vacuum Disc Metering, Simultaneous Fertilizer Hopper Drill, Adjustable Row Spacing',
    attachments: ['Maize Disc Plates', 'Cotton Precision Discs', 'Groundnut / Soybean Seed Plates'],
    description: 'Precision seed placement maintains exact plant-to-plant spacing. Cuts expensive hybrid seed wastage by 20% and ensures uniform stand count for maximum photosynthetic yield.',
    terms: {
      operatorIncluded: false,
      dieselPolicy: 'Renter Pays Diesel',
      securityDepositInr: 0,
      deliveryAvailable: true,
    },
    rating: 4.5,
    reviewCount: 6,
    isSample: true,
    createdAt: '2026-02-28T08:30:00Z',
  },
  {
    id: 'eq_7',
    name: 'Multi-Crop Axial Flow Thresher & Destoner',
    category: 'Threshers & Shellers',
    ownerName: 'Balaji Agro Services',
    ownerPhone: '+91 97012 34567',
    ownerId: 'owner_balaji_agro',
    isVerifiedOwner: true,
    location: 'Jadcherla, Mahabubnagar',
    mandal: 'Jadcherla',
    district: 'Mahabubnagar',
    dailyRate: 600,
    hourlyRate: 100,
    condition: 'Fair / Working Condition',
    available: true,
    icon: '⚡',
    imageUrl: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=800&q=80',
    specs: '10 HP PTO Driven or Electric Motor, High Speed Blower, Output 900 to 1200 kg/hr',
    attachments: ['Pulses Sieves (Chana/Redgram)', 'Cereal Concave Drum', 'Dust Air Separator'],
    description: 'High capacity stationary thresher. Separates clean grain from husk without seed breakage. Ready for chickpea, pigeon pea, wheat, sorghum, and millet harvesting.',
    terms: {
      operatorIncluded: false,
      dieselPolicy: 'Renter Pays Diesel',
      securityDepositInr: 0,
      deliveryAvailable: false,
    },
    rating: 4.4,
    reviewCount: 5,
    isSample: true,
    createdAt: '2026-03-02T12:15:00Z',
  },
  {
    id: 'eq_8',
    name: 'Hydraulic Tipping Farm Trailer (3.5 Ton)',
    category: 'Haulage & Trailers',
    ownerName: 'Mallesh Yadav',
    ownerPhone: '+91 96180 98765',
    ownerId: 'owner_mallesh',
    isVerifiedOwner: true,
    location: 'Gajwel, Siddipet',
    mandal: 'Gajwel',
    district: 'Siddipet',
    dailyRate: 400,
    hourlyRate: 70,
    condition: 'Good Condition',
    available: true,
    icon: '🚛',
    imageUrl: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=800&q=80',
    specs: '3.5 Ton Capacity, Single Axle Heavy Duty Springs, 3-Stage Hydraulic Ram Cylinder',
    attachments: ['Removable Side Grain Panels', 'Rear Tow Hook Hitch', 'Hydraulic Pipe Hose'],
    description: 'Tough all-steel agricultural trolley for grain mandi transport, cotton sack haulage, sugarcane transit, and spreading organic farmyard manure on fields.',
    terms: {
      operatorIncluded: false,
      dieselPolicy: 'Renter Pays Diesel',
      securityDepositInr: 0,
      deliveryAvailable: false,
    },
    rating: 4.7,
    reviewCount: 7,
    isSample: true,
    createdAt: '2026-03-08T15:00:00Z',
  },
];

// Initial seed bookings demonstrating booking lifecycle
export const INITIAL_BOOKINGS_SEED: EquipmentBooking[] = [
  {
    id: 'bk_sample_1',
    equipmentId: 'eq_1',
    equipmentName: 'Mahindra 575 DI XP Plus (47 HP Tractor)',
    equipmentCategory: 'Tractors',
    equipmentIcon: '🚜',
    dailyRate: 900,
    sellerId: 'user_default_1',
    sellerName: 'Ramesh Reddy',
    sellerPhone: '+91 98480 12345',
    buyerId: 'user_sample_venkat',
    buyerName: 'Venkat Rao',
    buyerPhone: '+91 98765 43210',
    buyerVillage: 'Narsampet Rural',
    startDate: '2026-10-02',
    endDate: '2026-10-04',
    totalDays: 3,
    totalAmount: 2700,
    status: 'Completed',
    notes: 'Paddy land preparation and 3-MB ploughing across 4 acres.',
    createdAt: '2026-09-30T10:00:00Z',
    updatedAt: '2026-10-05T18:00:00Z',
  },
  {
    id: 'bk_sample_2',
    equipmentId: 'eq_2',
    equipmentName: 'Kubota DC-68G Multi-Crop Combine Harvester',
    equipmentCategory: 'Combine Harvesters',
    equipmentIcon: '🌾',
    dailyRate: 2400,
    sellerId: 'owner_seva_kendra',
    sellerName: 'Kisan Seva Kendra',
    sellerPhone: '+91 94401 56789',
    buyerId: 'user_default_1',
    buyerName: 'Ramesh Reddy',
    buyerPhone: '+91 98480 12345',
    buyerVillage: 'Warangal Delta Field',
    startDate: '2026-10-18',
    endDate: '2026-10-19',
    totalDays: 2,
    totalAmount: 4800,
    status: 'Accepted',
    notes: 'Harvesting Kharif paddy crop before forecast showers.',
    createdAt: '2026-10-08T14:30:00Z',
    updatedAt: '2026-10-08T16:00:00Z',
  },
  {
    id: 'bk_sample_3',
    equipmentId: 'eq_5',
    equipmentName: 'Garuda Kisan Hexacopter Drone Sprayer (16L)',
    equipmentCategory: 'Sprayers & Agri-Drones',
    equipmentIcon: '🚁',
    dailyRate: 1400,
    sellerId: 'owner_vdrones',
    sellerName: 'V-Drones Tech Solutions',
    sellerPhone: '+91 99887 76655',
    buyerId: 'user_default_1',
    buyerName: 'Ramesh Reddy',
    buyerPhone: '+91 98480 12345',
    buyerVillage: 'Warangal Rural',
    startDate: '2026-10-22',
    endDate: '2026-10-22',
    totalDays: 1,
    totalAmount: 1400,
    status: 'Pending',
    notes: 'Foliar micronutrient & neem oil spray for 5-acre cotton field.',
    createdAt: '2026-10-09T08:00:00Z',
    updatedAt: '2026-10-09T08:00:00Z',
  },
];

export const INITIAL_REVIEWS_SEED: EquipmentReview[] = [
  {
    id: 'rev_1',
    bookingId: 'bk_sample_1',
    equipmentId: 'eq_1',
    reviewerId: 'user_sample_venkat',
    reviewerName: 'Venkat Rao (Farmer)',
    rating: 5,
    comment: 'Tractor was delivered right on time. The rotavator attachment created a very fine puddle for my paddy nursery. Owner Ramesh was extremely cooperative.',
    createdAt: '2026-10-05T19:00:00Z',
  },
];

export const EquipmentService = {
  // --- LISTINGS MANAGEMENT ---
  getListings(): EquipmentListing[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.LISTINGS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      localStorage.setItem(STORAGE_KEYS.LISTINGS, JSON.stringify(INITIAL_EQUIPMENT_SEED));
      return INITIAL_EQUIPMENT_SEED;
    } catch {
      return INITIAL_EQUIPMENT_SEED;
    }
  },

  saveListings(listings: EquipmentListing[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.LISTINGS, JSON.stringify(listings));
    } catch (e) {
      console.warn('Could not save listings to localStorage:', e);
    }
  },

  createListing(newEq: Omit<EquipmentListing, 'id' | 'createdAt' | 'rating' | 'reviewCount' | 'isSample'>): EquipmentListing {
    const listings = this.getListings();
    const created: EquipmentListing = {
      ...newEq,
      id: `eq_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      rating: 5.0,
      reviewCount: 0,
      isSample: false,
      createdAt: new Date().toISOString(),
    };

    listings.unshift(created);
    this.saveListings(listings);
    return created;
  },

  updateListing(id: string, updates: Partial<EquipmentListing>): EquipmentListing | null {
    const listings = this.getListings();
    const index = listings.findIndex((e) => e.id === id);
    if (index === -1) return null;

    listings[index] = { ...listings[index], ...updates };
    this.saveListings(listings);
    return listings[index];
  },

  toggleListingAvailability(id: string): EquipmentListing | null {
    const listings = this.getListings();
    const item = listings.find((e) => e.id === id);
    if (!item) return null;

    item.available = !item.available;
    this.saveListings(listings);
    return item;
  },

  deleteListing(id: string): boolean {
    const listings = this.getListings();
    const filtered = listings.filter((e) => e.id !== id);
    if (filtered.length === listings.length) return false;

    this.saveListings(filtered);
    return true;
  },

  // --- BOOKINGS MANAGEMENT ---
  getBookings(): EquipmentBooking[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(INITIAL_BOOKINGS_SEED));
      return INITIAL_BOOKINGS_SEED;
    } catch {
      return INITIAL_BOOKINGS_SEED;
    }
  },

  saveBookings(bookings: EquipmentBooking[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
    } catch (e) {
      console.warn('Could not save bookings to localStorage:', e);
    }
  },

  calculateRentalDays(startDateStr: string, endDateStr: string): number {
    if (!startDateStr || !endDateStr) return 1;
    const start = new Date(startDateStr);
    const end = new Date(endDateStr);
    const diffTime = end.getTime() - start.getTime();
    if (diffTime < 0) return 1;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // inclusive days
    return Math.max(1, diffDays);
  },

  checkDateOverlap(
    equipmentId: string,
    startDateStr: string,
    endDateStr: string,
    excludeBookingId?: string
  ): { hasOverlap: boolean; conflictingBooking?: EquipmentBooking } {
    const bookings = this.getBookings();
    const reqStart = new Date(startDateStr).getTime();
    const reqEnd = new Date(endDateStr).getTime();

    // Check only Accepted or Pending active bookings for this machine
    for (const b of bookings) {
      if (b.equipmentId !== equipmentId) continue;
      if (excludeBookingId && b.id === excludeBookingId) continue;
      if (b.status !== 'Accepted' && b.status !== 'Pending') continue;

      const bStart = new Date(b.startDate).getTime();
      const bEnd = new Date(b.endDate).getTime();

      // Standard interval overlap condition: max(startA, startB) <= min(endA, endB)
      if (reqStart <= bEnd && reqEnd >= bStart) {
        return { hasOverlap: true, conflictingBooking: b };
      }
    }

    return { hasOverlap: false };
  },

  createBooking(
    bookingData: Omit<EquipmentBooking, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'totalDays' | 'totalAmount'>
  ): { success: boolean; booking?: EquipmentBooking; error?: string } {
    // 1. Validate dates
    if (!bookingData.startDate || !bookingData.endDate) {
      return { success: false, error: 'Please choose both start and end dates.' };
    }

    const start = new Date(bookingData.startDate);
    const end = new Date(bookingData.endDate);
    if (end.getTime() < start.getTime()) {
      return { success: false, error: 'End date cannot be earlier than start date.' };
    }

    // 2. Overlap validation
    const overlap = this.checkDateOverlap(bookingData.equipmentId, bookingData.startDate, bookingData.endDate);
    if (overlap.hasOverlap && overlap.conflictingBooking) {
      const conf = overlap.conflictingBooking;
      return {
        success: false,
        error: `Equipment is already reserved from ${conf.startDate} to ${conf.endDate} (Status: ${conf.status}). Please pick different dates.`,
      };
    }

    // 3. Create booking
    const bookings = this.getBookings();
    const days = this.calculateRentalDays(bookingData.startDate, bookingData.endDate);
    const total = bookingData.dailyRate * days;

    const newBooking: EquipmentBooking = {
      ...bookingData,
      id: `bk_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      totalDays: days,
      totalAmount: total,
      status: 'Pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    bookings.unshift(newBooking);
    this.saveBookings(bookings);
    return { success: true, booking: newBooking };
  },

  updateBookingStatus(bookingId: string, newStatus: BookingStatus, reason?: string): EquipmentBooking | null {
    const bookings = this.getBookings();
    const index = bookings.findIndex((b) => b.id === bookingId);
    if (index === -1) return null;

    bookings[index] = {
      ...bookings[index],
      status: newStatus,
      rejectionReason: reason || bookings[index].rejectionReason,
      updatedAt: new Date().toISOString(),
    };

    this.saveBookings(bookings);
    return bookings[index];
  },

  cancelBooking(bookingId: string): { success: boolean; message: string } {
    const bookings = this.getBookings();
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) return { success: false, message: 'Booking not found.' };

    if (booking.status !== 'Pending') {
      return {
        success: false,
        message: `Only Pending bookings can be cancelled. Current status is ${booking.status}.`,
      };
    }

    booking.status = 'Cancelled';
    booking.updatedAt = new Date().toISOString();
    this.saveBookings(bookings);
    return { success: true, message: 'Booking request cancelled successfully.' };
  },

  // --- REVIEWS MANAGEMENT ---
  getReviews(equipmentId?: string): EquipmentReview[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.REVIEWS);
      let list: EquipmentReview[] = stored ? JSON.parse(stored) : INITIAL_REVIEWS_SEED;
      if (!Array.isArray(list) || list.length === 0) list = INITIAL_REVIEWS_SEED;

      if (equipmentId) {
        return list.filter((r) => r.equipmentId === equipmentId);
      }
      return list;
    } catch {
      return INITIAL_REVIEWS_SEED;
    }
  },

  addReview(reviewData: Omit<EquipmentReview, 'id' | 'createdAt'>): EquipmentReview {
    const reviews = this.getReviews();
    const newRev: EquipmentReview = {
      ...reviewData,
      id: `rev_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    reviews.unshift(newRev);
    try {
      localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
    } catch {}

    // Update equipment average rating
    const eqReviews = reviews.filter((r) => r.equipmentId === reviewData.equipmentId);
    const sum = eqReviews.reduce((acc, r) => acc + r.rating, 0);
    const avg = Math.round((sum / eqReviews.length) * 10) / 10;

    this.updateListing(reviewData.equipmentId, {
      rating: avg,
      reviewCount: eqReviews.length,
    });

    return newRev;
  },

  // --- DERIVED METRICS & STATS ---
  getSellerStats(sellerIdOrName: string) {
    const listings = this.getListings().filter(
      (e) => e.ownerId === sellerIdOrName || e.ownerName.toLowerCase().includes(sellerIdOrName.toLowerCase())
    );
    const bookings = this.getBookings().filter(
      (b) => b.sellerId === sellerIdOrName || b.sellerName.toLowerCase().includes(sellerIdOrName.toLowerCase())
    );

    const activeListingsCount = listings.filter((e) => e.available).length;
    const pendingRequestsCount = bookings.filter((b) => b.status === 'Pending').length;
    const completedRentalsCount = bookings.filter((b) => b.status === 'Completed').length;
    const acceptedRentalsCount = bookings.filter((b) => b.status === 'Accepted').length;

    // Genuine earnings calculated from accepted + completed booking records!
    const totalEarnings = bookings
      .filter((b) => b.status === 'Accepted' || b.status === 'Completed')
      .reduce((sum, b) => sum + b.totalAmount, 0);

    return {
      totalListings: listings.length,
      activeListingsCount,
      pendingRequestsCount,
      completedRentalsCount,
      acceptedRentalsCount,
      totalEarnings,
      myListings: listings,
      myReceivedBookings: bookings,
    };
  },

  getBuyerStats(buyerIdOrName: string) {
    const bookings = this.getBookings().filter(
      (b) => b.buyerId === buyerIdOrName || b.buyerName.toLowerCase().includes(buyerIdOrName.toLowerCase())
    );

    const pendingCount = bookings.filter((b) => b.status === 'Pending').length;
    const acceptedCount = bookings.filter((b) => b.status === 'Accepted').length;
    const completedCount = bookings.filter((b) => b.status === 'Completed').length;

    return {
      totalBookings: bookings.length,
      pendingCount,
      acceptedCount,
      completedCount,
      myBookings: bookings,
    };
  },

  // Derive realistic suggested market price range from comparable listings
  getSuggestedPriceRange(category: EquipmentCategory, mandal?: string): {
    min: number;
    max: number;
    avg: number;
    count: number;
    benchmarkDescription: string;
  } {
    const listings = this.getListings();
    let matches = listings.filter((e) => e.category === category);

    if (mandal && matches.filter((e) => e.mandal.toLowerCase() === mandal.toLowerCase()).length >= 2) {
      matches = matches.filter((e) => e.mandal.toLowerCase() === mandal.toLowerCase());
    }

    if (matches.length === 0) {
      const defaultRanges: Record<EquipmentCategory, { min: number; max: number; avg: number }> = {
        'Tractors': { min: 700, max: 1200, avg: 880 },
        'Combine Harvesters': { min: 1800, max: 2800, avg: 2300 },
        'Power Tillers & Weeders': { min: 350, max: 600, avg: 450 },
        'Sprayers & Agri-Drones': { min: 1000, max: 1800, avg: 1350 },
        'Land Levellers': { min: 600, max: 950, avg: 750 },
        'Sowing & Planters': { min: 500, max: 800, avg: 620 },
        'Threshers & Shellers': { min: 450, max: 850, avg: 600 },
        'Haulage & Trailers': { min: 300, max: 550, avg: 400 },
      };
      const def = defaultRanges[category] || { min: 500, max: 1000, avg: 750 };
      return {
        ...def,
        count: 0,
        benchmarkDescription: `Regional state average estimate for ${category}`,
      };
    }

    const rates = matches.map((m) => m.dailyRate);
    const min = Math.min(...rates);
    const max = Math.max(...rates);
    const avg = Math.round(rates.reduce((a, b) => a + b, 0) / rates.length);

    return {
      min,
      max,
      avg,
      count: matches.length,
      benchmarkDescription: `Calculated from ${matches.length} active comparable ${category} listings`,
    };
  },

  // --- AGRONOMIC AI MATCHMAKER ENGINE ---
  // Recommends machinery based on crop, land size, farming task, location, and budget
  runMatchmaker(filter: MatchmakerFilter): MatchmakerRecommendation[] {
    const listings = this.getListings().filter((e) => e.available);
    const recommendations: MatchmakerRecommendation[] = [];

    const crop = (filter.crop || '').toLowerCase();
    const task = (filter.task || '').toLowerCase();
    const acres = filter.landAcres || 3;
    const maxBudget = filter.maxBudget || 10000;

    for (const eq of listings) {
      if (eq.dailyRate > maxBudget) continue;

      let score = 50; // baseline
      let reason = '';
      let benefit = '';
      let estHours = Math.max(1, Math.round(acres * 1.5));

      const cat = eq.category;

      // 1. Task Matching
      if (task.includes('land prep') || task.includes('tillage') || task.includes('plough') || task.includes('దుక్కి')) {
        if (cat === 'Tractors') {
          score += 40;
          reason = `For ${acres} acres of land preparation in ${filter.crop || 'your crop'}, this ${eq.name} with attached rotavator & plough turns dense soil strata, breaks clods, and buries crop residue 8x faster than draft animals.`;
          benefit = `Saves ~₹3,500 in manual bullock labor and prepares field in ${(acres * 1.8).toFixed(1)} machine hours.`;
          estHours = Math.round(acres * 1.8);
        } else if (cat === 'Power Tillers & Weeders' && acres <= 3) {
          score += 35;
          reason = `Optimal economical choice for small landholdings (${acres} acres). Maneuvers easily in tight corners with minimal fuel consumption.`;
          benefit = `Low rental cost of ₹${eq.dailyRate}/day with zero tractor soil compaction.`;
          estHours = Math.round(acres * 3.0);
        }
      } else if (task.includes('harvest') || task.includes('కోత') || task.includes('cutting')) {
        if (cat === 'Combine Harvesters') {
          score += 45;
          reason = `Crucial for timely ${filter.crop || 'cereal/grain'} harvesting. Equipped with wide cutter bar and rubber crawler track that operates without wheel-spin even in moist paddy fields.`;
          benefit = `Cuts, threshes, and cleans in one single pass. Reduces harvest grain loss to under 1.5% and protects crop from sudden rain showers.`;
          estHours = Math.round(acres * 1.2);
        } else if (cat === 'Threshers & Shellers') {
          score += 30;
          reason = `Stationary grain separation for manual or reaper-cut ${filter.crop || 'crops'}. Cleans chaff and separates grain cleanly.`;
          benefit = `High throughput of 1,000 kg/hr with low grain breakage.`;
          estHours = Math.round(acres * 2.0);
        }
      } else if (task.includes('spray') || task.includes('pest') || task.includes('పురుగు') || task.includes('రక్షణ')) {
        if (cat === 'Sprayers & Agri-Drones') {
          score += 45;
          reason = `Autonomous GPS aerial spraying for ${filter.crop || 'field crops'}. Delivers ultra-fine droplets that reach both top and underside of leaves with zero field trampling.`;
          benefit = `Completes ${acres} acres in just ${Math.round(acres * 8)} minutes. Saves 30% chemical dose and eliminates farmer exposure to toxic pesticides.`;
          estHours = Math.max(1, Math.round(acres * 0.2));
        }
      } else if (task.includes('level') || task.includes('నీరు') || task.includes('water conservation')) {
        if (cat === 'Land Levellers') {
          score += 45;
          reason = `Laser leveling delivers ±2mm precision gradient slope. Essential for paddy, cotton, and maize fields before sowing.`;
          benefit = `Saves 25% to 30% irrigation water, ensures uniform fertilizer uptake, and prevents water-logging.`;
          estHours = Math.round(acres * 2.2);
        }
      } else if (task.includes('sow') || task.includes('plant') || task.includes('విత్తనం')) {
        if (cat === 'Sowing & Planters') {
          score += 45;
          reason = `Precision vacuum seed drill maintains exact plant-to-plant and row-to-row spacing for ${filter.crop || 'crops'}.`;
          benefit = `Cuts costly hybrid seed wastage by 20% and ensures uniform germination stand.`;
          estHours = Math.round(acres * 1.4);
        }
      } else if (task.includes('haul') || task.includes('transport') || task.includes('రవాణా') || task.includes('mandi')) {
        if (cat === 'Haulage & Trailers') {
          score += 45;
          reason = `Heavy hydraulic tipping trailer with 3.5 ton capacity for fast haulage to the nearby Mandi or market hub.`;
          benefit = `Smooth transit prevents grain sack damage and rapid hydraulic tipping unloads in 2 minutes.`;
          estHours = 4;
        }
      }

      // 2. Crop Synergies
      if (crop.includes('paddy') || crop.includes('వరి')) {
        if (eq.attachments.some((a) => a.toLowerCase().includes('rotavator') || a.toLowerCase().includes('paddy'))) {
          score += 10;
        }
      }
      if (crop.includes('cotton') || crop.includes('పత్తి') || crop.includes('chilli') || crop.includes('మిర్చి')) {
        if (cat === 'Sprayers & Agri-Drones' || cat === 'Sowing & Planters') {
          score += 10;
        }
      }

      // 3. Mandal Proximity Bonus
      if (filter.mandal && eq.mandal.toLowerCase() === filter.mandal.toLowerCase()) {
        score += 15;
        reason += ` Located locally right in ${eq.mandal} for instant deployment with minimal road transit cost.`;
      }

      // 4. Rating Bonus
      if (eq.rating >= 4.7) {
        score += 5;
      }

      if (score >= 65) {
        const estDays = Math.max(1, Math.ceil(estHours / 8));
        recommendations.push({
          equipment: eq,
          matchScore: Math.min(98, score),
          recommendedTask: filter.task || 'General Farm Mechanization',
          suitabilityReason: reason || `Matches your ${filter.crop || 'farm'} requirements with proven field reliability.`,
          efficiencyBenefit: benefit || `Cuts operational completion time by 65% compared to manual methods.`,
          estimatedDaysNeeded: estDays,
          estimatedTotalCost: eq.dailyRate * estDays,
        });
      }
    }

    // Sort by highest match score
    return recommendations.sort((a, b) => b.matchScore - a.matchScore);
  },

  async runAiMatchmakerAsync(filter: MatchmakerFilter): Promise<{
    recommendations: MatchmakerRecommendation[];
    isGeminiPowered: boolean;
    source: string;
  }> {
    const fallbackRecs = this.runMatchmaker(filter);
    const availableEquipment = this.getListings().filter((e) => e.available);

    try {
      const res = await fetch('/api/equipment/matchmaker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          crop: filter.crop,
          acres: filter.landAcres,
          mandal: filter.mandal,
          task: filter.task,
          maxBudget: filter.maxBudget,
          availableEquipment,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.recommendations && Array.isArray(data.recommendations)) {
          // Re-attach equipment objects
          const geminiRecs: MatchmakerRecommendation[] = [];
          for (const item of data.recommendations) {
            const eq = availableEquipment.find((e) => e.id === item.equipmentId);
            if (eq) {
              const days = item.estimatedDaysNeeded || 1;
              geminiRecs.push({
                equipment: eq,
                matchScore: item.matchScore || 90,
                recommendedTask: item.recommendedTask || filter.task,
                suitabilityReason: item.suitabilityReason,
                efficiencyBenefit: item.efficiencyBenefit || 'Higher efficiency with mechanized execution.',
                estimatedDaysNeeded: days,
                estimatedTotalCost: eq.dailyRate * days,
              });
            }
          }

          if (geminiRecs.length > 0) {
            return {
              recommendations: geminiRecs.sort((a, b) => b.matchScore - a.matchScore),
              isGeminiPowered: true,
              source: data.source || 'Google Gemini AI',
            };
          }
        }
      }
    } catch (e) {
      console.warn('API Matchmaker failed, falling back to agronomic engine:', e);
    }

    return {
      recommendations: fallbackRecs,
      isGeminiPowered: false,
      source: 'KrishiSahay Agronomic Rule Engine',
    };
  },
};

