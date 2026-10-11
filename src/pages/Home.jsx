
import banner from "../images/banner.webp";

export default function Home(){

    return(
        <div
            className="flex-1 w-full bg-contain bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${banner})` }}
        >
        </div>
    )
}
