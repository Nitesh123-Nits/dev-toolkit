import React, { useState } from 'react';
import { Copy, Trash2, Check, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import yaml from 'js-yaml';
import { XMLBuilder, XMLParser } from 'fast-xml-parser';

const Formatter = ({ type }) => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleFormat = () => {
    setError('');
    if (!input.trim()) return;

    try {
      let formatted = '';
      if (type === 'json') {
        const parsed = JSON.parse(input);
        formatted = JSON.stringify(parsed, null, 2);
      } else if (type === 'yaml') {
        const parsed = yaml.load(input);
        formatted = yaml.dump(parsed, { indent: 2 });
      } else if (type === 'xml') {
        const parser = new XMLParser();
        const parsed = parser.parse(input);
        const builder = new XMLBuilder({ format: true, indentBy: '  ' });
        formatted = builder.build(parsed);
      }
      setOutput(formatted);
    } catch (err) {
      setError(`Invalid ${type.toUpperCase()} format: ${err.message}`);
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

  const handleDownload = () => {
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `formatted.${type}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="formatter-container"
    >
      <div className="input-area">
        <label className="field-label">Input {type.toUpperCase()}</label>
        <textarea 
          className="textarea"
          placeholder={`Paste your ${type.toUpperCase()} here...`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <div className="action-bar">
          <button className="button" onClick={handleFormat}>Format</button>
          <button className="button-ghost" onClick={handleClear}>
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
          >
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
              <button className="icon-button" onClick={handleDownload}>
                <Download size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Formatter;
