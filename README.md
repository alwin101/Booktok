# 📖 BookTok

A TikTok-style interface for reading and exploring textbook excerpts with an infinite scroll experience. Transform any textbook into an engaging, scrollable format that makes learning more interactive and enjoyable.

## 🌟 Features

- **Infinite Scrolling Feed**: Seamlessly load textbook excerpts as you scroll
- **Like & Save**: Bookmark your favorite excerpts for later review
- **Export Capabilities**: Save your liked excerpts as a JSON file
- **Responsive Design**: Optimized for both mobile and desktop viewing
- **Minimalist Interface**: Focus on content with a clean, distraction-free design
- **Easy Textbook Integration**: Add any PDF textbook with a simple command

## 🛠 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **React Icons** for beautiful, consistent icons

### Backend
- **FastAPI** (Python) for the API server
- **Uvicorn** as the ASGI server
- **PyPDF2** for text extraction from PDFs
- **Pydantic** for data validation

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (for frontend)
- Python 3.10+ (for backend)
- npm, yarn, or bun (package manager)
- Git (for version control)

### Backend Setup

1. **Set up the virtual environment**:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: .\venv\Scripts\activate
   ```

2. **Install Python dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the backend server**:
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload
   ```
   The API will be available at `http://localhost:8001`
   - API Docs: `http://localhost:8001/docs`
   - Health Check: `http://localhost:8001/api/health`

### Frontend Setup

1. **Navigate to the frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install  # or yarn or bun install
   ```

3. **Start the development server**:
   ```bash
   npm run dev  # or yarn dev or bun run dev
   ```

4. **Open in browser**:
   - Development: [http://localhost:5173](http://localhost:5173)
   - Production build: [http://localhost:4173](http://localhost:4173) (after building)

## 📚 Adding Your Own Textbook

1. **Prepare your textbook**:
   - Place your PDF file in the project root
   - Ensure the PDF has selectable text (not scanned images)

2. **Run the preprocessing script**:
   ```bash
   python preprocess_textbook.py your_textbook.pdf
   ```
   This will:
   - Extract text from the PDF
   - Split it into manageable chunks (~300 words each)
   - Save as `backend/app/data/excerpts.json`

3. **Restart the backend server** to load the new excerpts

4. **Customize chunking** (optional):
   Modify `preprocess_textbook.py` to adjust chunk size or processing logic

## 🎮 Usage Guide

### Reading Excerpts
- **Scroll down** to load more excerpts automatically
- **Swipe up/down** (on mobile) or use your mouse wheel to navigate
- **Pull to refresh** to get a new set of excerpts

### Managing Your Library
- ❤️ **Like** excerpts by tapping the heart icon
- 💾 **Save for later** - All liked excerpts are stored in your browser
- 📤 **Export** your liked excerpts as a JSON file
- 🔄 **Reset** your likes at any time from the likes panel

### Keyboard Shortcuts
- `Space` or `↓` - Next excerpt
- `↑` - Previous excerpt
- `L` - Like/unlike current excerpt
- `E` - Export liked excerpts

## 🏗 Project Structure

```
booktok/
├── backend/               # FastAPI backend
│   ├── app/
│   │   ├── api/          # API routes
│   │   ├── data/         # Excerpts and other data
│   │   └── main.py       # FastAPI application
│   └── requirements.txt  # Python dependencies
├── frontend/             # React frontend
│   ├── public/           # Static files
│   ├── src/              # Source code
│   └── package.json      # Frontend dependencies
├── preprocess_textbook.py # PDF processing script
└── README.md             # This file
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ✨ Show Your Support

Give a ⭐️ if this project helped you!

## 📜 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=IsaacGemal/wikitok&type=Date)](https://star-history.com/#IsaacGemal/wikitok&Date)