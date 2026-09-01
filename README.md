# CreatR — AI Content Creation Platform (Client)

CreatR is a full-stack content creation and publishing platform with a rich-text editor, personalized feed, social interactions, and AI-assisted writing tools. This repository contains the **client (frontend)** application, built with React and Vite.

🔗 **Live App:** [creatr.netlify.app](https://creatr.netlify.app)
🔗 **Backend Repo:** [CreatR-server](https://github.com/bdhanush-pxl/CreatR-server) <!-- update if your server repo name is different -->

---

## ✨ Features

- **Rich-Text Editor** — WYSIWYG editing powered by `react-quill-new`, with autosave, drafts, and publish/schedule flows.
- **AI-Assisted Writing** — Integrated with the Gemini API (`@google/generative-ai`) for AI-powered content generation and improvement suggestions directly inside the editor.
- **Personalized Feed & Discovery** — Trending algorithm and suggested-users logic to surface relevant content and creators.
- **Social Interactions** — Follow/unfollow, likes, comments, and follow-back UX to drive engagement.
- **Analytics Dashboard** — View/like/comment counters and daily-views charting using `chart.js` / `react-chartjs-2`.
- **Image Handling** — Optimized image upload, transformation, and delivery via ImageKit (`@imagekit/react`), with drag-and-drop uploads (`react-dropzone`).
- **Authentication** — Secure user auth and session management with JWT.
- **Polished UI** — Built with Tailwind CSS v4 and shadcn/Radix UI primitives (dialogs, dropdowns, tabs, sliders, selects) for an accessible, consistent design system.
- **Form Handling & Validation** — `react-hook-form` with `zod` schema validation.
- **Dark/Light Theme** — Theme switching via `next-themes`.

---

## 🛠️ Tech Stack

| Category | Technologies |
|---|---|
| **Framework** | React 19, Vite 7 |
| **Routing** | React Router v7 |
| **Styling** | Tailwind CSS v4, tailwindcss-animate |
| **UI Components** | Radix UI primitives, shadcn-style components, Lucide Icons |
| **Auth** | JWT |
| **Rich Text Editor** | react-quill-new |
| **AI** | Google Generative AI (Gemini API) |
| **Media/CDN** | ImageKit |
| **Charts** | Chart.js, react-chartjs-2 |
| **Forms & Validation** | React Hook Form, Zod |
| **Notifications** | Sonner |
| **Linting** | ESLint 9 |

---

## 📂 Project Structure

```
CreatR-client/
├── public/          # Static assets
├── src/             # Application source code
│   ├── components/  # Reusable UI components
│   ├── pages/        # Route-level pages
│   └── ...
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
└── components.json  # shadcn/ui config
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/bdhanush-pxl/CreatR-client.git
cd CreatR-client

# Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the root directory and add the following:

```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
VITE_IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
VITE_API_BASE_URL=your_backend_api_url
```

> Adjust variable names above to match what's actually referenced in your `src/` code.

### Run Locally

```bash
npm run dev
```

The app will be available at `http://localhost:5173` by default.

### Build for Production

```bash
npm run build
npm run preview
```

---

## 🔗 Related Repository

This is the client-side application. The backend (Node.js/Express, MongoDB, JWT auth) lives in a separate repository — see the server repo linked above for API and database setup.

---

## 📄 License

This project is open source and available for learning/reference purposes.

---

## 👤 Author

**Dhanush Bandi**
- GitHub: [@bdhanush-pxl](https://github.com/bdhanush-pxl)
- LinkedIn: [dhanushbandi](https://www.linkedin.com/in/dhanush-bandi-0b06412b5/)
