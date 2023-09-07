import React from "react";

export const RefDecorator = ({ children, innerRef }) => {
    return innerRef ? React.cloneElement(children, { ref: innerRef }) : children;
};
