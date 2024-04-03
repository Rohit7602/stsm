import React, { createContext, useContext } from 'react';

const ImageValidationContext = createContext();

export const useImageValidation = () => {
    const context = useContext(ImageValidationContext);
    return context;
};

export const ImageValidationProvider = ({ children }) => {
    // Define your image validation logic here
    const validateImage = async (file, desiredAspectRatio, desiredWidth, desiredHeight) => {
        // Check image size
        const maxSizeInBytes = 1.5 * 1024 * 1024; // 1.5 MB in bytes

        if (file.size > maxSizeInBytes) {
            throw new Error('Image size exceeds the allowed limit.');
        }

        // Continue with existing validation logic
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                const image = new Image();
                image.onload = () => {
                    const actualWidth = image.width;
                    const actualHeight = image.height;
                    const actualAspectRatio = actualWidth / actualHeight;
                    if (
                        Math.abs(actualAspectRatio - desiredAspectRatio) < 0.01 && // Adjust the threshold as needed
                        actualWidth <= desiredWidth &&
                        actualHeight <= desiredHeight
                    ) {
                        // Image meets the desired criteria
                        resolve(file);
                    } else {
                        // Image does not meet the required aspect ratio and dimensions
                        reject(new Error('Image does not meet the required aspect ratio and dimensions.'));
                    }
                };

                image.src = event.target.result;
            };

            reader.readAsDataURL(file);
        });
    };

    const contextValue = {
        validateImage,
    };

    return (
        <ImageValidationContext.Provider value={contextValue}>
            {children}
        </ImageValidationContext.Provider>
    );
};


