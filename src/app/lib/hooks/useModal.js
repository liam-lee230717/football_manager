import React, { useRef, useEffect, useState, createElement } from 'react';
import { createPortal } from "react-dom";
import {useModalStore} from "@/app/lib/store";

const useModal = (modalData) => {
  const [modalOpened, setModalOpened] = useState(false);
  const [modalMount, setModalMount] = useState(null);
  const { setModalOpen, setModalClose } = useModalStore();

  const openModal = (mode, row) => {
    const modalInfo = modalData[mode];
    if (!modalInfo) return;

    const props = {
      closeModal: closeModal,
      ...(row && { row }),
      ...(modalInfo.props && modalInfo.props)
    };

    setModalMount({ component: modalInfo.type, props });
    setModalOpened(true);
    setModalOpen();
  }

  const closeModal = () => {
    setModalOpened(false);
    setModalMount(null);
    setModalClose();
  }

  const keyEvent = (e) => {
    if (e.key === "Escape") {
      closeModal();
    }
  }

  const ModalPortal = () => {
    const ref = useRef();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
      setMounted(true);
      if (document) {
        const dom = document.querySelector('#LayerDetail');
        ref.current = dom;
      }
    }, [])

    useEffect(() => {
      if (modalOpened) {
        document.addEventListener("keyup", keyEvent)
        return () => {
          document.removeEventListener("keyup", keyEvent)
        }
      }
    }, [modalOpened])

    if (ref.current && mounted && modalOpened && modalMount) {
      return createPortal(
        createElement(modalMount.component, modalMount.props),
        ref.current
      );
    }
    return null;
  }

  return { openModal, ModalPortal }
}

export default useModal;
