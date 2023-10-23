import { ethers } from "ethers";

export default function EntranceForm(props) {
    const handleChangeAmount = (event) => {
        props.setEntranceAmount(ethers.utils.parseEther(event.target.value).toString());
    }

    const minEntranceEthAmount = () => {
        return ethers.utils.formatEther(props.minEntrancePrice);
    }

    return (
        <div className="grid grid-cols-7 gap-4">
            <div className="xl:col-start-4 xl:col-span-1 lg:col-start-3 lg:col-span-3 sm:col-start-2 sm:col-span-5 xs:col-start-2 xs:col-span-5">
                <div>
                    <div className="relative mt-2 rounded-md shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <svg className="w-4 h-4 mr-2 -ml-1 text-[#626890]" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="ethereum" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="currentColor" d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>
                        </div>
                        <input
                            type="number"
                            id="entrance-price"
                            className="block text-center w-full rounded-md border-0 py-1.5 pl-7 pr-12 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 md:text-md md:leading-6"
                            aria-describedby="price-currency"
                            value={ ethers.utils.formatEther(props.entranceAmount) }
                            onChange={ handleChangeAmount }
                            min={ minEntranceEthAmount() }
                            step={ minEntranceEthAmount() }
                        />
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                            <span className="text-gray-500 sm:text-sm" id="price-currency">ETH</span>
                        </div>
                    </div>
                    <div className="text-gray-500 sm:text-sm text-center">
                        <span>min { minEntranceEthAmount() } ETH</span>
                    </div>
                </div>
                <button
                    type="button"
                    className="w-full text-lg text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg px-5 py-2.5 text-center mr-2 mb-1"
                    onClick={ props.handleSubmit }
                    disabled={ props.buttonDisabled }
                >
                    { props.buttonDisabled ? (
                        <div className="mx-auto animate-spin spinner-border h-7 w-7 border-b-2 rounded-full"></div>
                    ) : (
                        "Enter Lottery"
                    ) }
                </button>
            </div>
        </div>
    );
}