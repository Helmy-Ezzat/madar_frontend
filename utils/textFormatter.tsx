import React from 'react';

/**
 * Purpose: Transforms raw text into a rich-media interactive UI by detecting 
 * URLs, Egyptian Phone numbers (WhatsApp), Emails, and Hashtags.
 */
export function formatJobText(text: string) {
    if (!text) return null;

    // Split text by new lines to maintain original paragraph structure
    return text.split('\n').map((line, index) => {
        // Handle empty lines by rendering a line break
        if (!line.trim()) return <br key={index} />;

        // Split line into words to analyze each element
        const words = line.split(' ').map((word, wordIndex) => {
            /**
             * CLEANING PHASE:
             * We remove the 'Object Replacement Character' (\ufffc) and invisible whitespaces.
             * This fixes the issue where links like ￼https://... were not detected.
             */
            const cleanWord = word.replace(/\ufffc/g, '').trim();

            // 1. URL DETECTION: Matches http/https links
            // We use the cleaned version for the check but keep punctuation for the UI if needed
            if (cleanWord.match(/^(https?:\/\/[^\s]+)/g)) {
                return (
                    <a
                        key={wordIndex}
                        href={cleanWord}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline break-all mx-1"
                    >
                        {cleanWord}
                    </a>
                );
            }

            // 2. WHATSAPP DETECTION: Matches Egyptian mobile formats (010, 011, 012, 015)
            if (cleanWord.match(/^01[0125][0-9]{8}$/)) {
                const waNumber = `20${cleanWord.substring(1)}`;
                return (
                    <a
                        key={wordIndex}
                        href={`https://wa.me/${waNumber}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 font-bold hover:text-green-700 mx-1 inline-flex items-center  gap-1"
                        title="Contact via WhatsApp"
                    >
                        <span className="text-lg">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                width="18"
                                height="18"
                            >
                                <path d="M20.52 3.48A11.862 11.862 0 0012 0C5.373 0 0 5.373 0 12a11.92 11.92 0 001.81 6.02L0 24l5.9-1.74A11.92 11.92 0 0012 24c6.627 0 12-5.373 12-12 0-3.2-1.25-6.22-3.48-8.52zM12 22.08a10.08 10.08 0 01-5.32-1.47l-.38-.23-3.5 1.03 1.04-3.42-.25-.4A10.08 10.08 0 011.92 12 10.08 10.08 0 0112 1.92 10.08 10.08 0 0122.08 12 10.08 10.08 0 0112 22.08zm5.46-7.28c-.24-.12-1.42-.7-1.64-.78-.23-.08-.4-.12-.57.12-.16.24-.62.78-.78.94-.16.16-.32.18-.59.06-.24-.12-.99-.36-1.88-1.16-.7-.62-1.16-1.38-1.3-1.62-.12-.24-.01-.36.1-.48.1-.1.24-.26.36-.39.12-.16.16-.26.24-.42.08-.16.04-.3-.02-.42-.06-.12-.57-1.38-.78-1.9-.21-.5-.43-.44-.57-.45l-.48-.02c-.16 0-.42.06-.64.3s-.84.82-.84 2 .86 2.32.98 2.48c.12.18 1.7 2.6 4.12 3.64.58.24 1.03.38 1.38.48.58.16 1.11.14 1.53.08.47-.08 1.42-.58 1.62-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28z" />
                            </svg>

                        </span>
                        <span className="dir-ltr">{cleanWord}</span>
                    </a>
                );
            }

            // 3. EMAIL DETECTION: Standard RFC email pattern
            if (cleanWord.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
                return (
                    <a
                        key={wordIndex}
                        href={`mailto:${cleanWord}`}
                        className="text-purple-600 font-bold hover:underline"
                        title="Send Email"
                    >
                        {cleanWord}
                    </a>
                );
            }

            // 4. HASHTAG DETECTION
            if (cleanWord.startsWith('#')) {
                return (
                    <span key={wordIndex} className="text-blue-500 font-bold wrap-break-word">
                        {cleanWord}
                    </span>
                );
            }

            // Default: Return the word as plain text
            return word + ' ';
        });

        // Wrap the processed words in a paragraph with consistent line height
        return (
            <p key={index} className="text-gray-700 text-right" dir="auto">
                {words}
            </p>
        );
    });
}