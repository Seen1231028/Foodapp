import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Customer Dashboard - ZeenZilla",
  description: "Customer dashboard for food ordering",
};

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}