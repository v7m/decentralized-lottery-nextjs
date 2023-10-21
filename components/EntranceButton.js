import { ethers } from "ethers";

export default function EntranceButton(props) {
    return (
        <button
            type="button"
            className="w-full text-lg text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg px-5 py-2.5 text-center mr-2 mb-2"
            onClick={ props.handleSubmit }
            disabled={ props.buttonDisabled }
        >
            { props.buttonDisabled ? (
                <div className="mx-auto animate-spin spinner-border h-7 w-7 border-b-2 rounded-full"></div>
            ) : (
                "Enter Lottery"
            ) }
        </button>
    );
}
