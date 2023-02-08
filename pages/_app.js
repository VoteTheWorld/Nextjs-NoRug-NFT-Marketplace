import "@/styles/globals.css"
import { MoralisProvider } from "react-moralis"
import Header from "../components/header"

export default function App({ Component, pageProps }) {
    return (
        <MoralisProvider initializeOnMount={false}>
            <Header />
            <Component {...pageProps} />
        </MoralisProvider>
    )
}
