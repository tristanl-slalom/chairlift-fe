import axios, { AxiosError } from 'axios';
import { Flight, SearchFlightsParams } from '../types/flight.types';
import { Customer, UpdateCustomerRequest } from '../types/customer.types';
import { Booking, CreateBookingRequest } from '../types/booking.types';
import { BookingDetails, CustomerDashboard } from '../types/aggregated.types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Error handling helper
function handleApiError(error: unknown): never {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ error?: string }>;
    const message = axiosError.response?.data?.error || axiosError.message || 'An error occurred';
    throw new Error(message);
  }
  throw error;
}

// Flights API
export const flightsApi = {
  async searchFlights(params: SearchFlightsParams): Promise<Flight[]> {
    try {
      const response = await apiClient.get<Flight[]>('/flights', { params });
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  async getFlight(id: string): Promise<Flight> {
    try {
      const response = await apiClient.get<Flight>(`/flights/${id}`);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  }
};

// Customers API
export const customersApi = {
  async getCustomer(id: string): Promise<Customer> {
    try {
      const response = await apiClient.get<Customer>(`/customers/${id}`);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  async getCustomerDashboard(id: string): Promise<CustomerDashboard> {
    try {
      const response = await apiClient.get<CustomerDashboard>(`/customers/${id}/dashboard`);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  async updateCustomer(id: string, data: UpdateCustomerRequest): Promise<Customer> {
    try {
      const response = await apiClient.put<Customer>(`/customers/${id}`, data);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  }
};

// Bookings API
export const bookingsApi = {
  async createBooking(data: CreateBookingRequest): Promise<Booking> {
    try {
      const response = await apiClient.post<Booking>('/bookings', data);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  async getBookingDetails(id: string): Promise<BookingDetails> {
    try {
      const response = await apiClient.get<BookingDetails>(`/bookings/${id}/details`);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  async listCustomerBookings(customerId: string): Promise<Booking[]> {
    try {
      const response = await apiClient.get<Booking[]>(`/customers/${customerId}/bookings`);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  }
};
