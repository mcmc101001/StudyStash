/*
* Please note: TO CHANGE
* Use unique file id as key to upload file
* Take note
*/


"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useRef } from "react";

const MAX_FILE_SIZE = 10485760; // 10Mb

const cleanup = function(str: string) {
    return str.replace(/[^a-zA-Z0-9_.{}\- ]/g,'-');
}

export default function ResumeUploader() {

    const [ isDisabled, setIsDisabled ] = useState(false);
    const [ file, setFile ] = useState<File | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);

    const fileSelectedHandler = (e: React.FormEvent<HTMLInputElement>) => {
        if (e.currentTarget.files && e.currentTarget.files[0]) {
            setFile(e.currentTarget.files[0]);
            if (e.currentTarget.files[0].type != "application/pdf") {
                toast.error("Please upload a PDF file");
                // Set submit to disabled
                setIsDisabled(true);
            } else if (e.currentTarget.files[0].size > MAX_FILE_SIZE) {
                toast.error("Max file size: 10Mb");
                // Set submit to disabled
                setIsDisabled(true);
            } else {
              setIsDisabled(false);
            }
        }
    };

    const uploadFile = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!file || file.type != "application/pdf") {
            toast.error("Please upload a PDF file");
            return;
        } else {
            const safeFileName = cleanup(file.name);
            try {
                let { data } = await axios.post('/api/addPDF', {
                    name: safeFileName,
                    type: file.type,
                });
    
                const url = data.url;
    
                await axios.put(url, file, {
                  headers: {
                    "Content-Type": "application/pdf",
                    "Content-Disposition": "inline",
                    "Access-Control-Allow-Origin": "*",
                  },
                })
                
                toast.success('PDF uploaded successfully');
                
            } catch (error) {
                console.log(error);
                toast.error('Error uploading PDF.');
            }
            if (inputRef.current) {
                inputRef.current.value = '';
            }
            setIsDisabled(false);
        }
    };

    return (
        <form className="text-amber-700 flex flex-col justify-center items-center" onSubmit={(e) => uploadFile(e)}>
            <input
            type="file"
            accept=".pdf"
            ref = {inputRef}
            onChange={(e) => fileSelectedHandler(e)}
            ></input>
            <button disabled={isDisabled} type='submit'>Upload</button>
        </form>
        
    );
}