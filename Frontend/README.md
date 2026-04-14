# 🖥️ ConnectSphere Frontend

This is the frontend layer of the **ConnectSphere** platform, built with modern web technologies to provide a slick, responsive, and high-performance user experience.

## 🚀 Key Technologies
- **React 19:** Utilizing the latest features for efficient rendering and state management.
- **Vite 6:** Lightning-fast build tool and development server.
- **Tailwind CSS 4:** Modern styling with zero-runtime overhead and maximum flexibility.
- **Lucide React:** Beautifully crafted, consistent iconography.
- **React Router DOM 7:** Seamless client-side navigation.
- **Axios:** Robust HTTP client for backend communication.

## 🏗 Project Structure
- `/src/components`: Reusable UI components (Buttons, Inputs, Cards).
- `/src/pages`: Main application views (Home, Profile, Dashboard, Project Details).
- `/src/utils`: Helper functions and API configurations.
- `/src/context` (if any): Global state management providers.

## 🛠 Features Implemented
- **Responsive Navigation:** Optimized for both desktop and mobile devices.
- **Dynamic Dashboard:** Real-time data visualization for creators to track applicants.
- **Rich Forms:** Multi-step project creation and application processes.
- **Toasts & Feedback:** Immediate user feedback via `react-hot-toast`.

## 🚦 Getting Started
1. Ensure the Backend is running on `http://localhost:5000`.
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`

## 📦 Build for Production
```bash
npm run build
```
The build artifacts will be stored in the `dist/` directory.
