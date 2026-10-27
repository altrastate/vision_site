"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { jobsPath } from "@/lib/jobs/filters";

export function JobSearchForm({ defaultQuery = "" }: { defaultQuery?: string }) {
  const router = useRouter();
  const [query, setQuery] = useState(defaultQuery);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push(jobsPath({ q: query.trim(), page: 1 }));
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-xl border border-white/15 bg-white p-4 shadow-[var(--shadow-card)] sm:p-5"
    >
      <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
        <div className="space-y-2">
          <Label htmlFor="job-query">Search jobs</Label>
          <Input
            id="job-query"
            name="q"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Role, company, or keywords"
            autoComplete="off"
          />
        </div>
        <Button type="submit" variant="accent" className="w-full sm:w-auto">
          <Search className="h-4 w-4" aria-hidden="true" />
          Search jobs
        </Button>
      </div>
    </form>
  );
}
