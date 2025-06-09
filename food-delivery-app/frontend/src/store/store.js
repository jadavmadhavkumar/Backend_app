import { configureStore } from "@reduxjs/toolkit"

// You can add Redux slices here for more complex state management
// For now, we're using Context API for simplicity

export const store = configureStore({
  reducer: {
    // Add your reducers here
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
