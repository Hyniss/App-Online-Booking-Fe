export const numbers = {
    clamp: (value, min, max) => {
        if (!value) {
            return 0;
        }
        if (!min || !max || min > max) {
            return value;
        }
        if (value < min) {
            return min;
        }

        if (value > max) {
            return max;
        }
        return value;
    },
};
