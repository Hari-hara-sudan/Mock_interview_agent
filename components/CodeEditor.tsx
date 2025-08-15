'use client';

import { useTheme } from 'next-themes';
import { Editor } from '@monaco-editor/react';
import { useState, useEffect, useRef } from 'react';

interface CodeEditorProps {
  language: string;
  value: string;
  onChange: (value: string) => void;
  height?: string;
  placeholder?: string;
  readOnly?: boolean;
  className?: string;
}

export default function CodeEditor({
  language,
  value,
  onChange,
  height = "400px",
  placeholder,
  readOnly = false,
  className = ""
}: CodeEditorProps) {
  const { theme } = useTheme();
  const [editorTheme, setEditorTheme] = useState('vs-dark');
  const editorRef = useRef<any>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    setEditorTheme(theme === 'light' ? 'vs-light' : 'vs-dark');
  }, [theme]);

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;
    
    // Configure editor options
    editor.updateOptions({
      fontSize: 14,
      lineHeight: 20,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      automaticLayout: true,
      tabSize: 2,
      insertSpaces: true,
      wordWrap: 'on',
      lineNumbers: 'on',
      renderLineHighlight: 'line',
      scrollbar: {
        vertical: 'auto',
        horizontal: 'auto',
        verticalScrollbarSize: 8,
        horizontalScrollbarSize: 8,
      },
      suggestOnTriggerCharacters: true,
      quickSuggestions: true,
      formatOnPaste: true,
      formatOnType: true,
    });

    // Add custom key bindings
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      // Handle save shortcut if needed
      console.log('Save triggered');
    });

    // Add placeholder functionality
    if (placeholder && !value) {
      const placeholderDecoration = [
        {
          range: new monaco.Range(1, 1, 1, 1),
          options: {
            after: {
              content: placeholder,
              inlineClassName: 'monaco-placeholder'
            }
          }
        }
      ];
      editor.deltaDecorations([], placeholderDecoration);
    }
  };

  const handleEditorChange = (newValue: string | undefined) => {
    onChange(newValue || '');
  };

  const getLanguageName = (lang: string): string => {
    const languageMap: Record<string, string> = {
      'javascript': 'javascript',
      'typescript': 'typescript',
      'python': 'python',
      'java': 'java',
      'cpp': 'cpp',
      'c': 'c',
      'csharp': 'csharp',
      'go': 'go',
      'rust': 'rust',
      'ruby': 'ruby',
      'php': 'php',
      'swift': 'swift',
      'kotlin': 'kotlin',
    };
    return languageMap[lang] || 'javascript';
  };

  if (!isClient) {
    return (
      <div 
        className={`w-full bg-gray-900 rounded-lg flex items-center justify-center ${className}`}
        style={{ height }}
      >
        <div className="text-gray-400">Loading editor...</div>
      </div>
    );
  }

  return (
    <div className={`w-full border border-gray-700 rounded-lg overflow-hidden ${className}`}>
      <div className="bg-gray-800 px-4 py-2 border-b border-gray-700 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <span className="text-gray-300 text-sm ml-4">
            {getLanguageName(language).toUpperCase()}
          </span>
        </div>
        <div className="text-gray-400 text-xs">
          {readOnly ? 'Read Only' : 'Ctrl+S to save'}
        </div>
      </div>
      
      <Editor
        height={height}
        language={getLanguageName(language)}
        value={value}
        theme={editorTheme}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        options={{
          readOnly,
          contextmenu: !readOnly,
          selectOnLineNumbers: true,
          roundedSelection: false,
          scrollBeyondLastLine: false,
          cursorStyle: 'line',
          automaticLayout: true,
        }}
      />
      
      <style jsx global>{`
        .monaco-placeholder {
          color: #6b7280;
          font-style: italic;
          opacity: 0.7;
        }
        
        .monaco-editor .margin,
        .monaco-editor .monaco-editor-background,
        .monaco-editor-background {
          background-color: ${theme === 'light' ? '#ffffff' : '#1f2937'} !important;
        }
        
        .monaco-editor .decorationsOverviewRuler {
          background-color: ${theme === 'light' ? '#f3f4f6' : '#374151'} !important;
        }
      `}</style>
    </div>
  );
}
