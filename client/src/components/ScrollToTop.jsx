import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
    const {pathname} = useLocation()
    useEffect(() => {
        console.log('to top')
        window.scrollTo(0,0)
    }, [pathname])
}

export default ScrollToTop