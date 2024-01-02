import { createContext, useContext } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ImageHandleContext = createContext();

export const useImageHandleContext = () => {
    return useContext(ImageHandleContext);
}

export const ImageHandleProvider = ({ children }) => {
    const MAX_FILE_SIZE_MB = 1.5;

    const ImageisValidOrNot = (file) => {
        if (!file) {
            // No file selected
            return false;
        }

        // Check file extension
        const allowedExtensions = ['.png', '.jpeg', '.jpg', '.webp', '.svg'];
        const fileExtension = file.name.split('.').pop().toLowerCase();
        const isExtensionValid = allowedExtensions.includes(`.${fileExtension}`);

        // Check file size
        const isSizeValid = file.size <= MAX_FILE_SIZE_MB * 1024 * 1024; // Convert MB to bytes

        return isExtensionValid && isSizeValid;
    };

    return (
        <ImageHandleContext.Provider value={{ ImageisValidOrNot }}>
            {children}
        </ImageHandleContext.Provider>
    );
}
