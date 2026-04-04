'use client';

import AirdropForm from "./airdrop-form"
import { useAccount } from "wagmi"

export default function HomeContent(){
    const { isConnected } = useAccount();

    if(!isConnected){
        return (
            <div className="flex items-center justify-center h-screen text-gray-400">
                <h2 className="text-xl">
                    Please Connect Wallet
                </h2>
            </div>
        )
    }
    return (
        <AirdropForm />
    )
}