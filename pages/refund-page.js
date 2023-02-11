import Head from "next/head"
import Image from "next/image"
import styles from "../styles/Home.module.css"
import { Form, useNotification, Button } from "web3uikit"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { ethers } from "ethers"
import nftAbi from "../constants/NoRugERC721.json"
import nftMarketplaceAbi from "../constants/NoRugMarketplace.json"
import networkMapping from "../constants/contractMapping.json"
import { useEffect, useState } from "react"

export default function Refund() {
    const { chainId, account, isWeb3Enabled } = useMoralis()
    const chainString = chainId ? parseInt(chainId).toString() : "31337"
    const marketplaceAddress = networkMapping[chainString].NoRugMarketplace[0]
    const dispatch = useNotification()
    const [refund, setRefund] = useState("0")

    const { runContractFunction } = useWeb3Contract()

    const handleRefundSuccess = () => {
        dispatch({
            type: "success",
            message: "Refund NFT",
            position: "topR",
        })
    }

    async function refundNFT(data) {
        console.log("refund public balance...")
        const nftAddress = data.data[0].inputResult
        const publicSaleCount = data.data[1].inputResult
        const tokenId = data.data[2].inputResult

        const publicWithdraw = {
            abi: nftMarketplaceAbi,
            contractAddress: marketplaceAddress,
            functionName: "refundPublicSale",
            params: {
                nftAddress: nftAddress,
                publicSalesCount: publicSaleCount,
                tokenId: tokenId,
            },
        }

        await runContractFunction({
            params: publicWithdraw,
            onSuccess: () => handlePublicWithdrawSuccess(),
            onError: (error) => {
                console.log(error)
            },
        })
    }

    return (
        <div className={styles.container}>
            <Form
                onSubmit={refundNFT}
                data={[
                    {
                        name: "NFT Address",
                        type: "text",
                        inputWidth: "50%",
                        value: "",
                        key: "nftAddress",
                    },
                    {
                        name: "Market Sales Counter",
                        type: "number",
                        value: "",
                        key: "publicSaleCount",
                    },
                    {
                        name: "Token ID",
                        type: "number",
                        value: "",
                        key: "tokenId",
                    },
                ]}
                title="Refund Public Sales!"
                id="Main Form"
            />
        </div>
    )
}
