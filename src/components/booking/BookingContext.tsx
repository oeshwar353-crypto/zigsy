import React, { createContext, useContext, useState, useEffect } from 'react';
import { Outfit, Order, DeliveryOption, BookingPaymentMethod, TrackingStep } from '../../types';
import { INITIAL_ORDERS, SAVED_ADDRESSES } from '../../data';
import { useBuyer } from '../home/BuyerContext';

interface BookingContextType {
    orders: Order[];
    currentRentalOutfit: Outfit | null;
    currentRentalDates: { startDate: string; endDate: string } | null;
    currentRentalDays: number;
    currentRentalDeliveryOption: DeliveryOption;
    currentRentalAddress: string;
    currentRentalPaymentMethod: BookingPaymentMethod;
    selectedOrder: Order | null;
    setRentalOutfit: (outfit: Outfit) => void;
    setRentalDates: (start: string, end: string, days: number) => void;
    setDeliveryOption: (option: DeliveryOption) => void;
    setDeliveryAddress: (address: string) => void;
    setPaymentMethod: (method: BookingPaymentMethod) => void;
    createOrder: () => Order;
    extendOrder: (orderId: string, days: number, cost: number, newReturnDate: string) => void;
    cancelOrder: (orderId: string, reason: string, refundAmount: number) => void;
    selectOrder: (order: Order | null) => void;
    updateOrderTracking: (orderId: string, stepKey: string, completed: boolean) => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const useBooking = () => {
    const context = useContext(BookingContext);
    if (!context) throw new Error('useBooking must be used within BookingProvider');
    return context;
};

interface BookingProviderProps {
    children: React.ReactNode;
}

export function BookingProvider({ children }: BookingProviderProps) {
    const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
    const [currentRentalOutfit, setCurrentRentalOutfit] = useState<Outfit | null>(null);
    const [currentRentalDates, setCurrentRentalDates] = useState<{ startDate: string; endDate: string } | null>(null);
    const [currentRentalDays, setCurrentRentalDays] = useState<number>(0);
    const [currentRentalDeliveryOption, setCurrentRentalDeliveryOption] = useState<DeliveryOption>('pickup');
    const [currentRentalAddress, setCurrentRentalAddress] = useState<string>(SAVED_ADDRESSES[0]);
    const [currentRentalPaymentMethod, setCurrentRentalPaymentMethod] = useState<BookingPaymentMethod>('upi');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    const { updateUserProfile } = useBuyer();

    useEffect(() => {
        const activeRentals = orders.filter(o => o.status === 'active' || o.status === 'upcoming' || o.status === 'completed').length;
        updateUserProfile({
            rentalsCount: activeRentals
        });
    }, [orders]);

    const setRentalOutfit = (outfit: Outfit) => {
        setCurrentRentalOutfit(outfit);
    };

    const setRentalDates = (start: string, end: string, days: number) => {
        setCurrentRentalDates({ startDate: start, endDate: end });
        setCurrentRentalDays(days);
    };

    const setDeliveryOption = (option: DeliveryOption) => {
        setCurrentRentalDeliveryOption(option);
    };

    const setDeliveryAddress = (address: string) => {
        setCurrentRentalAddress(address);
    };

    const setPaymentMethod = (method: BookingPaymentMethod) => {
        setCurrentRentalPaymentMethod(method);
    };

    const createOrder = (): Order => {
        if (!currentRentalOutfit || !currentRentalDates) {
            throw new Error('Incomplete booking information');
        }

        const dailyCost = currentRentalOutfit.pricePerDay * currentRentalDays;
        const totalAmount = dailyCost + currentRentalOutfit.securityDeposit;

        const newOrder: Order = {
            id: `ZGS-${Math.floor(10000 + Math.random() * 90000)}`,
            outfit: currentRentalOutfit,
            startDate: currentRentalDates.startDate,
            endDate: currentRentalDates.endDate,
            rentalDays: currentRentalDays,
            status: 'upcoming',
            amount: totalAmount,
            securityDeposit: currentRentalOutfit.securityDeposit,
            deliveryOption: currentRentalDeliveryOption,
            address: currentRentalDeliveryOption === 'home' ? currentRentalAddress : 'Vivekananda Global University, Admin Block Lawn',
            paymentMethod: currentRentalPaymentMethod,
            trackingTimeline: [
                { key: 'confirmed', label: 'Booking Confirmed', date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), description: 'Your rental booking has been verified and confirmed.', completed: true, active: true },
                { key: 'preparing', label: 'Preparing Outfit', description: 'Seller is dry cleaning and packaging the outfit.', completed: false, active: false },
                { key: 'ready_pickup', label: 'Ready for Pickup', description: 'Outfit is ready to be picked up by delivery partner.', completed: false, active: false },
                { key: 'picked_up', label: 'Picked Up', description: 'Delivery courier has received the outfit.', completed: false, active: false },
                { key: 'active', label: 'Rental Active', description: 'Outfit is in your possession. Have a fabulous time!', completed: false, active: false },
                { key: 'return_reminder', label: 'Return Reminder', description: 'Reminder to pack and prepare outfit for return courier.', completed: false, active: false },
                { key: 'returned', label: 'Returned Successfully', description: 'Outfit has been returned to the seller.', completed: false, active: false },
                { key: 'refunded', label: 'Security Deposit Refunded', description: 'Refund has been processed back to your original payment method.', completed: false, active: false }
            ]
        };

        setOrders(prev => [newOrder, ...prev]);
        setSelectedOrder(newOrder); // Automatically select newly created order

        // Clear booking state after creation
        setCurrentRentalOutfit(null);
        setCurrentRentalDates(null);
        setCurrentRentalDays(0);
        setCurrentRentalDeliveryOption('home');
        setCurrentRentalAddress(SAVED_ADDRESSES[0]);
        setCurrentRentalPaymentMethod('upi');

        return newOrder;
    };

