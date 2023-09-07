export const callRequest = async (path, options) =>
    fetch(process.env.REACT_APP_API_PATH + path, options)
        .then((response) => {
            try {
                return response.json();
            } catch (SyntaxError) {
                return { status: 400, message: "No response", data: null };
            }
        })
        .then((response) => {
            if (response.status >= 400) {
                throw response;
            }
            return response;
        });
