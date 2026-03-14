import React, { useState } from 'react';
import { Copy, Trash2, Check, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const JwtDecoder = () => {
  const [input, setInput] = useState('');
  const [headerOutput, setHeaderOutput] = useState('');
  const [payloadOutput, setPayloadOutput] = useState('');
  const [error, setError] = useState('');
  const [copiedHeader, setCopiedHeader] = useState(false);
  const [copiedPayload, setCopiedPayload] = useState(false);

  const handleDecode = () => {
    setError('');
    setHeaderOutput('');
    setPayloadOutput('');
    if (!input.trim()) return;

    try {
      const parts = input.split('.');
      if (parts.length !== 3) {
        throw new Error('JWT must have exactly 3 parts separated by dots.');
      }

      const decodeBase64Url = (str) => {
        // Base64Url decode logic
        let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
        // Pad with '=' to make length a multiple of 4
        while (base64.length % 4) {
          base64 += '=';
        }
        return decodeURIComponent(escape(atob(base64)));
      };

      const headerRaw = decodeBase64Url(parts[0]);
      const payloadRaw = decodeBase64Url(parts[1]);

      setHeaderOutput(JSON.stringify(JSON.parse(headerRaw), null, 2));
      setPayloadOutput(JSON.stringify(JSON.parse(payloadRaw), null, 2));

    } catch (err) {
      setError(`Invalid JWT: ${err.message}`);
    }
  };

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    if (type === 'header') {
      setCopiedHeader(true);
      setTimeout(() => setCopiedHeader(false), 2000);
    } else {
      setCopiedPayload(true);
      setTimeout(() => setCopiedPayload(false), 2000);
    }
  };

  const handleClear = () => {
    setInput('');
    setHeaderOutput('');
    setPayloadOutput('');
    setError('');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="formatter-container"
    >
      <div className="input-area">
        <label className="field-label">Encoded JWT</label>
        <textarea 
          className="textarea"
          placeholder="Paste JWT string here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ minHeight: '120px' }}
        />
        <div className="action-bar" style={{ display: 'flex', gap: '10px' }}>
          <button className="button" onClick={handleDecode}>Decode</button>
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

      {(headerOutput || payloadOutput) && (
        <div className="dual-pane" style={{ marginTop: '20px' }}>
          <div className="pane">
            <label className="field-label">HEADER (Algorithm & Token Type)</label>
            <div className="output-wrapper" style={{ height: '100%' }}>
              <textarea 
                className="textarea readonly"
                readOnly
                value={headerOutput}
                style={{ height: 'calc(100% - 20px)' }}
              />
              <div className="output-actions">
                <button className="icon-button" onClick={() => handleCopy(headerOutput, 'header')}>
                  {copiedHeader ? <Check size={16} className="text-success" /> : <Copy size={16} />}
                </button>
              </div>
            </div>
          </div>
          <div className="pane">
            <label className="field-label">PAYLOAD (Data)</label>
            <div className="output-wrapper" style={{ height: '100%' }}>
              <textarea 
                className="textarea readonly"
                readOnly
                value={payloadOutput}
                style={{ height: 'calc(100% - 20px)' }}
              />
              <div className="output-actions">
                <button className="icon-button" onClick={() => handleCopy(payloadOutput, 'payload')}>
                  {copiedPayload ? <Check size={16} className="text-success" /> : <Copy size={16} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default JwtDecoder;