    const extendOrder = (orderId: string, days: number, cost: number, newReturnDate: string) => {
        setOrders(prev => prev.map(o => {
            if (o.id === orderId) {
                const updated = {
                    ...o,
                    endDate: newReturnDate,
                    rentalDays: o.rentalDays + days,
                    amount: o.amount + cost,
                    extendedReturnDate: newReturnDate,
                    extensionDays: (o.extensionDays || 0) + days,
                    extensionCost: (o.extensionCost || 0) + cost
                };
                if (selectedOrder?.id === orderId) {
                    setSelectedOrder(updated);
                }
                return updated;
            }
            return o;
        }));
    };

    const cancelOrder = (orderId: string, reason: string, refundAmount: number) => {
        setOrders(prev => prev.map(o => {
            if (o.id === orderId) {
                const updated: Order = {
                    ...o,
                    status: 'cancelled',
                    cancellationReason: reason,
                    cancellationRefund: refundAmount
                };
                if (selectedOrder?.id === orderId) {
                    setSelectedOrder(updated);
                }
                return updated;
            }
            return o;
        }));
    };

    const selectOrder = (order: Order | null) => {
        setSelectedOrder(order);
    };

    const updateOrderTracking = (orderId: string, stepKey: string, completed: boolean) => {
        setOrders(prev => prev.map(o => {
            if (o.id === orderId) {
                let foundTarget = false;
                const updatedTimeline = o.trackingTimeline.map((step, idx) => {
                    const isTarget = step.key === stepKey;
                    if (isTarget) foundTarget = true;

                    // If we are setting completed to true, mark all preceding steps as completed too
                    let stepCompleted = step.completed;
                    if (completed) {
                        if (idx <= o.trackingTimeline.findIndex(s => s.key === stepKey)) {
                            stepCompleted = true;
                        }
                    } else {
                        // If we are setting completed to false, mark all succeeding steps as uncompleted too
                        if (idx >= o.trackingTimeline.findIndex(s => s.key === stepKey)) {
                            stepCompleted = false;
                        }
                    }

                    // Compute dates
                    const todayStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                    return {
                        ...step,
                        completed: stepCompleted,
                        date: stepCompleted ? (step.date || todayStr) : undefined,
                        active: false // We will set active dynamically
                    };
                });

                // Determine active step (first step that is not completed)
                const firstUncompletedIdx = updatedTimeline.findIndex(s => !s.completed);
                if (firstUncompletedIdx !== -1) {
                    updatedTimeline[firstUncompletedIdx].active = true;
                } else {
                    // All completed, so the last step is active
                    updatedTimeline[updatedTimeline.length - 1].active = true;
                }

                // Determine overall status
                let orderStatus = o.status;
                const isConfirmed = updatedTimeline.find(s => s.key === 'confirmed')?.completed;
                const isActive = updatedTimeline.find(s => s.key === 'active')?.completed;
                const isReturned = updatedTimeline.find(s => s.key === 'returned')?.completed;

                if (isReturned) {
                    orderStatus = 'completed';
                } else if (isActive) {
                    orderStatus = 'active';
                } else if (isConfirmed) {
                    orderStatus = 'upcoming';
                }

                const updatedOrder: Order = {
                    ...o,
                    status: orderStatus,
                    trackingTimeline: updatedTimeline
                };

                if (selectedOrder?.id === orderId) {
                    setSelectedOrder(updatedOrder);
                }
                return updatedOrder;
            }
            return o;
        }));
    };

    return (
        <BookingContext.Provider
            value={{
                orders,
                currentRentalOutfit,
                currentRentalDates,
                currentRentalDays,
                currentRentalDeliveryOption,
                currentRentalAddress,
                currentRentalPaymentMethod,
                selectedOrder,
                setRentalOutfit,
                setRentalDates,
                setDeliveryOption,
                setDeliveryAddress,
                setPaymentMethod,
                createOrder,
                extendOrder,
                cancelOrder,
                selectOrder,
                updateOrderTracking
            }}
        >
            {children}
        </BookingContext.Provider>
    );
}
