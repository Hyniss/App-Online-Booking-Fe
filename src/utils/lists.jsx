export const lists = {
    sumOf: (collection, selector = (item) => item) => (collection || []).map(selector).reduce((a, b) => a + b, 0),
    lastOf: (collection, { orElse } = { orElse: null }) => {
        if (!collection) {
            return orElse;
        }
        if (collection.length === 0) {
            return collection[0];
        }
        return collection[collection.length - 1];
    },
    isEmpty: (collection) => {
        return (collection?.length ?? 0) === 0;
    },
    isNotEmpty: (collection) => {
        return (collection?.length ?? 0) > 0;
    },
};
