import React, { useEffect } from 'react';
import { XCircleIcon } from 'lucide-react';
import { Button } from './Button';

export const Modal = ({ title, children, isOpen, onClose, widthClass = "max-w-lg", showActions = true, primaryActionText = "Salvar", onPrimaryAction, primaryActionDisabled = false, secondaryActionText = "Cancelar", onSecondaryAction, isPrimaryActionLoading = false }) => {
    useEffect(() => {
        const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
        if (isOpen) { document.body.style.overflow = 'hidden'; window.addEventListener('keydown', handleEsc); }
        return () => { document.body.style.overflow = 'unset'; window.removeEventListener('keydown', handleEsc); };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 p-4 animate-fadeIn" onClick={onClose}>
            <div className={`relative w-full ${widthClass} flex max-h-[90vh] flex-col rounded-xl bg-white shadow-2xl animate-scaleUp`} onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between rounded-t-xl border-b bg-white p-5">
                    <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
                    <button onClick={onClose} className="rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600" aria-label="Fechar">
                        <XCircleIcon size={24} />
                    </button>
                </div>
                <div className="flex-grow overflow-y-auto p-5 md:p-6 custom-scrollbar">{children}</div>
                {showActions && (
                    <div className="flex items-center justify-end space-x-3 rounded-b-xl border-t bg-gray-50 p-4 md:p-5">
                        <Button onClick={onSecondaryAction || onClose} variant="outline">{secondaryActionText}</Button>
                        <Button onClick={onPrimaryAction} disabled={primaryActionDisabled} isLoading={isPrimaryActionLoading}>{primaryActionText}</Button>
                    </div>
                )}
            </div>
        </div>
    );
};
