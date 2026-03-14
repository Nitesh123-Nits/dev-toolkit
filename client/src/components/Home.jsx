import React from 'react';
import { motion } from 'framer-motion';
import { 
  FileJson, 
  Braces, 
  Database, 
  Code,
  Type,
  Files,
  FileText,
  Layout,
  Hash,
  Key,
  Link2,
  FileEdit,
  FileCode
} from 'lucide-react';

const homeTools = [
  { id: 'json-formatter', name: 'JSON Formatter', icon: <FileJson size={24} />, description: 'Format and prettify JSON data instantly.', cat: 'Formatters' },
  { id: 'yaml-formatter', name: 'YAML Formatter', icon: <FileCode size={24} />, description: 'Convert and prettify YAML.', cat: 'Formatters' },
  { id: 'xml-formatter', name: 'XML Formatter', icon: <Braces size={24} />, description: 'Format XML structures.', cat: 'Formatters' },
  { id: 'sql-formatter', name: 'SQL Formatter', icon: <Database size={24} />, description: 'Format raw SQL queries to readable syntax.', cat: 'Formatters' },
  { id: 'code-formatter', name: 'Code Formatter', icon: <Code size={24} />, description: 'Universal formatting for JS, HTML, CSS.', cat: 'Formatters' },
  { id: 'text-comparator', name: 'Text Comparator', icon: <Type size={24} />, description: 'Find differences in text.', cat: 'Comparators' },
  { id: 'json-comparator', name: 'JSON Comparator', icon: <Files size={24} />, description: 'Deep diff JSON objects visually.', cat: 'Comparators' },
  { id: 'yaml-comparator', name: 'YAML Comparator', icon: <FileText size={24} />, description: 'Diff YAML files.', cat: 'Comparators' },
  { id: 'xml-comparator', name: 'XML Comparator', icon: <Layout size={24} />, description: 'Compare XML documents.', cat: 'Comparators' },
  { id: 'base64-converter', name: 'Base64 Tool', icon: <Hash size={24} />, description: 'Encode and decode Base64 strings.', cat: 'Encoders' },
  { id: 'jwt-decoder', name: 'JWT Decoder', icon: <Key size={24} />, description: 'Decode JSON Web Tokens.', cat: 'Encoders' },
  { id: 'url-encoder', name: 'URL Encoder', icon: <Link2 size={24} />, description: 'Encode and decode URLs.', cat: 'Encoders' },
  { id: 'markdown-previewer', name: 'Markdown Editor', icon: <FileEdit size={24} />, description: 'Live preview GFM with rich toolbar.', cat: 'Text' },
];

const Home = ({ setActiveTool }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="home-container"
      style={{ padding: '0 20px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}
    >
      <div style={{ textAlign: 'center', margin: '40px 0 60px 0' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '16px', fontFamily: 'var(--font-header, var(--font-sans))' }}>
          Welcome to <span style={{ color: 'var(--accent-primary)' }}>DevUtil</span>
        </h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
          The all-in-one blazing fast suite of utilities built entirely on the client side. No data leaves your browser.
        </p>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
        gap: '24px' 
      }}>
        {homeTools.map((tool, idx) => (
          <motion.div
            key={tool.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            onClick={() => setActiveTool(tool.id)}
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--glass-border)',
              borderRadius: 'var(--radius-md)',
              padding: '24px',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--accent-primary)';
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = 'var(--glass-shadow)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--glass-border)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ 
                padding: '12px', 
                background: 'var(--bg-tertiary)', 
                borderRadius: 'var(--radius-sm)',
                color: 'var(--accent-primary)'
              }}>
                {tool.icon}
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>{tool.name}</h3>
            </div>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.5 }}>{tool.description}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Home;
