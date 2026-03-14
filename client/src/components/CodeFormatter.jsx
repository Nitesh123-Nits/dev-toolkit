import React, { useState } from 'react';
import { Play, Copy, Trash2, Check, AlertCircle, Code2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Importing standalone prettier and required browser plugins
import * as prettier from 'prettier/standalone';
import * as prettierPluginBabel from 'prettier/plugins/babel';
import * as prettierPluginEstree from 'prettier/plugins/estree';
import * as prettierPluginHtml from 'prettier/plugins/html';
import * as prettierPluginPostcss from 'prettier/plugins/postcss';

const SUPPORTED_LANGUAGES = [
  { id: 'javascript', name: 'JavaScript / JSX', parser: 'babel', plugins: [prettierPluginBabel, prettierPluginEstree] },
  { id: 'html', name: 'HTML', parser: 'html', plugins: [prettierPluginHtml] },
  { id: 'css', name: 'CSS / SCSS', parser: 'css', plugins: [prettierPluginPostcss] },
  { id: 'json', name: 'JSON', parser: 'json', plugins: [prettierPluginBabel, prettierPluginEstree] },
  { id: 'java', name: 'Java (Basic Indent)', parser: 'custom' },
  { id: 'csharp', name: 'C# (Basic Indent)', parser: 'custom' }
];

const CodeFormatter = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [activeLang, setActiveLang] = useState(SUPPORTED_LANGUAGES[0]);

  // Fallback basic indenter for C#/Java since Prettier doesn't support them natively in browser
  const basicIndent = (code) => {
    let indentLevel = 0;
    const lines = code.split('\n');
    let formatted = '';

    for (let line of lines) {
      line = line.trim();
      if (!line) continue;

      if (line.startsWith('}')) {
        indentLevel = Math.max(0, indentLevel - 1);
      }

      formatted += '  '.repeat(indentLevel) + line + '\n';

      if (line.endsWith('{')) {
        indentLevel++;
      }
    }
    return formatted.trim();
  };

  const handleFormat = async () => {
    if (!input.trim()) {
      setOutput('');
      setError('');
      return;
    }

    try {
      setError('');
      let formattedResult = '';

      if (activeLang.parser === 'custom') {
        // Fallback for Java/C#
        formattedResult = basicIndent(input);
      } else {
        // Prettier formatting
        formattedResult = await prettier.format(input, {
          parser: activeLang.parser,
          plugins: activeLang.plugins,
          semi: true,
          singleQuote: true,
          trailingComma: 'es5',
          printWidth: 80,
          tabWidth: 2,
        });
      }

      setOutput(formattedResult);
    } catch (err) {
      setError(err.message || 'Syntax Error: Could not format code.');
      console.error(err);
    }
  };

  const handleCopy = () => {
    if (output) {
      navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError('');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="formatter-container"
    >
      <div className="dual-pane">
        
        {/* Left Pane - Input */}
        <div className="pane">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label className="field-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Code2 size={16}/> Input Code
            </label>
            <select 
              className="textarea" 
              style={{ width: 'auto', minHeight: 'auto', padding: '4px 8px', borderRadius: '4px' }}
              value={activeLang.id}
              onChange={(e) => setActiveLang(SUPPORTED_LANGUAGES.find(l => l.id === e.target.value))}
            >
              {SUPPORTED_LANGUAGES.map(lang => (
                <option key={lang.id} value={lang.id}>{lang.name}</option>
              ))}
            </select>
          </div>
          <div className="input-area" style={{ flex: 1, position: 'relative' }}>
            <textarea 
              className="textarea"
              placeholder={`Paste your ${activeLang.name} code here...`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={{ height: '100%', resize: 'none' }}
            />
            {input && (
              <button 
                className="icon-button" 
                onClick={handleClear} 
                style={{ position: 'absolute', top: '10px', right: '10px' }}
                title="Clear input"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Center Action */}
        <div className="action-bar-center" style={{ flexDirection: 'column', justifyContent: 'center' }}>
          <button className="button" onClick={handleFormat} style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '0 auto' }}>
            <Play size={16} /> Format
          </button>
        </div>

        {/* Right Pane - Output */}
        <div className="pane">
          <label className="field-label">Formatted Output</label>
          <div className="output-area" style={{ flex: 1, position: 'relative' }}>
            <textarea 
              className="textarea readonly"
              value={output}
              readOnly
              placeholder="Result will appear here..."
              style={{ height: '100%', resize: 'none' }}
            />
            {output && (
              <button 
                className="icon-button" 
                onClick={handleCopy} 
                style={{ position: 'absolute', top: '10px', right: '10px' }}
                title="Copy formatted code"
              >
                {copied ? <Check size={16} className="text-success" /> : <Copy size={16} />}
              </button>
            )}
          </div>
        </div>

      </div>

      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="error-message"
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <AlertCircle size={16} /> {error}
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
};

export default CodeFormatter;
