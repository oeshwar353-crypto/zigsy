export enum Screen {
  Splash = "splash",
  Login = "login",
  Otp = "otp",
  Landing = "landing",
  SignupBasic = "signup_basic",
  SignupStyle = "signup_style",
  SignupStudent = "signup_student",
  SignupIdentity = "signup_identity",
  AccountCreated = "account_created",
  Home = "home",
}


export interface LegacyProduct {
  id: string;
  designer: string;
  name: string;
  pricePerDay: number;
  imageUrl: string;
  isNewArrival?: boolean;
  badge?: string;
  badgeType?: "sustainability" | "rare" | "limited" | "standard";
  rating?: number;
  rentalsCount?: number;
  category: "for-you" | "dresses" | "outerwear";
}
export interface Product {
  id: string;
  name: string;
  price: number; // Daily rental price in ₹ or $
  currency: '₹' | '$';
  brand: string;
  description: string;
  size?: string;
  color?: string;
  image: string;
  rating?: number;
  distance?: string; // e.g. "2.4 km" or "1.2 miles"
  tag?: string; // e.g. "Available Now", "LIMITED", "ECO", "AVAILABLE NOW", "New In", "Sustainable"
  category: string; // e.g. "Party" | "Casual" | "Streetwear" | "Date Night" | "Formal" | "Accessories"
  gallery?: string[]; // for multi-image carousel
  refundableDeposit?: string;
  owner?: {
    name: string;
    avatar: string;
    role: string;
  };
  estimatedOriginalValue?: number;
  isHighValue?: boolean;
  securityDeposit?: number;
  gender?: 'Male' | 'Female' | 'Unisex';
  subcategory?: string;
  occasion?: string;
  rentalPrice?: number;
  availability?: 'Available' | 'Booked';
  status?: string;
  visibility?: string;
  ownerId?: string;
  views?: number;
  wishes?: number;
  bookingsCount?: number;
  createdAt?: string;
  updatedAt?: string;
  condition?: string;
}

export type ActiveScreen =
  | 'home'
  | 'search'
  | 'category'
  | 'details'
  | 'wishlist'
  | 'profile'
  | 'sell'
  | 'date-selection'
  | 'checkout'
  | 'payment'
  | 'booking-success'
  | 'my-orders'
  | 'order-details'
  | 'order-tracking'
  | 'order-extension'
  | 'order-cancellation'
  | 'chat-inbox'
  | 'chat-screen'
  | 'chat-booking-details'
  | 'chat-schedule-return'
  | 'chat-report-issue'
  | 'chat-notifications'
  | 'trending-all';

export interface FilterState {
  priceRange: number;
  distance: string; // 'under-5' | 'city-wide' | 'nationwide'
  size: string; // 'XXS' | 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL'
  brands: string[];
  gender: string[];
  sizes: string[];
  colors: string[];
  occasions: string[];
  conditions: string[];
  availability: 'All' | 'Available' | 'Booked';
}
export type ListingStatus = 'Active' | 'Rented' | 'Pending Approval' | 'Drafts';

export interface Listing {
  id: string;
  title: string;
  description: string;
  size: string;
  price: number;
  securityDeposit: number;
  image: string;
  images?: string[];
  status: ListingStatus;
  category: string;
  brand: string;
  color: string;
  condition: string;
  views: number;
  wishes: number;
  bookingsCount: number;
  totalRevenue: number;
  blockedDates: string[]; // e.g. ["2023-10-09", "2023-10-10"]
  bookedDates: string[]; // e.g. ["2023-10-03", "2023-10-04", "2023-10-16", "2023-10-17", "2023-10-18"]
  pickupLocation: string;
  deliveryAvailable: boolean;
  createdAt?: string;
  updatedAt?: string;
  estimatedOriginalValue: number;
  isHighValue?: boolean;
  ownerId?: string;
  ownerName?: string;
  ownerAvatar?: string;
  ownerRole?: string;
  visibility?: 'ACTIVE' | 'ARCHIVED' | 'DRAFT';
  gender?: 'Male' | 'Female' | 'Unisex';
  subcategory?: string;
  occasion?: string;
  rentalPrice?: number;
  availability?: 'Available' | 'Booked';
}

export interface ChatMessage {
  id: string;
  sender: 'Seller' | 'Buyer';
  text: string;
  timestamp: string;
}

export interface BookingRequest {
  id: string;
  buyerName: string;
  buyerRating: number;
  buyerRentalsCount: number;
  buyerAvatar: string;
  listingId: string;
  listingTitle: string;
  listingImage: string;
  startDate: string; // e.g. "Oct 12"
  endDate: string; // e.g. "Oct 15"
  price: number;
  isExpiringSoon?: boolean;
  status: 'Pending' | 'Accepted' | 'Rejected';
  messages: ChatMessage[];
}

export type SellerScreen =
  | 'Dashboard'
  | 'MyListings'
  | 'UploadOutfit'
  | 'ListingDetails'
  | 'BookingRequests'
  | 'Profile';
export interface Outfit {
  id: string;
  name: string;
  brand: string;
  image: string;
  pricePerDay: number;
  sellerName: string;
  sellerImage: string;
  sellerRating: number;
  securityDeposit: number;
  rules: string[];
  description: string;
  isHighValue?: boolean;
}

export type DeliveryOption = 'home' | 'pickup';

export type BookingPaymentMethod = 'upi' | 'card' | 'netbanking' | 'wallet';

export type OrderStatus = 'upcoming' | 'active' | 'completed' | 'cancelled';

export interface TrackingStep {
  key: string;
  label: string;
  date?: string;
  description: string;
  completed: boolean;
  active: boolean;
}

