import { ethers } from "ethers";

export default function LotteryTable(props) {
    const winningProbability = () => {
        return props.playerAmount > 0 ? `${(props.lotteryPrize / props.playerAmount) * 100}%` : "N/A"
    }

    return (
        <div className="relative overflow-x-auto">
            <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <tbody>
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
                                Your probability of winning
                            </th>
                            <td className="px-6 py-4">
                                { winningProbability() }
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
