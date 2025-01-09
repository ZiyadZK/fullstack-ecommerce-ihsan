'use client'

export const modal = {
    show: (modalId) => {
        document.getElementById(modalId).showModal()
    },
    close: (modalId) => {
        document.getElementById(modalId).close()
    }
}

export default function Modal({
    children,
    title = 'Modal Title',
    closeButton = true,
    modalId = 'myModalId',
    modalClassname = '',
    modalBoxClassname = '',
    onClose = () => {},
    showTitle = true
}) {
    return (
        <dialog id={modalId} className={`modal ${modalClassname} backdrop-blur z-[990]`}>
            <div className={`modal-box ${modalBoxClassname} rounded bg-white  border-2 da`}>
                {closeButton && (
                    <form method="dialog">
                        <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                )}
                {showTitle && (
                    <>
                        <h3 className="font-bold text-lg">
                            {title}
                        </h3>
                        <hr className="my-3" />
                    </>
                )}
                {children}
            </div>
        </dialog>
    )
}