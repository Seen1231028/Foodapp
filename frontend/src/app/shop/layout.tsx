import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop Dashboard - ZeenZilla",
  description: "Shop owner dashboard for restaurant management",
};

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}