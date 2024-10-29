import React from 'react';
import { X, Copy, Check } from 'lucide-react';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { javascript, python, typescript, css, html, java } from 'react-syntax-highlighter/dist/esm/languages/hljs';

// Register languages
SyntaxHighlighter.registerLanguage('javascript', javascript);
SyntaxHighlighter.registerLanguage('python', python);
SyntaxHighlighter.registerLanguage('typescript', typescript);
SyntaxHighlighter.registerLanguage('css', css);
SyntaxHighlighter.registerLanguage('html', html);
SyntaxHighlighter.registerLanguage('java', java);

interface CodePreviewProps {
  code: string;
  language: string;
  onClose: () => void;
}

export function CodePreview({ code, language, onClose }: CodePreviewProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="absolute inset-0 bg-black bg-opacity-60" onClick={onClose} />
      <div className="bg-gray-900 rounded-lg w-full max-w-4xl p-6 relative z-10 max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-white">Visualização do Código</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="p-2 text-gray-300 hover:text-white transition-colors rounded-lg hover:bg-gray-800"
              title={copied ? "Copiado!" : "Copiar código"}
            >
              {copied ? (
                <Check className="w-5 h-5 text-green-500" />
              ) : (
                <Copy className="w-5 h-5" />
              )}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-300 hover:text-white transition-colors rounded-lg hover:bg-gray-800"
              title="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-auto rounded-lg">
          <SyntaxHighlighter
            language={language.toLowerCase()}
            style={atomOneDark}
            customStyle={{
              margin: 0,
              padding: '1.5rem',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              backgroundColor: '#1a1b26',
            }}
            showLineNumbers
          >
            {code}
          </SyntaxHighlighter>
        </div>
      </div>
    </div>
  );
}