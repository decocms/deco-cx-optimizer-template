import { useState } from 'react';

export const App = (props) => {
  console.log('[MarkdownUploader] Component mounted with props:', props);
  
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [results, setResults] = useState([]);
  
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };
  
  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.name.endsWith('.md') || file.name.endsWith('.markdown') || file.name.endsWith('.mdx')
    );
    
    console.log('[MarkdownUploader] Files dropped:', files.length);
    
    if (files.length === 0) {
      alert('Please drop markdown files (.md, .markdown, or .mdx)');
      return;
    }
    
    await uploadFiles(files);
  };
  
  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);
    console.log('[MarkdownUploader] Files selected:', files.length);
    await uploadFiles(files);
  };
  
  const uploadFiles = async (files) => {
    setUploading(true);
    setResults([]);
    const uploadResults = [];
    
    for (const file of files) {
      try {
        console.log('[MarkdownUploader] Reading file:', file.name);
        const content = await readFileContent(file);
        
        // Extract name without extension
        const name = file.name.replace(/\.(md|markdown|mdx)$/i, '');
        
        console.log('[MarkdownUploader] Creating document:', name);
        const result = await callTool({
          integrationId: 'i:documents-management',
          toolName: 'DECO_RESOURCE_DOCUMENT_CREATE',
          input: {
            data: {
              name: name,
              description: `Uploaded from ${file.name}`,
              content: content
            }
          }
        });
        
        console.log('[MarkdownUploader] Document created:', result);
        
        uploadResults.push({
          filename: file.name,
          name: name,
          success: true,
          uri: result.structuredContent?.uri || 'Unknown'
        });
      } catch (error) {
        console.error('[MarkdownUploader] Failed to upload:', file.name, error);
        uploadResults.push({
          filename: file.name,
          success: false,
          error: error.message || 'Upload failed'
        });
      }
    }
    
    setResults(uploadResults);
    setUploading(false);
    console.log('[MarkdownUploader] Upload complete:', uploadResults);
  };
  
  const readFileContent = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  };
  
  return (
    <div 
      className="w-full min-h-screen p-6"
      style={{
        backgroundColor: 'var(--background)',
        color: 'var(--foreground)'
      }}
    >
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div 
          className="border p-6"
          style={{
            backgroundColor: 'var(--card)',
            borderColor: 'var(--border)',
            borderRadius: 'var(--radius)'
          }}
        >
          <h1 
            className="text-3xl font-bold mb-2"
            style={{ color: 'var(--card-foreground)' }}
          >
            📝 Markdown to Documents
          </h1>
          <p 
            className="text-base"
            style={{ color: 'var(--muted-foreground)' }}
          >
            Drag and drop markdown files here to convert them into Documents
          </p>
        </div>

        {/* Drop Zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className="border-2 border-dashed p-12 text-center transition-all"
          style={{
            backgroundColor: isDragging ? 'var(--accent)' : 'var(--card)',
            borderColor: isDragging ? 'var(--primary)' : 'var(--border)',
            borderRadius: 'var(--radius)',
            cursor: 'pointer'
          }}
        >
          <div className="space-y-4">
            <div className="text-6xl">
              {isDragging ? '📂' : '📄'}
            </div>
            <div>
              <p 
                className="text-xl font-semibold mb-2"
                style={{ color: 'var(--card-foreground)' }}
              >
                {isDragging ? 'Drop files here' : 'Drag & drop markdown files'}
              </p>
              <p 
                className="text-sm"
                style={{ color: 'var(--muted-foreground)' }}
              >
                Accepts .md, .markdown, and .mdx files
              </p>
            </div>
            <div>
              <label
                className="px-6 py-3 rounded-[var(--radius)] font-medium inline-block cursor-pointer transition-opacity hover:opacity-80"
                style={{
                  backgroundColor: 'var(--primary)',
                  color: 'var(--primary-foreground)'
                }}
              >
                Or click to browse files
                <input
                  type="file"
                  multiple
                  accept=".md,.markdown,.mdx"
                  onChange={handleFileSelect}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            </div>
          </div>
        </div>

        {/* Uploading Status */}
        {uploading && (
          <div 
            className="border p-6 text-center"
            style={{
              backgroundColor: 'var(--card)',
              borderColor: 'var(--border)',
              borderRadius: 'var(--radius)'
            }}
          >
            <div className="text-4xl mb-3">⏳</div>
            <p 
              className="text-lg font-semibold"
              style={{ color: 'var(--card-foreground)' }}
            >
              Uploading and converting files...
            </p>
          </div>
        )}

        {/* Results */}
        {results.length > 0 && !uploading && (
          <div 
            className="border p-6"
            style={{
              backgroundColor: 'var(--card)',
              borderColor: 'var(--border)',
              borderRadius: 'var(--radius)'
            }}
          >
            <h2 
              className="text-xl font-bold mb-4"
              style={{ color: 'var(--card-foreground)' }}
            >
              Upload Results
            </h2>
            <div className="space-y-3">
              {results.map((result, index) => (
                <div
                  key={index}
                  className="border p-4 flex items-start gap-3"
                  style={{
                    backgroundColor: result.success ? 'var(--success)' : 'var(--destructive)',
                    color: result.success ? 'var(--success-foreground)' : 'var(--destructive-foreground)',
                    borderColor: 'var(--border)',
                    borderRadius: 'var(--radius)',
                    opacity: 0.9
                  }}
                >
                  <div className="text-2xl flex-shrink-0">
                    {result.success ? '✅' : '❌'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold mb-1">
                      {result.filename}
                    </div>
                    {result.success ? (
                      <div className="text-sm">
                        Created document: <span className="font-medium">{result.name}</span>
                        <br />
                        <span className="opacity-75">{result.uri}</span>
                      </div>
                    ) : (
                      <div className="text-sm">
                        Error: {result.error}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <button
              onClick={() => setResults([])}
              className="mt-4 px-4 py-2 rounded-[var(--radius)] font-medium transition-opacity hover:opacity-80"
              style={{
                backgroundColor: 'var(--secondary)',
                color: 'var(--secondary-foreground)'
              }}
            >
              Clear Results
            </button>
          </div>
        )}

        {/* Instructions */}
        <div 
          className="border p-6"
          style={{
            backgroundColor: 'var(--muted)',
            borderColor: 'var(--border)',
            borderRadius: 'var(--radius)'
          }}
        >
          <h3 
            className="font-bold mb-2"
            style={{ color: 'var(--card-foreground)' }}
          >
            💡 How it works
          </h3>
          <ul 
            className="text-sm space-y-1 list-disc list-inside"
            style={{ color: 'var(--muted-foreground)' }}
          >
            <li>Drop one or more markdown files (.md, .markdown, or .mdx)</li>
            <li>Files are automatically converted to Documents</li>
            <li>Document name = filename without extension</li>
            <li>Original markdown content is preserved</li>
            <li>View results and navigate to created documents</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

// Metadata exports
export const name = "Markdown to Documents Uploader";
export const description = "Drag and drop markdown files (.md, .markdown, .mdx) to convert them into Documents";
export const icon = "📝";
export const tags = ["upload","markdown","documents","drag-drop"];