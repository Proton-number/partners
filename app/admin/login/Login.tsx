"use client";

import { SyntheticEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/submitClient";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      return;
    }

    router.refresh();
    router.push("/admin");
  }

  return (
    <main className="mx-auto max-w-md p-8 min-h-screen flex items-center justify-center flex-col">
      <Card className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-lg shadow-slate-200/60 dark:shadow-slate-950/30">
        <h1 className="mb-6 text-2xl font-bold tracking-tight text-foreground">
          Login
        </h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-md border border-input bg-background p-3 text-foreground placeholder:text-muted-foreground"
            required
          />

          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-md border border-input bg-background p-3 text-foreground placeholder:text-muted-foreground"
            required
          />

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button
            type="submit"
            className="w-full rounded-md bg-primary px-4 py-4 text-base font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 active:scale-[0.99] md:py-4 md:text-sm"
          >
            Login
          </Button>
        </form>
      </Card>
    </main>
  );
}
