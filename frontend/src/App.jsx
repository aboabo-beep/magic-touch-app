import React, { useState } from 'react';

// Dit is de React-code uit de Code Code playground, nu in een complete app.
function App() {
    const [appState, setAppState] = useState('input'); // 'input', 'loading', 'result'
    const [inputValue, setInputValue] = useState('');
    const [result, setResult] = useState(null);

    async function handleMagicTouch() {
        if (inputValue.trim() === '' || appState === 'loading') return;
        
        setAppState('loading');
        
        try {
          const response = await fetch('/api/get-magic-touch', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ dish: inputValue })
          });
          
          const aiData = await response.json();

          if (response.ok) {
            // We parsen de markdown-achtige tekst naar HTML
            const formattedText = aiData.raw_text
              .replace(/### (.*?)\n/g, '<h3 class="text-xl font-semibold text-gray-200 mt-4 mb-2">$1</h3>')
              .replace(/\n/g, '<br />');
            setResult({ html: formattedText });
          } else {
            setResult({ error: aiData.error || "Er is een onbekende fout opgetreden." });
          }
          
        } catch (error) {
          setResult({ error: "Kon de server niet bereiken. Controleer je verbinding." });
        }
        
        setAppState('result');
    };

    const handleReset = () => {
        setAppState('input');
        setInputValue('');
        setResult(null);
    };

    return (
        <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center p-4 font-sans">
            <div className="w-full max-w-2xl bg-gray-800 rounded-2xl shadow-2xl p-8 transition-all duration-500">
                
                <h1 className="text-4xl font-bold text-center mb-2 text-yellow-400">Magic Touch</h1>
                <p className="text-center text-gray-400 mb-8">Geef je gerecht de finishing touch die het verdient.</p>

                {appState !== 'result' ? (
                    <>
                        <div className="relative mb-4">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Wat ben je aan het maken? (bv. risotto, omelet...)"
                                className="w-full p-4 bg-gray-700 rounded-lg border-2 border-gray-600 focus:outline-none focus:border-yellow-400 transition-colors"
                                disabled={appState === 'loading'}
                            />
                        </div>
                        <button
                            onClick={handleMagicTouch}
                            className="w-full p-4 bg-yellow-500 text-gray-900 font-bold rounded-lg hover:bg-yellow-400 transition-transform transform hover:scale-105 disabled:bg-gray-600 disabled:cursor-not-allowed"
                            disabled={appState === 'loading'}
                        >
                            {appState === 'loading' ? 'Momentje, de magie werkt...' : 'Vind de Magic Touch'}
                        </button>
                    </>
                ) : (
                    <div>
                        <h2 className="text-2xl font-semibold text-center mb-4">Suggesties voor je <span className="text-yellow-400">{inputValue}</span>:</h2>
                        <div className="bg-gray-700 p-6 rounded-lg text-left">
                            {result.error ? (
                                <p className="text-red-400">{result.error}</p>
                            ) : (
                                <div dangerouslySetInnerHTML={{ __html: result.html }} />
                            )}
                        </div>
                        <button
                            onClick={handleReset}
                            className="w-full mt-6 p-4 bg-gray-600 text-white font-bold rounded-lg hover:bg-gray-500 transition-colors"
                        >
                            Nog een gerecht proberen
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;