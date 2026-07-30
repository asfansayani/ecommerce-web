import Footer from "@/components/common/Footer";
import Header from "@/components/common/Header";

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
      <Header />
      <main>
        {children}
        <Footer locale={locale} />
      </main>
    </>
  );
}
