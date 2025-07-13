# LawCo AI – Frontend

LawCo AI is an intelligent legal assistant web app that helps users analyze legal documents, ask legal questions, and get instant AI-powered insights. This is the frontend (React/Next.js) for the LawCo AI platform.

---

## 🚀 Features

- **AI Chatbot:** Ask legal questions and get instant answers.
- **Document Analysis:** Upload legal documents for AI-powered summaries and risk analysis.
- **Team Section:** Meet the minds behind LawCo AI.
- **Modern UI:** Responsive, accessible, and visually appealing.
- **Particles & Animations:** Engaging background effects.
- **Demo Section:** See LawCo AI in action with sample chat and analysis.
- **GitHub Integration:** Quick access to the project repository.

---

## 📸 Screenshots

> _Add your own screenshots here!_

| Home Page                       | AI Chat Demo                    | Team Section                    |
| ------------------------------- | ------------------------------- | ------------------------------- |
| ![Home](./screenshots/home.png) | ![Demo](./screenshots/demo.png) | ![Team](./screenshots/team.png) |

---

## 🛠️ Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (React)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Particles:** [react-tsparticles](https://particles.js.org/)
- **Other:** TypeScript, modern CSS, and more

---

## 📦 Dependencies

Install all dependencies with:

```bash
npm install
```

Key dependencies:

- `next`
- `react`
- `react-dom`
- `tailwindcss`
- `lucide-react`
- `react-tsparticles`
- `tsparticles`

See `package.json` for the full list.

---

## 🖥️ Getting Started

### 1. **Clone the repository**

```bash
git clone https://github.com/your-org/your-repo.git
cd your-repo
```

### 2. **Install dependencies**

```bash
npm install
```

### 3. **Run the development server**

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗂️ Project Structure

```
src/
  app/                # Next.js app directory (pages, layout, etc.)
  components/         # Reusable React components (Chat, TeamSection, DemoSection, etc.)
  contexts/           # React context providers
  hooks/              # Custom React hooks
  lib/                # Utility functions and constants
  services/           # API and business logic services
  types/              # TypeScript types and interfaces
public/               # Static assets (SVGs, images)
```

---

## ⚙️ Customization

- **Particles:** Edit `src/components/ParticlesBackground.tsx` to change background effects.
- **Team Members:** Update `src/components/TeamSection.tsx` with your real team info.
- **Demo Content:** Edit `src/components/DemoSection.tsx` for the chat/analysis demo.
- **Colors & Styles:** Tweak `src/app/globals.css` and Tailwind config for branding.

---

## 🤝 Contributing

1. Fork this repo
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a Pull Request

---

## 📄 License

[MIT](./LICENSE)

---

## 📬 Contact

For questions, feedback, or support, open an issue or contact the team at [your-email@example.com].

---

> _Happy coding!_
