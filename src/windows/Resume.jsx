import React, { useState } from 'react';
import WindowWrapper from '#hoc/WindowWrapper';
import useWindowStore from '#store/window';
import { Download, FileText } from 'lucide-react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Initialize PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

const Resume = () => {
    const { closeWindow } = useWindowStore();
    const [numPages, setNumPages] = useState(null);

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
    };

    return (
        <div className="bg-white h-full w-full flex flex-col font-inter select-none overflow-hidden rounded-xl">
            {/* MacOS Window Header */}
            <div id="window-header" className="window-header">
                <div id="window-controls">
                    <button className="close" onClick={() => closeWindow("resume")}></button>
                    <button className="minimize"></button>
                    <button className="maximize"></button>
                </div>
                
                <h2 className="flex items-center justify-center gap-2">
                    <FileText size={14} className="text-gray-400" />
                    Sruthika_Resume.pdf
                </h2>
                
                <div className="w-20 flex justify-end pr-2">
                    <a href="/files/resume.pdf" download className="p-1.5 hover:bg-black/5 rounded-md transition-colors text-gray-500 hover:text-black">
                        <Download size={16} />
                    </a>
                </div>
            </div>

            {/* MacOS Preview-style Content Area (White background as requested) */}
            <div className="flex-1 w-full overflow-y-auto overflow-x-hidden bg-white custom-scrollbar relative border-t border-gray-100">
                <Document
                    file="/files/resume.pdf"
                    onLoadSuccess={onDocumentLoadSuccess}
                    className="flex flex-col items-center w-full"
                    loading={
                        <div className="flex flex-col items-center justify-center h-full min-h-[400px] space-y-4">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400"></div>
                            <p className="text-sm font-medium text-gray-400">Opening Document...</p>
                        </div>
                    }
                    error={
                        <div className="flex flex-col items-center justify-center p-12 space-y-4 min-h-[400px]">
                            <div className="size-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                <FileText size={32} className="text-gray-300" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800">Preview Unavailable</h3>
                            <p className="text-gray-500 max-w-sm text-center text-sm">
                                The PDF preview could not be loaded. Please try downloading the file.
                            </p>
                            <a 
                                href="/files/resume.pdf" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="mt-4 px-5 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-shadow shadow-sm active:scale-95"
                            >
                                Download Resume
                            </a>
                        </div>
                    }
                >
                    {numPages && Array.from(new Array(numPages), (el, index) => (
                         <Page 
                            key={`page_${index + 1}`}
                            pageNumber={index + 1} 
                            renderTextLayer={false} 
                            renderAnnotationLayer={false}
                            className="flex justify-center bg-white"
                            // Window is 768px, subtract 18px for scrollbar (8px) + gutters/safety
                            width={typeof window !== 'undefined' ? Math.min(window.innerWidth * 0.9 - 18, 750) : 750}
                        />
                    ))}
                </Document>
            </div>
        </div>
    );
};

const ResumeWindow = WindowWrapper(Resume, "resume");

export default ResumeWindow;