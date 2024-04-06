import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./utils/slices/userSlice";
import sidebarMenuReducer from "./utils/slices/sidebarmenuSlice";

export default configureStore({
  reducer: {
    user: userReducer,
    sidebarmenu: sidebarMenuReducer,
  },
});
