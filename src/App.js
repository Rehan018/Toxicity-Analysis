import React, { useState } from 'react';
import * as toxicity from '@tensorflow-models/toxicity';
import './App.css';

function App() {
  const [state, setState] = useState({
    inputText: '',
    predictions: null,
    isLoading: false,
    error: null,
  });

  const { inputText, predictions, isLoading, error } = state;
  const threshold = 0.9;

  const handleChange = (e) => {
    setState((prevState) => ({ ...prevState, inputText: e.target.value }));
  };

  const classifyText = async () => {
    setState((prevState) => ({ ...prevState, isLoading: true, error: null }));

    try {
      const model = await toxicity.load(threshold);
      const results = await model.classify([inputText]);
      setState((prevState) => ({
        ...prevState,
        predictions: results,
        isLoading: false,
      }));
    } catch (err) {
      setState((prevState) => ({
        ...prevState,
        error: 'An error occurred while classifying text.',
        isLoading: false,
      }));
    }
  };

  return (
    <div className="container">
      <h1>Toxicity Classifier</h1>
      <textarea
        rows="4"
        placeholder="Enter text here..."
        value={inputText}
        onChange={handleChange}
        className="text-input"
      />
      <button onClick={classifyText} disabled={isLoading}>
        {isLoading ? 'Classifying...' : 'Classify Text'}
      </button>
      {error && <p className="error">{error}</p>}
      {predictions && (
        <div className="predictions">
          <h2>Predictions</h2>
          <ul>
            {predictions.map((prediction, index) => (
              <li key={index}>
                <strong>{prediction.label}</strong>:{' '}
                {prediction.results[0].match ? 'Toxic' : 'Not Toxic'}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
