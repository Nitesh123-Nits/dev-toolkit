import React, { useState } from 'react';
import { Copy, Trash2, Check, ArrowRightLeft, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Base64Converter = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleEncode = () => {
    setError('');
    if (!input.trim()) return;
    try {
      const encoded = btoa(unescape(encodeURIComponent(input)));
      setOutput(encoded);
    } catch (err) {
      setError(`Encoding failed: ${err.message}`);
      setOutput('');
    }
  };

  const handleDecode = () => {
    setError('');
    if (!input.trim()) return;
    try {
      const decoded = decodeURIComponent(escape(atob(input.trim())));
      setOutput(decoded);
    } catch (err) {
      setError(`Invalid Base64 string: ${err.message}`);
      setOutput('');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError('');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="formatter-container"
    >
      <div className="input-area">
        <label className="field-label">Input Text or Base64</label>
        <textarea 
          className="textarea"
          placeholder="Paste text or Base64 here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <div className="action-bar" style={{ display: 'flex', gap: '10px' }}>
          <button className="button" onClick={handleEncode}>Encode</button>
          <button className="button" onClick={handleDecode} style={{ backgroundColor: '#4f46e5', color: '#fff' }}>Decode</button>
          <button className="button-ghost" onClick={handleClear} style={{ marginLeft: 'auto' }}>
            <Trash2 size={16} />
            <span>Clear</span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="error-message"
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <ShieldAlert size={16} />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="output-area">
        <label className="field-label">Result</label>
        <div className="output-wrapper">
          <textarea 
            className="textarea readonly"
            readOnly
            value={output}
            placeholder="Result will appear here..."
          />
          {output && (
            <div className="output-actions">
              <button className="icon-button" onClick={handleCopy}>
                {copied ? <Check size={16} className="text-success" /> : <Copy size={16} />}
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Base64Converter;
