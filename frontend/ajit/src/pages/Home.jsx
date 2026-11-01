import { Link } from "react-router-dom";
import {
Brain,
FileText,
MessageSquare,
Sparkles,
ArrowRight,
ShieldCheck,
Zap,
Upload,
BookOpen,
CheckCircle2,
} from "lucide-react";
import "../App.css";

function Home() {
return (
<div className="home-page">
<nav className="home-nav">
<Link to="/" className="home-logo">
<span className="home-logo-icon">
<Brain size={25} />
</span>
<span>
Second<span className="home-highlight">Brain</span>
</span>
</Link>

    <div className="home-nav-links">
      <a href="#features">Features</a>
      <a href="#how-it-works">How it works</a>
    </div>

    <div className="home-nav-actions">
      <Link to="/login" className="home-login">
        Login
      </Link>
      <Link to="/signup" className="home-signup">
        Get Started <ArrowRight size={16} />
      </Link>
    </div>
  </nav>

  <main>
    <section className="home-hero">
      <div className="home-hero-content">
        <div className="home-badge">
          <Sparkles size={16} />
          Your Personal AI Knowledge Assistant
        </div>

        <h1>
          Your knowledge.
          <br />
          Your PDFs.
          <br />
          <span>One intelligent brain.</span>
        </h1>

        <p className="home-description">
          Upload your PDF documents, ask questions in natural language,
          and discover information faster with your personal AI assistant.
        </p>

        <div className="home-hero-actions">
          <Link to="/signup" className="home-primary-btn">
            Start for Free <ArrowRight size={18} />
          </Link>

          <a href="#how-it-works" className="home-secondary-btn">
            Explore Features
          </a>
        </div>

        <div className="home-trust">
          <span>
            <CheckCircle2 size={16} /> Simple to use
          </span>
          <span>
            <ShieldCheck size={16} /> Secure login
          </span>
        </div>
      </div>

      <div className="home-preview">
        <div className="preview-window">
          <div className="preview-topbar">
            <div className="preview-dots">
              <i />
              <i />
              <i />
            </div>
            <span>AI Second Brain Workspace</span>
          </div>

          <div className="preview-body">
            <aside className="preview-sidebar">
              <div className="preview-side-logo">
                <Brain size={20} />
                <span>SecondBrain</span>
              </div>

              <div className="preview-side-item active">
                <MessageSquare size={16} /> AI Chat
              </div>
              <div className="preview-side-item">
                <FileText size={16} /> My Documents
              </div>
              <div className="preview-side-item">
                <BookOpen size={16} /> Knowledge
              </div>
            </aside>

            <div className="preview-chat">
              <div className="preview-welcome">
                <div className="preview-ai-icon">
                  <Sparkles size={23} />
                </div>
                <h3>Ask your documents</h3>
                <p>Your AI assistant is ready to help.</p>
              </div>

              <div className="preview-document">
                <FileText size={22} />
                <div>
                  <strong>Study_Notes.pdf</strong>
                  <small>PDF document · Example preview</small>
                </div>
                <CheckCircle2 size={18} />
              </div>

              <div className="preview-question">
                Explain the key concepts in this document.
              </div>

              <div className="preview-answer">
                <Sparkles size={18} />
                <div>
                  <strong>AI Assistant</strong>
                  <p>
                    Upload your own PDF and ask questions to get
                    answers based on its content.
                  </p>
                </div>
              </div>

              <div className="preview-input">
                <span>Ask a question about your PDF...</span>
                <ArrowRight size={18} />
              </div>
            </div>
          </div>
        </div>

        <div className="home-float-card">
          <div className="home-float-icon">
            <Zap size={20} />
          </div>
          <div>
            <strong>AI-powered answers</strong>
            <p>Understand documents faster</p>
          </div>
        </div>
      </div>
    </section>

    <section className="home-features" id="features">
      <div className="home-section-heading">
        <span className="home-section-label">POWERFUL FEATURES</span>
        <h2>Everything you need to think smarter</h2>
        <p>
          Turn long documents into knowledge you can actually use.
        </p>
      </div>

      <div className="home-feature-grid">
        <article className="home-feature-card">
          <div className="home-feature-icon purple">
            <Upload size={25} />
          </div>
          <h3>Upload PDF Documents</h3>
          <p>
            Upload your study notes, reports, and readable PDF documents
            to get started.
          </p>
        </article>

        <article className="home-feature-card">
          <div className="home-feature-icon blue">
            <MessageSquare size={25} />
          </div>
          <h3>Chat with Your PDFs</h3>
          <p>
            Ask questions about your document and get AI-generated
            answers based on its content.
          </p>
        </article>

        <article className="home-feature-card">
          <div className="home-feature-icon green">
            <Brain size={25} />
          </div>
          <h3>Build Your Knowledge</h3>
          <p>
            Explore your information through a simple, organized
            personal workspace.
          </p>
        </article>
      </div>
    </section>

    <section className="home-how" id="how-it-works">
      <div className="home-section-heading">
        <span className="home-section-label">HOW IT WORKS</span>
        <h2>From PDF to answers in three steps</h2>
      </div>

      <div className="home-steps">
        <article className="home-step">
          <div className="home-step-number">01</div>
          <h3>Create your account</h3>
          <p>Sign up to enter your personal AI workspace.</p>
        </article>

        <article className="home-step">
          <div className="home-step-number">02</div>
          <h3>Upload your PDF</h3>
          <p>Select a document containing text you want to understand.</p>
        </article>

        <article className="home-step">
          <div className="home-step-number">03</div>
          <h3>Ask the AI</h3>
          <p>Ask questions and explore the information in your document.</p>
        </article>
      </div>
    </section>

    <section className="home-cta">
      <div className="home-cta-icon">
        <Brain size={30} />
      </div>
      <h2>Ready to give your knowledge a brain?</h2>
      <p>Create your account and start exploring your documents with AI.</p>
      <Link to="/signup" className="home-primary-btn">
        Get Started Now <ArrowRight size={18} />
      </Link>
    </section>
  </main>

  <footer className="home-footer">
    <Link to="/" className="home-logo">
      <span className="home-logo-icon">
        <Brain size={22} />
      </span>
      <span>
        Second<span className="home-highlight">Brain</span>
      </span>
    </Link>
    <p>Built to make learning and document understanding easier.</p>
    <span>© 2026 AI Second Brain</span>
  </footer>
</div>

);
}

export default Home;