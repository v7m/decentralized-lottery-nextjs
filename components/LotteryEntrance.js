import { contractAddresses, contractAbi } from "../constants";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { useEffect, useState } from "react";
import { useNotification } from "web3uikit";
import { ethers } from "ethers";

export default function LotteryEntrance() {
    const { isWeb3Enabled, chainId: chainIdHex, account } = useMoralis();
    const chainId = parseInt(chainIdHex);
    const lotteryAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null;
    const [minEntrancePrice, setEntrancePrice] = useState("0");
    const [playersCount, setPlayersCount] = useState("0");
    const [recentWinner, setRecentWinner] = useState("0");
    const [lotteryPrize, setLotteryPrize] = useState("0");
    const [playerAmount, setPlayerAmount] = useState("0");
    const [playersAmountAvg, setPlayersAmountAvg] = useState("0");

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
        msgValue: minEntrancePrice,
        params: {},
    });

    const { runContractFunction: getMinEntrancePrice } = useWeb3Contract({
        abi: contractAbi,
        contractAddress: lotteryAddress,
        functionName: "getMinEntrancePrice",
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

    const { runContractFunction: getLotteryPrize } = useWeb3Contract({
        abi: contractAbi,
        contractAddress: lotteryAddress,
        functionName: "getLotteryPrize",
        params: {},
    });

    const { runContractFunction: getGetPlayerAmount } = useWeb3Contract({
        abi: contractAbi,
        contractAddress: lotteryAddress,
        functionName: "getGetPlayerAmount",
        params: {
            playerAddress: account
        },
    });

    const { runContractFunction: getPlayersAmountAvg } = useWeb3Contract({
        abi: contractAbi,
        contractAddress: lotteryAddress,
        functionName: "getPlayersAmountAvg",
        params: {},
    });

    async function updateUIValues() {
        const entranceFeeFromCall = (await getMinEntrancePrice()).toString();
        const numPlayersFromCall = (await getPlayersCount()).toString();
        const recentWinnerFromCall = await getRecentWinner();
        const lotteryPrizeFromCall = (await getLotteryPrize()).toString();
        const playerAmountFromCall = (await getGetPlayerAmount()).toString();
        const playersAmountAvgFromCall = (await getPlayersAmountAvg()).toString();


        setEntrancePrice(entranceFeeFromCall);
        setPlayersCount(numPlayersFromCall);
        setRecentWinner(recentWinnerFromCall);
        setLotteryPrize(lotteryPrizeFromCall);
        setPlayerAmount(playerAmountFromCall);
        setPlayersAmountAvg(playersAmountAvgFromCall);
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUIValues();
        }
    }, [isWeb3Enabled]);

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
                    <div>Min Entrance Price: { ethers.utils.formatEther(lotteryPrize) } ETH</div>
                    <div>Current Lottery user amount: { ethers.utils.formatEther(playerAmount) } ETH</div>
                    <div>Current Lottery Prize: { ethers.utils.formatEther(lotteryPrize) } ETH</div>
                    <div>Current Lottery AVG user amount: { ethers.utils.formatEther(playersAmountAvg) } ETH</div>
                    <div>Current Lottery number of players: { playersCount }</div>
                    <div>The most previous winner was: { recentWinner }</div>
                </>
            ) : (
                <div>Please connect to a supported chain </div>
            )}
        </div>
    );
}
