import React, { useState, useEffect } from 'react';
import { 
  FileJson, 
  FileCode, 
  Files, 
  Layout, 
  Type, 
  Settings, 
  ChevronRight,
  Braces,
  FileText,
  Hash,
  Key,
  Link2,
  Database,
  FileEdit,
  Code // Added Code icon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Formatter from './components/Formatter';
import Comparator from './components/Comparator';
import Base64Converter from './components/Base64Converter';
import JwtDecoder from './components/JwtDecoder';
import UrlEncoder from './components/UrlEncoder';
import SqlFormatter from './components/SqlFormatter';
import MarkdownPreviewer from './components/MarkdownPreviewer';
import CodeFormatter from './components/CodeFormatter'; 
import Home from './components/Home'; // Added Home import
import './App.css';

// Feature Components (Placeholders for now)
const ToolPlaceholder = ({ title, subtitle }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="tool-container"
  >
    <h2>{title} coming soon</h2>
    <p>{subtitle}</p>
  </motion.div>
);

function App() {
  const [activeTool, setActiveTool] = useState('home'); // Now defaults to 'home'
  const [theme, setTheme] = useState(() => localStorage.getItem('app-theme') || 'midnight');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('app-theme', theme);
  }, [theme]);

  const themes = [
    { id: 'midnight', name: 'Midnight', color: '#3b82f6' },
    { id: 'oceanic', name: 'Oceanic', color: '#06b6d4' },
    { id: 'cyberpunk', name: 'Cyberpunk', color: '#ec4899' },
    { id: 'forest', name: 'Forest', color: '#10b981' },
    { id: 'retro', name: 'Retro Arcade', color: '#fbbf24' },
    { id: 'daylight', name: 'Daylight', color: '#f8fafc' },
  ];

  const tools = [
    { 
      section: 'Formatters', 
      items: [
        { id: 'json-formatter', name: 'JSON Formatter', type: 'json', icon: <FileJson size={18} />, subtitle: 'Prettify your JSON data' },
        { id: 'yaml-formatter', name: 'YAML Formatter', type: 'yaml', icon: <FileCode size={18} />, subtitle: 'Convert and prettify YAML' },
        { id: 'xml-formatter', name: 'XML Formatter', type: 'xml', icon: <Braces size={18} />, subtitle: 'Format XML structures' },
        { id: 'sql-formatter', name: 'SQL Formatter', type: 'sql', icon: <Database size={18} />, subtitle: 'Format raw SQL queries' },
        { id: 'code-formatter', name: 'Code Formatter', type: 'code', icon: <Code size={18} />, subtitle: 'Format HTML, CSS, JS, etc.' }, // Added Code Formatter
      ]
    },
    { 
      section: 'Comparators', 
      items: [
        { id: 'text-comparator', name: 'Text Comparator', type: 'text', icon: <Type size={18} />, subtitle: 'Find differences in text' },
        { id: 'json-comparator', name: 'JSON Comparator', type: 'json', icon: <Files size={18} />, subtitle: 'Deep compare JSON objects' },
        { id: 'yaml-comparator', name: 'YAML Comparator', type: 'yaml', icon: <FileText size={18} />, subtitle: 'Diff YAML files' },
        { id: 'xml-comparator', name: 'XML Comparator', type: 'xml', icon: <Layout size={18} />, subtitle: 'Compare XML documents' },
      ]
    },
    {
      section: 'Encoders / Decoders',
      items: [
        { id: 'base64-converter', name: 'Base64 Converter', type: 'base64', icon: <Hash size={18} />, subtitle: 'Encode and decode Base64 strings' },
        { id: 'jwt-decoder', name: 'JWT Decoder', type: 'jwt', icon: <Key size={18} />, subtitle: 'Decode JSON Web Tokens' },
        { id: 'url-encoder', name: 'URL Encoder', type: 'url', icon: <Link2 size={18} />, subtitle: 'Encode and decode URLs' },
      ]
    },
    {
      section: 'Text & Documents',
      items: [
        { id: 'markdown-previewer', name: 'Markdown Previewer', type: 'md', icon: <FileEdit size={18} />, subtitle: 'Real-time Markdown editor' },
      ]
    }
  ];

  const getActiveToolData = () => {
    for (const section of tools) {
      const item = section.items.find(i => i.id === activeTool);
      if (item) return item;
    }
    return null;
  };

  const activeToolData = getActiveToolData();

  const renderTool = () => {
    if (activeTool === 'home') {
      return <Home key="home" setActiveTool={setActiveTool} />;
    }
    if (activeTool === 'sql-formatter') {
      return <SqlFormatter key={activeTool} />;
    }
    if (activeTool === 'code-formatter') { // Added condition for CodeFormatter
      return <CodeFormatter key={activeTool} />;
    }
    if (activeTool.includes('formatter')) {
      return <Formatter key={activeTool} type={activeToolData.type} />;
    }
    if (activeTool.includes('comparator')) {
      return <Comparator key={activeTool} type={activeToolData.type} />;
    }
    if (activeTool === 'base64-converter') {
      return <Base64Converter key={activeTool} />;
    }
    if (activeTool === 'jwt-decoder') {
      return <JwtDecoder key={activeTool} />;
    }
    if (activeTool === 'url-encoder') {
      return <UrlEncoder key={activeTool} />;
    }
    if (activeTool === 'markdown-previewer') {
      return <MarkdownPreviewer key={activeTool} />;
    }
    return (
      <ToolPlaceholder 
        key={activeTool}
        title={activeToolData?.name}
        subtitle={activeToolData?.subtitle}
      />
    );
  };

  return (
    <div className="app-shell">
      
      {/* Top Navigation Bar */}
      <header className="top-navbar">
        <div className="navbar-brand" onClick={() => setActiveTool('home')}>
          <FileCode size={24} color="var(--accent-primary)" />
          DevUtil
        </div>
        
        <div className="navbar-actions">
          {/* Theme Switcher in Navbar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-tertiary)', padding: '4px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-primary)' }}>
            {themes.map(t => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                title={`Switch to ${t.name} theme`}
                style={{
                  width: '24px',
                  height: '24px',
                  flexShrink: 0,
                  borderRadius: '50%',
                  background: t.color,
                  border: `2px solid ${theme === t.id ? 'var(--text-primary)' : 'transparent'}`,
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  transform: theme === t.id ? 'scale(1.1)' : 'scale(1)',
                  boxShadow: theme === t.id ? `0 0 12px ${t.color}` : 'none',
                }}
              />
            ))}
          </div>
        </div>
      </header>

      <div className="app-container">
        {/* Sidebar */}
        <aside className="sidebar">
          <nav className="sidebar-nav">
            <div 
              className={`nav-item ${activeTool === 'home' ? 'active' : ''}`}
              onClick={() => setActiveTool('home')}
              style={{ marginBottom: '16px' }}
            >
              <Layout size={18} />
              <span>Home Dashboard</span>
            </div>
            
            {tools.map((section) => (
              <React.Fragment key={section.section}>
                <div className="nav-section-label">{section.section}</div>
                {section.items.map((item) => (
                  <div 
                    key={item.id}
                    className={`nav-item ${activeTool === item.id ? 'active' : ''}`}
                    onClick={() => setActiveTool(item.id)}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </div>
                ))}
              </React.Fragment>
            ))}
          </nav>

          <div style={{ marginTop: 'auto' }}>
            <div className="nav-section-label" style={{ marginTop: '1.5rem' }}>System</div>
            <div className="nav-item">
              <Settings size={18} />
              <span>Settings</span>
            </div>
          </div>
        </aside>

        {/* Main Workspace */}
        <main className="main-content">
          {activeTool !== 'home' && activeToolData && (
            <ContentHeader 
              title={activeToolData.name} 
              subtitle={activeToolData.subtitle} 
            />
          )}
          
          <div className="tool-area">
            <AnimatePresence mode="wait">
              {renderTool()}
            </AnimatePresence>
          </div>

          <footer className="footer">
            <p>© {new Date().getFullYear()} DevUtil Studio. All processing is local and secure.</p>
          </footer>
        </main>
      </div>
    </div>
  );
}

const ContentHeader = ({ title, subtitle }) => (
  <header className="content-header">
    <h2 className="content-title">{title}</h2>
    <p className="content-subtitle">{subtitle}</p>
  </header>
);

export default App;
