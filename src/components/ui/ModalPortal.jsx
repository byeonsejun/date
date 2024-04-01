import reactDom from 'react-dom';

export default function ModalPortal({ children }) {
  const node = document.getElementById('portal');

  return reactDom.createPortal(children, node);
}
