import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./utils/slices/userSlice";

export default configureStore({
  reducer: {
    user: userReducer,
  },
});
