import React from 'react'
import Modal from './Modal'
import Button from './Button'

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, danger = false }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="mt-2">
        <p className="text-sm text-gray-500 dark:text-gray-400">{message}</p>
      </div>
      <div className="mt-6 flex justify-end space-x-3">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button variant={danger ? 'danger' : 'primary'} onClick={onConfirm}>
          Confirm
        </Button>
      </div>
    </Modal>
  )
}

export default ConfirmDialog
