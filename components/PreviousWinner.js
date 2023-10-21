export default function PreviousWinner(props) {
    return (
        <div>
            <div className="p-1 text-center text-md">
                Previous winner:
            </div>
            <div className="p-1 text-center border rounded-lg box-decoration-slice bg-gradient-to-b from-orange-500 to-yellow-300 text-gray-40 px-2 text-md">
                { props.recentWinner }
            </div>
        </div>
    );
}
