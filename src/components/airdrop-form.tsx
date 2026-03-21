"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useChainId, useConfig, useAccount, useWriteContract } from "wagmi";
import { Coins, Users, HandCoins, Send, Loader2, Info } from "lucide-react";
import { chainsToTSender, tsenderAbi, erc20Abi } from "@/constants";
import { readContract, waitForTransactionReceipt } from "@wagmi/core";
import { calculateTotal } from "@/lib/utils";
import { toast } from "sonner";
import { isAddress } from "viem";

export default function AirdropForm() {
  const chainId = useChainId();
  const config = useConfig();
  const account = useAccount();
  const { writeContractAsync } = useWriteContract();

  const [tokenAddress, setTokenAddress] = useState("");
  const [recipients, setRecipients] = useState("");
  const [amounts, setAmounts] = useState("");
  const [tokenName, setTokenName] = useState("");
  const [isFetchingName, setIsFetchingName] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Load from local storage
  useEffect(() => {
    const savedToken = localStorage.getItem("airdrop-token-address");
    const savedRecipients = localStorage.getItem("airdrop-recipients");
    const savedAmounts = localStorage.getItem("airdrop-amounts");

    if (savedToken) setTokenAddress(savedToken);
    if (savedRecipients) setRecipients(savedRecipients);
    if (savedAmounts) setAmounts(savedAmounts);
  }, []);

  // Save to local storage
  useEffect(() => {
    localStorage.setItem("airdrop-token-address", tokenAddress);
  }, [tokenAddress]);

  useEffect(() => {
    localStorage.setItem("airdrop-recipients", recipients);
  }, [recipients]);

  useEffect(() => {
    localStorage.setItem("airdrop-amounts", amounts);
  }, [amounts]);

  // Fetch token name
  useEffect(() => {
    const fetchTokenName = async () => {
      if (isAddress(tokenAddress)) {
        setIsFetchingName(true);
        try {
          const name = await readContract(config, {
            abi: erc20Abi,
            address: tokenAddress as `0x${string}`,
            functionName: "name",
          });
          setTokenName(name as string);
        } catch (error) {
          console.error("Error fetching token name:", error);
          setTokenName("");
        } finally {
          setIsFetchingName(false);
        }
      } else {
        setTokenName("");
      }
    };

    fetchTokenName();
  }, [tokenAddress, config]);

  const totalAmount = calculateTotal(amounts);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!tokenAddress || !recipients || !amounts) {
      toast.error("Please fill in all fields");
      return;
    }

    if (!isAddress(tokenAddress)) {
      toast.error("Invalid token address");
      return;
    }

    setIsProcessing(true);
    const tsenderAddress = chainsToTSender[chainId].tsender;

    try {
      toast.info("Checking allowance...");
      const approvedAmount = await getApprovedAmount(
        tsenderAddress,
        tokenAddress as `0x${string}`,
      );

      if ((approvedAmount || 0) < totalAmount) {
        toast.info("Requesting approval...");
        const txHash = await writeContractAsync({
          abi: erc20Abi,
          address: tokenAddress as `0x${string}`,
          functionName: "approve",
          args: [tsenderAddress, BigInt(totalAmount)],
        });

        toast.loading("Waiting for approval confirmation...", {
          id: "tx-status",
        });
        await waitForTransactionReceipt(config, { hash: txHash });
        toast.success("Approval successful!", { id: "tx-status" });
      }
      toast.info("Initiating airdrop...");
      const airdropHash = await writeContractAsync({
        abi: tsenderAbi,
        address: tsenderAddress as `0x${string}`,
        functionName: "airdropERC20",
        args: [
          tokenAddress,
          recipients
            .split(/[\n,]+/)
            .map((address) => address.trim())
            .filter((address) => address !== ""),
          amounts
            .split(/[\n,]+/)
            .map((amount) => amount.trim())
            .filter((amount) => amount !== ""),
          BigInt(totalAmount),
        ],
      });

      toast.loading("Processing airdrop...", { id: "tx-status" });
      const receipt = await waitForTransactionReceipt(config, {
        hash: airdropHash,
      });

      if (receipt.status === "success") {
        toast.success("Airdrop completed successfully!", { id: "tx-status" });
        // Clear form after success if desired, or just notify
      } else {
        toast.error("Airdrop failed on-chain.", { id: "tx-status" });
      }
    } catch (error: unknown) {
      console.error(error);
      const errorMessage =
        error instanceof Error
          ? (error as { shortMessage?: string }).shortMessage || error.message
          : "An error occurred";
      toast.error(errorMessage, { id: "tx-status" });
    } finally {
      setIsProcessing(false);
    }
  };

  async function getApprovedAmount(
    tSenderAddress: string,
    tokenAddress: `0x${string}`,
  ) {
    if (!tSenderAddress) {
      throw new Error("No address found, please switch to a supported chain");
    }

    const response = await readContract(config, {
      abi: erc20Abi,
      address: tokenAddress,
      functionName: "allowance",
      args: [account.address, tSenderAddress],
    });

    return Number(response);
  }

  return (
    <section className="container mx-auto max-w-3xl px-4 py-12 sm:py-24">
      <div className="relative overflow-hidden rounded-[2rem] border border-white/5 bg-neutral-900/60 p-8 sm:p-12 backdrop-blur-2xl shadow-2xl shadow-indigo-500/5">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 -mr-24 -mt-24 h-96 w-96 rounded-full bg-indigo-500/10 blur-[100px]" />
        <div className="absolute bottom-0 left-0 -ml-24 -mb-24 h-96 w-96 rounded-full bg-purple-500/10 blur-[100px]" />

        <div className="relative space-y-10">
          <div className="space-y-3 text-center sm:text-left">
            <h2 className="text-4xl font-black tracking-tight text-white sm:text-5xl">
              Airdrop Tokens
            </h2>
            <p className="text-neutral-400 text-lg">
              Effortlessly distribute tokens to multiple recipients in a single
              transaction.
            </p>
          </div>

          <form className="space-y-8" onSubmit={handleSubmit}>
            {/* Token Address Field */}
            <div className="space-y-3">
              <Label
                htmlFor="token-address"
                className="flex items-center gap-2 text-neutral-300 font-semibold text-sm"
              >
                <Coins className="h-4 w-4 text-indigo-400" />
                Token Address
              </Label>
              <div className="relative">
                <Input
                  name="token-address"
                  id="token-address"
                  value={tokenAddress}
                  onChange={(e) => setTokenAddress(e.target.value)}
                  placeholder="0x0000...0000"
                  className="h-14 rounded-xl border-white/10 bg-neutral-950/50 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 pr-12 transition-all"
                />
                {isFetchingName && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <Loader2 className="h-5 w-5 animate-spin text-neutral-500" />
                  </div>
                )}
              </div>
            </div>

            {/* Details Section */}
            {(tokenName || totalAmount > 0) && (
              <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/10 p-5 space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="flex items-center gap-2 text-indigo-400 mb-2">
                  <Info className="h-4 w-4" />
                  <span className="text-xs font-bold uppercase tracking-widest">
                    Airdrop Details
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <p className="text-[10px] text-indigo-300/70 uppercase font-black tracking-widest">
                      Contract Name
                    </p>
                    <p className="text-base font-semibold text-white truncate">
                      {isFetchingName
                        ? "Loading..."
                        : tokenName || "Unknown Token"}
                    </p>
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-[10px] text-indigo-300/70 uppercase font-black tracking-widest">
                      Total Amount
                    </p>
                    <p className="text-base font-bold text-emerald-400">
                      {totalAmount.toLocaleString()}{" "}
                      {tokenName && `($${tokenName})`}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid gap-8 sm:grid-cols-2">
              {/* Recipients Field */}
              <div className="space-y-3 sm:col-span-1">
                <Label
                  htmlFor="recipients"
                  className="flex items-center gap-2 text-neutral-300 font-semibold text-sm"
                >
                  <Users className="h-4 w-4 text-emerald-400" />
                  Recipients
                </Label>
                <Textarea
                  name="recipients"
                  id="recipients"
                  value={recipients}
                  onChange={(e) => setRecipients(e.target.value)}
                  placeholder="0x71C...6d8976F&#10;0x15d...Aa2C6A65"
                  className="min-h-[220px] rounded-xl resize-none border-white/10 bg-neutral-950/50 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-all p-4"
                />
                <p className="text-[11px] text-neutral-500 px-1 uppercase tracking-widest font-bold">
                  One address per line
                </p>
              </div>

              {/* Amounts Field */}
              <div className="space-y-3 sm:col-span-1">
                <Label
                  htmlFor="amounts"
                  className="flex items-center gap-2 text-neutral-300 font-semibold text-sm"
                >
                  <HandCoins className="h-4 w-4 text-purple-400" />
                  Amounts
                </Label>
                <Textarea
                  name="amounts"
                  id="amounts"
                  value={amounts}
                  onChange={(e) => setAmounts(e.target.value)}
                  placeholder="0.5&#10;1.25&#10;10"
                  className="min-h-[220px] rounded-xl resize-none border-white/10 bg-neutral-950/50 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition-all p-4"
                />
                <p className="text-[11px] text-neutral-500 px-1 uppercase tracking-widest font-bold">
                  Corresponding to recipients
                </p>
              </div>
            </div>

            <Button
              className="w-full text-lg font-bold group h-16 rounded-xl bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-xl shadow-indigo-500/25 border border-white/10 transition-all active:scale-[0.98]"
              size="lg"
              type="submit"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Send Airdrop
                  <Send className="ml-3 h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
