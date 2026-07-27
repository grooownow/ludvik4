import type { Metadata } from "next";
import { SignInPage } from "@/features/auth";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

interface SignInProps {
  searchParams: Promise<{ callbackUrl?: string | string[] }>;
}

export default async function SignIn({ searchParams }: SignInProps) {
  const { callbackUrl } = await searchParams;
  return <SignInPage callbackUrl={callbackUrl} />;
}
