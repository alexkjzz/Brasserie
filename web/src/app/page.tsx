import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="flex justify-center items-start w-full p-8">
      <div className="grid grid-cols-[2fr_auto_2fr] gap-10 w-full max-w-5xl mt-16">
        <div className="pr-8">
        </div>
        <div className="hidden md:block bg-stone-500 w-px h-full mx-auto"></div>
        <div className="pl-8">
        </div>
      </div>
      <Footer  />
    </main>
  );
}











