import { createContext, useContext } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ImageHandleContext = createContext()
export const useImageHandleContext = () => {
    return useContext(ImageHandleContext)
}

export  const ImageHandleProvider = ({ children }) => {
    const ImageisValidOrNot = (file) => {
        if (!file) {
            // No file selected
            return false;
        }
        
        const allowedExtensions = ['.png', '.jpeg', '.jpg', '.webp', '.svg'];
        const fileExtension = file.name.split('.').pop().toLowerCase();
        return allowedExtensions.includes(`.${fileExtension}`);
    };
    return (
        <ImageHandleContext.Provider value={{ ImageisValidOrNot }}>
            {children}
        </ImageHandleContext.Provider>
    );
}


