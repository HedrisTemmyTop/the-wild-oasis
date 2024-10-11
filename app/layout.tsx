import Header from "./_components/Header";
import { ReservationProvider } from "./_components/ReservationContext";

import "./_styles/globals.css";
import { Josefin_Sans } from "next/font/google";
const josefin = Josefin_Sans({
  subsets: ["latin"],
  display: "swap",
});
export const metadata = {
  title: {
    template: "%s The Wild Oasis",
    default: "Welcome / The Wild Oasis",
  },
  description: "Luxurious cabin hotel, located in the heart of ikire",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${josefin.className} antialiased bg-primary-950 text-primary-100 min-h-screen flex flex-col`}
      >
        <Header />
        <div className="flex-1 px-8 py-12">
          <ReservationProvider>
            <main className="max-w-7xl mx-auto">{children}</main>
          </ReservationProvider>
        </div>
      </body>
    </html>
  );
}
