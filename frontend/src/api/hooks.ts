import { useQuery } from "@tanstack/react-query";
import { api } from "./client";
import type {
  Accessory,
  AccessoryCategory,
  Brand,
  Phone,
  RepairType,
  ApiListResponse,
  ApiItemResponse,
} from "../types";

// ---------- Marques ----------
export function useBrands() {
  return useQuery({
    queryKey: ["brands"],
    queryFn: async () => {
      const { data } = await api.get<ApiItemResponse<Brand[]>>("/brands");
      return data.data;
    },
  });
}

// ---------- Téléphones ----------
export interface PhoneFilters {
  brand?: string;
  condition?: "NEW" | "REFURBISHED";
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  inStock?: boolean;
  page?: number;
  limit?: number;
}

export function usePhones(filters: PhoneFilters = {}) {
  return useQuery({
    queryKey: ["phones", filters],
    queryFn: async () => {
      const params: Record<string, string> = {};
      if (filters.brand) params.brand = filters.brand;
      if (filters.condition) params.condition = filters.condition;
      if (filters.minPrice !== undefined)
        params.minPrice = String(filters.minPrice);
      if (filters.maxPrice !== undefined)
        params.maxPrice = String(filters.maxPrice);
      if (filters.search) params.search = filters.search;
      if (filters.inStock) params.inStock = "true";
      if (filters.page) params.page = String(filters.page);
      if (filters.limit) params.limit = String(filters.limit);

      const { data } = await api.get<ApiListResponse<Phone>>("/phones", {
        params,
      });
      return data;
    },
  });
}

export function usePhone(id: string | undefined) {
  return useQuery({
    queryKey: ["phone", id],
    enabled: !!id,
    queryFn: async () => {
      const { data } = await api.get<ApiItemResponse<Phone>>(`/phones/${id}`);
      return data.data;
    },
  });
}

// ---------- Produits phares (pour le hero) ----------
export function useFeaturedPhones() {
  return useQuery({
    queryKey: ["featured-phones"],
    queryFn: async () => {
      const { data } = await api.get<ApiItemResponse<Phone[]>>(
        "/phones/featured"
      );
      return data.data;
    },
  });
}

// ---------- Accessoires ----------
export interface AccessoryFilters {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  page?: number;
  limit?: number;
}

export function useAccessories(filters: AccessoryFilters = {}) {
  return useQuery({
    queryKey: ["accessories", filters],
    queryFn: async () => {
      const params: Record<string, string> = {};
      if (filters.category) params.category = filters.category;
      if (filters.search) params.search = filters.search;
      if (filters.minPrice !== undefined)
        params.minPrice = String(filters.minPrice);
      if (filters.maxPrice !== undefined)
        params.maxPrice = String(filters.maxPrice);
      if (filters.inStock) params.inStock = "true";
      if (filters.page) params.page = String(filters.page);
      if (filters.limit) params.limit = String(filters.limit);

      const { data } = await api.get<ApiListResponse<Accessory>>(
        "/accessories",
        { params }
      );
      return data;
    },
  });
}

export function useAccessoryCategories() {
  return useQuery({
    queryKey: ["accessory-categories"],
    queryFn: async () => {
      const { data } = await api.get<ApiItemResponse<AccessoryCategory[]>>(
        "/accessories/categories"
      );
      return data.data;
    },
  });
}

// ---------- Réparation ----------
export function useRepairTypes() {
  return useQuery({
    queryKey: ["repair-types"],
    queryFn: async () => {
      const { data } = await api.get<ApiItemResponse<RepairType[]>>(
        "/repairs/types"
      );
      return data.data;
    },
  });
}