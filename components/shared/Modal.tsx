'use client';

import { FC, useEffect } from 'react';
import { createPortal } from 'react-dom';
import AlertIcon from '../icons/status/AlertIcon';
import CrossIcon from '../icons/navigation/CrossIcon';
import IconButton from '../icons/IconButton';
import DoneIcon from '../icons/status/DoneIcon';
import InfoIcon from '../icons/status/InfoIcon';
import WarningIcon from '../icons/status/WarningIcon';
import Button from './Button';

type ModalProps = {
  type?: 'success' | 'info' | 'error' | 'warning';
  isOpen?: boolean;
  title?: string;
  description?: string;
  className?: string;
  onClose?: () => void;
  onBtnClick?: () => void;
  children?: React.ReactElement | React.ReactElement[];
  zIndex?: number;
};

const Modal: FC<ModalProps> = (props: ModalProps) => {
  const {
    type,
    title,
    description,
    zIndex = 60,
    isOpen = false,
    className = '',
    onClose,
    onBtnClick,
    children,
  } = props;

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open');
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('modal-open', 'overflow-hidden');
    }

    return () =>
      document.body.classList.remove('modal-open', 'overflow-hidden');
  }, [isOpen]);

  if (typeof document === 'undefined') {
    return null;
  }

  const root = document.getElementById('root') ?? document.body;

  if (!isOpen) {
    return null;
  }

  const getIcon = () => {
    switch (type) {
      case 'warning':
        return <WarningIcon />;
      case 'success':
        return <DoneIcon />;
      case 'error':
        return <AlertIcon />;
      default:
        return <InfoIcon />;
    }
  };

  const getBtnText = () => {
    switch (type) {
      case 'warning':
        return 'Продовжити';
      case 'error':
        return 'Спробувати ще раз';
      default:
        return 'Дякую';
    }
  };

  const getTypeIconClasses = () => {
    switch (type) {
      case 'warning':
        return 'bg-status-warning-100 border-status-warning-50';
      case 'success':
        return 'bg-status-success-100 border-status-success-50';
      case 'error':
        return 'bg-status-danger-100 border-status-danger-50';
      default:
        return 'bg-status-info-100 border-status-info-50';
    }
  };

  return createPortal(
    <div className={`z-${zIndex} modal-wrapper`}>
      <div className="modal-position">
        <div className={`modal ${className} z-${zIndex + 60}`}>
          <div className="flex justify-between items-center mb-2">
            <div className={`modal-icon ${getTypeIconClasses()} `}>
              {getIcon()}
            </div>
            <IconButton className="cursor-pointer" onClick={onClose}>
              <CrossIcon />
            </IconButton>
          </div>

          <h4 className="text-quote text-font-primary">{title}</h4>
          {description && <p className="text-small text-grey-700 mb-6 min-h-[40px]">
            {description}
          </p>}
          {onBtnClick && <Button onClick={onBtnClick}>{getBtnText()}</Button>}
          {children}
        </div>
      </div>
    </div>,
    root,
  );
};

export default Modal;
