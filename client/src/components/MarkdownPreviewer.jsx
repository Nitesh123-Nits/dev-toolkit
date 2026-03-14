import React, { useState, useEffect } from 'react';
import { Copy, Trash2, Check, Edit3, Eye, Download, Bold, Italic, Link as LinkIcon, Image as ImageIcon, Code, List, Table } from 'lucide-react';
import { motion } from 'framer-motion';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

const MarkdownPreviewer = () => {
  const [input, setInput] = useState('# Hello Markdown\n\nStart typing your markdown here:\n\n* **Bold text**\n* *Italic text*\n* `Inline code`\n\n```javascript\nconsole.log("Hello World");\n```\n\n> Blockquotes are rendered beautifully.');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const textareaRef = React.useRef(null);

  // Parse markdown in real-time
  useEffect(() => {
    try {
      const rawHtml = marked.parse(input, { gfm: true, breaks: true });
      const cleanHtml = DOMPurify.sanitize(rawHtml);
      setOutput(cleanHtml);
    } catch (err) {
      console.error('Markdown parsing error:', err);
    }
  }, [input]);

  const handleCopy = () => {
    navigator.clipboard.writeText(input); // Copy raw markdown
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInput('');
  };

  const insertText = (before, after = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    
    const selectedText = text.substring(start, end);
    const newText = text.substring(0, start) + before + selectedText + after + text.substring(end);
    
    setInput(newText);
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  };

  const handleDownloadMarkdown = () => {
    const blob = new Blob([input], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadHtml = () => {
    const fullHtml = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  body { font-family: system-ui, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 2rem; color: #333; }
  pre { background: #f4f4f4; padding: 1rem; border-radius: 4px; overflow-x: auto; }
  code { background: #f4f4f4; padding: 0.2rem 0.4rem; border-radius: 3px; font-family: monospace; }
  blockquote { border-left: 4px solid #ccc; margin: 0; padding-left: 1rem; color: #666; }
  table { border-collapse: collapse; width: 100%; }
  th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
  th { background-color: #f4f4f4; }
  img { max-width: 100%; height: auto; }
</style>
</head>
<body>
${output}
</body>
</html>`;
    
    const blob = new Blob([fullHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="formatter-container"
      style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1, minHeight: 0 }}
    >
      <div className="dual-pane" style={{ flex: 1, minHeight: 0 }}>
        
        {/* Left Pane - Editor */}
        <div className="pane" style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <label className="field-label" style={{ marginBottom: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Edit3 size={16}/> Edit Markdown
            </label>
            <div style={{ display: 'flex', gap: '10px' }}>
               <button className="button-ghost" onClick={handleClear} style={{ padding: '4px 8px' }}>
                <Trash2 size={14} /> Clear
              </button>
            </div>
          </div>
          
          <div className="toolbar" style={{ display: 'flex', gap: '4px', marginBottom: '8px', padding: '6px', background: 'var(--bg-tertiary)', borderRadius: '6px', border: '1px solid var(--border-primary)', flexWrap: 'wrap' }}>
            <button className="icon-button" onClick={() => insertText('**', '**')} title="Bold" style={{ padding: '6px' }}><Bold size={14} /></button>
            <button className="icon-button" onClick={() => insertText('_', '_')} title="Italic" style={{ padding: '6px' }}><Italic size={14} /></button>
            <div style={{ width: '1px', background: 'var(--border-primary)', margin: '0 4px' }}></div>
            <button className="icon-button" onClick={() => insertText('[', '](url)')} title="Link" style={{ padding: '6px' }}><LinkIcon size={14} /></button>
            <button className="icon-button" onClick={() => insertText('![alt text](', ' image_url)')} title="Image" style={{ padding: '6px' }}><ImageIcon size={14} /></button>
            <div style={{ width: '1px', background: 'var(--border-primary)', margin: '0 4px' }}></div>
            <button className="icon-button" onClick={() => insertText('`', '`')} title="Inline Code" style={{ padding: '6px' }}><Code size={14} /></button>
            <button className="icon-button" onClick={() => insertText('\n```\n', '\n```\n')} title="Code Block" style={{ padding: '6px' }}><Code size={14} strokeWidth={3} /></button>
            <div style={{ width: '1px', background: 'var(--border-primary)', margin: '0 4px' }}></div>
            <button className="icon-button" onClick={() => insertText('- ', '')} title="Bulleted List" style={{ padding: '6px' }}><List size={14} /></button>
            <button className="icon-button" onClick={() => insertText('\n| Column 1 | Column 2 |\n|----------|----------|\n| Cell 1   | Cell 2   |\n', '')} title="Table" style={{ padding: '6px' }}><Table size={14} /></button>
          </div>
          
          <div className="output-wrapper" style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            <textarea 
              ref={textareaRef}
              className="textarea"
              placeholder="Start typing markdown..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={{ flex: 1, resize: 'none', overflowY: 'auto', minHeight: 0 }}
            />
            {input && (
              <div className="output-actions">
                <button className="icon-button" onClick={handleDownloadMarkdown} title="Download .md file">
                  <Download size={16} />
                </button>
                <button className="icon-button" onClick={handleCopy} title="Copy Raw Markdown">
                  {copied ? <Check size={16} className="text-success" /> : <Copy size={16} />}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Pane - Preview */}
        <div className="pane" style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <label className="field-label" style={{ marginBottom: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Eye size={16}/> Preview
            </label>
            {output && (
              <button className="button-ghost" onClick={handleDownloadHtml} style={{ padding: '4px 8px' }} title="Export as standalone HTML file">
                <Download size={14} /> Export HTML
              </button>
            )}
          </div>
          
          <div 
            className="textarea markdown-body"
            style={{ 
              flex: 1, 
              overflowY: 'auto', 
              minHeight: 0,
              backgroundColor: 'var(--card-bg)', 
              border: '1px solid var(--border)',
              borderRadius: '8px',
              padding: '24px',
              color: 'var(--text-secondary)'
            }}
            dangerouslySetInnerHTML={{ __html: output }}
          />
        </div>

      </div>
    </motion.div>
  );
};

export default MarkdownPreviewer;
