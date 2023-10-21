import { contractAddresses, contractAbi } from "../constants";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { useEffect, useState } from "react";
import { useNotification } from "web3uikit";
import { ethers } from "ethers";

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

    const handleChangeAmount = (event) => {
        console.log(ethers.utils.parseEther(event.target.value));
        setEntranceAmount(ethers.utils.parseEther(event.target.value).toString());
    }

    return (
        <div className="p-5">
            {lotteryAddress ? (
                <>
                    <div className="h-70 grid grid-cols-7 gap-4 content-center">
                        <div className="col-start-3 col-span-3">
                            { lotteryState == "0" ? (
                                <div className="p-1 text-center border rounded-lg box-decoration-slice bg-gradient-to-r from-green-500 to-green-700 text-white px-2 text-3xl">
                                    LOTTERY IS OPEN
                                </div>
                            ) : (
                                <div className="p-1 text-center border rounded-lg box-decoration-slice bg-gradient-to-r from-yellow-600 to-red-600 text-white px-2 text-3xl">
                                    WINNER CALCULATING
                                </div>
                            ) }
                        </div>
                    </div>
                    <div className="h-70 grid grid-cols-5 gap-4 content-center">
                        <div className="col-start-3 col-span-1">
                            <div className="relative mt-2 rounded-md shadow-sm">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <svg className="w-4 h-4 mr-2 -ml-1 text-[#626890]" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="ethereum" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="currentColor" d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>
                                </div>
                                <input
                                    type="number"
                                    id="entrance-price"
                                    className="block text-center w-full rounded-md border-0 py-1.5 pl-7 pr-12 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 md:text-md md:leading-6"
                                    aria-describedby="price-currency"
                                    value={ ethers.utils.formatEther(entranceAmount) }
                                    onChange={ handleChangeAmount }
                                    min={ ethers.utils.formatEther(minEntrancePrice) }
                                    step={ ethers.utils.formatEther(minEntrancePrice) }
                                />
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                    <span className="text-gray-500 sm:text-sm" id="price-currency">ETH</span>
                                </div>
                            </div>
                            <div className="text-gray-500 sm:text-sm text-center">
                                Min Entrance Price: { ethers.utils.formatEther(minEntrancePrice) } ETH
                            </div>
                            <button
                                type="button"
                                className="w-full text-lg text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg px-5 py-2.5 text-center mr-2 mb-2"
                                onClick={ handleSubmit }
                                disabled={ isLoading || isFetching }
                            >
                                { isLoading || isFetching ? (
                                    <div className="mx-auto animate-spin spinner-border h-7 w-7 border-b-2 rounded-full"></div>
                                ) : (
                                    "Enter Lottery"
                                ) }
                            </button>
                        </div>
                        <div className="col-start-2 col-span-3">
                            <div className="relative overflow-x-auto">
                                <div className="border rounded-lg overflow-hidden">
                                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                        <tbody>
                                            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                    Jackpot
                                                </th>
                                                <td className="px-6 py-4">
                                                    { ethers.utils.formatEther(lotteryPrize) } ETH
                                                </td>
                                            </tr>
                                            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                    Number of players
                                                </th>
                                                <td className="px-6 py-4">
                                                    { playersCount }
                                                </td>
                                            </tr>
                                            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                    Average bid
                                                </th>
                                                <td className="px-6 py-4">
                                                    { ethers.utils.formatEther(playersAmountAvg) } ETH
                                                </td>
                                            </tr>
                                            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                    Your bid
                                                </th>
                                                <td className="px-6 py-4">
                                                    { ethers.utils.formatEther(playerAmount) } ETH
                                                </td>
                                            </tr>
                                            <tr className="bg-white dark:bg-gray-800">
                                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                    Your probability of winning
                                                </th>
                                                <td className="px-6 py-4">
                                                    { playerAmount > 0 ? `${(lotteryPrize / playerAmount) * 100}%` : "N/A" }
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="h-70 grid grid-cols-7 gap-4 content-center">
                        <div className="col-start-3 col-span-3">
                            <div className="p-1 text-center text-md">
                                Previous winner:
                            </div>
                            <div className="p-1 text-center border rounded-lg box-decoration-slice bg-gradient-to-b from-orange-500 to-yellow-300 text-gray-40 px-2 text-md">
                                { recentWinner }
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <div>Please connect to a supported chain (Sepolia)</div>
            )}
        </div>
    );
}
