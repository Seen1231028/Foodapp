import { Providers } from "@/components/Providers";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers toasterPosition="bottom-center">
      {children}
    </Providers>
  );
}