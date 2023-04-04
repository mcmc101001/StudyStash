'use client'

import React, { useState } from 'react';

function PDFViewer(props: { url: string }) {
    const [ PDF, showPDF ] = useState(false);

    const togglePDF = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        showPDF(!PDF);
    }

    return ( 
        <>
            <button onClick={(e => togglePDF(e)) } className="bg-amber-700 text-white font-bold py-2 px-4 rounded"> Show resume </button>
            <iframe src={ PDF ? props.url : 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'} width="100%" height="500px"></iframe>
        </>
     );
}

export default PDFViewer;