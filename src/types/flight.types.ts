export interface Flight {
  flightId: string;
  flightNumber: string;
  airline: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  availableSeats: number;
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
