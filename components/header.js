import { ConnectButton } from "web3uikit"
import Link from "next/link"

export default function Header() {
    return (
        <nav>
            <Link href="/">
                <a> NoRug NFT Marketplace</a>
            </Link>
            <Link href="/sell-page">
                <a> Sell NFT</a>
            </Link>
            <ConnectButton />
        </nav>
    )
}
