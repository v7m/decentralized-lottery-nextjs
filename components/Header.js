import { ConnectButton } from "web3uikit";

export default function Header() {
    return (
        <header>
            <nav className="rounded-b-lg bg-white border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800">
                <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
                    <a href="." className="flex items-center">
                        <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
                            Decentralized Ethereum Lottery
                        </span>
                    </a>
                    <div className="flex items-center lg:order-2">
                        <ConnectButton moralisAuth={false}/>
                    </div>
                </div>
            </nav>
        </header>
    );
}
