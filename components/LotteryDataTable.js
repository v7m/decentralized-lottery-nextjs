import { ethers } from "ethers";

export default function LotteryDataTable(props) {
    const winningProbability = () => {
        return props.playerAmount > 0 ? `${(props.lotteryPrize / props.playerAmount) * 100}%` : "N/A"
    }

    return (
        <div className="grid grid-cols-7 gap-4">
            <div className="xl:col-start-3 xl:col-span-3 lg:col-start-2 lg:col-span-5 sm:col-start-2 sm:col-span-5 xs:col-start-2 xs:col-span-5">
                <div className="relative overflow-x-auto">
                    <div className="border rounded-lg overflow-hidden">
                        <table className="w-full text-md text-left text-gray-500 dark:text-gray-400">
                            <tbody>
                                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        Duration
                                    </th>
                                    <td className="px-6 py-4">
                                        { props.duration } sec
                                    </td>
                                </tr>
                                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        Jackpot
                                    </th>
                                    <td className="px-6 py-4">
                                        { ethers.utils.formatEther(props.lotteryPrize) } ETH
                                    </td>
                                </tr>
                                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        Number of players
                                    </th>
                                    <td className="px-6 py-4">
                                        { props.playersCount }
                                    </td>
                                </tr>
                                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        Average bid
                                    </th>
                                    <td className="px-6 py-4">
                                        { ethers.utils.formatEther(props.playersAmountAvg) } ETH
                                    </td>
                                </tr>
                                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        Your bid
                                    </th>
                                    <td className="px-6 py-4">
                                        { ethers.utils.formatEther(props.playerAmount) } ETH
                                    </td>
                                </tr>
                                <tr className="bg-white dark:bg-gray-800">
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        Your winning probability
                                    </th>
                                    <td className="px-6 py-4">
                                        { winningProbability() }
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
