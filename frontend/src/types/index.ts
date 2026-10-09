export interface Brand {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  _count?: { phones: number };
}

export interface Phone {
  id: string;
  brandId: string;
  brand: Brand;
  model: string;
  storage?: string;
  color?: string;
  condition: "NEW" | "REFURBISHED";
  price: number;
  stock: number;
  description?: string;
  images: string[];
  warrantyMonths: number;
  isActive: boolean;
  createdAt: string;
}

export interface AccessoryCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  _count?: { accessories: number };
}

export interface Accessory {
  id: string;
  categoryId: string;
  category: AccessoryCategory;
  name: string;
  description?: string;
  price: number;
  stock: number;
  images: string[];
  isActive: boolean;
  createdAt: string;
}

export interface RepairType {
  id: string;
  name: string;
  slug: string;
  description?: string;
  basePrice: number;
  estimatedDuration?: string;
  imageUrl?: string;
  isActive: boolean;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: "CLIENT" | "ADMIN";
}

export interface ApiListResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiItemResponse<T> {
  data: T;
}