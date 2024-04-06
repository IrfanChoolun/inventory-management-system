import { createSlice } from "@reduxjs/toolkit";

// const [expandedItems, setExpandedItems] = useState({
//     inventory: false,
//     reports: false,
//     suppliers: false,
//     orders: false,
//     users: false,
//   });

export const sidebarMenuSlice = createSlice({
  name: "sidebarmenu",
  initialState: {
    value: {
      inventory: false,
      reports: false,
      suppliers: false,
      orders: false,
      users: false,
    },
  },
  reducers: {
    updateSideBarMenu: (state, action) => {
      state.value = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateSideBarMenu } = sidebarMenuSlice.actions;

export default sidebarMenuSlice.reducer;
