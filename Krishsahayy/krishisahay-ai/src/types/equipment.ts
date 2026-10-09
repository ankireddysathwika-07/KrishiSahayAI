export type EquipmentCategory =
  | 'Tractors'
  | 'Combine Harvesters'
  | 'Power Tillers & Weeders'
  | 'Sprayers & Agri-Drones'
  | 'Land Levellers'
  | 'Sowing & Planters'
  | 'Threshers & Shellers'
  | 'Haulage & Trailers';

export type EquipmentCondition =
  | 'Like New (Under 1 Yr)'
  | 'Good Condition'
  | 'Fair / Working Condition';

export type BookingStatus =
  | 'Pending'
  | 'Accepted'
  | 'Rejected'
  | 'Completed'
  | 'Cancelled';

export interface EquipmentListing {
  id: string;
  name: string;
  category: EquipmentCategory;
  ownerName: string;
  ownerPhone: string;
  ownerId: string;
  isVerifiedOwner: boolean;
  location: string;
  mandal: string;
  district: string;
  dailyRate: number; // in INR
  hourlyRate?: number; // optional in INR
  condition: EquipmentCondition;
  available: boolean;
  blockedDates?: string[]; // ISO date strings ['2026-10-15']
  icon: string;
  imageUrl?: string;
  specs: string; // e.g. "45 HP Di Engine, Dual Clutch, 8F+2R Gears"
  attachments: string[]; // e.g. ["Rotavator", "3-MB Plough", "Leveler"]
  description: string;
  terms: {
    operatorIncluded: boolean;
    dieselPolicy: 'Renter Pays Diesel' | 'Owner Supplies Diesel (Inclusive)' | 'Negotiable';
    securityDepositInr: number;
    deliveryAvailable: boolean;
  };
  rating: number; // 1.0 - 5.0
  reviewCount: number;
  isSample: boolean; // clearly marks demo/sample data
  createdAt: string;
}

export interface EquipmentBooking {
  id: string;
  equipmentId: string;
  equipmentName: string;
  equipmentCategory: EquipmentCategory;
  equipmentIcon: string;
  dailyRate: number;
  sellerId: string;
  sellerName: string;
  sellerPhone: string;
  buyerId: string;
  buyerName: string;
  buyerPhone: string;
  buyerVillage: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  totalDays: number;
  totalAmount: number; // dailyRate * totalDays
  status: BookingStatus;
  rejectionReason?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EquipmentReview {
  id: string;
  bookingId: string;
  equipmentId: string;
  reviewerId: string;
  reviewerName: string;
  rating: number; // 1 to 5
  comment: string;
  createdAt: string;
}

export interface MatchmakerFilter {
  crop: string;
  landAcres: number;
  mandal: string;
  task: string;
  maxBudget?: number;
}

export interface MatchmakerRecommendation {
  equipment: EquipmentListing;
  matchScore: number; // 0-100%
  recommendedTask: string;
  suitabilityReason: string;
  efficiencyBenefit: string;
  estimatedDaysNeeded: number;
  estimatedTotalCost: number;
}
