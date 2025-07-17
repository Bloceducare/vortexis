## 🛠️ Update Summary

### 📌 Changes Implemented

1. **Added Cursor Pointer to Buttons**

   - Applied `cursor-pointer` class to all navigation and form control buttons for improved user interaction feedback.

2. **Introduced `navigationProps.ts` Interface**

   - Created a new TypeScript interface file to define standardized navigation props.
   - Interface includes:
     ```ts
     interface NavigationProps {
       onNext?: () => void;
       onPrev?: () => void;
     }
     ```
   - These props were integrated into each form component to handle step-based navigation (Next/Previous).

3. **Form Step Navigation Handling**

   - Updated form components (`Details`, `Submission`, etc.) to support controlled navigation using the `onNext` and `onPrev` functions.
   - Ensured smooth transition between steps with consistent state management.

4. **Styling Improvements**

   - Refined the dashboard layout and UI styling for a more polished and responsive design.
   - Improved spacing, button consistency, and overall visual hierarchy.

5. **Sidebar updated**
   - updated the sidebar

---

### ✅ Outcome

- Navigation across multi-step form is now modular and reusable.
- Codebase is more maintainable with clear type definitions.
- UX is more intuitive with better visual and interactive feedback.
- Sidebar updated
- Ui bugs fixed
- Framer motion added


### Zustand setup 

-I added the useAuthStore with three functions. getToken, SetToken and clearToken. (With the feature where by when you call the function you have to pass a time in millisecons of when the token will expire as it have an expiry date; I don't know if we want this as a feature)
- I added the useHackathon store to use two function: 
   - setField(Key, Value) → This is to update the field by just calling this function
   - getHackathonData() → to get all saved data for submission
   - clearHackathon() → to reset state
   - persist → to save data across page refresh 


