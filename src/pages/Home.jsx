
import banner from "../images/banner.webp";

export default function Home(){

    return(
        <div
            className="flex min-h-[60vh] flex-1 w-full items-center  bg-contain bg-center bg-no-repeat px-6 py-10 text-center"
            style={{ backgroundImage: `url(${banner})` }}
        >
            <h1 className="font-serif text-3xl font-bold tracking-tight text-black drop-shadow-sm sm:text-5xl">
                We Care About Pets
            </h1>
        </div>
    )
}
