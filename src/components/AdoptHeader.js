import {shop, user} from "../svg";

function AdoptHeader() {
    return (
        <div
            className="w-full h-48 bg-Main_Header flex items-center justify-center border-2 border-Main_Header_Border relative">
            <h1 className="text-3xl font-Pet_Title text-border absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-Main_Header">Adopt & Play</h1>
            <button className="absolute right-24 top-1/2 transform -translate-y-1/2">
                {shop()}
            </button>
            <button className="absolute right-4 top-1/2 transform -translate-y-1/2">
                {user()}
            </button>
        </div>
    );
}

export default AdoptHeader;
