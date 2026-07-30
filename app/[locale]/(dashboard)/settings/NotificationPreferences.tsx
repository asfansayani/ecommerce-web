"use client";

import { useId, useState } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

type PreferenceKey = "newsUpdates" | "pushNotification" | "emailNotification";

const preferences: {
  key: PreferenceKey;
  label: string;
}[] = [
  { key: "newsUpdates", label: "News and updates" },
  { key: "pushNotification", label: "Push Notification" },
  { key: "emailNotification", label: "Email Notification" },
];

export default function NotificationPreferences() {
  const baseId = useId();
  const [values, setValues] = useState<Record<PreferenceKey, boolean>>({
    newsUpdates: true,
    pushNotification: true,
    emailNotification: true,
  });

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
                onCheckedChange={(checked) =>
                  setValues((prev) => ({ ...prev, [item.key]: checked }))
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
