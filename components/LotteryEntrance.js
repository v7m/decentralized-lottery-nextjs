import { useEffect, useState } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { useNotification } from "web3uikit";
import { ethers } from "ethers";

import { contractAddresses, contractAbi } from "../constants";
import LotteryDataTable from "./LotteryDataTable";
import PreviousWinner from "./PreviousWinner";
import LotteryState from "./LotteryState";
import EntranceInput from "./EntranceInput";
import TechStack from "./TechStack";
import EntranceButton from "./EntranceButton";

export default function LotteryEntrance() {
    const [minEntrancePrice, setMinEntrancePrice] = useState("0");
    const [playersCount, setPlayersCount] = useState("0");
    const [recentWinner, setRecentWinner] = useState("");
    const [lotteryPrize, setLotteryPrize] = useState("0");
    const [playerAmount, setPlayerAmount] = useState("0");
    const [playersAmountAvg, setPlayersAmountAvg] = useState("0");
    const [lotteryState, setLotteryState] = useState("");
    const [entranceAmount, setEntranceAmount] = useState("0");
    const [duration, setDuration] = useState("");
    const dispatch = useNotification();

    const { isWeb3Enabled, chainId: chainIdHex, account } = useMoralis();
    const chainId = parseInt(chainIdHex);
    const lotteryAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null;
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const lotteryContract = new ethers.Contract(lotteryAddress, contractAbi, provider);

    const { runContractFunction: enterLottery, isLoading, isFetching } = useWeb3Contract({
        abi: contractAbi,
        contractAddress: lotteryAddress,
        functionName: "enterLottery",
        msgValue: entranceAmount,
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

    const { runContractFunction: getDuration } = useWeb3Contract({
        abi: contractAbi,
        contractAddress: lotteryAddress,
        functionName: "getDuration",
        params: {},
    });

    const { runContractFunction: getLotteryState } = useWeb3Contract({
        abi: contractAbi,
        contractAddress: lotteryAddress,
        functionName: "getLotteryState",
        params: {},
    });

    async function updateUIValues() {
        const minEntrancePriceFromCall = (await getMinEntrancePrice()).toString();
        const numPlayersFromCall = (await getPlayersCount()).toString();
        const recentWinnerFromCall = await getRecentWinner();
        const lotteryPrizeFromCall = (await getLotteryPrize()).toString();
        const playerAmountFromCall = (await getGetPlayerAmount()).toString();
        const lotteryStateFromCall = (await getLotteryState()).toString();
        const playersAmountAvgFromCall = (await getPlayersAmountAvg()).toString();
        const durationFromCall = (await getDuration()).toString();

        setEntranceAmount(minEntrancePriceFromCall);
        setMinEntrancePrice(minEntrancePriceFromCall);
        setPlayersCount(numPlayersFromCall);
        setRecentWinner(recentWinnerFromCall);
        setLotteryPrize(lotteryPrizeFromCall);
        setPlayerAmount(playerAmountFromCall);
        setLotteryState(lotteryStateFromCall);
        setPlayersAmountAvg(playersAmountAvgFromCall);
        setDuration(durationFromCall);
    }

    useEffect(() => {
        if (isWeb3Enabled) { updateUIValues(); }
    }, [isWeb3Enabled]);

    useEffect(() => {
        const winnerRequestedEventFilter = {
            address: lotteryAddress,
            topics: [ethers.utils.id("LotteryWinnerRequested(uint256)")]
        }

        const enterLotteryEventFilter = {
            address: lotteryAddress,
            topics: [ethers.utils.id("PlayerEnterLottery(address)")]
        }

        const winnerPickedEventFilter = {
            address: lotteryAddress,
            topics: [ethers.utils.id("LotteryWinnerPicked(address)")]
        }

        const lotteryOpenedFilter = {
            address: lotteryAddress,
            topics: [ethers.utils.id("LotteryOpened()")]
        }

        const lotteryClosedFilter = {
            address: lotteryAddress,
            topics: [ethers.utils.id("LotteryClosed()")]
        }

        const lotteryStartedFilter = {
            address: lotteryAddress,
            topics: [ethers.utils.id("LotteryStarted()")]
        }

        lotteryContract.on(winnerRequestedEventFilter, (requestId, event) => {
            updateUIValues();
        });

        lotteryContract.on(enterLotteryEventFilter, (player, event) => {
            updateUIValues();
        });

        lotteryContract.on(winnerPickedEventFilter, (player, event) => {
            updateUIValues();
            handleWinnerPickedNotification(player);
        });

        lotteryContract.on(lotteryOpenedFilter, (event) => {
            updateUIValues();
        });

        lotteryContract.on(lotteryClosedFilter, (event) => {
            updateUIValues();
            handleLotteryClosedNotification();
        });

        lotteryContract.on(lotteryStartedFilter, (event) => {
            updateUIValues();
            handleLotteryStartedNotification();
        });

        return () => {
            lotteryContract.removeAllListeners();
        }
    }, []);

    const handleTransactionCompletedNotification = () => {
        dispatch({
            type: "success",
            message: "You have successfully entered lottery!",
            title: "Lottery entered",
            position: "topR",
            icon: "bell",
        });
    }

    const handleWinnerPickedNotification = (winner) => {
        dispatch({
            type: "success",
            message: `Winner address: ${winner}`,
            title: "Winner selected!",
            position: "topL",
            icon: "bell",
        });
    }

    const handleTransactionSentNotification = () => {
        dispatch({
            type: "info",
            message: "Entrance transaction sent, waiting for confirmation.",
            title: "Transaction sent",
            position: "topR",
            icon: "bell",
        });
    }

    const handleLotteryClosedNotification = () => {
        dispatch({
            type: "info",
            message: "The winner will be announced soon.",
            title: "Lottery round was over",
            position: "topL",
            icon: "bell",
        });
    }

    const handleLotteryStartedNotification = () => {
        dispatch({
            type: "info",
            message: "The round will continue for the specified time",
            title: "Lottery round started",
            position: "topL",
            icon: "bell",
        });
    }

    const handleSuccessEntrance = async (txResponse) => {
        try {
            await txResponse.wait(1);
            updateUIValues();
            handleTransactionCompletedNotification(txResponse);
        } catch (error) {
            console.log(error);
        }
    }

    const handleSubmit = async () => {
        await enterLottery({
            onComplete: handleTransactionSentNotification,
            onSuccess: handleSuccessEntrance,
            onError: (error) => console.log(error),
        })
    }

    return (
        <div className="p-5">
            { lotteryAddress ? (
                <>
                    <div className="grid grid-cols-7 gap-4">
                        <div className="xl:col-start-3 xl:col-span-3 lg:col-start-2 lg:col-span-5 sm:col-start-2 sm:col-span-5 xs:col-start-2 xs:col-span-5">
                            <div className="mb-5">
                                    <p className="text-justify">
                                        Each lottery round has a limited duration of { duration } seconds.
                                        After the round concludes, a winner will be selected to receive the jackpot amount in their wallet address.
                                        To participate, you must send at least the minimum price of { ethers.utils.formatEther(minEntrancePrice) } ETH.
                                        The more you send, the greater your chance of winning.
                                    </p>
                            </div>
                            <LotteryState lotteryState={ lotteryState } />
                        </div>
                    </div>
                    <div className="grid grid-cols-7 gap-4">
                        <div className="xl:col-start-4 xl:col-span-1 lg:col-start-3 lg:col-span-3 sm:col-start-2 sm:col-span-5 xs:col-start-2 xs:col-span-5">
                            <EntranceInput
                                entranceAmount={ entranceAmount }
                                setEntranceAmount={ setEntranceAmount }
                                minEntrancePrice={ minEntrancePrice }
                            />
                            <EntranceButton
                                handleSubmit={ handleSubmit }
                                buttonDisabled= { isLoading || isFetching }
                            />
                        </div>
                        <div className="xl:col-start-3 xl:col-span-3 lg:col-start-2 lg:col-span-5 sm:col-start-2 sm:col-span-5 xs:col-start-2 xs:col-span-5">
                            <LotteryDataTable
                                lotteryPrize={ lotteryPrize }
                                playersCount={ playersCount }
                                playersAmountAvg={ playersAmountAvg }
                                playerAmount={ playerAmount }
                                duration={ duration }
                            />
                        </div>
                    </div>
                    <PreviousWinner recentWinner={ recentWinner } />
                    <TechStack/>
                </>
            ) : (
                <div>Please connect to a supported chain (Sepolia)</div>
            )}
        </div>
    );
}
