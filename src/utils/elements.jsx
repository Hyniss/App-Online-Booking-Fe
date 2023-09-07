import React from "react";

export const HTMLNodes = ({ rawHTML, className = "", keepStyle = false }) => {
    const nodeRef = React.useRef();
    React.useEffect(() => {
        if (!nodeRef.current) {
            return;
        }
        Array.from(nodeRef.current.querySelectorAll("*")).forEach((element) => {
            element.setAttribute("style", "");
        });
    }, [nodeRef.current]);
    return keepStyle ? <div className={className} dangerouslySetInnerHTML={{ __html: rawHTML }}></div> : <div className={className} ref={nodeRef} dangerouslySetInnerHTML={{ __html: rawHTML }}></div>;
};
