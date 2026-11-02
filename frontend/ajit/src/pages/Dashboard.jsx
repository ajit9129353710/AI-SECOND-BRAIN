import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
Brain,
Upload,
FileText,
MessageSquare,
Send,
LogOut,
LoaderCircle,
Sparkles,
Trash2,
History,
RefreshCw,
} from "lucide-react";
import "./Dashboard.css";

const API_URL = "${import.meta.env.VITE_API_URL}/api";

function Dashboard() {
const navigate = useNavigate();

const [file, setFile] = useState(null);
const [pdfText, setPdfText] = useState("");
const [fileName, setFileName] = useState("");
const [question, setQuestion] = useState("");
const [messages, setMessages] = useState([]);

const [chatHistory, setChatHistory] = useState([]);
const [historyLoading, setHistoryLoading] = useState(true);

const [uploading, setUploading] = useState(false);
const [asking, setAsking] = useState(false);
const [error, setError] = useState("");
const [success, setSuccess] = useState("");

const token = localStorage.getItem("token");

let user = null;

try {
user = JSON.parse(localStorage.getItem("user") || "null");
} catch {
user = null;
}

const logout = () => {
localStorage.removeItem("token");
localStorage.removeItem("user");

sessionStorage.removeItem("token");
sessionStorage.removeItem("user");

navigate("/login", { replace: true });

};

const loadHistory = useCallback(async () => {
const currentToken = localStorage.getItem("token");

if (!currentToken) {
  setHistoryLoading(false);
  return;
}

setHistoryLoading(true);

try {
  const response = await fetch(`${API_URL}/history`, {
    headers: {
      Authorization: `Bearer ${currentToken}`,
    },
  });

  const data = await response.json();

  if (response.status === 401) {
    logout();
    return;
  }

  if (!response.ok) {
    throw new Error(
      data.message || "Could not load chat history."
    );
  }

  setChatHistory(
    Array.isArray(data.history) ? data.history : []
  );
} catch (err) {
  console.error("History loading error:", err.message);
} finally {
  setHistoryLoading(false);
}

}, []);

useEffect(() => {
if (!token) {
navigate("/login", { replace: true });
return;
}

loadHistory();

}, [token, navigate, loadHistory]);

const uploadPDF = async () => {
if (!file) {
setError("Please select a PDF file first.");
return;
}

if (
  file.type !== "application/pdf" &&
  !file.name.toLowerCase().endsWith(".pdf")
) {
  setError("Please select a valid PDF file.");
  return;
}

if (file.size > 10 * 1024 * 1024) {
  setError("PDF size must be less than 10 MB.");
  return;
}

setError("");
setSuccess("");
setUploading(true);
setMessages([]);
setPdfText("");
setFileName("");

try {
  const currentToken = localStorage.getItem("token");

  const formData = new FormData();
  formData.append("pdf", file);

  const response = await fetch(`${API_URL}/pdf/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${currentToken}`,
    },
    body: formData,
  });

  const data = await response.json();

  if (response.status === 401) {
    logout();
    return;
  }

  if (!response.ok) {
    throw new Error(data.message || "PDF upload failed.");
  }

  if (typeof data.text !== "string" || !data.text.trim()) {
    throw new Error(
      "PDF was uploaded, but no readable text was returned."
    );
  }

  setPdfText(data.text);
  setFileName(data.fileName || file.name);

  setSuccess(
    `PDF uploaded successfully! ${
      data.pages ? `${data.pages} pages processed.` : ""
    } You can now ask questions.`
  );

  setFile(null);
} catch (err) {
  setError(
    err.message === "Failed to fetch"
      ? "Cannot connect to the backend. Check your backend URL."
      : err.message
  );
} finally {
  setUploading(false);
}

};

