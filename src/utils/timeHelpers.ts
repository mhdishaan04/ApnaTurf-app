import { Booking } from '../types';

// Generates 1-hour time slots for a given date from 6 AM to 10 PM
export const generateTimeSlots = (date: Date): Date[] => {
  const slots: Date[] = [];
  const day = new Date(date);
  day.setHours(6, 0, 0, 0); // Start at 6 AM

  for (let i = 0; i < 17; i++) { // 17 slots from 6 AM to 10 PM
    slots.push(new Date(day));
    day.setHours(day.getHours() + 1);
  }
  return slots;
};

// Checks which time slots are already booked
export const getBookedSlots = (slots: Date[], bookings: Booking[]): Set<string> => {
  const bookedSlots = new Set<string>();
  if (!bookings) return bookedSlots;

  for (const booking of bookings) {
    const startTime = new Date(booking.start_time).toISOString();
    bookedSlots.add(startTime);
  }
  return bookedSlots;
};