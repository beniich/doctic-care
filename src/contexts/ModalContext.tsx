import React, { createContext, useContext, useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

// ============================================================================
// MODAL CONTEXT
// ============================================================================
interface ModalContextType {
    openModal: (content: React.ReactNode) => void;
    closeModal: () => void;
}

const ModalContext = createContext<ModalContextType>({
    openModal: () => { },
    closeModal: () => { }
});

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [modalContent, setModalContent] = useState<React.ReactNode>(null);

    const openModal = (content: React.ReactNode) => setModalContent(content);
    const closeModal = () => setModalContent(null);

    return (
        <ModalContext.Provider value={{ openModal, closeModal }}>
            {children}
            {modalContent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-background rounded-xl border border-border max-w-4xl w-full max-h-[90vh] overflow-y-auto relative shadow-2xl animate-in zoom-in-95 duration-200">
                        <Button variant="ghost" size="icon" className="absolute top-4 right-4 z-10" onClick={closeModal}>
                            <X className="h-4 w-4" />
                        </Button>
                        {modalContent}
                    </div>
                </div>
            )}
        </ModalContext.Provider>
    );
};

export function useModal() {
    return useContext(ModalContext);
}
