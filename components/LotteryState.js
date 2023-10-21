export default function LotteryState(props) {
    return (
        <div>
            { props.lotteryState == "0" ? (
                <div className="p-1 text-center border rounded-lg box-decoration-slice bg-gradient-to-r from-green-500 to-green-700 text-white px-2 text-3xl">
                    LOTTERY IS OPEN
                </div>
            ) : (
                <div className="p-1 text-center border rounded-lg box-decoration-slice bg-gradient-to-r from-yellow-600 to-red-600 text-white px-2 text-3xl">
                    WINNER CALCULATING
                </div>
            ) }
        </div>
    );
}