export interface Order {
  id: string;
  outfit: Outfit;
  startDate: string;
  endDate: string;
  rentalDays: number;
  status: OrderStatus;
  amount: number;
  securityDeposit: number;
  deliveryOption: DeliveryOption;
  address: string;
  paymentMethod: BookingPaymentMethod;
  trackingTimeline: TrackingStep[];
  cancellationReason?: string;
  cancellationRefund?: number;
  extendedReturnDate?: string;
  extensionDays?: number;
  extensionCost?: number;
}

export type CheckoutScreen =
  | 'EXPLORE'
  | 'PRODUCT_DETAILS'
  | 'DATE_SELECTION'
  | 'CHECKOUT'
  | 'PAYMENT'
  | 'SUCCESS'
  | 'MY_ORDERS'
  | 'ORDER_DETAILS'
  | 'ORDER_TRACKING'
  | 'EXTENSION'
  | 'CANCELLATION';
export interface User {
  id: string;
  name: string;
  avatar: string;
  isVerified: boolean;
  isOnline: boolean;
}

export interface Conversation {
  id: string;
  user: User;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  bookingStatus: string;
  itemName: string;
  itemImage: string;
}

export interface Message {
  id: string;
  senderId: string;
  text?: string;
  image?: string;
  timestamp: string;
  isRead: boolean;
  locationCard?: {
    location: string;
    date: string;
    time: string;
    status: 'pending' | 'confirmed' | 'rescheduled';
  };
}

export type NotificationType =
  | 'BOOKING_CONFIRMED'
  | 'PAYMENT_SUCCESSFUL'
  | 'SELLER_ACCEPTED'
  | 'RENTAL_REMINDER'
  | 'RETURN_REMINDER'
  | 'DEPOSIT_REFUNDED'
  | 'NEW_MESSAGE'
  | 'BOOKING_CANCELLED'
  | 'REVIEW_REMINDER'
  | 'PROMO'
  | 'SYSTEM'
  | 'booking'
  | 'payment'
  | 'chat'
  | 'returns'
  | 'promotions'
  | 'system';

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  timestamp: string;
  timeLabel?: string; // "Today", "Yesterday", "Earlier"
  group?: 'Today' | 'Yesterday' | 'Earlier';
  isRead: boolean;
  itemImage?: string;
}

export interface ReturnSchedule {
  location: string;
  date: string;
  timeSlot: string;
}

export interface IssueReport {
  category: 'damaged' | 'wrong' | 'missing' | 'late' | 'payment' | 'other';
  description: string;
  photos: string[];
}
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface UserProfile {
  id?: string;
  fullName: string;
  username: string;
  collegeName: string;
  isVerifiedStudent: boolean;
  isTrustedMember: boolean;
  rating: number;
  rentalsCount: number;
  listingsCount: number;
  totalEarnings: number;
  onTimeReturnRate: number;
  bio: string;
  gender: string;
  phoneNumber: string;
  email: string;
  profilePhoto: string;
  mobileNumber?: string;
  collegeEmail?: string;
  studentIdUploaded?: boolean;
  selfieImage?: string;
  stylePreferences?: string[];
  isIdentityVerified?: boolean;
  highValueVerificationStatus?: 'Not Verified' | 'Government ID Submitted' | 'Selfie Submitted' | 'Verification Pending' | 'Verified';
}

export interface WishlistItem {
  id: string;
  image: string;
  name: string;
  brand: string;
  price: number;
  sellerName: string;
  sellerAvatar: string;
  rating: number;
}

export type RentalStatus = 'upcoming' | 'active' | 'completed' | 'cancelled';

export interface RentalItem {
  id: string;
  name: string;
  image: string;
  sellerName: string;
  sellerAvatar: string;
  dates: string;
  status: RentalStatus;
  amount: number;
  startsInDays?: number;
  endsTomorrowText?: string;
}

export type AddressType = 'Hostel' | 'Home' | 'Apartment' | 'Other';

export interface Address {
  id: string;
  label: string;
  type: AddressType;
  isDefault: boolean;
  detail: string;
}

export type PaymentType = 'card' | 'upi';

export interface PaymentMethod {
  id: string;
  type: PaymentType;
  cardType?: string; // e.g. 'Visa Infinite', 'Mastercard Debit'
  cardNumber?: string; // e.g. '•••• •••• •••• 8842'
  cardHolder?: string;
  expires?: string;
  upiId?: string; // e.g. 'alexrivera@okaxis'
  isPrimary: boolean;
  provider: string; // 'Visa' | 'Mastercard' | 'GPay' | 'PhonePe'
}

export interface Review {
  id: string;
  authorName: string;
  authorAvatar: string;
  rating: number;
  date: string;
  text: string;
  imageUrls?: string[];
  type: 'received' | 'given';
}


export interface FAQItem {
  question: string;
  answer: string;
  category: string;
}
export interface BankAccount {
  bankName: string;
  accountHolder: string;
  accountNumber: string;
  ifsc: string;
  isVerified: boolean;
}

export interface UPIAccount {
  id: string;
  upiId: string;
  isPrimary: boolean;
  isVerified: boolean;
}

export type TransactionStatus = 'Completed' | 'Processing' | 'Failed';

export interface Transaction {
  id: string;
  payoutId: string;
  amount: number;
  destination: string;
  destinationType: 'bank' | 'upi';
  status: TransactionStatus;
  date: string;
}

export interface WalletSummary {
  availableBalance: number;
  pendingEarnings: number;
  lifetimeEarnings: number;
  nextPayoutDay: string;
}
