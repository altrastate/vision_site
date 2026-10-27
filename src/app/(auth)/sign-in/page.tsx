import { redirect } from "next/navigation";

import { loginPath } from "@/lib/auth/redirects";

type PageProps = {
  searchParams: Promise<{ next?: string }>;
};

export default async function SignInRedirect({ searchParams }: PageProps) {
  const params = await searchParams;
  redirect(loginPath(params.next));
}
