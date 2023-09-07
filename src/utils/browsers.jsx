const stopBrowserBack = (callback) => {
    window.history.pushState(null, "", window.location.href);
    window.onpopstate = () => {
        window.history.pushState(null, "", window.location.href);
        callback && callback();
    };
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const startBrowserBack = () => {
    window.onpopstate = undefined;
    window.history.back();
};

export const browsers = {
    stopGoBack: stopBrowserBack,
    startGoBack: startBrowserBack,
    delay: delay,
};
