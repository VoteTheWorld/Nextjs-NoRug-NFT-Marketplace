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

export default function Withdraw() {
    const { chainId, account, isWeb3Enabled } = useMoralis()
    const chainString = chainId ? parseInt(chainId).toString() : "31337"
    const marketplaceAddress = networkMapping[chainString].NoRugMarketplace[0]
    const dispatch = useNotification()
    const [balance, setBalance] = useState("0")
    const [publicBalance, setPublicBalance] = useState("0")

    const { runContractFunction } = useWeb3Contract()

    const handleWithdrawSuccess = () => {
        dispatch({
            type: "success",
            message: "Withdrawing Balance",
            position: "topR",
        })
    }
    const handlePublicWithdrawSuccess = () => {
        dispatch({
            type: "success",
            message: "Withdrawing Public Balance",
            position: "topR",
        })
    }

    async function withdrawPublicBalance(data) {
        console.log("withdraw public balance...")
        const nftAddress = data.data[0].inputResult
        const publicSaleCount = data.data[1].inputResult

        const publicWithdraw = {
            abi: nftMarketplaceAbi,
            contractAddress: marketplaceAddress,
            functionName: "withdrawBalancePublic",
            params: {
                nftAddress: nftAddress,
                publicSaleCount: publicSaleCount,
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

    async function setupUI() {
        const returnedBalance = await runContractFunction({
            params: {
                abi: nftMarketplaceAbi,
                contractAddress: marketplaceAddress,
                functionName: "getBalance",
                params: {
                    owner: account,
                },
            },
            onError: (error) => console.log(error),
        })
        if (returnedBalance) {
            setBalance(returnedBalance.toString())
        }

        const returnedPublicBalance = await runContractFunction({
            params: {
                abi: nftMarketplaceAbi,
                contractAddress: marketplaceAddress,
                functionName: "getPublicBalance",
                params: {
                    owner: account,
                },
            },
            onError: (error) => console.log(error),
        })
        if (returnedPublicBalance) {
            setPublicBalance(returnedPublicBalance.toString())
        }
    }

    useEffect(() => {
        setupUI()
        console.log("Account: ", account)
    }, [balance, publicBalance, account, isWeb3Enabled, chainId])

    return (
        <div className={styles.container}>
            <div> You can Withdraw {balance} common balance</div>
            {balance != "0" ? (
                <Button
                    onClick={() => {
                        runContractFunction({
                            params: {
                                abi: nftMarketplaceAbi,
                                contractAddress: marketplaceAddress,
                                functionName: "withdrawBalancePublic",
                                params: {},
                            },
                            onError: (error) => console.log(error),
                            onSuccess: () => handleWithdrawSuccess,
                        })
                    }}
                    text="Withdraw"
                    type="button"
                />
            ) : (
                <div>Sorry! There are no common balance for your account</div>
            )}
            <Form
                onSubmit={withdrawPublicBalance}
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
                ]}
                title="Withdraw Public Sales!"
                id="Main Form"
            />
        </div>
    )
}
