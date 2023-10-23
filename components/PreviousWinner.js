export default function PreviousWinner(props) {
    return (
        <div className="grid grid-cols-9 gap-4 mb-4">
            <div className="xl:col-start-4 xl:col-span-3 lg:col-start-3 lg:col-span-5 sm:col-start-2 sm:col-span-7 xs:col-start-2 xs:col-span-7 mb-5">
                <div className="p-1 text-center text-md">
                    Previous winner:
                </div>
                <p className="text-ellipsis overflow-hidden p-1 text-center border rounded-lg box-decoration-slice bg-gradient-to-b from-orange-500 to-yellow-300 text-gray-40 px-2 text-md">
                    { props.recentWinner }
                </p>
            </div>
        </div>
    );
}
