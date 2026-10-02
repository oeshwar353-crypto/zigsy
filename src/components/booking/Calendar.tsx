import React, { useState, useMemo } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarProps {
    pricePerDay: number;
    currency: string;
    onDateSelect: (startDate: string, endDate: string, totalDays: number) => void;
    initialStartDate?: string;
    initialEndDate?: string;
}

export default function Calendar({
    pricePerDay,
    currency,
    onDateSelect,
    initialStartDate,
    initialEndDate
}: CalendarProps) {
    // Generate dates for June 2026
    const calendarDays = useMemo(() => {
        const days = [];
        // June 2026 starts on a Monday (1st) and has 30 days
        for (let i = 1; i <= 30; i++) {
            days.push(i);
        }
        return days;
    }, []);

    const parseDayStr = (dateStr?: string): number | null => {
        if (!dateStr) return null;
        const matches = dateStr.match(/2026-06-(\d+)/);
        return matches ? parseInt(matches[1], 10) : null;
    };

    const formatDayStr = (dayNum: number): string => {
        return `2026-06-${dayNum.toString().padStart(2, '0')}`;
    };

    const [selectedRange, setSelectedRange] = useState<{ start: number | null; end: number | null }>({
        start: parseDayStr(initialStartDate),
        end: parseDayStr(initialEndDate)
    });

    const rentalDaysCount = useMemo(() => {
        const { start, end } = selectedRange;
        if (start && end) {
            return end - start + 1;
        }
        return 0;
    }, [selectedRange]);

    const subtotal = useMemo(() => {
        return rentalDaysCount * pricePerDay;
    }, [rentalDaysCount, pricePerDay]);

    const dateRangeString = useMemo(() => {
        const { start, end } = selectedRange;
        if (start && end) {
            return `Jun ${start} - Jun ${end}, 2026`;
        }
        if (start) {
            return `Starting Jun ${start}, 2026`;
        }
        return 'Select Dates';
    }, [selectedRange]);

    const handleDayClick = (day: number) => {
        setSelectedRange(prev => {
            let nextRange;
            if (!prev.start || (prev.start && prev.end)) {
                // First click or reset
                nextRange = { start: day, end: null };
            } else if (prev.start && !prev.end) {
                if (day < prev.start) {
                    // If clicked day is before start, set as new start
                    nextRange = { start: day, end: null };
                } else {
                    // Set as end
                    nextRange = { start: prev.start, end: day };
                    // Trigger date select callback
                    onDateSelect(
                        formatDayStr(prev.start),
                        formatDayStr(day),
                        day - prev.start + 1
                    );
                }
            } else {
                nextRange = { start: day, end: null };
            }
            return nextRange;
        });
    };

    return (
        <div className="bg-white p-5 rounded-3xl border border-surface-container shadow-md flex flex-col justify-between w-full">
            <div>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-extrabold text-sm flex items-center gap-2 text-on-surface">
                        <CalendarDays className="w-4 h-4 text-primary" />
                        Select Dates (June 2026)
                    </h3>
                    <div className="flex gap-1.5">
                        <button className="p-1 rounded-lg hover:bg-surface-container text-on-surface-variant cursor-pointer transition-colors"><ChevronLeft className="w-5 h-5" /></button>
                        <button className="p-1 rounded-lg hover:bg-surface-container text-on-surface-variant cursor-pointer transition-colors"><ChevronRight className="w-5 h-5" /></button>
                    </div>
                </div>

                {/* Calendar Grid Header */}
                <div className="grid grid-cols-7 gap-y-3 text-center mb-2">
                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((dayName, idx) => (
                        <span key={idx} className="text-xs font-bold text-on-surface-variant/70 uppercase">
                            {dayName}
                        </span>
                    ))}
                </div>

                {/* Calendar Days (Grid) */}
                <div className="grid grid-cols-7 gap-y-2 text-center text-sm font-semibold">
                    {calendarDays.map((day) => {
                        const { start, end } = selectedRange;
                        const isStart = start === day;
                        const isEnd = end === day;
                        const inRange = start && end && day > start && day < end;

                        let dayClass = 'py-1.5 hover:bg-surface-container rounded-lg cursor-pointer transition-all duration-150 ';

                        if (isStart) {
                            dayClass += 'bg-primary text-white font-bold rounded-l-full rounded-r-none scale-105 shadow-sm';
                        } else if (isEnd) {
                            dayClass += 'bg-primary text-white font-bold rounded-r-full rounded-l-none scale-105 shadow-sm';
                        } else if (inRange) {
                            dayClass += 'bg-primary/10 text-primary font-semibold rounded-none';
                        } else {
                            dayClass += 'text-on-surface font-medium';
                        }

                        return (
                            <div
                                key={day}
                                onClick={() => handleDayClick(day)}
                                className={dayClass}
                            >
                                {day}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Subtotal Display */}
            {rentalDaysCount > 0 && (
                <div className="mt-5 pt-5 border-t border-surface-container flex justify-between items-center animate-slide-up">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Subtotal</span>
                        <span className="font-extrabold text-lg text-primary">
                            {currency}{subtotal.toLocaleString()}{' '}
                            <span className="text-xs font-medium text-on-surface-variant">({rentalDaysCount} {rentalDaysCount === 1 ? 'day' : 'days'})</span>
                        </span>
                    </div>
                    <div className="text-right">
                        <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">Selected Dates</span>
                        <span className="font-bold text-xs text-on-surface">{dateRangeString}</span>
                    </div>
                </div>
            )}
        </div>
    );
}
