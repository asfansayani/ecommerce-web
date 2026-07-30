"use client";

import { useEffect, useId, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FormField } from "@/components/ui/form-field";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createAddress, updateAddress } from "@/lib/api/address";
import { getCitiesByCountryId, getCountries } from "@/lib/api/countries";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "@/i18n/navigation";
import type { Address, AddressPayload, City, Country } from "@/types/address";

export type AddressFormValues = {
  firstName: string;
  lastName: string;
  addressLine1: string;
  addressLine2: string;
  country: string;
  city: string;
  phone: string;
  email: string;
  isDefault: boolean;
};

type AddressFormProps = {
  mode: "create" | "edit";
  addressId?: string | number;
  initialValues?: Address;
};

export default function AddressForm({
  mode,
  addressId,
  initialValues,
}: AddressFormProps) {
  const router = useRouter();
  const token = useAuthStore((s) => s.token);
  const defaultCheckboxId = useId();

  const [countries, setCountries] = useState<Country[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCountryId, setSelectedCountryId] = useState<number | null>(
    null
  );
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [loadingCities, setLoadingCities] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<AddressFormValues>({
    defaultValues: {
      firstName: initialValues?.firstName ?? "",
      lastName: initialValues?.lastName ?? "",
      addressLine1: initialValues?.addressLine1 ?? "",
      addressLine2: initialValues?.addressLine2 ?? "",
      country: initialValues?.country ?? "",
      city: initialValues?.city ?? "",
      phone: initialValues?.phone ?? "",
      email: initialValues?.email ?? "",
      isDefault: initialValues?.isDefault ?? false,
    },
  });

  useEffect(() => {
    let cancelled = false;

    async function loadCountries() {
      setLoadingCountries(true);
      try {
        const response = await getCountries();
        if (cancelled) return;
        const list = response?.data ?? [];
        setCountries(list);

        const initialCountryName = initialValues?.country;
        if (initialCountryName) {
          const match = list.find((c) => c.name === initialCountryName);
          if (match) setSelectedCountryId(match.id);
        }
      } catch {
        if (!cancelled) {
          toast.error("Unable to load countries");
        }
      } finally {
        if (!cancelled) setLoadingCountries(false);
      }
    }

    loadCountries();
    return () => {
      cancelled = true;
    };
  }, [initialValues?.country]);

  useEffect(() => {
    if (!selectedCountryId) {
      setCities([]);
      return;
    }

    let cancelled = false;

    async function loadCities() {
      setLoadingCities(true);
      try {
        const response = await getCitiesByCountryId(selectedCountryId!);
        if (cancelled) return;
        setCities(response?.data ?? []);
      } catch {
        if (!cancelled) {
          toast.error("Unable to load cities");
          setCities([]);
        }
      } finally {
        if (!cancelled) setLoadingCities(false);
      }
    }

    loadCities();
    return () => {
      cancelled = true;
    };
  }, [selectedCountryId]);

  const onSubmit = async (data: AddressFormValues) => {
    if (!token) {
      toast.error("You must be signed in to save an address.");
      return;
    }

    const payload: AddressPayload = {
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      addressLine1: data.addressLine1.trim(),
      addressLine2: data.addressLine2.trim() || undefined,
      country: data.country,
      city: data.city,
      phone: data.phone.trim(),
      email: data.email.trim(),
      isDefault: data.isDefault,
    };

    try {
      if (mode === "edit" && addressId != null) {
        const response = await updateAddress(addressId, payload, token);
        toast.success(response.message || "Address updated successfully");
      } else {
        const response = await createAddress(payload, token);
        toast.success(response.message || "Address created successfully");
      }
      router.push("/address");
      router.refresh();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to save address";
      toast.error(message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-5 rounded-lg border border-border bg-white p-6 md:p-8"
      noValidate
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <FormField
          label="First Name"
          placeholder="First name"
          autoComplete="given-name"
          error={errors.firstName?.message}
          {...register("firstName", {
            required: "First name is required",
            minLength: {
              value: 2,
              message: "First name must be at least 2 characters",
            },
          })}
        />

        <FormField
          label="Last Name"
          placeholder="Last name"
          autoComplete="family-name"
          error={errors.lastName?.message}
          {...register("lastName", {
            required: "Last name is required",
            minLength: {
              value: 2,
              message: "Last name must be at least 2 characters",
            },
          })}
        />
      </div>

      <FormField
        label="Address Line 1"
        placeholder="Street address"
        autoComplete="address-line1"
        error={errors.addressLine1?.message}
        {...register("addressLine1", {
          required: "Address line 1 is required",
        })}
      />

      <FormField
        label="Address Line 2"
        placeholder="Apartment, suite, etc. (optional)"
        autoComplete="address-line2"
        error={errors.addressLine2?.message}
        {...register("addressLine2")}
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Controller
          name="country"
          control={control}
          rules={{ required: "Country is required" }}
          render={({ field }) => (
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium text-primary">
                Country
              </Label>
              <Select
                value={field.value || null}
                onValueChange={(value) => {
                  const name = value ?? "";
                  field.onChange(name);
                  setValue("city", "");
                  const match = countries.find((c) => c.name === name);
                  setSelectedCountryId(match?.id ?? null);
                }}
                disabled={loadingCountries}
              >
                <SelectTrigger
                  className="h-11 w-full rounded-md"
                  aria-invalid={!!errors.country}
                >
                  <SelectValue
                    placeholder={
                      loadingCountries
                        ? "Loading countries..."
                        : "Select country"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country.id} value={country.name}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.country?.message ? (
                <p className="text-xs text-destructive" role="alert">
                  {errors.country.message}
                </p>
              ) : null}
            </div>
          )}
        />

        <Controller
          name="city"
          control={control}
          rules={{ required: "City is required" }}
          render={({ field }) => (
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium text-primary">City</Label>
              <Select
                key={selectedCountryId ?? "no-country"}
                value={field.value || null}
                onValueChange={(value) => field.onChange(value ?? "")}
                disabled={!selectedCountryId || loadingCities}
              >
                <SelectTrigger
                  className="h-11 w-full rounded-md"
                  aria-invalid={!!errors.city}
                >
                  <SelectValue
                    placeholder={
                      !selectedCountryId
                        ? "Select a country first"
                        : loadingCities
                          ? "Loading cities..."
                          : "Select city"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city.id} value={city.name}>
                      {city.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.city?.message ? (
                <p className="text-xs text-destructive" role="alert">
                  {errors.city.message}
                </p>
              ) : null}
            </div>
          )}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <FormField
          label="Phone"
          type="tel"
          placeholder="+971501234567"
          autoComplete="tel"
          error={errors.phone?.message}
          {...register("phone", {
            required: "Phone is required",
          })}
        />

        <FormField
          label="Email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          error={errors.email?.message}
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Please enter a valid email",
            },
          })}
        />
      </div>



      <Controller
        name="isDefault"
        control={control}
        render={({ field }) => (
          <div className="flex items-center gap-3">
            <Checkbox
              id={defaultCheckboxId}
              checked={field.value}
              onCheckedChange={(checked) => field.onChange(checked === true)}
            />
            <Label
              htmlFor={defaultCheckboxId}
              className="cursor-pointer text-sm font-medium text-primary"
            >
              Set as default address
            </Label>
          </div>
        )}
      />

      <div className="flex flex-wrap gap-3 pt-1">
        <Button type="submit" disabled={isSubmitting} className="px-6">
          {isSubmitting
            ? mode === "edit"
              ? "Saving..."
              : "Creating..."
            : mode === "edit"
              ? "Save Changes"
              : "Add Address"}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="px-6"
          onClick={() => router.push("/address")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
