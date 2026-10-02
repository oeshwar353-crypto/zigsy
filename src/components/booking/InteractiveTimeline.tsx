import React from 'react';
import { Order, TrackingStep } from '../../types';
import { useBooking } from './BookingContext';
import { CheckCircle2, Circle, AlertCircle, Play } from 'lucide-react';

interface InteractiveTimelineProps {
    order: Order;
}

export default function InteractiveTimeline({ order }: InteractiveTimelineProps) {
    const { updateOrderTracking } = useBooking();

    const handleToggleStep = (stepKey: string, isCompleted: boolean) => {
        updateOrderTracking(order.id, stepKey, isCompleted);
    };

    return (
        <div className="bg-white rounded-3xl p-6 border border-surface-container shadow-sm flex flex-col gap-6">
            <div className="flex justify-between items-center pb-4 border-b border-surface-container">
                <div>
                    <h3 className="font-extrabold text-sm text-on-surface">Order Tracking</h3>
                    <p className="text-xs text-on-surface-variant">ID: {order.id}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${
                    order.status === 'active' 
                        ? 'bg-green-100 text-green-700' 
                        : order.status === 'completed'
                        ? 'bg-blue-100 text-blue-700'
                        : order.status === 'cancelled'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-yellow-100 text-yellow-700'
                }`}>
                    {order.status}
                </span>
            </div>

            {/* Timeline Steps */}
            <div className="relative pl-8 space-y-8">
                {/* Vertical Line */}
                <div className="absolute left-[13px] top-2 bottom-2 w-0.5 bg-surface-container-highest"></div>

                {order.trackingTimeline.map((step, idx) => {
                    const isCompleted = step.completed;
                    const isActive = step.active;

                    // Connector line highlight
                    const showHighlightConnector = isCompleted && idx < order.trackingTimeline.length - 1 && order.trackingTimeline[idx + 1].completed;

                    return (
                        <div key={step.key} className="relative flex gap-4 items-start">
                            {/* Highlight connector line section */}
                            {showHighlightConnector && (
                                <div className="absolute -left-[27px] top-6 h-[40px] w-0.5 bg-primary z-10"></div>
                            )}

                            {/* Node Icon */}
                            <div className="absolute -left-[27px] top-1 z-20 flex items-center justify-center">
                                {isCompleted ? (
                                    <CheckCircle2 className="w-7 h-7 text-primary bg-white rounded-full" />
                                ) : isActive ? (
                                    <div className="relative">
                                        <Circle className="w-7 h-7 text-primary fill-primary/10 bg-white rounded-full animate-pulse" />
                                        <div className="absolute inset-1.5 w-4 h-4 bg-primary rounded-full animate-ping"></div>
                                    </div>
                                ) : (
                                    <Circle className="w-7 h-7 text-on-surface-variant/40 bg-white rounded-full" />
                                )}
                            </div>

                            {/* Text Info */}
                            <div className="flex-grow">
                                <div className="flex justify-between items-baseline">
                                    <h4 className={`text-sm font-bold ${isCompleted ? 'text-on-surface' : isActive ? 'text-primary' : 'text-on-surface-variant/60'}`}>
                                        {step.label}
                                    </h4>
                                    {step.date && (
                                        <span className="text-[10px] font-semibold text-on-surface-variant/75">
                                            {step.date}
                                        </span>
                                    )}
                                </div>
                                <p className={`text-xs mt-1 leading-relaxed ${isCompleted ? 'text-on-surface-variant' : isActive ? 'text-on-surface-variant font-medium' : 'text-on-surface-variant/40'}`}>
                                    {step.description}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Simulation Dashboard Controls */}
            {order.status !== 'cancelled' && (
                <div className="mt-4 pt-6 border-t border-surface-container bg-surface-container-low p-4 rounded-2xl border border-dashed border-primary/20">
                    <div className="flex items-center gap-2 mb-3 text-primary font-bold text-xs">
                        <AlertCircle className="w-4 h-4" />
                        <span>Interactive Simulator (Admin Demo Controls)</span>
                    </div>
                    <p className="text-[10px] text-on-surface-variant mb-4 leading-relaxed">
                        Use these controls to simulate courier actions, dry cleaning processes, and delivery statuses to see the real-time tracking timeline update.
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                        {order.trackingTimeline.map((step) => {
                            const isCompleted = step.completed;
                            return (
                                <button
                                    key={step.key}
                                    onClick={() => handleToggleStep(step.key, !isCompleted)}
                                    className={`py-2 px-3 rounded-xl font-bold text-[10px] transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                                        isCompleted 
                                            ? 'bg-primary/10 text-primary border border-primary/25 hover:bg-primary/20' 
                                            : 'bg-white text-on-surface border border-surface-container hover:bg-surface-container'
                                    }`}
                                >
                                    <Play className={`w-3 h-3 ${isCompleted ? 'rotate-90 text-primary' : 'text-on-surface-variant'}`} />
                                    <span>{isCompleted ? 'Undo ' : 'Complete '} {step.label.replace('Successfully', '').replace('Confirmed', '')}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
