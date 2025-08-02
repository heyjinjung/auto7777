import React from 'react';
import { useState } from 'react';
import { motion } from 'framer-motion';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: {
    nickname: string;
    tokens: number;
  };
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, userProfile }) => {
  const modalVariants = {
    open: { opacity: 1, scale: 1 },
    closed: { opacity: 0, scale: 0.9 },
  };

  return (
    <motion.div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ${isOpen ? 'block' : 'hidden'}`}
      onClick={onClose}
      initial="closed"
      animate={isOpen ? 'open' : 'closed'}
      variants={modalVariants}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="bg-white rounded-lg shadow-lg p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-4">User Profile</h2>
        <p className="mb-2">Nickname: {userProfile.nickname}</p>
        <p className="mb-4">Tokens: {userProfile.tokens}</p>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={onClose}
        >
          Close
        </button>
      </motion.div>
    </motion.div>
  );
};

export default Modal;