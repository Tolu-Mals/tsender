"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Coins, Users, HandCoins, Send } from "lucide-react";

export default function AirdropForm() {
  const handleSubmit = async (data: FormData) => {
    const tokenAddress = data.get("token-address") as string;
    const recipients = data.get("recipients") as string;
    const amounts = data.get("amounts") as string;
    console.log(tokenAddress, recipients, amounts);
  };

  return (
    <section className="container mx-auto max-w-2xl px-4 py-12 sm:py-20">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-2xl dark:bg-black/20 dark:border-white/5 shadow-2xl">
        {/* Decorative Background Elements */}
        <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="relative space-y-8">
          <div className="space-y-2">
            <h2 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">
              Airdrop Tokens
            </h2>
            <p className="text-muted-foreground">
              Effortlessly distribute tokens to multiple recipients in a single
              transaction.
            </p>
          </div>

          <form className="space-y-6" action={handleSubmit}>
            {/* Token Address Field */}
            <div className="space-y-2.5">
              <Label
                htmlFor="token-address"
                className="flex items-center gap-2"
              >
                <Coins className="h-4 w-4 text-blue-500" />
                Token Address
              </Label>
              <Input
                name="token-address"
                id="token-address"
                placeholder="0x0000...0000"
                className="h-12 border-slate-200 dark:border-white/10 focus:border-blue-500 focus:ring-blue-500/10"
              />
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {/* Recipients Field */}
              <div className="space-y-2.5 sm:col-span-1">
                <Label htmlFor="recipients" className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-emerald-500" />
                  Recipients
                </Label>
                <Textarea
                  name="recipients"
                  id="recipients"
                  placeholder="0x71C...6d8976F 0x15d...Aa2C6A65"
                  className="min-h-[200px] resize-none border-slate-200 dark:border-white/10 focus:border-emerald-500 focus:ring-emerald-500/10"
                />
                <p className="text-[10px] text-muted-foreground px-1 uppercase tracking-wider font-bold">
                  One address per line
                </p>
              </div>

              {/* Amounts Field */}
              <div className="space-y-2.5 sm:col-span-1">
                <Label htmlFor="amounts" className="flex items-center gap-2">
                  <HandCoins className="h-4 w-4 text-amber-500" />
                  Amounts
                </Label>
                <Textarea
                  name="amounts"
                  id="amounts"
                  placeholder="0.5 1.25 10"
                  className="min-h-[200px] resize-none border-slate-200 dark:border-white/10 focus:border-amber-500 focus:ring-amber-500/10"
                />
                <p className="text-[10px] text-muted-foreground px-1 uppercase tracking-wider font-bold">
                  Corresponding to recipients
                </p>
              </div>
            </div>

            <Button className="w-full text-lg group" size="lg" type="submit">
              Send Airdrop
              <Send className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
