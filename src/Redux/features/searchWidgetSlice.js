import { createSlice } from "@reduxjs/toolkit";
// initialState
const initialState = {
  isWhereSelected: false,
  isCheckinSelected: false,
  isCheckoutSelected: false,
  isAddGuestSelected: false,
  showDatePicker: false,
  selectedDate: [null, null],
  adultCount: {id: 4,value:1}, //id : 4
  childrenCount: {id:5,value:0}, //id 5
  petCount: {id: 6,value: 0},//id 6
  bedCount: 1,
  idHome: 0,
  totalRoomBook: 10,
  totalByRoomId: {
    id: null,
    total: null,
    detail: []
  },
  listRoomBooking: [],
  listdetail: 
  { 
    id: null,
    value: null
  },
  outerClickEffect: false
};

//Reducer
const searchWidgetSlice = createSlice({
  name: "searchWidgetSlice",
  initialState,
  reducers: {
    setIsWhereSelected: (state, action) => {
      state.isWhereSelected = false;
      state.isCheckinSelected = false;
      state.isAddGuestSelected = false;
      state.isCheckoutSelected = false;
      state.showDatePicker = false;
      state.outerClickEffect = false
    },
    setIsCheckinSelected: (state, action) => {
      state.isCheckinSelected = true;
      state.isAddGuestSelected = false;
      state.isWhereSelected = false;
      state.isCheckoutSelected = false;
      state.showDatePicker = true;
      state.outerClickEffect = false
    },
    setIsCheckoutSelected: (state, action) => {
      state.isCheckinSelected = false;
      state.isAddGuestSelected = false;
      state.isWhereSelected = false;
      state.isCheckoutSelected = true;
      state.showDatePicker = true;
      state.outerClickEffect = false
    },
    setIsAddGuesSelected: (state, action) => {
      state.isCheckinSelected = false;
      state.isAddGuestSelected = true;
      state.isWhereSelected = false;
      state.isCheckoutSelected = false;
      state.showDatePicker = false;
      state.outerClickEffect = false
    },
    setCheckinSelectedDate: (state, action) => {
      state.outerClickEffect = false
      state.isCheckinSelected = false;
      state.isCheckoutSelected = true;
      state.selectedDate[0] = action.payload;

    },
    setCheckOutSelectedDate: (state, action) => {
      state.outerClickEffect = false
      state.isCheckinSelected = false;
      state.isCheckoutSelected = false;
      state.isAddGuestSelected = true;
      state.selectedDate[1] = action.payload;

    },
    clearSelectedDate: (state, action) => {
      state.outerClickEffect = false
      state.isCheckoutSelected = false;
      state.isCheckinSelected = true;
      state.selectedDate = [null, null];
    },
    resetAll: (state, action) => {
      state.isWhereSelected = false;
      state.isCheckinSelected = false;
      state.isAddGuestSelected = false;
      state.isCheckoutSelected = false;
      state.showDatePicker = false;
    },
    incrementadultCount: (state, action) => {
      state.adultCount.value += 1;
    },
    decrementadultCount: (state, action) => {
      if (state.adultCount.value == 0) {
        return;
      }
      state.adultCount.value -= 1;
    },
    incrementchildrenCount: (state, action) => {
      state.childrenCount.value += 1;
    },
    decrementchildrenCount: (state, action) => {
      if (state.childrenCount.value == 0) {
        return;
      }
      state.childrenCount.value -= 1;
    },
    incrementBedCount: (state, action) => {
      state.bedCount += 1;
    },
    decrementBedCount: (state, action) => {
      if (state.bedCount == 0) {
        return;
      }
      state.bedCount -= 1;
    },

    incrementpetCount: (state, action) => {
      state.petCount.value += 1;
    },
    decrementpetCount: (state, action) => {
      if (state.petCount.value == 0) {
        return;
      }
      state.petCount.value -= 1;
    },
    resetAllGuest: (state, action) => {
      state.adultCount.value = 0
      state.childrenCount.value = 0
      // state.infantCount = 0
      state.petCount.value = 0
    },
    setOuterClick: (state, action) => {

      state.outerClickEffect = true
      state.isWhereSelected = false
      state.isCheckinSelected = false;
      state.isAddGuestSelected = false;
      state.isCheckoutSelected = false;
    },
    disableOuterClick: (state, action) => {
      state.isCheckinSelected = false;
      state.isAddGuestSelected = false;
      state.isWhereSelected = false;
      state.isCheckoutSelected = false;
      state.showDatePicker = false;
      state.outerClickEffect = false
    },
    getHomeId: (state, action) => {
      state.idHome = action.payload;
    },
    getTotalRoomBook: (state, action) => {
      state.totalRoomBook = action.payload;
    }
  },
});

//Export Action
export const {
  setIsWhereSelected,
  setIsAddGuesSelected,
  setIsCheckinSelected,
  setIsCheckoutSelected,
  setCheckinSelectedDate,
  setCheckOutSelectedDate,
  clearSelectedDate,
  incrementadultCount,
  decrementadultCount,
  incrementchildrenCount,
  decrementchildrenCount,
  incrementBedCount,
  decrementBedCount,
  incrementpetCount,
  decrementpetCount,
  disableOuterClick,
  resetAllGuest,
  setOuterClick,
  resetAll,
  getHomeId,
  getTotalRoomBook,
} = searchWidgetSlice.actions;

//export reducer
export default searchWidgetSlice.reducer;