const saveHistory = async (currentQuestion, answer) => {
const currentToken = localStorage.getItem("token");

const response = await fetch(`${API_URL}/history/save`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${currentToken}`,
  },
  body: JSON.stringify({
    question: currentQuestion,
    answer,
    pdfName: fileName || "My PDF",
  }),
});

const data = await response.json();

if (response.status === 401) {
  logout();
  throw new Error("Your session expired. Please login again.");
}

if (!response.ok) {
  throw new Error(
    data.message || "Could not save chat history."
  );
}

if (data.history) {
  setChatHistory((previous) => [
    data.history,
    ...previous.filter(
      (item) => item._id !== data.history._id
    ),
  ]);
} else {
  await loadHistory();
}

};
const askQuestion = async (e) => {
e.preventDefault();

if (!pdfText) {
  setError("Please upload a PDF before asking a question.");
  return;
}

if (!question.trim() || asking) {
  return;
}

const currentQuestion = question.trim();

setError("");
setSuccess("");
setQuestion("");
setAsking(true);

setMessages((previous) => [
  ...previous,
  {
    role: "user",
    text: currentQuestion,
  },
]);

try {
  const currentToken = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/chat/ask`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${currentToken}`,
    },
    body: JSON.stringify({
      question: currentQuestion,
      pdfText,
    }),
  });

  const data = await response.json();

  if (response.status === 401) {
    logout();
    return;
  }

  if (!response.ok) {
    throw new Error(
      data.message || "Could not get an AI answer."
    );
  }

  const answer =
    data.answer ||
    data.response ||
    data.reply ||
    data.text ||
    data.message;

  if (typeof answer !== "string" || !answer.trim()) {
    throw new Error(
      "AI responded, but no answer text was returned."
    );
  }

  setMessages((previous) => [
    ...previous,
    {
      role: "assistant",
      text: answer,
    },
  ]);

  try {
    await saveHistory(currentQuestion, answer);
  } catch (historyError) {
    console.error("Save history error:", historyError);

    setError(
      `AI answered successfully, but history could not be saved: ${historyError.message}`
    );
  }
} catch (err) {
  setError(
    err.message === "Failed to fetch"
      ? "Could not connect to the backend. Please check the server."
      : err.message
  );
} finally {
  setAsking(false);
}

};

const deleteHistory = async (historyId) => {
const confirmed = window.confirm(
"Are you sure you want to delete this chat history?"
);

if (!confirmed) return;

setError("");
setSuccess("");

try {
  const currentToken = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/history/${historyId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${currentToken}`,
      },
    }
  );

  const data = await response.json();

  if (response.status === 401) {
    logout();
    return;
  }

  if (!response.ok) {
    throw new Error(
      data.message || "Could not delete chat history."
    );
  }

  setChatHistory((previous) =>
    previous.filter((item) => item._id !== historyId)
  );

  setSuccess("Chat history deleted successfully.");
} catch (err) {
  setError(
    err.message === "Failed to fetch"
      ? "Could not connect to the backend."
      : err.message
  );
}

};

const openHistory = (item) => {
setMessages([
{ role: "user", text: item.question },
{ role: "assistant", text: item.answer },
]);

setFileName(item.pdfName || "My PDF");

setSuccess(
  "Previous conversation opened. Upload its PDF again if you want to ask new questions."
);

window.scrollTo({
  top: 0,
  behavior: "smooth",
});

};

const removePDF = () => {
setFile(null);
setPdfText("");
setFileName("");
setMessages([]);
setError("");
setSuccess("");
};

if (!token) {
return null;
}

