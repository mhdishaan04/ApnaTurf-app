// This file will hold all our common TypeScript types
export type Turf = {
    id: number;
    name: string;
    location: string;
    price_per_hour: number;
    images: string[];
    sports_available: string[];
    operating_hours: { open: string; close: string };
  };

  export type Booking = {
    id: number;
    turf_id: number;
    user_id: string;
    start_time: string;
    end_time: string;
  };