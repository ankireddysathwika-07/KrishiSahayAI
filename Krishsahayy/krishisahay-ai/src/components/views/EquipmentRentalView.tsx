import React, { useState, useEffect, useMemo } from 'react';
import {
  Tractor,
  Search,
  Filter,
  Sparkles,
  CheckCircle2,
  Clock,
  Plus,
  Phone,
  ShieldCheck,
  Star,
  Calendar,
  MapPin,
  IndianRupee,
  Trash2,
  Eye,
  XCircle,
  ArrowRight,
  Info,
  Check,
  X,
  AlertTriangle,
  RotateCcw,
  SlidersHorizontal,
  ChevronRight,
  FileText,
  BadgeAlert,
  Fuel,
  User,
  Wrench,
  ThumbsUp,
  Award,
} from 'lucide-react';
import { FarmProfile } from '../../types/agricultural';
import { UserAccount } from '../../services/offlineStorage';
import { SupportedLanguage } from '../../services/i18n';
import {
  EquipmentListing,
  EquipmentBooking,
  EquipmentReview,
  EquipmentCategory,
  EquipmentCondition,
  BookingStatus,
  MatchmakerFilter,
  MatchmakerRecommendation,
} from '../../types/equipment';
import { EquipmentService, INITIAL_EQUIPMENT_SEED } from '../../services/equipmentService';

interface EquipmentRentalViewProps {
  farm: FarmProfile;
  user?: UserAccount | null;
  currentLanguage?: SupportedLanguage;
}

const CATEGORIES: EquipmentCategory[] = [
  'Tractors',
  'Combine Harvesters',
  'Power Tillers & Weeders',
  'Sprayers & Agri-Drones',
  'Land Levellers',
  'Sowing & Planters',
  'Threshers & Shellers',
  'Haulage & Trailers',
];

