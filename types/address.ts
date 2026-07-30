import type { Pagination } from "@/types/common";

export type Address = {
  id: number;
  firstName: string;
  lastName: string;
  addressLine1: string;
  addressLine2: string;
  country: string;
  city: string;
  postalCode?: string;
  phone: string;
  email: string;
  isDefault: boolean;
  createdAt?: string;
  updatedAt?: string;
  userId?: number;
};

export type AddressPayload = {
  firstName: string;
  lastName: string;
  addressLine1: string;
  addressLine2?: string;
  country: string;
  city: string;
  phone: string;
  email: string;
  isDefault?: boolean;
};

export type AddressesResponse = {
  message?: string;
  success?: boolean;
  data: Address[];
  meta?: Pagination;
};

export type AddressResponse = {
  message?: string;
  success?: boolean;
  data: Address;
};

export type Country = {
  id: number;
  name: string;
  code: string;
};

export type City = {
  id: number;
  name: string;
};

export type CountriesResponse = {
  message?: string;
  success?: boolean;
  data: Country[];
};

export type CitiesResponse = {
  message?: string;
  success?: boolean;
  data: City[];
};
