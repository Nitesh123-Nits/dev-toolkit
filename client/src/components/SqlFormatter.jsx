import React, { useState } from 'react';
import { Copy, Trash2, Check, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'sql-formatter';

const SqlFormatter = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleFormat = () => {
    console.log("SQL Formatter: handleFormat clicked!");
    console.log("Input:", input);
    setError('');
    if (!input.trim()) return;

    try {
      const formatted = format(input, {
        language: 'sql', 
        indent: '  ',     
        keywordCase: 'upper',
        linesBetweenQueries: 2
      });
      console.log("Formatted SQL:", formatted);
      setOutput(formatted);
    } catch (err) {
      console.error("SQL Formatter Error:", err);
      setError(`Invalid SQL: ${err.message}`);
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
        <label className="field-label">Raw SQL Query</label>
        <textarea 
          className="textarea"
          placeholder="Paste your unformatted SQL query here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <div className="action-bar" style={{ display: 'flex', gap: '10px' }}>
          <button className="button" onClick={handleFormat}>Format SQL</button>
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
        <label className="field-label">Formatted Result</label>
        <div className="output-wrapper">
          <textarea 
            className="textarea readonly"
            readOnly
            value={output}
            placeholder="Formatted output will appear here..."
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

export default SqlFormatter;
