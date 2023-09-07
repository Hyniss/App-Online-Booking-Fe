import Slider from "@mui/material/Slider";
import { alpha, createTheme, styled } from "@mui/material/styles";

export const Xtheme = createTheme({
    palette: {
        primary: {
            light: "#fac5e1",
            main: "#ee2752",
            dark: "#8f0e24",
        },
    },
});

export const XSlider = styled(Slider)(({ theme }) => ({
    color: theme.palette.primary.main,
    "& .MuiSlider-thumb": {
        "&:hover, &.Mui-focusVisible": {
            boxShadow: `0px 0px 0px 8px ${alpha(theme.palette.primary.main, 0.16)}`,
        },
        "&.Mui-active": {
            boxShadow: `0px 0px 0px 14px ${alpha(theme.palette.primary.main, 0.16)}`,
        },
    },
}));
