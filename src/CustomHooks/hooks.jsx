import React from "react";

const useEffectOnce = (effect, conditions = []) => {
    const destroyFunc = React.useRef();
    const effectCalled = React.useRef(false);
    const renderAfterCalled = React.useRef(false);
    const [val, setVal] = React.useState(0);

    if (effectCalled.current) {
        renderAfterCalled.current = true;
    }

    React.useEffect(() => {
        // only execute the effect first time around
        if (conditions.length > 0 && !conditions.some((x) => x)) {
            return;
        }

        if (!effectCalled.current) {
            destroyFunc.current = effect();
            effectCalled.current = true;
        }

        // this forces one render after the effect is run
        setVal((val) => val + 1);

        return () => {
            // if the comp didn't render since the useEffect was called,
            // we know it's the dummy React cycle
            if (!renderAfterCalled.current) {
                return;
            }
            if (destroyFunc.current) {
                try {
                    destroyFunc.current();
                } catch (error) {}
            }
        };
    }, conditions);
};

function getBrowserVisibilityProp() {
    if (typeof document.hidden !== "undefined") {
        // Opera 12.10 and Firefox 18 and later support
        return "visibilitychange";
    } else if (typeof document.msHidden !== "undefined") {
        return "msvisibilitychange";
    } else if (typeof document.webkitHidden !== "undefined") {
        return "webkitvisibilitychange";
    }
}

function getBrowserDocumentHiddenProp() {
    if (typeof document.hidden !== "undefined") {
        return "hidden";
    } else if (typeof document.msHidden !== "undefined") {
        return "msHidden";
    } else if (typeof document.webkitHidden !== "undefined") {
        return "webkitHidden";
    }
}

function getIsDocumentHidden() {
    return !document[getBrowserDocumentHiddenProp()];
}

function usePageVisibility() {
    const [isVisible, setIsVisible] = React.useState(getIsDocumentHidden());
    const onVisibilityChange = () => setIsVisible(getIsDocumentHidden());

    React.useEffect(() => {
        const visibilityChange = getBrowserVisibilityProp();

        document.addEventListener(visibilityChange, onVisibilityChange, false);

        return () => {
            document.removeEventListener(visibilityChange, onVisibilityChange);
        };
    });

    return isVisible;
}

const useCallbackState = (initState) => {
    const [state, setState] = React.useState(initState);
    const stateRef = React.useRef(state);
    stateRef.current = state;
    return [stateRef, setState];
};

const useParentSize = () => {
    const [size, setSize] = React.useState({ height: 0, width: 0 });

    const parentRef = React.useRef(null);

    React.useEffect(() => {
        const resizeObserver = new ResizeObserver((event) => {
            setSize({
                height: event[0].contentBoxSize[0].blockSize,
                width: event[0].contentBoxSize[0].inlineSize,
            });
        });

        if (parentRef?.current) resizeObserver.observe(parentRef.current);
    }, [parentRef?.current]);

    return [size, parentRef];
};

function getScrollParentsOf(element, includeHidden = true) {
    var style = getComputedStyle(element);
    var excludeStaticParent = style.position === "absolute";
    var overflowRegex = includeHidden ? /(auto|scroll|hidden)/ : /(auto|scroll)/;

    const parents = [];
    if (style.position === "fixed") {
        parents.push(document.body);
    }

    for (var parent = element; (parent = parent.parentElement); ) {
        style = getComputedStyle(parent);
        if (excludeStaticParent && style.position === "static") {
            continue;
        }
        if (overflowRegex.test(style.overflow + style.overflowY + style.overflowX)) {
            parents.push(parent);
        }
    }

    return parents;
}

