export interface LoyaltyProgram {
  tier: 'SILVER' | 'GOLD' | 'PLATINUM';
  points: number;
}

export interface Customer {
  customerId: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  loyaltyProgram?: LoyaltyProgram;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateCustomerRequest {
  email?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  loyaltyProgram?: LoyaltyProgram;
}
