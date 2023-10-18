import { contractAddresses, contractAbi } from "../constants";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { useEffect, useState } from "react";
import { useNotification } from "web3uikit";
import { ethers } from "ethers";

export default function LotteryEntrance() {
    const { isWeb3Enabled, chainId: chainIdHex } = useMoralis();
    const chainId = parseInt(chainIdHex);
    const lotteryAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null;
    const [entrancePrice, setEntrancePrice] = useState("0");
    const [playersCount, setPlayersCount] = useState("0");
    const [recentWinner, setRecentWinner] = useState("0");
    const dispatch = useNotification();

    const {
        runContractFunction: enterLottery,
        data: enterTxResponse,
        isLoading,
        isFetching,
    } = useWeb3Contract({
        abi: contractAbi,
        contractAddress: lotteryAddress,
        functionName: "enterLottery",
        msgValue: entrancePrice,
        params: {},
    });

    const { runContractFunction: getEntrancePrice } = useWeb3Contract({
        abi: contractAbi,
        contractAddress: lotteryAddress,
        functionName: "getEntrancePrice",
        params: {},
    });

    const { runContractFunction: getPlayersCount } = useWeb3Contract({
        abi: contractAbi,
        contractAddress: lotteryAddress,
        functionName: "getPlayersCount",
        params: {},
    });

    const { runContractFunction: getRecentWinner } = useWeb3Contract({
        abi: contractAbi,
        contractAddress: lotteryAddress,
        functionName: "getRecentWinner",
        params: {},
    });

    async function updateUIValues() {
        const entranceFeeFromCall = (await getEntrancePrice()).toString();
        const numPlayersFromCall = (await getPlayersCount()).toString();
        const recentWinnerFromCall = await getRecentWinner();
        setEntrancePrice(entranceFeeFromCall);
        setPlayersCount(numPlayersFromCall);
        setRecentWinner(recentWinnerFromCall);
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUIValues();
        }
    }, [isWeb3Enabled]);

    // An example filter for listening for events, we will learn more on this next Front end lesson
    // const filter = {
    //     address: lotteryAddress,
    //     topics: [
    //         // the name of the event, parnetheses containing the data type of each event, no spaces
    //         utils.id("RaffleEnter(address)"),
    //     ],
    // }

    const handleNewNotification = () => {
        dispatch({
            type: "info",
            message: "You have successfully entered lottery!",
            title: "Transaction Complete",
            position: "topR",
            icon: "bell",
        });
    }

    const handleSuccess = async (txResponse) => {
        try {
            await txResponse.wait(1);
            updateUIValues();
            handleNewNotification(txResponse);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="p-5">
            {lotteryAddress ? (
                <>
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
                        onClick={async () =>
                            await enterLottery({
                                onSuccess: handleSuccess,
                                onError: (error) => console.log(error),
                            })
                        }
                        disabled={isLoading || isFetching}
                    >
                        {isLoading || isFetching ? (
                            <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
                        ) : (
                            "Enter Lottery"
                        )}
                    </button>
                    <div>Entrance Fee: {ethers.utils.formatUnits(entrancePrice, "ether")} ETH</div>
                    <div>The current number of players is: {playersCount}</div>
                    <div>The most previous winner was: {recentWinner}</div>
                </>
            ) : (
                <div>Please connect to a supported chain </div>
            )}
        </div>
    );
}
