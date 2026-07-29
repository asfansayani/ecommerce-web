import Footer from "@/app/components/common/Footer";

export default async function WebsiteLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {

  const { locale } = await params;
  return (
    <>
      <main>
        {children}
        <Footer locale={locale} />
      </main>
    </>
  );
}
