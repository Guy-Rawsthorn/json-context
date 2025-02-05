import { ReactWidget } from '@jupyterlab/ui-components';

import React, { useState } from 'react';

import { requestAPI } from './handler'

/**
 * React component for a counter.
 *
 * @returns The React component
 */

const JsonCodeBlock: React.FC = () => {
  const [jsonInput, setJsonInput] = useState<string>('{\n  "example": "Type your JSON here!"\n}');
  const [error, setError] = useState<string | null>(null);

  // Handle input change and JSON validation
  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = event.target.value;
    setJsonInput(newValue);

    try {
      // Attempt to parse JSON
      JSON.parse(newValue);
      setError(null); // Clear error if valid JSON
    } catch (e) {
      setError('Invalid JSON syntax');
    }
  };

  const handleSaveClick = () => {
    console.log("buttonClicked")
    
    const jsonData = jsonInput
    console.log(jsonData)
    console.log(JSON.stringify(jsonData))
    
    requestAPI<any>('json', {
      body: JSON.stringify(jsonData),
      method: 'POST'
    })
    .then(reply => {
      console.log(reply);
    })
    .catch(reason => {
      console.error(
        `Error on POST /jupyterlab-json-context/json ${jsonData}.\n${reason}`
      );
    });
  }

  return (
    <div style={styles.container}>
      <textarea
        value={jsonInput}
        onChange={handleInputChange}
        style={styles.textArea}
        placeholder='Type JSON here...'
      />
      {error && <p style={styles.errorText}>{error}</p>}

      <div style={styles.buttonContainer}>
        <button onClick={handleSaveClick} style={styles.saveButton}>
          Save
        </button>
      </div>

    </div>
  );
};

/**
 * A Counter Lumino Widget that wraps a CounterComponent.
 */
export class JsonWidget extends ReactWidget {
  /**
   * Constructs a new CounterWidget.
   */
  constructor() {
    super();
    this.addClass('jp-react-widget');
  }

  render(): JSX.Element {
    return <JsonCodeBlock />;
  }
}

/**
 * Inline styles for basic UI layout.
 */
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as 'column',
    gap: '8px',
    padding: '10px',
    backgroundColor: '#f5f5f5',
    borderRadius: '8px',
    boxShadow: '0px 2px 8px rgba(0,0,0,0.1)',
    fontFamily: 'monospace',
  },
  textArea: {
    width: '100%',
    height: '200px',
    fontSize: '14px',
    padding: '8px',
    backgroundColor: '#272822',
    color: '#f8f8f2',
    border: '1px solid #444',
    borderRadius: '5px',
    fontFamily: 'monospace',
  },
  errorText: {
    color: 'red',
    fontSize: '12px',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '10px',
  },
  saveButton: {
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    fontSize: '14px',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  saveButtonHover: {
    backgroundColor: '#0056b3',
  }
};