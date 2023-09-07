import React from "react";

const BrowserContext = React.createContext();

const useWindowSize = () => React.useContext(BrowserContext);

function getBreakPoint(windowWidth) {
    if (!windowWidth) {
        return null;
    }
    if (windowWidth > 1536) {
        return "2xl";
    }
    if (windowWidth > 1280) {
        return "xl";
    }
    if (windowWidth > 1024) {
        return "lg";
    }
    if (windowWidth > 768) {
        return "md";
    }
    if (windowWidth > 640) {
        return "sm";
    }

    return null;
}

const sizes = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    "2xl": 1536,
};

const BrowserProvider = ({ children }) => {
    const isWindowClient = typeof window === "object";

    const [windowSize, setWindowSize] = React.useState(
        isWindowClient ? getBreakPoint(window.innerWidth) : undefined
    );

    React.useEffect(() => {
        function setSize() {
            setWindowSize(window.innerWidth);
        }
        setSize();
        window.addEventListener("resize", setSize);
        return () => window.removeEventListener("resize", setSize);
    }, []);

    const is = React.useCallback(
        (size) => {
            return getBreakPoint(windowSize) === size;
        },
        [windowSize]
    );

    const isLargerThan = React.useCallback(
        (size) => {
            if (sizes[size]) {
                return windowSize >= sizes[size];
            }
            return false;
        },
        [windowSize]
    );

    const isSmallerThan = React.useCallback(
        (size) => {
            if (sizes[size]) {
                return windowSize <= sizes[size];
            }
            return false;
        },
        [windowSize]
    );

    return (
        <BrowserContext.Provider value={{ is, isLargerThan, isSmallerThan }}>
            {children}
        </BrowserContext.Provider>
    );
};

export { BrowserProvider, useWindowSize };
