"use client";

import { useEffect, useState } from "react";
import {
  Controller,
  type Control,
  type FieldErrors,
  type FieldPath,
  type UseFormRegister,
  type UseFormSetValue,
  type UseFormWatch,
} from "react-hook-form";
import { toast } from "sonner";
import { FormField } from "@/components/ui/form-field";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getCitiesByCountryId, getCountries } from "@/lib/api/countries";
import type { CheckoutAddressFields as AddressShape } from "@/lib/checkout-storage";
import type { City, Country } from "@/types/address";

export type CheckoutAddressFormGroup = {
  shipping: AddressShape;
  billing: AddressShape;
  useDifferentBilling: boolean;
};

type Props = {
  namePrefix: "shipping" | "billing";
  register: UseFormRegister<CheckoutAddressFormGroup>;
  control: Control<CheckoutAddressFormGroup>;
  setValue: UseFormSetValue<CheckoutAddressFormGroup>;
  watch: UseFormWatch<CheckoutAddressFormGroup>;
  errors: FieldErrors<CheckoutAddressFormGroup>;
};

export default function CheckoutAddressFields({
  namePrefix,
  register,
  control,
  setValue,
  watch,
  errors,
}: Props) {
  const autoCompletePrefix = namePrefix;
  const [countries, setCountries] = useState<Country[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCountryId, setSelectedCountryId] = useState<number | null>(
    null,
  );
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [loadingCities, setLoadingCities] = useState(false);

  const countryValue = watch(`${namePrefix}.country`);

  useEffect(() => {
    let cancelled = false;

    async function loadCountries() {
      setLoadingCountries(true);
      try {
        const response = await getCountries();
        if (cancelled) return;
        setCountries(response?.data ?? []);
      } catch {
        if (!cancelled) toast.error("Unable to load countries");
      } finally {
        if (!cancelled) setLoadingCountries(false);
      }
    }

    loadCountries();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!countries.length || !countryValue) return;
    const match = countries.find((c) => c.name === countryValue);
    setSelectedCountryId(match?.id ?? null);
  }, [countries, countryValue]);

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

  const groupErrors = errors[namePrefix];

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <FormField
          label="First Name"
          placeholder="First name"
          autoComplete={`${autoCompletePrefix} given-name`}
          error={groupErrors?.firstName?.message}
          {...register(`${namePrefix}.firstName`, {
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
          autoComplete={`${autoCompletePrefix} family-name`}
          error={groupErrors?.lastName?.message}
          {...register(`${namePrefix}.lastName`, {
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
        autoComplete={`${autoCompletePrefix} address-line1`}
        error={groupErrors?.addressLine1?.message}
        {...register(`${namePrefix}.addressLine1`, {
          required: "Address line 1 is required",
        })}
      />

      <FormField
        label="Address Line 2"
        placeholder="Apartment, suite, etc. (optional)"
        autoComplete={`${autoCompletePrefix} address-line2`}
        error={groupErrors?.addressLine2?.message}
        {...register(`${namePrefix}.addressLine2`)}
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Controller
          name={`${namePrefix}.country` as FieldPath<CheckoutAddressFormGroup>}
          control={control}
          rules={{ required: "Country is required" }}
          render={({ field }) => (
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium text-primary">
                Country
              </Label>
              <Select
                value={(field.value as string) || null}
                onValueChange={(value) => {
                  const name = value ?? "";
                  field.onChange(name);
                  setValue(`${namePrefix}.city`, "");
                  const match = countries.find((c) => c.name === name);
                  setSelectedCountryId(match?.id ?? null);
                }}
                disabled={loadingCountries}
              >
                <SelectTrigger
                  className="h-11 w-full rounded-md"
                  aria-invalid={!!groupErrors?.country}
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
              {groupErrors?.country?.message ? (
                <p className="text-xs text-destructive" role="alert">
                  {groupErrors.country.message}
                </p>
              ) : null}
            </div>
          )}
        />

        <Controller
          name={`${namePrefix}.city` as FieldPath<CheckoutAddressFormGroup>}
          control={control}
          rules={{ required: "City is required" }}
          render={({ field }) => (
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium text-primary">City</Label>
              <Select
                key={selectedCountryId ?? "no-country"}
                value={(field.value as string) || null}
                onValueChange={(value) => field.onChange(value ?? "")}
                disabled={!selectedCountryId || loadingCities}
              >
                <SelectTrigger
                  className="h-11 w-full rounded-md"
                  aria-invalid={!!groupErrors?.city}
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
              {groupErrors?.city?.message ? (
                <p className="text-xs text-destructive" role="alert">
                  {groupErrors.city.message}
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
          placeholder="+971521112233"
          autoComplete={`${autoCompletePrefix} tel`}
          error={groupErrors?.phone?.message}
          {...register(`${namePrefix}.phone`, {
            required: "Phone is required",
          })}
        />
        <FormField
          label="Postal code"
          placeholder="00000"
          autoComplete={`${autoCompletePrefix} postal-code`}
          error={groupErrors?.postalCode?.message}
          {...register(`${namePrefix}.postalCode`)}
        />
      </div>

      <FormField
        label="Email"
        type="email"
        placeholder="you@example.com"
        autoComplete={`${autoCompletePrefix} email`}
        error={groupErrors?.email?.message}
        {...register(`${namePrefix}.email`, {
          required: "Email is required",
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: "Please enter a valid email",
          },
        })}
      />
    </div>
  );
}
