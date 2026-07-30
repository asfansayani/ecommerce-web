"use client";

import { useEffect, useId, useState } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAuthStore } from "@/store/authStore";
import type { UpdateNotificationPreferencePayload } from "@/types/auth";

type PreferenceKey = keyof UpdateNotificationPreferencePayload;

const preferences: {
  key: PreferenceKey;
  label: string;
}[] = [
  { key: "pushPromotional", label: "Push Notification" },
  { key: "inAppPromotional", label: "News and updates" },
  { key: "inAppSystem", label: "In-app system" },
];

const defaultValues: UpdateNotificationPreferencePayload = {
  pushPromotional: true,
  inAppPromotional: true,
  inAppSystem: true,
};

export default function NotificationPreferences() {
  const baseId = useId();
  const user = useAuthStore((s) => s.user);
  const updateNotificationPreferences = useAuthStore(
    (s) => s.updateNotificationPreferences
  );
  const isLoading = useAuthStore((s) => s.isLoading);

  const [values, setValues] =
    useState<UpdateNotificationPreferencePayload>(defaultValues);
  const [updatingKey, setUpdatingKey] = useState<PreferenceKey | null>(null);

  useEffect(() => {
    const prefs = user?.userNotificationPref;
    if (!prefs) return;

    setValues({
      pushPromotional: prefs.pushPromotional ?? true,
      inAppPromotional: prefs.inAppPromotional ?? true,
      inAppSystem: prefs.inAppSystem ?? true,
    });
  }, [user]);

  const handleToggle = async (key: PreferenceKey, checked: boolean) => {
    const previous = values;
    const next = { ...values, [key]: checked };
    setValues(next);
    setUpdatingKey(key);

    try {
      await updateNotificationPreferences(next);
    } catch {
      setValues(previous);
    } finally {
      setUpdatingKey(null);
    }
  };

  return (
    <div className="rounded-lg border border-border bg-white p-6 md:p-8">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-primary">
          Notification Preference
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Choose how you want to hear from us.
        </p>
      </div>

      <div className="flex flex-col divide-y divide-border">
        {preferences.map((item) => {
          const id = `${baseId}-${item.key}`;

          return (
            <div
              key={item.key}
              className="flex items-center justify-between gap-4 py-5 first:pt-0 last:pb-0"
            >
              <Label
                htmlFor={id}
                className="cursor-pointer text-base font-semibold text-primary"
              >
                {item.label}
              </Label>
              <Switch
                id={id}
                checked={values[item.key]}
                disabled={isLoading && updatingKey === item.key}
                onCheckedChange={(checked) =>
                  handleToggle(item.key, checked === true)
                }
                className="data-checked:bg-tertiary"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