const PRESET_IMAGES = [
  { label: 'Heavy Duty Tractor', url: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80', icon: '🚜' },
  { label: 'Combine Harvester', url: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=800&q=80', icon: '🌾' },
  { label: 'Power Tiller', url: 'https://images.unsplash.com/photo-1589834390005-5d4fb9bf3d32?auto=format&fit=crop&w=800&q=80', icon: '⚙️' },
  { label: 'Laser Leveller', url: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=800&q=80', icon: '📐' },
  { label: 'Agri Drone Sprayer', url: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=800&q=80', icon: '🚁' },
  { label: 'Precision Planter', url: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=800&q=80', icon: '🌱' },
];

export const EquipmentRentalView: React.FC<EquipmentRentalViewProps> = ({
  farm,
  user,
  currentLanguage = 'en',
}) => {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'browse' | 'matchmaker' | 'buyer-bookings' | 'owner-portal'>('browse');

  // Master Data State
  const [listings, setListings] = useState<EquipmentListing[]>([]);
  const [bookings, setBookings] = useState<EquipmentBooking[]>([]);
  const [reviews, setReviews] = useState<EquipmentReview[]>([]);

  // Current session farmer identity
  const currentFarmerId = user?.id || 'user_default_1';
  const currentFarmerName = user?.name || farm.farmerName || 'Ramesh Reddy';
  const currentFarmerPhone = user?.phone || '+91 98480 12345';
  const currentFarmerLocation = user?.location || farm.location || 'Warangal, Telangana';

  // Notification Toast State
  const [toastMessage, setToastMessage] = useState<{ title: string; desc: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (title: string, desc: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToastMessage({ title, desc, type });
    setTimeout(() => setToastMessage(null), 4500);
  };

  // 1. Initial Load & Sync
  const refreshData = () => {
    setListings(EquipmentService.getListings());
    setBookings(EquipmentService.getBookings());
    setReviews(EquipmentService.getReviews());
  };

  useEffect(() => {
    refreshData();
  }, []);

  // --- TAB 1: BROWSE & FILTERS STATE ---
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedMandal, setSelectedMandal] = useState<string>('All');
  const [maxPriceFilter, setMaxPriceFilter] = useState<number>(3000);
  const [onlyAvailable, setOnlyAvailable] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'rating' | 'newest'>('price-asc');

  // Extract distinct mandals from active listings
  const availableMandals = useMemo(() => {
    const set = new Set<string>();
    listings.forEach((l) => {
      if (l.mandal) set.add(l.mandal);
    });
    return Array.from(set).sort();
  }, [listings]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedMandal('All');
    setMaxPriceFilter(3000);
    setOnlyAvailable(false);
    setSortBy('price-asc');
  };

  // Filtered & Sorted listings
  const filteredListings = useMemo(() => {
    return listings
      .filter((eq) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = eq.name.toLowerCase().includes(q);
          const matchCategory = eq.category.toLowerCase().includes(q);
          const matchSpecs = eq.specs.toLowerCase().includes(q);
          const matchDesc = eq.description.toLowerCase().includes(q);
          const matchMandal = eq.mandal.toLowerCase().includes(q);
          const matchAttachments = eq.attachments.some((a) => a.toLowerCase().includes(q));
          if (!matchName && !matchCategory && !matchSpecs && !matchDesc && !matchMandal && !matchAttachments) {
            return false;
          }
        }
        // Category
        if (selectedCategory !== 'All' && eq.category !== selectedCategory) {
          return false;
        }
        // Mandal
        if (selectedMandal !== 'All' && eq.mandal !== selectedMandal) {
          return false;
        }
        // Max Price
        if (eq.dailyRate > maxPriceFilter) {
          return false;
        }
        // Only Available
        if (onlyAvailable && !eq.available) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.dailyRate - b.dailyRate;
        if (sortBy === 'price-desc') return b.dailyRate - a.dailyRate;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        return 0;
      });
  }, [listings, searchQuery, selectedCategory, selectedMandal, maxPriceFilter, onlyAvailable, sortBy]);

  // --- TAB 2: AI MATCHMAKER STATE ---
  const [matchCrop, setMatchCrop] = useState<string>('Paddy (వరి)');
  const [matchAcres, setMatchAcres] = useState<number>(3.0);
  const [matchMandal, setMatchMandal] = useState<string>('Narsampet');
  const [matchTask, setMatchTask] = useState<string>('Land Preparation & Puddling (దుక్కి & దమ్ము చేయడం)');
  const [matchBudget, setMatchBudget] = useState<number>(2500);
  const [isMatchmakerLoading, setIsMatchmakerLoading] = useState<boolean>(false);
  const [matchmakerResults, setMatchmakerResults] = useState<MatchmakerRecommendation[] | null>(null);
  const [matchmakerSource, setMatchmakerSource] = useState<string>('Agronomic Engine');

  const handleRunMatchmaker = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsMatchmakerLoading(true);
    setMatchmakerResults(null);

    const filter: MatchmakerFilter = {
      crop: matchCrop,
      landAcres: matchAcres,
      mandal: matchMandal,
      task: matchTask,
      maxBudget: matchBudget,
    };

    try {
      const res = await EquipmentService.runAiMatchmakerAsync(filter);
      setMatchmakerResults(res.recommendations);
      setMatchmakerSource(res.source);
    } catch {
      const fallback = EquipmentService.runMatchmaker(filter);
      setMatchmakerResults(fallback);
      setMatchmakerSource('KrishiSahay Agronomic Rule Engine');
    } finally {
      setIsMatchmakerLoading(false);
    }
  };

  // Run matchmaker once initially when opening matchmaker tab if results are empty
  useEffect(() => {
    if (activeTab === 'matchmaker' && !matchmakerResults && !isMatchmakerLoading) {
      handleRunMatchmaker();
    }
  }, [activeTab]);

  // --- MODALS STATE ---
  const [detailsEquipment, setDetailsEquipment] = useState<EquipmentListing | null>(null);
  const [bookingEquipment, setBookingEquipment] = useState<EquipmentListing | null>(null);
  const [reviewBooking, setReviewBooking] = useState<EquipmentBooking | null>(null);

  // Booking Form Fields
  const [bookingStartDate, setBookingStartDate] = useState<string>(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [bookingEndDate, setBookingEndDate] = useState<string>(() => {
    const twoDaysLater = new Date();
    twoDaysLater.setDate(twoDaysLater.getDate() + 2);
    return twoDaysLater.toISOString().split('T')[0];
  });
  const [bookingVillage, setBookingVillage] = useState<string>(currentFarmerLocation);
  const [bookingNotes, setBookingNotes] = useState<string>('');
  const [bookingOverlapError, setBookingOverlapError] = useState<string | null>(null);

  // Re-calculate booking days & check overlap live
  const bookingDays = useMemo(() => {
    return EquipmentService.calculateRentalDays(bookingStartDate, bookingEndDate);
  }, [bookingStartDate, bookingEndDate]);

  const bookingTotalAmount = useMemo(() => {
    if (!bookingEquipment) return 0;
    return bookingEquipment.dailyRate * bookingDays;
  }, [bookingEquipment, bookingDays]);

  useEffect(() => {
    if (bookingEquipment && bookingStartDate && bookingEndDate) {
      const check = EquipmentService.checkDateOverlap(bookingEquipment.id, bookingStartDate, bookingEndDate);
      if (check.hasOverlap && check.conflictingBooking) {
        setBookingOverlapError(
          `Dates unavailable: Already reserved from ${check.conflictingBooking.startDate} to ${check.conflictingBooking.endDate} (${check.conflictingBooking.status}). Please choose alternative dates.`
        );
      } else {
        setBookingOverlapError(null);
      }
    }
  }, [bookingEquipment, bookingStartDate, bookingEndDate]);

  const handleOpenBookingModal = (eq: EquipmentListing) => {
    setBookingEquipment(eq);
    setBookingOverlapError(null);
  };

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingEquipment) return;

    if (bookingOverlapError) {
      showToast('Dates Conflict', bookingOverlapError, 'error');
      return;
    }

    const res = EquipmentService.createBooking({
      equipmentId: bookingEquipment.id,
      equipmentName: bookingEquipment.name,
      equipmentCategory: bookingEquipment.category,
      equipmentIcon: bookingEquipment.icon,
      dailyRate: bookingEquipment.dailyRate,
      sellerId: bookingEquipment.ownerId,
      sellerName: bookingEquipment.ownerName,
      sellerPhone: bookingEquipment.ownerPhone,
      buyerId: currentFarmerId,
      buyerName: currentFarmerName,
      buyerPhone: currentFarmerPhone,
      buyerVillage: bookingVillage,
      startDate: bookingStartDate,
      endDate: bookingEndDate,
      notes: bookingNotes,
    });

    if (!res.success) {
      showToast('Booking Failed', res.error || 'Could not submit booking request.', 'error');
      return;
    }

    refreshData();
    setBookingEquipment(null);
    showToast(
      'Booking Request Submitted!',
      `Request for ${bookingEquipment.name} (${bookingDays} days, ₹${bookingTotalAmount}) sent to ${bookingEquipment.ownerName}. Status is Pending approval.`,
      'success'
    );
    // Switch to Buyer Bookings tab to review status
    setActiveTab('buyer-bookings');
  };

  // Cancel pending booking
  const handleCancelBooking = (bookingId: string) => {
    if (!window.confirm('Are you sure you want to cancel this pending booking request?')) return;
    const res = EquipmentService.cancelBooking(bookingId);
    if (res.success) {
      refreshData();
      showToast('Booking Cancelled', res.message, 'info');
    } else {
      showToast('Cancellation Failed', res.message, 'error');
    }
  };

  // --- SELLER / OWNER PORTAL STATE ---
  const sellerStats = useMemo(() => {
    return EquipmentService.getSellerStats(currentFarmerId);
  }, [currentFarmerId, listings, bookings]);

  const buyerStats = useMemo(() => {
    return EquipmentService.getBuyerStats(currentFarmerId);
  }, [currentFarmerId, bookings]);

  // Seller Listing Form
  const [newEqName, setNewEqName] = useState('');
  const [newEqCategory, setNewEqCategory] = useState<EquipmentCategory>('Tractors');
  const [newEqDailyRate, setNewEqDailyRate] = useState<string>('950');
  const [newEqHourlyRate, setNewEqHourlyRate] = useState<string>('150');
  const [newEqMandal, setNewEqMandal] = useState<string>('Narsampet');
  const [newEqDistrict, setNewEqDistrict] = useState<string>('Warangal');
  const [newEqCondition, setNewEqCondition] = useState<EquipmentCondition>('Good Condition');
  const [newEqSpecs, setNewEqSpecs] = useState('');
  const [newEqAttachments, setNewEqAttachments] = useState('');
  const [newEqDescription, setNewEqDescription] = useState('');
  const [newEqOperator, setNewEqOperator] = useState<boolean>(false);
  const [newEqDiesel, setNewEqDiesel] = useState<'Renter Pays Diesel' | 'Owner Supplies Diesel (Inclusive)' | 'Negotiable'>('Renter Pays Diesel');
  const [newEqDeposit, setNewEqDeposit] = useState<number>(0);
  const [newEqImage, setNewEqImage] = useState<string>(PRESET_IMAGES[0].url);

  // Dynamic Market Price Benchmark derived from listings
  const suggestedBenchmark = useMemo(() => {
    return EquipmentService.getSuggestedPriceRange(newEqCategory, newEqMandal);
  }, [newEqCategory, newEqMandal, listings]);

  const handleCreateListing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEqName.trim()) {
      showToast('Missing Field', 'Please enter equipment name (e.g., Sonalika 45 HP)', 'error');
      return;
    }
    const rateNum = parseInt(newEqDailyRate, 10);
    if (isNaN(rateNum) || rateNum <= 0) {
      showToast('Invalid Price', 'Please enter a valid positive daily rate in ₹', 'error');
      return;
    }

    const attachmentsList = newEqAttachments
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const presetMatch = PRESET_IMAGES.find((p) => p.url === newEqImage);

    EquipmentService.createListing({
      name: newEqName.trim(),
      category: newEqCategory,
      ownerName: currentFarmerName,
      ownerPhone: currentFarmerPhone,
      ownerId: currentFarmerId,
      isVerifiedOwner: true,
      location: `${newEqMandal}, ${newEqDistrict}`,
      mandal: newEqMandal,
      district: newEqDistrict,
      dailyRate: rateNum,
      hourlyRate: newEqHourlyRate ? parseInt(newEqHourlyRate, 10) : undefined,
      condition: newEqCondition,
      available: true,
      icon: presetMatch ? presetMatch.icon : '🚜',
      imageUrl: newEqImage,
      specs: newEqSpecs.trim() || 'Custom farm mechanization equipment ready for hire.',
      attachments: attachmentsList.length > 0 ? attachmentsList : ['Standard Tow Hitch'],
      description: newEqDescription.trim() || 'Reliable machinery maintained in peak operational condition.',
      terms: {
        operatorIncluded: newEqOperator,
        dieselPolicy: newEqDiesel,
        securityDepositInr: newEqDeposit,
        deliveryAvailable: true,
      },
    });

    refreshData();
    showToast(
      'Machinery Listed Successfully!',
      `${newEqName} is now live on the marketplace at ₹${rateNum}/day.`,
      'success'
    );

    // Reset form fields
    setNewEqName('');
    setNewEqSpecs('');
    setNewEqAttachments('');
    setNewEqDescription('');
  };

  const handleToggleAvailability = (id: string) => {
    const updated = EquipmentService.toggleListingAvailability(id);
    if (updated) {
      refreshData();
      showToast(
        'Availability Updated',
        `${updated.name} is now ${updated.available ? 'Available for Rent' : 'Marked as Unavailable / In Use'}.`,
        'info'
      );
    }
  };

  const handleDeleteListing = (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to remove '${name}' from marketplace?`)) return;
    const ok = EquipmentService.deleteListing(id);
    if (ok) {
      refreshData();
      showToast('Listing Removed', `${name} was deleted from active listings.`, 'info');
    }
  };

  const handleAcceptBooking = (bookingId: string) => {
    const updated = EquipmentService.updateBookingStatus(bookingId, 'Accepted');
    if (updated) {
      refreshData();
      showToast(
        'Booking Accepted!',
        `Accepted rental for ${updated.equipmentName} (${updated.buyerName}). Dates reserved: ${updated.startDate} to ${updated.endDate}.`,
        'success'
      );
    }
  };

  const handleRejectBooking = (bookingId: string) => {
    const reason = window.prompt('Please enter a reason for declining this request (optional):', 'Machinery undergoing routine maintenance');
    if (reason === null) return; // cancelled prompt
    const updated = EquipmentService.updateBookingStatus(bookingId, 'Rejected', reason);
    if (updated) {
      refreshData();
      showToast('Booking Declined', `Declined request for ${updated.equipmentName}.`, 'info');
    }
  };

  const handleCompleteBooking = (bookingId: string) => {
    const updated = EquipmentService.updateBookingStatus(bookingId, 'Completed');
    if (updated) {
      refreshData();
      showToast(
        'Rental Completed',
        `Rental cycle completed! ₹${updated.totalAmount} added to your verified earnings ledger.`,
        'success'
      );
    }
  };

  // Review submission
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState<string>('');

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewBooking) return;
    if (!reviewComment.trim()) {
      showToast('Review Required', 'Please share a brief comment about equipment performance.', 'error');
      return;
    }

    EquipmentService.addReview({
      bookingId: reviewBooking.id,
      equipmentId: reviewBooking.equipmentId,
      reviewerId: currentFarmerId,
      reviewerName: currentFarmerName,
      rating: reviewRating,
      comment: reviewComment.trim(),
    });

    refreshData();
    setReviewBooking(null);
    setReviewComment('');
    showToast('Review Posted!', 'Thank you! Your feedback helps local farmers choose reliable machinery.', 'success');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* GLOBAL TOAST NOTIFICATION */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 p-4 rounded-2xl shadow-2xl border flex items-start space-x-3 max-w-md transition-all animate-bounce ${
            toastMessage.type === 'success'
              ? 'bg-emerald-900 text-white border-emerald-700'
              : toastMessage.type === 'error'
              ? 'bg-rose-900 text-white border-rose-700'
              : 'bg-stone-900 text-white border-stone-700'
          }`}
        >
          {toastMessage.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />}
          {toastMessage.type === 'error' && <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />}
          {toastMessage.type === 'info' && <Info className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />}
          <div className="flex-1">
            <h4 className="font-bold text-sm leading-tight">{toastMessage.title}</h4>
            <p className="text-xs text-stone-200 mt-1">{toastMessage.desc}</p>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-stone-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* TOP HERO BANNER */}
      <div className="bg-gradient-to-br from-[#14532d] via-emerald-800 to-teal-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none flex items-center justify-center">
          <Tractor className="w-96 h-96 -mr-20 -mt-10" />
        </div>

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 bg-emerald-700/60 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-semibold text-emerald-100 border border-emerald-500/30 mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
            <span>Verified Telangana & AP Custom Hiring Center (CHC) Network</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black font-serif tracking-tight leading-tight">
            Equipment Rental & Custom Hiring Hub
          </h1>
          <p className="text-emerald-100/90 text-sm sm:text-base mt-2 leading-relaxed">
            Shared agricultural machinery marketplace. Rent modern tractors, harvesters, laser levellers, and agri-drones from verified local owners without heavy capital investment.
          </p>

          {/* Quick Stats Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-emerald-700/60">
            <div>
              <span className="text-xs text-emerald-200/80 block">Active Inventory</span>
              <span className="text-xl font-black text-white">{listings.length} Machines</span>
            </div>
            <div>
              <span className="text-xs text-emerald-200/80 block">Covered Mandals</span>
              <span className="text-xl font-black text-white">{availableMandals.length || 6} Mandals</span>
            </div>
            <div>
              <span className="text-xs text-emerald-200/80 block">Active Bookings</span>
              <span className="text-xl font-black text-white">
                {bookings.filter((b) => b.status === 'Accepted' || b.status === 'Pending').length} Active
              </span>
            </div>
            <div>
              <span className="text-xs text-emerald-200/80 block">Completed Rentals</span>
              <span className="text-xl font-black text-emerald-300">
                {bookings.filter((b) => b.status === 'Completed').length} Verified
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 PRIMARY NAVIGATION TABS */}
      <div className="bg-white rounded-2xl p-2 border border-stone-200/80 shadow-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setActiveTab('browse')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center space-x-2 transition-all ${
              activeTab === 'browse'
                ? 'bg-[#14532d] text-white shadow-sm'
                : 'text-stone-700 hover:bg-stone-100'
            }`}
          >
            <Tractor className="w-4 h-4" />
            <span>Browse Machinery</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${activeTab === 'browse' ? 'bg-emerald-700 text-white' : 'bg-stone-200 text-stone-700'}`}>
              {filteredListings.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('matchmaker')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center space-x-2 transition-all relative ${
              activeTab === 'matchmaker'
                ? 'bg-[#14532d] text-white shadow-sm'
                : 'text-stone-700 hover:bg-stone-100'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
            <span>AI Matchmaker</span>
            <span className="bg-amber-400 text-amber-950 text-[10px] px-1.5 py-0.5 rounded-md font-black tracking-wide uppercase">
              Smart
            </span>
          </button>

          <button
            onClick={() => setActiveTab('buyer-bookings')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center space-x-2 transition-all ${
              activeTab === 'buyer-bookings'
                ? 'bg-[#14532d] text-white shadow-sm'
                : 'text-stone-700 hover:bg-stone-100'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>My Bookings</span>
            {buyerStats.pendingCount > 0 && (
              <span className="bg-amber-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                {buyerStats.pendingCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('owner-portal')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center space-x-2 transition-all ${
              activeTab === 'owner-portal'
                ? 'bg-[#14532d] text-white shadow-sm'
                : 'text-stone-700 hover:bg-stone-100'
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span>Owner Portal</span>
            {sellerStats.pendingRequestsCount > 0 && (
              <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold animate-pulse">
                {sellerStats.pendingRequestsCount} Pending
              </span>
            )}
          </button>
        </div>

        <div className="flex items-center space-x-2 text-xs text-stone-500 pr-2">
          <User className="w-3.5 h-3.5 text-stone-400" />
          <span>Active User: <strong className="text-stone-800">{currentFarmerName}</strong></span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: BROWSE & RENT MACHINERY */}
      {/* ========================================================================= */}
      {activeTab === 'browse' && (
        <div className="space-y-6">
          {/* SEARCH & FILTERS CONTROLS */}
          <div className="bg-white rounded-3xl p-5 border border-stone-200/90 shadow-xs space-y-4">
            {/* Search + Quick Category Scroll */}
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  placeholder="Search by equipment name, specs, attachments, or mandal..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#14532d] focus:border-transparent bg-stone-50/60"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-3 text-stone-400 hover:text-stone-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Sort By Dropdown */}
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-stone-500 whitespace-nowrap">Sort By:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm font-semibold bg-white text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#14532d]"
                >
                  <option value="price-asc">Price: Low to High (₹)</option>
                  <option value="price-desc">Price: High to Low (₹)</option>
                  <option value="rating">Top Rated (★)</option>
                  <option value="newest">Newest Listed</option>
                </select>
              </div>
            </div>

            {/* Category Chips Carousel */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
              <button
                onClick={() => setSelectedCategory('All')}
                className={`px-3.5 py-1.5 rounded-full font-bold whitespace-nowrap transition-all ${
                  selectedCategory === 'All'
                    ? 'bg-[#14532d] text-white shadow-xs'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                All Categories ({listings.length})
              </button>
              {CATEGORIES.map((cat) => {
                const count = listings.filter((l) => l.category === cat).length;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-full font-bold whitespace-nowrap transition-all ${
                      selectedCategory === cat
                        ? 'bg-[#14532d] text-white shadow-xs'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    {cat} ({count})
                  </button>
                );
              })}
            </div>

            {/* Sub-Filters Row: Mandal, Max Price Slider, Availability Toggle */}
            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4 pt-3 border-t border-stone-100 items-center text-xs">
              {/* Mandal Selector */}
              <div>
                <label className="block text-[11px] font-bold text-stone-500 mb-1">Mandal / Location</label>
                <select
                  value={selectedMandal}
                  onChange={(e) => setSelectedMandal(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs font-semibold bg-white text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#14532d]"
                >
                  <option value="All">All Mandals ({availableMandals.length})</option>
                  {availableMandals.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              {/* Daily Price Filter */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-bold text-stone-500">Max Daily Rate:</span>
                  <span className="text-xs font-black text-emerald-800">₹{maxPriceFilter}/day</span>
                </div>
                <input
                  type="range"
                  min="400"
                  max="3000"
                  step="100"
                  value={maxPriceFilter}
                  onChange={(e) => setMaxPriceFilter(parseInt(e.target.value, 10))}
                  className="w-full accent-[#14532d] cursor-pointer"
                />
              </div>

              {/* Only Available Toggle */}
              <div className="flex items-center space-x-2 pt-3 sm:pt-4">
                <input
                  type="checkbox"
                  id="availOnly"
                  checked={onlyAvailable}
                  onChange={(e) => setOnlyAvailable(e.target.checked)}
                  className="rounded text-[#14532d] focus:ring-[#14532d] w-4 h-4 cursor-pointer"
                />
                <label htmlFor="availOnly" className="text-xs font-bold text-stone-700 cursor-pointer select-none">
                  Available Now Only
                </label>
              </div>

              {/* Clear Filters Button */}
              <div className="sm:text-right pt-2 sm:pt-4">
                <button
                  onClick={clearFilters}
                  className="text-xs font-bold text-stone-500 hover:text-stone-800 inline-flex items-center space-x-1 underline"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset All Filters</span>
                </button>
              </div>
            </div>
          </div>

          {/* ACTIVE FILTER STATUS STRIP */}
          <div className="flex items-center justify-between text-xs text-stone-500 px-1">
            <span>
              Showing <strong className="text-stone-900">{filteredListings.length}</strong> matching machines
              {selectedCategory !== 'All' && <span> in <strong>{selectedCategory}</strong></span>}
              {selectedMandal !== 'All' && <span> in <strong>{selectedMandal}</strong></span>}
            </span>
            <span className="italic">All rates shown in INR per calendar day</span>
          </div>

          {/* MACHINERY CARDS GRID */}
          {filteredListings.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-stone-300 space-y-3">
              <Tractor className="w-12 h-12 text-stone-300 mx-auto" />
              <h3 className="text-lg font-bold text-stone-800">No machinery matched your active filters</h3>
              <p className="text-xs text-stone-500 max-w-md mx-auto">
                Try widening your price range, clearing the mandal filter, or resetting category selections.
              </p>
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-stone-800 text-white rounded-xl text-xs font-bold hover:bg-stone-900"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredListings.map((eq) => (
                <div
                  key={eq.id}
                  className="bg-white rounded-3xl border border-stone-200/90 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col group"
                >
                  {/* Equipment Photo / Header */}
                  <div className="relative h-48 bg-stone-100 overflow-hidden">
                    {eq.imageUrl ? (
                      <img
                        src={eq.imageUrl}
                        alt={eq.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-5xl">
                        {eq.icon}
                      </div>
                    )}

                    {/* Category Tag */}
                    <div className="absolute top-3 left-3 bg-stone-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center space-x-1">
                      <span>{eq.icon}</span>
                      <span>{eq.category}</span>
                    </div>

                    {/* Availability Status Badge */}
                    <div className="absolute top-3 right-3">
                      {eq.available ? (
                        <span className="bg-emerald-500/95 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs flex items-center space-x-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                          <span>Available</span>
                        </span>
                      ) : (
                        <span className="bg-rose-500/95 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs">
                          In Use / Booked
                        </span>
                      )}
                    </div>

                    {/* Sample Data Badge if applicable */}
                    {eq.isSample && (
                      <div className="absolute bottom-2 left-3 bg-amber-500/90 backdrop-blur-sm text-amber-950 text-[9px] font-black px-2 py-0.5 rounded-md">
                        Demo Sample Listing
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-bold text-base text-stone-900 leading-snug group-hover:text-[#14532d] transition-colors">
                          {eq.name}
                        </h3>
                      </div>

                      {/* Owner & Mandal Info */}
                      <div className="flex items-center justify-between text-xs text-stone-500">
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                          <span className="font-medium">{eq.mandal}, {eq.district}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-amber-600 font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{eq.rating.toFixed(1)}</span>
                          <span className="text-[10px] text-stone-400 font-normal">({eq.reviewCount})</span>
                        </div>
                      </div>

                      {/* Verified Owner Badge */}
                      <div className="flex items-center space-x-1.5 text-xs text-stone-600 bg-stone-50 px-2.5 py-1.5 rounded-xl border border-stone-100">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate">
                          Owner: <strong>{eq.ownerName}</strong>
                        </span>
                        {eq.isVerifiedOwner && (
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-bold ml-auto shrink-0">
                            Verified
                          </span>
                        )}
                      </div>

                      {/* Key Specs snippet */}
                      <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                        {eq.specs}
                      </p>

                      {/* Attachments Chips */}
                      {eq.attachments && eq.attachments.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {eq.attachments.slice(0, 3).map((att, i) => (
                            <span
                              key={i}
                              className="text-[10px] bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-md font-medium border border-emerald-100/80"
                            >
                              ✓ {att}
                            </span>
                          ))}
                          {eq.attachments.length > 3 && (
                            <span className="text-[10px] text-stone-400 font-medium self-center">
                              +{eq.attachments.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Price and Action Buttons */}
                    <div className="pt-3 border-t border-stone-100 space-y-3">
                      <div className="flex items-baseline justify-between">
                        <div>
                          <span className="text-xs text-stone-400">Daily Rental: </span>
                          <span className="text-xl font-black text-[#14532d]">₹{eq.dailyRate}</span>
                          <span className="text-xs text-stone-500 font-medium"> / day</span>
                        </div>
                        {eq.hourlyRate && (
                          <span className="text-[11px] text-stone-500">
                            or ₹{eq.hourlyRate}/hr
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => setDetailsEquipment(eq)}
                          className="py-2.5 px-3 rounded-xl border border-stone-200 text-stone-700 text-xs font-bold hover:bg-stone-50 transition-colors flex items-center justify-center space-x-1.5"
                        >
                          <Eye className="w-3.5 h-3.5 text-stone-500" />
                          <span>View Details</span>
                        </button>

                        <button
                          onClick={() => handleOpenBookingModal(eq)}
                          disabled={!eq.available}
                          className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
                            eq.available
                              ? 'bg-[#14532d] hover:bg-emerald-900 text-white shadow-xs'
                              : 'bg-stone-100 text-stone-400 cursor-not-allowed'
                          }`}
                        >
                          <Calendar className="w-3.5 h-3.5" />
                          <span>Book Machine</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: AI EQUIPMENT MATCHMAKER ("FIND THE RIGHT MACHINE FOR YOUR FARM") */}
      {/* ========================================================================= */}
      {activeTab === 'matchmaker' && (
        <div className="space-y-6">
          {/* HACKATHON DIFFERENTIATOR BANNER */}
          <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-[#14532d] text-white rounded-3xl p-6 sm:p-8 shadow-md">
            <div className="flex items-center space-x-2 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Hackathon Mechanization Intelligence</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-black font-serif">
              Find the Right Machine for Your Farm
            </h2>
            <p className="text-emerald-100 text-xs sm:text-sm mt-2 max-w-2xl leading-relaxed">
              Never overspend on oversized horsepower or rent the wrong implements. Our agronomic engine matches your crop stage, soil preparation needs, and land acreage with verified local equipment.
            </p>
          </div>

          {/* INPUT FORM CARD */}
          <form
            onSubmit={handleRunMatchmaker}
            className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-xs space-y-5"
          >
            <h3 className="text-base font-bold text-stone-800 flex items-center space-x-2">
              <SlidersHorizontal className="w-4 h-4 text-[#14532d]" />
              <span>Step 1: Enter Your Farm & Task Profile</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
              {/* Crop Select */}
              <div>
                <label className="block text-[11px] font-bold text-stone-600 mb-1">Target Crop</label>
                <select
                  value={matchCrop}
                  onChange={(e) => setMatchCrop(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-200 font-semibold bg-stone-50/50 text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#14532d]"
                >
                  <option value="Paddy (వరి)">Paddy / Rice (వరి)</option>
                  <option value="Cotton (పత్తి)">Cotton (పత్తి)</option>
                  <option value="Chilli (మిర్చి)">Chilli (మిర్చి)</option>
                  <option value="Maize (మొక్కజొన్న)">Maize (మొక్కజొన్న)</option>
                  <option value="Groundnut (వేరుశనగ)">Groundnut (వేరుశనగ)</option>
                  <option value="Pulses / Red Gram (కంది)">Pulses / Red Gram (కంది)</option>
                </select>
              </div>

              {/* Land Acres */}
              <div>
                <label className="block text-[11px] font-bold text-stone-600 mb-1">Land Size (Acres)</label>
                <input
                  type="number"
                  min="0.5"
                  max="50"
                  step="0.5"
                  value={matchAcres}
                  onChange={(e) => setMatchAcres(parseFloat(e.target.value) || 1)}
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-200 font-semibold bg-stone-50/50 text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#14532d]"
                />
              </div>

              {/* Mandal / Location */}
              <div>
                <label className="block text-[11px] font-bold text-stone-600 mb-1">Village / Mandal</label>
                <input
                  type="text"
                  value={matchMandal}
                  onChange={(e) => setMatchMandal(e.target.value)}
                  placeholder="e.g. Narsampet, Hasanparthy"
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-200 font-semibold bg-stone-50/50 text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#14532d]"
                />
              </div>

              {/* Farming Task */}
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-stone-600 mb-1">Farming Operation / Task Needed</label>
                <select
                  value={matchTask}
                  onChange={(e) => setMatchTask(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-200 font-semibold bg-stone-50/50 text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#14532d]"
                >
                  <option value="Land Preparation & Puddling (దుక్కి & దమ్ము చేయడం)">
                    Land Preparation & Puddling (దుక్కి & దమ్ము చేయడం)
                  </option>
                  <option value="Laser Land Levelling (లేజర్ లెవలింగ్ - నీటి పొదుపు)">
                    Laser Land Levelling (లేజర్ లెవలింగ్ - 25% నీటి పొదుపు)
                  </option>
                  <option value="Precision Sowing & Planting (విత్తనం వేయడం)">
                    Precision Sowing & Planting (విత్తనం వేయడం - 20% విత్తన ఆదా)
                  </option>
                  <option value="Foliar & Drone Pest Spraying (మందుల పిచికారీ / డ్రోన్)">
                    Foliar & Drone Pest Spraying (మందుల పిచికారీ / అగ్రి-డ్రోన్)
                  </option>
                  <option value="Grain Harvesting & Threshing (వరి కోత & నూర్పిడి)">
                    Grain Harvesting & Threshing (వరి కోత & నూర్పిడి)
                  </option>
                  <option value="Mandi Haulage & Produce Transport (మార్కెట్ రవాణా)">
                    Mandi Haulage & Produce Transport (మార్కెట్ రవాణా)
                  </option>
                </select>
              </div>

              {/* Maximum Daily Budget */}
              <div>
                <label className="block text-[11px] font-bold text-stone-600 mb-1">Max Daily Budget (₹)</label>
                <input
                  type="number"
                  min="500"
                  max="10000"
                  step="100"
                  value={matchBudget}
                  onChange={(e) => setMatchBudget(parseInt(e.target.value, 10) || 3000)}
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-200 font-semibold bg-stone-50/50 text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#14532d]"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-stone-500">
                Transparent rule engine and Gemini AI analysis with genuine field agronomy logic.
              </span>
              <button
                type="submit"
                disabled={isMatchmakerLoading}
                className="px-6 py-2.5 bg-[#14532d] hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center space-x-2 disabled:opacity-50"
              >
                {isMatchmakerLoading ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Analyzing Farm Machinery...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Recommend Best Machinery</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* RECOMMENDATIONS RESULTS SECTION */}
          {matchmakerResults && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-bold text-stone-900 font-serif">
                    Recommended Equipment for {matchAcres} Acres of {matchCrop}
                  </h3>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-bold">
                    {matchmakerResults.length} Matched
                  </span>
                </div>

                <div className="text-xs text-stone-500 flex items-center space-x-1">
                  <span>Engine: </span>
                  <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                    {matchmakerSource}
                  </span>
                </div>
              </div>

              {matchmakerResults.length === 0 ? (
                <div className="bg-white rounded-3xl p-8 text-center border border-stone-200">
                  <p className="text-stone-600 text-sm">
                    No equipment met the strict budget and task parameters. Try increasing your maximum daily budget.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {matchmakerResults.map((rec, idx) => (
                    <div
                      key={rec.equipment.id}
                      className="bg-white rounded-3xl p-6 border-2 border-emerald-900/10 hover:border-emerald-700/40 shadow-sm transition-all space-y-4 flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        {/* Top Match Score & Rank */}
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-lg">
                            Match Rank #{idx + 1}
                          </span>
                          <div className="flex items-center space-x-1 bg-amber-100 text-amber-900 px-2.5 py-1 rounded-lg text-xs font-black">
                            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                            <span>{rec.matchScore}% Agronomic Match</span>
                          </div>
                        </div>

                        {/* Equipment Title */}
                        <div className="flex items-start space-x-3">
                          <div className="w-12 h-12 rounded-2xl bg-stone-100 overflow-hidden shrink-0 flex items-center justify-center text-2xl">
                            {rec.equipment.imageUrl ? (
                              <img src={rec.equipment.imageUrl} alt={rec.equipment.name} className="w-full h-full object-cover" />
                            ) : (
                              rec.equipment.icon
                            )}
                          </div>
                          <div>
                            <h4 className="font-bold text-base text-stone-900 leading-snug">
                              {rec.equipment.name}
                            </h4>
                            <span className="text-xs text-stone-500">
                              {rec.equipment.category} • {rec.equipment.mandal} (Owner: {rec.equipment.ownerName})
                            </span>
                          </div>
                        </div>

                        {/* Transparent Suitability Rationale */}
                        <div className="bg-emerald-50/70 p-3.5 rounded-2xl border border-emerald-100 text-xs text-emerald-950 space-y-1.5">
                          <div className="font-bold flex items-center space-x-1.5 text-emerald-900">
                            <Info className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                            <span>Agronomic Justification:</span>
                          </div>
                          <p className="leading-relaxed text-emerald-900/90">{rec.suitabilityReason}</p>
                        </div>

                        {/* Concrete Efficiency & Cost Benefit */}
                        <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200/80 text-xs text-stone-700 space-y-1">
                          <span className="font-bold text-stone-900 flex items-center space-x-1.5">
                            <ThumbsUp className="w-3.5 h-3.5 text-[#14532d] shrink-0" />
                            <span>Efficiency & Labor Impact:</span>
                          </span>
                          <p className="leading-relaxed">{rec.efficiencyBenefit}</p>
                        </div>

                        {/* Estimated Time & Cost Breakdown */}
                        <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                          <div className="bg-stone-100/70 p-2.5 rounded-xl">
                            <span className="text-[10px] text-stone-500 block">Est. Time Needed</span>
                            <span className="font-bold text-stone-900">
                              {rec.estimatedDaysNeeded} {rec.estimatedDaysNeeded === 1 ? 'Day' : 'Days'}
                            </span>
                          </div>
                          <div className="bg-stone-100/70 p-2.5 rounded-xl">
                            <span className="text-[10px] text-stone-500 block">Est. Total Cost</span>
                            <span className="font-bold text-[#14532d]">
                              ₹{rec.estimatedTotalCost.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* CTA to Book Immediately */}
                      <div className="pt-2">
                        <button
                          onClick={() => handleOpenBookingModal(rec.equipment)}
                          className="w-full py-2.5 bg-[#14532d] hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center space-x-2"
                        >
                          <Calendar className="w-3.5 h-3.5" />
                          <span>Request Booking for This Machine</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: BUYER DASHBOARD (MY BOOKINGS & RENTAL HISTORY) */}
      {/* ========================================================================= */}
      {activeTab === 'buyer-bookings' && (
        <div className="space-y-6">
          {/* Header Stats Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-2xs">
              <span className="text-xs text-stone-500 block font-medium">Total Bookings</span>
              <span className="text-2xl font-black text-stone-900">{buyerStats.totalBookings}</span>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-2xs">
              <span className="text-xs text-amber-600 block font-medium">Pending Requests</span>
              <span className="text-2xl font-black text-amber-600">{buyerStats.pendingCount}</span>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-2xs">
              <span className="text-xs text-emerald-600 block font-medium">Accepted / Confirmed</span>
              <span className="text-2xl font-black text-emerald-700">{buyerStats.acceptedCount}</span>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-2xs">
              <span className="text-xs text-teal-600 block font-medium">Completed Rentals</span>
              <span className="text-2xl font-black text-teal-700">{buyerStats.completedCount}</span>
            </div>
          </div>

          {/* Bookings List Card */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-stone-900 font-serif">
                  My Rental Requests & Booking Records
                </h3>
                <p className="text-xs text-stone-500">
                  Track owner approvals, date reservations, and leave verified reviews upon completion.
                </p>
              </div>

              <button
                onClick={() => setActiveTab('browse')}
                className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold transition-colors"
              >
                + Rent Another Machine
              </button>
            </div>

            {buyerStats.myBookings.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-stone-200 rounded-2xl space-y-3">
                <Calendar className="w-10 h-10 text-stone-300 mx-auto" />
                <h4 className="font-bold text-stone-700 text-sm">No rental requests found</h4>
                <p className="text-xs text-stone-500">You haven't requested any machinery rentals yet.</p>
                <button
                  onClick={() => setActiveTab('browse')}
                  className="px-4 py-2 bg-[#14532d] text-white rounded-xl text-xs font-bold"
                >
                  Browse Machinery Directory
                </button>
              </div>
            ) : (
              <div className="divide-y divide-stone-100">
                {buyerStats.myBookings.map((bk) => (
                  <div key={bk.id} className="py-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center space-x-2">
                        <span className="text-xl">{bk.equipmentIcon}</span>
                        <h4 className="font-bold text-sm text-stone-900">{bk.equipmentName}</h4>

                        {/* Status Badge */}
                        <span
                          className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                            bk.status === 'Accepted'
                              ? 'bg-emerald-100 text-emerald-800'
                              : bk.status === 'Pending'
                              ? 'bg-amber-100 text-amber-800'
                              : bk.status === 'Completed'
                              ? 'bg-teal-100 text-teal-800'
                              : bk.status === 'Cancelled'
                              ? 'bg-stone-200 text-stone-700'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {bk.status === 'Pending' && '⏳ Pending Owner Acceptance'}
                          {bk.status === 'Accepted' && '✓ Confirmed by Owner'}
                          {bk.status === 'Completed' && '★ Completed Rental'}
                          {bk.status === 'Cancelled' && 'Cancelled'}
                          {bk.status === 'Rejected' && 'Declined by Owner'}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500">
                        <span className="flex items-center space-x-1">
                          <Calendar className="w-3.5 h-3.5 text-stone-400" />
                          <span>
                            {bk.startDate} to {bk.endDate} ({bk.totalDays} {bk.totalDays === 1 ? 'day' : 'days'})
                          </span>
                        </span>

                        <span className="flex items-center space-x-1">
                          <User className="w-3.5 h-3.5 text-stone-400" />
                          <span>Owner: {bk.sellerName}</span>
                        </span>

                        <a
                          href={`tel:${bk.sellerPhone}`}
                          className="flex items-center space-x-1 text-[#14532d] font-bold hover:underline"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>{bk.sellerPhone}</span>
                        </a>
                      </div>

                      {bk.notes && (
                        <p className="text-xs text-stone-600 italic bg-stone-50 px-2 py-1 rounded-md inline-block">
                          Note: "{bk.notes}"
                        </p>
                      )}

                      {bk.rejectionReason && (
                        <p className="text-xs text-rose-700 bg-rose-50 px-2.5 py-1 rounded-md">
                          Reason for decline: {bk.rejectionReason}
                        </p>
                      )}
                    </div>

                    {/* Amount & Actions */}
                    <div className="sm:text-right space-y-2">
                      <div className="text-base font-black text-[#14532d]">
                        ₹{bk.totalAmount.toLocaleString()}
                        <span className="text-[10px] text-stone-400 font-normal block">
                          (₹{bk.dailyRate}/day × {bk.totalDays} days)
                        </span>
                      </div>

                      <div className="flex items-center sm:justify-end gap-2">
                        {/* Cancel button if pending */}
                        {bk.status === 'Pending' && (
                          <button
                            onClick={() => handleCancelBooking(bk.id)}
                            className="px-3 py-1.5 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-bold transition-colors"
                          >
                            Cancel Request
                          </button>
                        )}

                        {/* Review button if completed */}
                        {bk.status === 'Completed' && (
                          <button
                            onClick={() => setReviewBooking(bk)}
                            className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-colors flex items-center space-x-1 shadow-2xs"
                          >
                            <Star className="w-3.5 h-3.5 fill-white" />
                            <span>Leave Review</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: OWNER / SELLER PORTAL & DASHBOARD */}
      {/* ========================================================================= */}
      {activeTab === 'owner-portal' && (
        <div className="space-y-6">
          {/* SELLER KPI METRIC CARDS */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-2xs">
              <span className="text-xs text-stone-500 block font-medium">My Active Machinery</span>
              <span className="text-2xl font-black text-stone-900">{sellerStats.activeListingsCount}</span>
              <span className="text-[11px] text-stone-400 block mt-1">{sellerStats.totalListings} total in directory</span>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-2xs relative">
              <span className="text-xs text-amber-600 block font-medium">Pending Farmer Requests</span>
              <span className="text-2xl font-black text-amber-600">{sellerStats.pendingRequestsCount}</span>
              {sellerStats.pendingRequestsCount > 0 && (
                <span className="text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-bold mt-1 inline-block">
                  Requires your decision
                </span>
              )}
            </div>

            <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-2xs">
              <span className="text-xs text-teal-600 block font-medium">Completed Rentals</span>
              <span className="text-2xl font-black text-teal-700">{sellerStats.completedRentalsCount}</span>
              <span className="text-[11px] text-stone-400 block mt-1">Verified deliveries</span>
            </div>

            <div className="bg-gradient-to-br from-emerald-800 to-[#14532d] text-white rounded-3xl p-5 shadow-2xs">
              <span className="text-xs text-emerald-200 block font-medium">Verified Rental Earnings</span>
              <span className="text-2xl font-black text-white">₹{sellerStats.totalEarnings.toLocaleString()}</span>
              <span className="text-[10px] text-emerald-200/80 block mt-1">
                Calculated strictly from accepted & completed rentals
              </span>
            </div>
          </div>

          {/* INCOMING BOOKING REQUESTS CARD */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-stone-900 font-serif">
                  Incoming Booking Requests from Local Farmers
                </h3>
                <p className="text-xs text-stone-500">
                  Accept or decline requests. Once accepted, dates will be locked to prevent double-booking.
                </p>
              </div>

              {sellerStats.pendingRequestsCount > 0 && (
                <span className="bg-amber-100 text-amber-900 text-xs px-3 py-1 rounded-full font-bold">
                  {sellerStats.pendingRequestsCount} Pending Action
                </span>
              )}
            </div>

            {sellerStats.myReceivedBookings.length === 0 ? (
              <div className="text-center py-8 border border-dashed border-stone-200 rounded-2xl">
                <Clock className="w-8 h-8 text-stone-300 mx-auto mb-1.5" />
                <p className="text-xs text-stone-500 font-medium">
                  No booking requests received for your equipment yet.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-stone-100">
                {sellerStats.myReceivedBookings.map((bk) => (
                  <div key={bk.id} className="py-4.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-sm text-stone-900">{bk.equipmentName}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            bk.status === 'Accepted'
                              ? 'bg-emerald-100 text-emerald-800'
                              : bk.status === 'Pending'
                              ? 'bg-amber-100 text-amber-800'
                              : bk.status === 'Completed'
                              ? 'bg-teal-100 text-teal-800'
                              : 'bg-stone-200 text-stone-700'
                          }`}
                        >
                          {bk.status}
                        </span>
                      </div>

                      <div className="text-xs text-stone-600 flex flex-wrap items-center gap-3">
                        <span>
                          Farmer: <strong>{bk.buyerName}</strong> ({bk.buyerVillage})
                        </span>
                        <span>
                          Phone: <a href={`tel:${bk.buyerPhone}`} className="text-[#14532d] font-bold hover:underline">{bk.buyerPhone}</a>
                        </span>
                        <span className="font-medium text-stone-500">
                          Dates: {bk.startDate} to {bk.endDate} ({bk.totalDays} days)
                        </span>
                      </div>

                      {bk.notes && (
                        <p className="text-xs text-stone-500 italic">Farmer note: "{bk.notes}"</p>
                      )}
                    </div>

                    {/* Decision Actions */}
                    <div className="flex items-center space-x-2 md:justify-end">
                      <div className="text-right mr-3">
                        <span className="text-xs text-stone-400 block">Payout</span>
                        <span className="text-base font-black text-[#14532d]">₹{bk.totalAmount}</span>
                      </div>

                      {bk.status === 'Pending' && (
                        <>
                          <button
                            onClick={() => handleAcceptBooking(bk.id)}
                            className="px-3.5 py-2 bg-[#14532d] hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition-all shadow-2xs"
                          >
                            Accept Booking
                          </button>
                          <button
                            onClick={() => handleRejectBooking(bk.id)}
                            className="px-3 py-2 border border-stone-200 text-stone-600 hover:bg-stone-50 rounded-xl text-xs font-bold transition-colors"
                          >
                            Decline
                          </button>
                        </>
                      )}

                      {bk.status === 'Accepted' && (
                        <button
                          onClick={() => handleCompleteBooking(bk.id)}
                          className="px-3.5 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold transition-all"
                        >
                          Mark as Completed
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* MY LISTINGS MANAGEMENT CARD */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-xs space-y-4">
            <h3 className="text-lg font-bold text-stone-900 font-serif">
              My Listed Machinery Inventory ({sellerStats.myListings.length})
            </h3>

            {sellerStats.myListings.length === 0 ? (
              <p className="text-xs text-stone-500">You haven't added any machinery to the directory yet.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {sellerStats.myListings.map((eq) => (
                  <div key={eq.id} className="p-4 rounded-2xl border border-stone-200 bg-stone-50/50 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-sm text-stone-900">{eq.name}</h4>
                        <span className="text-[11px] text-stone-500">{eq.category} • ₹{eq.dailyRate}/day</span>
                      </div>
                      <span className="text-xl">{eq.icon}</span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-stone-200 text-xs">
                      <button
                        onClick={() => handleToggleAvailability(eq.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                          eq.available
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                        }`}
                      >
                        {eq.available ? '● Available' : '○ Unavailable'}
                      </button>

                      <button
                        onClick={() => handleDeleteListing(eq.id, eq.name)}
                        className="text-stone-400 hover:text-rose-600 transition-colors p-1"
                        title="Delete listing"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* LIST YOUR IDLE MACHINERY FORM */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-xs space-y-6">
            <div className="border-b border-stone-100 pb-4">
              <h3 className="text-xl font-black text-stone-900 font-serif">
                List Your Idle Machinery for Rental Income
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Monetize your tractors, tillers, and harvesters during off-peak days. All fields are verified before publishing.
              </p>
            </div>

            <form onSubmit={handleCreateListing} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                {/* Equipment Name */}
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">
                    Equipment / Tractor Name & Model *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sonalika DI 42 RX (42 HP)"
                    value={newEqName}
                    onChange={(e) => setNewEqName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 font-semibold bg-stone-50/50 focus:outline-none focus:ring-2 focus:ring-[#14532d]"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">Category *</label>
                  <select
                    value={newEqCategory}
                    onChange={(e) => setNewEqCategory(e.target.value as EquipmentCategory)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 font-semibold bg-stone-50/50 focus:outline-none focus:ring-2 focus:ring-[#14532d]"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                {/* DYNAMIC MARKET PRICE BENCHMARK STRIP */}
                <div className="sm:col-span-3 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-3.5 flex items-start space-x-2 text-xs text-emerald-950">
                  <Award className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-emerald-900">
                      Dynamic Market Benchmark for {newEqCategory}:
                    </strong>
                    <span>
                      {suggestedBenchmark.benchmarkDescription}. Local active range: <strong>₹{suggestedBenchmark.min} - ₹{suggestedBenchmark.max}/day</strong> (Market Average: ₹{suggestedBenchmark.avg}/day).
                    </span>
                  </div>
                </div>

                {/* Daily Rental Price */}
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">
                    Daily Rental Rate (₹/day) *
                  </label>
                  <input
                    type="number"
                    required
                    min="200"
                    max="15000"
                    value={newEqDailyRate}
                    onChange={(e) => setNewEqDailyRate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 font-semibold bg-stone-50/50 focus:outline-none focus:ring-2 focus:ring-[#14532d]"
                  />
                </div>

                {/* Hourly Rate (optional) */}
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">
                    Hourly Rate (₹/hr - Optional)
                  </label>
                  <input
                    type="number"
                    min="50"
                    max="3000"
                    placeholder="e.g. 150"
                    value={newEqHourlyRate}
                    onChange={(e) => setNewEqHourlyRate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 font-semibold bg-stone-50/50 focus:outline-none focus:ring-2 focus:ring-[#14532d]"
                  />
                </div>

                {/* Condition */}
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">Machine Condition *</label>
                  <select
                    value={newEqCondition}
                    onChange={(e) => setNewEqCondition(e.target.value as EquipmentCondition)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 font-semibold bg-stone-50/50 focus:outline-none focus:ring-2 focus:ring-[#14532d]"
                  >
                    <option value="Like New (Under 1 Yr)">Like New (Under 1 Yr)</option>
                    <option value="Good Condition">Good Condition</option>
                    <option value="Fair / Working Condition">Fair / Working Condition</option>
                  </select>
                </div>

                {/* Mandal Location */}
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">Mandal / Town *</label>
                  <input
                    type="text"
                    required
                    value={newEqMandal}
                    onChange={(e) => setNewEqMandal(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 font-semibold bg-stone-50/50 focus:outline-none focus:ring-2 focus:ring-[#14532d]"
                  />
                </div>

                {/* District */}
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">District *</label>
                  <input
                    type="text"
                    required
                    value={newEqDistrict}
                    onChange={(e) => setNewEqDistrict(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 font-semibold bg-stone-50/50 focus:outline-none focus:ring-2 focus:ring-[#14532d]"
                  />
                </div>

                {/* Security Deposit */}
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">Security Deposit (₹)</label>
                  <input
                    type="number"
                    min="0"
                    step="500"
                    value={newEqDeposit}
                    onChange={(e) => setNewEqDeposit(parseInt(e.target.value, 10) || 0)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 font-semibold bg-stone-50/50 focus:outline-none focus:ring-2 focus:ring-[#14532d]"
                  />
                </div>

                {/* Rental Terms: Diesel Policy */}
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">Diesel / Fuel Policy</label>
                  <select
                    value={newEqDiesel}
                    onChange={(e) => setNewEqDiesel(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 font-semibold bg-stone-50/50 focus:outline-none focus:ring-2 focus:ring-[#14532d]"
                  >
                    <option value="Renter Pays Diesel">Renter Pays Diesel</option>
                    <option value="Owner Supplies Diesel (Inclusive)">Owner Supplies Diesel (Inclusive)</option>
                    <option value="Negotiable">Negotiable</option>
                  </select>
                </div>

                {/* Rental Terms: Operator Included Toggle */}
                <div className="flex items-center space-x-2 pt-4">
                  <input
                    type="checkbox"
                    id="operatorInc"
                    checked={newEqOperator}
                    onChange={(e) => setNewEqOperator(e.target.checked)}
                    className="rounded text-[#14532d] focus:ring-[#14532d] w-4 h-4 cursor-pointer"
                  />
                  <label htmlFor="operatorInc" className="text-xs font-bold text-stone-700 cursor-pointer">
                    Driver / Operator Included
                  </label>
                </div>

                {/* Preset Photo Selector */}
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">Machine Photo</label>
                  <select
                    value={newEqImage}
                    onChange={(e) => setNewEqImage(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 font-semibold bg-stone-50/50 focus:outline-none focus:ring-2 focus:ring-[#14532d]"
                  >
                    {PRESET_IMAGES.map((p) => (
                      <option key={p.url} value={p.url}>
                        {p.icon} {p.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Attachments */}
                <div className="sm:col-span-3">
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">
                    Included Attachments & Implements (Comma-separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Rotavator (42 Blade), 9-Tyne Cultivator, 3-MB Plough, Leveler"
                    value={newEqAttachments}
                    onChange={(e) => setNewEqAttachments(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 font-semibold bg-stone-50/50 focus:outline-none focus:ring-2 focus:ring-[#14532d]"
                  />
                </div>

                {/* Technical Specifications */}
                <div className="sm:col-span-3">
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">
                    Technical Specifications
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 45 HP 4-Cylinder ELS Engine, Dual Clutch, Power Steering, High Lug Mud Tires"
                    value={newEqSpecs}
                    onChange={(e) => setNewEqSpecs(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 font-semibold bg-stone-50/50 focus:outline-none focus:ring-2 focus:ring-[#14532d]"
                  />
                </div>

                {/* Detailed Description */}
                <div className="sm:col-span-3">
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">
                    Description & Maintenance History
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Describe machine performance, ideal tasks (e.g., paddy puddle, dry ploughing), and delivery terms..."
                    value={newEqDescription}
                    onChange={(e) => setNewEqDescription(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 font-semibold bg-stone-50/50 focus:outline-none focus:ring-2 focus:ring-[#14532d]"
                  />
                </div>
              </div>

              <div className="pt-2 text-right">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#14532d] hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition-all shadow-xs inline-flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Publish Machinery Listing</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: EQUIPMENT DETAILS MODAL */}
      {/* ========================================================================= */}
      {detailsEquipment && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200">
            {/* Header Image */}
            <div className="relative h-64 bg-stone-100">
              {detailsEquipment.imageUrl ? (
                <img src={detailsEquipment.imageUrl} alt={detailsEquipment.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-6xl">
                  {detailsEquipment.icon}
                </div>
              )}
              <button
                onClick={() => setDetailsEquipment(null)}
                className="absolute top-4 right-4 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-4 bg-stone-900/90 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                {detailsEquipment.category}
              </div>
            </div>

            {/* Content Body */}
            <div className="p-6 space-y-5">
              <div>
                <div className="flex items-start justify-between">
                  <h3 className="text-xl font-black text-stone-900 font-serif">
                    {detailsEquipment.name}
                  </h3>
                  <div className="text-right">
                    <span className="text-2xl font-black text-[#14532d]">₹{detailsEquipment.dailyRate}</span>
                    <span className="text-xs text-stone-500 block">per day</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3 text-xs text-stone-500 mt-2">
                  <span className="flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5 text-stone-400" />
                    <span>{detailsEquipment.location}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center space-x-1 text-amber-600 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{detailsEquipment.rating.toFixed(1)} ({detailsEquipment.reviewCount} reviews)</span>
                  </span>
                  <span>•</span>
                  <span className="font-semibold text-stone-700">{detailsEquipment.condition}</span>
                </div>
              </div>

              {/* Owner Info Card */}
              <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200/80 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-stone-500 block">Machinery Owner</span>
                  <span className="font-bold text-stone-900 text-sm flex items-center space-x-1">
                    <span>{detailsEquipment.ownerName}</span>
                    {detailsEquipment.isVerifiedOwner && (
                      <ShieldCheck className="w-4 h-4 text-emerald-600 inline" />
                    )}
                  </span>
                </div>
                <a
                  href={`tel:${detailsEquipment.ownerPhone}`}
                  className="px-3.5 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call {detailsEquipment.ownerPhone}</span>
                </a>
              </div>

              {/* Specs & Description */}
              <div className="space-y-2 text-xs">
                <h4 className="font-bold text-stone-800 text-sm">Description & Specifications</h4>
                <p className="text-stone-600 leading-relaxed">{detailsEquipment.description}</p>
                <div className="bg-stone-100/70 p-3 rounded-xl text-stone-700 font-mono text-[11px]">
                  {detailsEquipment.specs}
                </div>
              </div>

              {/* Included Attachments */}
              {detailsEquipment.attachments && detailsEquipment.attachments.length > 0 && (
                <div className="space-y-2 text-xs">
                  <h4 className="font-bold text-stone-800 text-sm">Included Attachments & Implements</h4>
                  <div className="flex flex-wrap gap-2">
                    {detailsEquipment.attachments.map((att, i) => (
                      <span key={i} className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-lg font-medium">
                        ✓ {att}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Rental Terms Table */}
              <div className="space-y-2 text-xs">
                <h4 className="font-bold text-stone-800 text-sm">Rental Terms & Policies</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100">
                    <span className="text-stone-400 block text-[10px]">Operator Included:</span>
                    <span className="font-bold text-stone-800">
                      {detailsEquipment.terms.operatorIncluded ? 'Yes, Driver Included' : 'No, Renter Drives'}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100">
                    <span className="text-stone-400 block text-[10px]">Diesel Policy:</span>
                    <span className="font-bold text-stone-800">{detailsEquipment.terms.dieselPolicy}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100">
                    <span className="text-stone-400 block text-[10px]">Security Deposit:</span>
                    <span className="font-bold text-stone-800">
                      {detailsEquipment.terms.securityDepositInr > 0 ? `₹${detailsEquipment.terms.securityDepositInr}` : '₹0 (No Deposit)'}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100">
                    <span className="text-stone-400 block text-[10px]">Field Delivery:</span>
                    <span className="font-bold text-stone-800">
                      {detailsEquipment.terms.deliveryAvailable ? 'Available to Farm Gate' : 'Self-Pickup'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Verified Farmer Reviews */}
              <div className="space-y-2 text-xs pt-2 border-t border-stone-100">
                <h4 className="font-bold text-stone-800 text-sm flex items-center justify-between">
                  <span>Farmer Reviews ({reviews.filter((r) => r.equipmentId === detailsEquipment.id).length})</span>
                  <span className="text-amber-600 font-bold">★ {detailsEquipment.rating.toFixed(1)}</span>
                </h4>

                {reviews.filter((r) => r.equipmentId === detailsEquipment.id).length === 0 ? (
                  <p className="text-stone-400 italic">No reviews yet for this equipment.</p>
                ) : (
                  <div className="space-y-2">
                    {reviews
                      .filter((r) => r.equipmentId === detailsEquipment.id)
                      .map((rev) => (
                        <div key={rev.id} className="p-3 bg-stone-50 rounded-xl space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-stone-800">{rev.reviewerName}</span>
                            <div className="flex text-amber-500">
                              {Array.from({ length: rev.rating }).map((_, i) => (
                                <Star key={i} className="w-3 h-3 fill-amber-400" />
                              ))}
                            </div>
                          </div>
                          <p className="text-stone-600 text-[11px] leading-relaxed">{rev.comment}</p>
                        </div>
                      ))}
                  </div>
                )}
              </div>

              {/* Action */}
              <div className="pt-4 border-t border-stone-100 flex items-center justify-end space-x-2">
                <button
                  onClick={() => setDetailsEquipment(null)}
                  className="px-4 py-2.5 border border-stone-200 text-stone-700 rounded-xl text-xs font-bold hover:bg-stone-50"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    const eq = detailsEquipment;
                    setDetailsEquipment(null);
                    handleOpenBookingModal(eq);
                  }}
                  disabled={!detailsEquipment.available}
                  className="px-6 py-2.5 bg-[#14532d] hover:bg-emerald-900 text-white rounded-xl text-xs font-bold disabled:opacity-50"
                >
                  Book Machine Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: BOOKING SYSTEM MODAL */}
      {/* ========================================================================= */}
      {bookingEquipment && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-stone-200 space-y-5">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="text-lg font-black text-stone-900 font-serif">
                  Book Machinery: {bookingEquipment.name}
                </h3>
                <span className="text-xs text-stone-500">
                  Rate: <strong>₹{bookingEquipment.dailyRate}/day</strong> • Owner: {bookingEquipment.ownerName}
                </span>
              </div>
              <button
                onClick={() => setBookingEquipment(null)}
                className="text-stone-400 hover:text-stone-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitBooking} className="space-y-4 text-xs">
              {/* Date pickers */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">
                    Rental Start Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={bookingStartDate}
                    onChange={(e) => setBookingStartDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 font-semibold bg-stone-50/50 focus:outline-none focus:ring-2 focus:ring-[#14532d]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">
                    Rental End Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={bookingEndDate}
                    onChange={(e) => setBookingEndDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 font-semibold bg-stone-50/50 focus:outline-none focus:ring-2 focus:ring-[#14532d]"
                  />
                </div>
              </div>

              {/* Live Overlap Warning Alert */}
              {bookingOverlapError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-start space-x-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{bookingOverlapError}</span>
                </div>
              )}

              {/* Automatic Total Cost Calculation */}
              <div className="bg-emerald-50/80 p-4 rounded-2xl border border-emerald-200/80 space-y-1.5">
                <div className="flex items-center justify-between text-xs text-emerald-950 font-bold">
                  <span>Rental Duration:</span>
                  <span>{bookingDays} Calendar {bookingDays === 1 ? 'Day' : 'Days'}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-emerald-950 font-bold">
                  <span>Daily Rate:</span>
                  <span>₹{bookingEquipment.dailyRate} / day</span>
                </div>
                <div className="flex items-center justify-between text-base font-black text-[#14532d] pt-2 border-t border-emerald-200">
                  <span>Estimated Total Amount:</span>
                  <span>₹{bookingTotalAmount.toLocaleString()}</span>
                </div>
                <span className="text-[10px] text-emerald-800/80 block pt-1">
                  * No advance payment required. You will settle payment directly with the owner upon completion.
                </span>
              </div>

              {/* Delivery Village */}
              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">
                  Delivery Field Location / Village *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Narsampet East Field, Survey No 14"
                  value={bookingVillage}
                  onChange={(e) => setBookingVillage(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 font-semibold bg-stone-50/50 focus:outline-none focus:ring-2 focus:ring-[#14532d]"
                />
              </div>

              {/* Notes / Farming Task */}
              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">
                  Farming Task / Notes for Owner (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Need rotavator for 4 acres of wet paddy field puddling before tomorrow's sowing."
                  value={bookingNotes}
                  onChange={(e) => setBookingNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 font-semibold bg-stone-50/50 focus:outline-none focus:ring-2 focus:ring-[#14532d]"
                />
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setBookingEquipment(null)}
                  className="px-4 py-2.5 border border-stone-200 text-stone-700 rounded-xl text-xs font-bold hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!!bookingOverlapError}
                  className="px-6 py-2.5 bg-[#14532d] hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition-all shadow-xs disabled:opacity-50"
                >
                  Submit Booking Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: LEAVE REVIEW MODAL (AFTER COMPLETED RENTAL) */}
      {/* ========================================================================= */}
      {reviewBooking && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-base font-black text-stone-900 font-serif">
                Review & Rate {reviewBooking.equipmentName}
              </h3>
              <button onClick={() => setReviewBooking(null)} className="text-stone-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-4 text-xs">
              {/* Star Rating Select */}
              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">Star Rating</label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="p-1 focus:outline-none"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= reviewRating ? 'fill-amber-400 text-amber-400' : 'text-stone-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="font-bold text-stone-700 ml-2">{reviewRating} / 5 Stars</span>
                </div>
              </div>

              {/* Comment text */}
              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">
                  Field Performance Review *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="How was the equipment condition? Did the implements work well? Was the owner helpful?"
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 font-semibold bg-stone-50/50 focus:outline-none focus:ring-2 focus:ring-[#14532d]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setReviewBooking(null)}
                  className="px-4 py-2 border border-stone-200 text-stone-700 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#14532d] hover:bg-emerald-900 text-white rounded-xl text-xs font-bold"
                >
                  Post Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