return (
<div className="dashboard-page">
<header className="dashboard-header">
<Link to="/" className="dashboard-brand">
<span className="dashboard-brand-icon">
<Brain size={24} />
</span>

      <span>
        Second<span>Brain</span>
      </span>
    </Link>

    <div className="dashboard-user">
      <div className="dashboard-user-info">
        <strong>{user?.name || "User"}</strong>
        <small>{user?.email || "Personal Workspace"}</small>
      </div>

      <button
        className="dashboard-logout"
        onClick={logout}
        title="Logout"
      >
        <LogOut size={17} />
        <span>Logout</span>
      </button>
    </div>
  </header>

  <main className="dashboard-main">
    <section className="dashboard-welcome">
      <div>
        <div className="dashboard-eyebrow">
          <Sparkles size={15} />
          YOUR PERSONAL AI WORKSPACE
        </div>

        <h1>
          Your knowledge,
          <br />
          <span>one question away.</span>
        </h1>

        <p>
          Upload a PDF and let AI help you understand its content.
        </p>
      </div>

      <div className="dashboard-welcome-icon">
        <Brain size={66} />
      </div>
    </section>

    {error && (
      <div className="dashboard-alert dashboard-alert-error">
        {error}
        <button onClick={() => setError("")}>×</button>
      </div>
    )}

    {success && (
      <div className="dashboard-alert dashboard-alert-success">
        {success}
        <button onClick={() => setSuccess("")}>×</button>
      </div>
    )}

    <div className="dashboard-grid">

      <section className="dashboard-panel upload-panel">
        <div className="dashboard-panel-heading">
          <div className="dashboard-panel-icon">
            <Upload size={21} />
          </div>

          <div>
            <h2>Upload your PDF</h2>
            <p>Choose a document to start chatting.</p>
          </div>
        </div>

        {!pdfText ? (
          <>
            <label className="pdf-dropzone">
              <input
                type="file"
                accept=".pdf,application/pdf"
                onChange={(e) => {
                  setFile(e.target.files?.[0] || null);
                  setError("");
                  setSuccess("");
                }}
              />

              <span className="pdf-upload-icon">
                <FileText size={30} />
              </span>

              <strong>
                {file ? file.name : "Choose a PDF document"}
              </strong>

              <span>
                {file
                  ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
                  : "Click here to browse your files"}
              </span>

              <small>PDF format · Maximum 10 MB</small>
            </label>

            <button
              className="dashboard-primary-btn upload-button"
              onClick={uploadPDF}
              disabled={!file || uploading}
            >
              {uploading ? (
                <>
                  <LoaderCircle
                    className="dashboard-spinner"
                    size={18}
                  />
                  Uploading PDF...
                </>
              ) : (
                <>
                  <Upload size={18} />
                  Upload and Process
                </>
              )}
            </button>
          </>
        ) : (
          <div className="uploaded-document">
            <div className="uploaded-document-icon">
              <FileText size={27} />
            </div>

            <div className="uploaded-document-info">
              <strong>{fileName}</strong>
              <span>Document processed successfully</span>
            </div>

            <button
              className="remove-pdf-button"
              onClick={removePDF}
              title="Remove document"
            >
              <Trash2 size={18} />
            </button>

            <div className="uploaded-status">
              <span />
              Ready to chat with AI
            </div>
          </div>
        )}

        <div className="upload-note">
          <Sparkles size={17} />
          <p>
            Your PDF text is sent to the AI service when you ask
            a question. Avoid uploading sensitive personal
            information.
          </p>
        </div>
      </section>

      <section className="dashboard-panel chat-panel">
        <div className="dashboard-panel-heading">
          <div className="dashboard-panel-icon chat-icon">
            <MessageSquare size={21} />
          </div>

          <div>
            <h2>Chat with your PDF</h2>
            <p>Ask questions about your document.</p>
          </div>

          <span className="ai-status">
            <i /> AI Assistant
          </span>
        </div>

        <div className="chat-messages">
          {messages.length === 0 ? (
            <div className="chat-empty">
              <div className="chat-empty-icon">
                <Sparkles size={27} />
              </div>

              <h3>Your AI assistant is ready</h3>

              <p>
                {!pdfText
                  ? "Upload a PDF first, then ask anything about its content."
                  : "Your document is ready. Ask your first question below."}
              </p>

              {pdfText && (
                <div className="suggested-questions">
                  <button
                    onClick={() =>
                      setQuestion("Summarize this document.")
                    }
                  >
                    Summarize this document
                  </button>

                  <button
                    onClick={() =>
                      setQuestion("What are the main points?")
                    }
                  >
                    What are the main points?
                  </button>
                </div>
              )}
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={`chat-message ${
                  message.role === "user"
                    ? "user-message"
                    : "ai-message"
                }`}
              >
                <div className="message-avatar">
                  {message.role === "user" ? (
                    <span>
                      {user?.name?.charAt(0) || "U"}
                    </span>
                  ) : (
                    <Sparkles size={17} />
                  )}
                </div>

                <div className="message-content">
                  <strong>
                    {message.role === "user"
                      ? "You"
                      : "AI Assistant"}
                  </strong>

                  <p>{message.text}</p>
                </div>
              </div>
            ))
          )}

          {asking && (
            <div className="ai-thinking">
              <LoaderCircle
                className="dashboard-spinner"
                size={18}
              />
              AI is thinking...
            </div>
          )}
        </div>

        <form
          className="chat-input-form"
          onSubmit={askQuestion}
        >
          <input
            type="text"
            placeholder={
              pdfText
                ? "Ask a question about your PDF..."
                : "Upload a PDF to start chatting..."
            }
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            disabled={!pdfText || asking}
          />

          <button
            type="submit"
            disabled={!pdfText || !question.trim() || asking}
            title="Send question"
          >
            <Send size={19} />
          </button>
        </form>

        <p className="chat-disclaimer">
          AI-generated answers may contain mistakes. Verify
          important facts.
        </p>
      </section>
    </div>

    <section className="dashboard-panel history-panel">
      <div className="dashboard-panel-heading">
        <div className="dashboard-panel-icon chat-icon">
          <History size={21} />
        </div>

        <div>
          <h2>Chat History</h2>
          <p>Your saved questions and AI answers.</p>
        </div>

        <button
          type="button"
          className="history-refresh-button"
          onClick={loadHistory}
          disabled={historyLoading}
          title="Refresh history"
        >
          <RefreshCw
            size={17}
            className={historyLoading ? "dashboard-spinner" : ""}
          />
        </button>
      </div>

      {historyLoading ? (
        <div className="history-empty">
          <LoaderCircle
            className="dashboard-spinner"
            size={22}
          />
          <p>Loading your chat history...</p>
        </div>
      ) : chatHistory.length === 0 ? (
        <div className="history-empty">
          <History size={30} />
          <h3>No saved conversations yet</h3>
          <p>
            Ask a question about your PDF. Your conversation
            will appear here automatically.
          </p>
        </div>
      ) : (
        <div className="history-list">
          {chatHistory.map((item) => (
            <article className="history-item" key={item._id}>
              <div className="history-item-content">
                <div className="history-item-meta">
                  <FileText size={15} />
                  <span>{item.pdfName || "My PDF"}</span>

                  {item.createdAt && (
                    <time>
                      {new Date(item.createdAt).toLocaleString()}
                    </time>
                  )}
                </div>

                <h3>{item.question}</h3>

                <p className="history-answer">
                  {item.answer}
                </p>

                <button
                  type="button"
                  className="history-open-button"
                  onClick={() => openHistory(item)}
                >
                  <MessageSquare size={15} />
                  View conversation
                </button>
              </div>

              <button
                type="button"
                className="remove-pdf-button history-delete-button"
                onClick={() => deleteHistory(item._id)}
                title="Delete conversation"
                aria-label="Delete conversation"
              >
                <Trash2 size={18} />
              </button>
            </article>
          ))}
        </div>
      )}
    </section>

    <footer className="dashboard-footer">
      <Brain size={17} />
      <span>AI Second Brain</span>
      <span className="footer-separator">·</span>
      <span>Your knowledge, organized.</span>
    </footer>
  </main>
</div>

);
}

export default Dashboard;