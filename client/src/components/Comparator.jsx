import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Diff, Trash2, Check, Copy } from 'lucide-react';
import * as diff from 'diff';
import yaml from 'js-yaml';
import { XMLParser } from 'fast-xml-parser';

const Comparator = ({ type }) => {
  const [leftInput, setLeftInput] = useState('');
  const [rightInput, setRightInput] = useState('');
  const [diffResult, setDiffResult] = useState([]);
  const [error, setError] = useState('');

  const handleCompare = () => {
    setError('');
    try {
      let leftStr = leftInput;
      let rightStr = rightInput;

      if (type !== 'text') {
        // For structured data, we parse then re-stringify to ensure consistent formatting before diff
        if (type === 'json') {
          leftStr = JSON.stringify(JSON.parse(leftInput || '{}'), null, 2);
          rightStr = JSON.stringify(JSON.parse(rightInput || '{}'), null, 2);
        } else if (type === 'yaml') {
          leftStr = yaml.dump(yaml.load(leftInput || ''), { indent: 2 });
          rightStr = yaml.dump(yaml.load(rightInput || ''), { indent: 2 });
        } else if (type === 'xml') {
          const parser = new XMLParser();
          leftStr = JSON.stringify(parser.parse(leftInput || ''), null, 2);
          rightStr = JSON.stringify(parser.parse(rightInput || ''), null, 2);
        }
      }

      const changes = diff.diffLines(leftStr, rightStr);
      setDiffResult(changes);
    } catch (err) {
      setError(`Invalid ${type.toUpperCase()}: ${err.message}`);
      setDiffResult([]);
    }
  };

  const handleClear = () => {
    setLeftInput('');
    setRightInput('');
    setDiffResult([]);
    setError('');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="comparator-container"
    >
      <div className="dual-pane">
        <div className="pane">
          <label className="field-label">Original (Left)</label>
          <textarea 
            className="textarea"
            placeholder={`Paste original ${type.toUpperCase()}...`}
            value={leftInput}
            onChange={(e) => setLeftInput(e.target.value)}
          />
        </div>
        <div className="pane">
          <label className="field-label">Modified (Right)</label>
          <textarea 
            className="textarea"
            placeholder={`Paste modified ${type.toUpperCase()}...`}
            value={rightInput}
            onChange={(e) => setRightInput(e.target.value)}
          />
        </div>
      </div>

      <div className="action-bar-center">
        <button className="button" onClick={handleCompare}>
          <Diff size={18} />
          <span>Compare</span>
        </button>
        <button className="button-ghost" onClick={handleClear}>
          <Trash2 size={16} />
          <span>Clear All</span>
        </button>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="error-message"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {diffResult.length > 0 && (
        <div className="diff-output">
          <label className="field-label">Comparison result</label>
          <div className="diff-viewer">
            {diffResult.map((part, index) => (
              <div 
                key={index}
                className={`diff-line ${part.added ? 'added' : part.removed ? 'removed' : ''}`}
              >
                {part.value}
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Comparator;
