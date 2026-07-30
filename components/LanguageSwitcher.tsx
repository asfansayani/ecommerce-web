"use client";

import { usePathname, useRouter } from "@/i18n/navigation";

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();

  console.log(pathname);

  return (
    <>
      <button onClick={() => router.replace(pathname, { locale: "en" })}>
        EN
      </button>

      <button onClick={() => router.replace(pathname, { locale: "ar" })}>
        AR
      </button>
    </>
  );
}