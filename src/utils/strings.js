const isBlank = (input) => {
    if (input === undefined || input === null || input === "null") {
        return true;
    }
    return input.trim().length == 0;
};

const isNotBlank = (input) => {
    return !isBlank(input);
};

const friendlyNumber = (input) => {
    if (typeof input !== "number") {
        return "0";
    }
    if (input < 1_000) {
        return `${input}`;
    }
    if (input < 1_000_000) {
        return `${Math.floor(input / 1_000)}K`;
    }
    if (input < 1_000_000_000) {
        return `${Math.floor(input / 1_000_000)}M`;
    }
    return `${Math.floor(input / 1_000_000_000)}B`;
};

const generateId = (_length = 13) => {
    // Math.random to base 36 (numbers, letters),
    // grab the first 9 characters
    // after the decimal.
    return "_" + Math.random().toString(36).substr(2, _length); // max _length should be less then 13
};

const priceFormatter = new Intl.NumberFormat("vi", {
    style: "currency",
    currency: "VND",
});

const toMoney = (value = 0) => {
    return priceFormatter.format(value);
};

const toName = (value = "") => {
    return value
        .split(" ")
        .filter((word) => isNotBlank(word))
        .map((word) => word[0].toUpperCase() + word.substring(1).toLowerCase())
        .join(" ");
};

const isNumeric = (str) => {
    if (typeof str != "string") return false;
    return !isNaN(str) && !isNaN(parseFloat(str));
};

const toNumber = (str) => {
    return isNumeric(str) ? Number(str) : 0;
};

const toList = (str) => {
    if (isBlank(str)) {
        return [];
    }
    try {
        return JSON.parse("[" + str + "]");
    } catch (e) {
        return str.split(",");
    }
};

const toQuery = (paramObject) => {
    if (!paramObject) {
        return null;
    }

    const query = new URLSearchParams(Object.fromEntries(Object.entries(paramObject).filter(([_, v]) => v != null))).toString();

    return isBlank(query) ? "" : "?" + query;
};

const phoneWoRegion = (phone) => {
    const value = phone?.split(" ")[1] || phone?.replace("+84", "") || "";
    return value.length === 9 ? `0${value}` : value;
};

const trim = (value) => {
    if (!value) {
    }
    try {
        return value?.trim() ?? "";
    } catch (error) {
        return "";
    }
};

export const strings = {
    isBlank,
    isNotBlank,
    trim,
    toQuery,
    friendlyNumber,
    toNumber,
    toName,
    generateId,
    toList,
    isNumeric,
    toMoney,
    phoneWoRegion,
};
