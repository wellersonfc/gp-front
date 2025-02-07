import React, { useEffect } from 'react';
import styles from './Modal.module.css';
import CadastroProjeto from '../Forms/CadastroProjeto';
import CadastroTarefa from '../Forms/CadastroTarefa';

const Modal = ({ isOpen, onClose, title, formType, projectId }) => {
  useEffect(() => {
    const handleCloseModal = () => {
      onClose();
    };

    window.addEventListener('fecharModal', handleCloseModal);

    return () => {
      window.removeEventListener('fecharModal', handleCloseModal);
    };
  }, [onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modalContainer}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{title}</h2>
          <button className={styles.closeButton} onClick={onClose}>×</button>
          <hr />
        </div>
        <div className={styles.modalBody}>
          {formType === 1 ? <CadastroProjeto /> : <CadastroTarefa projectId={projectId} />}
        </div>
      </div>
    </div>
  );
};

export default Modal;
