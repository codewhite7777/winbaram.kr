import { Header, Footer, LeftSidebar, RightSidebar, MainContent } from "@/components/layout";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 flex max-w-6xl mx-auto w-full">
        <LeftSidebar />
        <MainContent />
        <RightSidebar />
      </div>

      <Footer />
    </div>
  );
}