const useElementProp = () => {
    const [properties, setProperties] = React.useState({
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        width: 0,
        height: 0,
    });
    const ref = React.useRef();

    React.useLayoutEffect(() => {
        const calculateProperties = () => {
            if (!ref.current) {
                return;
            }
            const pos = ref.current.getBoundingClientRect();
            const newProperties = {
                left: pos.left,
                top: pos.top,
                right: pos.right,
                bottom: pos.bottom,
                width: ref.current.offsetWidth,
                height: ref.current.offsetHeight,
            };
            setProperties(newProperties);
        };
        window.addEventListener("resize", calculateProperties, false);
        window.addEventListener("scroll", calculateProperties, false);
        if (ref.current) {
            ref.current.addEventListener("click", calculateProperties, false);
            ref.current.addEventListener("scroll", calculateProperties, false);

            const scrollParents = getScrollParentsOf(ref.current);
            scrollParents.forEach((scrollParent) => {
                scrollParent.addEventListener("resize", calculateProperties, false);
                scrollParent.addEventListener("scroll", calculateProperties, false);
            });
        }
        calculateProperties();
        return () => {
            window.removeEventListener("resize", calculateProperties);
            window.removeEventListener("scroll", calculateProperties);
            if (ref.current) {
                ref.current.removeEventListener("click", calculateProperties, false);
                ref.current.removeEventListener("scroll", calculateProperties, false);

                const scrollParents = getScrollParentsOf(ref.current);
                scrollParents.forEach((scrollParent) => {
                    scrollParent.removeEventListener(
                        "resize",
                        calculateProperties,
                        false
                    );
                    scrollParent.removeEventListener(
                        "scroll",
                        calculateProperties,
                        false
                    );
                });
            }
        };
    }, [ref, ref.current]);

    return [ref, properties];
};

const useClickOutside = (setOpen) => {
    const ref = React.useRef(null);
    document.onmousedown = (event) => {
        if (ref.current && !ref.current.contains(event.target)) {
            setOpen(false);
        }
    };

    return ref;
};

const useLongPress = (callback = () => {}, ms = 300) => {
    const [startLongPress, setStartLongPress] = React.useState(false);

    React.useEffect(() => {
        let timerId;
        if (startLongPress) {
            timerId = setTimeout(callback, ms);
        } else {
            clearTimeout(timerId);
        }

        return () => {
            clearTimeout(timerId);
        };
    }, [callback, ms, startLongPress]);

    return {
        onMouseDown: () => setStartLongPress(true),
        onMouseUp: () => setStartLongPress(false),
        onMouseLeave: () => setStartLongPress(false),
        onTouchStart: () => setStartLongPress(true),
        onTouchEnd: () => setStartLongPress(false),
    };
};

const useHover = () => {
    const [isHovered, setIsHovered] = React.useState(false);

    const handleMouseOver = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    return [
        {
            onMouseOver: handleMouseOver,
            onMouseLeave: handleMouseLeave,
        },
        isHovered,
    ];
};

const useVisible = () => {
    const ref = React.useRef(null);
    const [isOnScreen, setIsOnScreen] = React.useState(false);
    const observerRef = React.useRef(null);

    React.useEffect(() => {
        observerRef.current = new IntersectionObserver(([entry]) =>
            setIsOnScreen(entry.isIntersecting)
        );
    }, []);

    React.useEffect(() => {
        try {
            observerRef.current.observe(ref.current);
        } catch (error) {}

        return () => {
            observerRef.current.disconnect();
        };
    }, [ref.current]);

    return [ref, isOnScreen];
};

const useQueryParameters = (query) => {
    const result = {};
    new URLSearchParams(query || window.location.search).forEach((value, key) => {
        result[key] = value;
    });
    return result;
};

const useInfiniteScroll = ({ page, setPage, totalPages, action }, dependencies = []) => {
    const [loading, setLoading] = React.useState(true);
    const [lastElement, setLastElement] = React.useState(null);
    const [maxPageRef, setMaxPage] = useCallbackState(totalPages);
    const [currentPageRef, setCurrentPage] = useCallbackState(page);

    const requestAction = async () => {
        await action();
    };

    React.useEffect(() => {
        setMaxPage(totalPages);
    }, [totalPages]);

    React.useEffect(() => {
        setCurrentPage(page);
    }, [page]);

    React.useEffect(() => {
        if (currentPageRef.current <= maxPageRef.current) {
            setLoading(true);
            requestAction().finally(() => setLoading(false));
        }
    }, [...dependencies, currentPageRef.current, maxPageRef.current]);

    const observer = React.useRef(
        new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                setPage((no) =>
                    no <= maxPageRef.current ? no + 1 : currentPageRef.current
                );
            }
        })
    );

    React.useEffect(() => {
        const currentElement = lastElement;
        const currentObserver = observer.current;

        if (currentElement) {
            currentObserver.observe(currentElement);
        }

        return () => {
            if (currentElement) {
                currentObserver.unobserve(currentElement);
            }
        };
    }, [lastElement]);

    return [loading, setLastElement];
};

export {
    useCallbackState,
    useClickOutside,
    useEffectOnce,
    useElementProp,
    useHover,
    useInfiniteScroll,
    useLongPress,
    usePageVisibility,
    useParentSize,
    useQueryParameters,
    useVisible,
};
