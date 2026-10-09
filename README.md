# 🌾 KrishiSahayAI — AI-Powered Smart Farming Assistant

**KrishiSahayAI** is an AI-powered smart agriculture platform designed to help farmers make better farming decisions through intelligent recommendations, crop disease detection, soil analysis, water optimization, and agricultural market insights.

The platform aims to make modern farming more accessible, efficient, and sustainable, especially for farmers in rural areas.

## 🚀 Key Features

* 🌱 **AI Crop Recommendation** — Suggests suitable crops based on agricultural conditions.
* 🦠 **Crop Disease Detection** — Helps identify plant diseases using image-based analysis.
* 🌍 **Soil Analysis** — Provides soil-related insights to support better crop planning.
* 💧 **Smart Water Optimization** — Helps farmers plan efficient water usage.
* 🌦️ **Weather Insights** — Displays weather-related information for farming decisions.
* 🌾 **Crop Rotation Planner** — Helps farmers plan crop rotation strategies.
* 📈 **Agricultural Market Hub** — Provides market-related information and insights.
* 🚜 **Equipment Rental** — Supports access to agricultural equipment rental information.
* 🌰 **Seed Quality Analysis** — Assists with seed quality assessment.
* 🎙️ **Kisan Vaani Voice Assistant** — Provides a voice-based interaction experience.
* 🧠 **Explainable AI** — Helps users understand AI-generated recommendations.
* 👤 **Face Recognition Login** — Includes a face-recognition interface for farmer identification.
* 📊 **Smart Dashboard** — Brings farming information and tools together in one place.

## 💡 Problem Statement

Farmers often face challenges such as unpredictable weather, crop diseases, inefficient water usage, limited access to agricultural information, and difficulties in making informed farming decisions.

Traditional farming methods may not provide timely, data-driven insights to address these challenges effectively.

## 💡 Our Solution

KrishiSahayAI brings multiple agricultural assistance features into a single digital platform. It combines AI-assisted analysis, farming utilities, and a farmer-friendly interface to support informed agricultural decisions.

The platform is designed with rural accessibility in mind, with the potential to be used through a centralized kiosk or service center at a Gram Panchayat for farmers who do not own smartphones.

## 🛠️ Technology Stack

* **Frontend:** React, TypeScript
* **Build Tool:** Vite
* **Styling:** CSS
* **AI Integration:** AI-assisted agricultural analysis and image-based processing
* **Development Tools:** VS Code, Git, GitHub

*Note: The exact AI models, backend services, and external API integrations depend on the implemented configuration.*

## 📂 Project Structure

```text
KrishiSahayAI/
├── index.html
├── package.json
├── package-lock.json
├── server.ts
├── vite.config.ts
├── tsconfig.json
├── public/
└── src/
    ├── App.tsx
    ├── main.tsx
    ├── index.css
    ├── components/
    │   ├── AgriMarketModule.tsx
    │   ├── AuthModal.tsx
    │   ├── FaceRecognitionModal.tsx
    │   ├── KisanVaaniDrawer.tsx
    │   └── views/
    ├── services/
    │   ├── faceRecognition.ts
    │   ├── diseaseModel.ts
    │   ├── soilModel.ts
    │   ├── waterModel.ts
    │   └── cropData.ts
    ├── data/
    └── types/
```

## ⚙️ Installation and Setup

### Prerequisites

Install the following tools:

* [Node.js](https://nodejs.org/)
* [Git](https://git-scm.com/)
* A code editor such as [Visual Studio Code](https://code.visualstudio.com/)

### Step 1: Clone the Repository

```bash
git clone https://github.com/ankireddysathwika-07/KrishiSahayAI.git
```

### Step 2: Navigate to the Project

```bash
cd KrishiSahayAI/Krishsahayy/krishisahay-ai
```

### Step 3: Install Dependencies

```bash
npm install
```

### Step 4: Configure Environment Variables

If the project requires external API keys, configure them using the environment-variable format documented in `.env.example`.

**Important:** Never upload actual API keys, passwords, or secrets to GitHub.

### Step 5: Start the Development Server

```bash
npm run dev
```

Open the local URL displayed in your terminal, usually `http://localhost:5173`.

## 👨‍🌾 Target Users

* Farmers in rural and semi-urban areas
* Agricultural support centers
* Gram Panchayat service centers
* Agricultural students and researchers
* Farming communities seeking digital agricultural assistance

## 🌟 Innovation

KrishiSahayAI combines multiple farming assistance tools in one platform rather than focusing on a single agricultural problem. Its proposed Gram Panchayat kiosk approach can help farmers access digital agricultural services even when they do not own smartphones.

Face recognition is intended to support farmer identification at login, subject to proper implementation, consent, and secure handling of biometric data.

## 🔮 Future Enhancements

* Offline-first support for areas with limited internet connectivity
* Secure centralized farmer registration and authentication
* Improved regional-language and voice support
* Integration with verified agricultural and weather data sources
* Real-time market price integrations
* More accurate crop disease detection using validated datasets
* Personalized recommendations based on farm-specific data
* Secure biometric data handling and privacy controls

## 🔐 Security and Privacy

* Keep API keys and credentials outside public source code.
* Obtain consent before collecting or processing facial data.
* Protect farmer information using appropriate access controls.
* Use secure authentication and encrypted communication for production deployments.

## 🤝 Contributing

Contributions, suggestions, and feedback are welcome.

1. Fork the repository.
2. Create a new branch.
3. Make your changes.
4. Commit and push your changes.
5. Submit a pull request.

## 📄 License

A license has not yet been specified. Add a `LICENSE` file before distributing the project under a particular open-source license.

## 👩‍💻 Project Repository

GitHub: https://github.com/ankireddysathwika-07/KrishiSahayAI

---

**KrishiSahayAI — Empowering Farmers Through AI and Smart Agriculture.** 🌱
