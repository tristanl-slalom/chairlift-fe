export interface SeatCapacity {
  economy: number;
  business: number;
  first: number;
}

export interface Pricing {
  economy: number;
  business: number;
  first: number;
}

export interface Flight {
  flightId: string;
  flightNumber: string;
  airlineCode: string;
  origin: string;
  destination: string;
  departureDate: string;
  departureTime: string;
  arrivalDate: string;
  arrivalTime: string;
  duration: number;
  aircraft: string;
  capacity: SeatCapacity;
  availableSeats: SeatCapacity;
  pricing: Pricing;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface SearchFlightsParams {
  origin?: string;
  destination?: string;
  departureDate?: string;
  minPrice?: number;
  maxPrice?: number;
}
