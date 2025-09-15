import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard - ZeenZilla",
  description: "Restaurant management system for administrators",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}