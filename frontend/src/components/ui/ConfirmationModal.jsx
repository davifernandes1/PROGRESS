import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';

export const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirmar", cancelText = "Cancelar", isLoading = false }) => (
    <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={title}
        showActions={false}
        widthClass="max-w-md"
    >
        <div className="text-center">
            <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">{title}</h3>
            <div className="mt-2">
                <p className="text-sm text-gray-500">{message}</p>
            </div>
        </div>
        <div className="mt-5 sm:mt-6 grid grid-cols-2 gap-3">
            <Button variant="outline" onClick={onClose} disabled={isLoading}>{cancelText}</Button>
            <Button variant="danger" onClick={onConfirm} isLoading={isLoading} disabled={isLoading}>{confirmText}</Button>
        </div>
    </Modal>
);