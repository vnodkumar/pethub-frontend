import { useEffect, useState } from "react";
import { setSlowHandler } from "../api/axiosInstance";
import SlowServerBanner from "../components/SlowServerBanner";

export default function SlowServerProvider({ children }) {
    const [slow, setSlow] = useState(false);

    useEffect(() => {
        setSlowHandler(setSlow);
        return () => setSlowHandler(null);
    }, []);

    return (
        <>
            {children}
            <SlowServerBanner visible={slow} />
        </>
    );
}
