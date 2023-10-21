import { contractAddresses, contractAbi } from "../constants";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { useEffect, useState } from "react";
import { useNotification } from "web3uikit";
import { ethers } from "ethers";

import LotteryTable from "./LotteryTable";
import PreviousWinner from "./PreviousWinner";
import LotteryState from "./LotteryState";
import EntranceInput from "./EntranceInput";
import EntranceButton from "./EntranceButton";

export default function LotteryEntrance() {
    const { isWeb3Enabled, chainId: chainIdHex, account } = useMoralis();
    const chainId = parseInt(chainIdHex);
    const lotteryAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null;
    const [minEntrancePrice, setMinEntrancePrice] = useState("0");
    const [playersCount, setPlayersCount] = useState("0");
    const [recentWinner, setRecentWinner] = useState("0");
    const [lotteryPrize, setLotteryPrize] = useState("0");
    const [playerAmount, setPlayerAmount] = useState("0");
    const [playersAmountAvg, setPlayersAmountAvg] = useState("0");
    const [lotteryState, setLotteryState] = useState("");
    const [entranceAmount, setEntranceAmount] = useState("0");

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

    const { runContractFunction: getLotteryState } = useWeb3Contract({
        abi: contractAbi,
        contractAddress: lotteryAddress,
        functionName: "getLotteryState",
        params: {},
    });

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const lotteryContract = new ethers.Contract(lotteryAddress, contractAbi, provider);

    async function updateUIValues() {
        const minEntrancePriceFromCall = (await getMinEntrancePrice()).toString();
        const numPlayersFromCall = (await getPlayersCount()).toString();
        const recentWinnerFromCall = await getRecentWinner();
        const lotteryPrizeFromCall = (await getLotteryPrize()).toString();
        const playerAmountFromCall = (await getGetPlayerAmount()).toString();
        const lotteryStateFromCall = (await getLotteryState()).toString();
        const playersAmountAvgFromCall = (await getPlayersAmountAvg()).toString();

        setEntranceAmount(minEntrancePriceFromCall);
        setMinEntrancePrice(minEntrancePriceFromCall);
        setPlayersCount(numPlayersFromCall);
        setRecentWinner(recentWinnerFromCall);
        setLotteryPrize(lotteryPrizeFromCall);
        setPlayerAmount(playerAmountFromCall);
        setLotteryState(lotteryStateFromCall);
        setPlayersAmountAvg(playersAmountAvgFromCall);
    }

    useEffect(() => {
        if (isWeb3Enabled) { updateUIValues(); }
    }, [isWeb3Enabled]);

    useEffect(() => {
        const winnerRequestedEventFilter = {
            address: lotteryAddress,
            topics: [
                ethers.utils.id("LotteryWinnerRequested(uint256)")
            ]
        }

        const enterLotteryEventFilter = {
            address: lotteryAddress,
            topics: [
                ethers.utils.id("PlayerEnterLottery(address)")
            ]
        }

        const winnerPickedEventFilter = {
            address: lotteryAddress,
            topics: [
                ethers.utils.id("LotteryWinnerPicked(address)")
            ]
        }

        lotteryContract.on(winnerRequestedEventFilter, (requestId, event) => {
            console.log('LotteryWinnerRequested');
            updateUIValues();
            handleWinnerRequestedNotification();
        });

        lotteryContract.on(enterLotteryEventFilter, (player, event) => {
            console.log('PlayerEnterLottery');
            updateUIValues();
        });

        lotteryContract.on(winnerPickedEventFilter, (player, event) => {
            console.log('LotteryWinnerPicked');
            updateUIValues();
            handleWinnerPickedNotification(player);
        });

        return () => {
            lotteryContract.removeAllListeners();
        }
    }, []);

    const handleTransactionCompletedNotification = () => {
        dispatch({
            type: "info",
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
            title: "The winner has been selected!",
            position: "topR",
            icon: "bell",
        });
    }

    const handleWinnerRequestedNotification = () => {
        dispatch({
            type: "warning",
            message: "The current lottery round has ended, a winner is being sought.",
            title: "Lottery round ended",
            position: "topR",
            icon: "bell",
        });
    }

    const handleSuccess = async (txResponse) => {
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
            onSuccess: handleSuccess,
            onError: (error) => console.log(error),
        })
    }

    return (
        <div className="p-5">
            {lotteryAddress ? (
                <>
                    <div className="h-70 grid grid-cols-7 gap-4 content-center">
                        <div className="col-start-3 col-span-3">
                            <LotteryState lotteryState={ lotteryState } />
                        </div>
                    </div>
                    <div className="h-70 grid grid-cols-5 gap-4 content-center">
                        <div className="col-start-3 col-span-1">
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
                        <div className="col-start-2 col-span-3">
                            <LotteryTable
                                lotteryPrize={ lotteryPrize }
                                playersCount={ playersCount }
                                playersAmountAvg={ playersAmountAvg }
                                playerAmount={ playerAmount }
                            />
                        </div>
                    </div>
                    <div className="h-70 grid grid-cols-7 gap-4 content-center">
                        <div className="col-start-3 col-span-3">
                            <PreviousWinner recentWinner={ recentWinner } />
                        </div>
                    </div>
                </>
            ) : (
                <div>Please connect to a supported chain (Sepolia)</div>
            )}
        </div>
    );
}
