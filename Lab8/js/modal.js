class ItcModal {
    #elem;
    #template = `<section class="itc-modal-backdrop">
                    <section class="itc-modal-content itc-modal-scrollable">
                        <section class="itc-modal-header">
                            <section class="itc-modal-title">
                                {{title}}
                            </section>
                            <span class="itc-modal-btn-close" title="Закрыть">
                                ×
                            </span>
                        </section>
                        <section class="itc-modal-body">
                            {{content}}
                        </section>
                    </section>
                </section>`;
    #eventShowModal = new Event('show.itc.modal', { bubbles: true });
    #eventHideModal = new Event('hide.itc.modal', { bubbles: true });
    #disposed = false;

    constructor(options = []) {
        this.#elem = document.createElement('div');
        this.#elem.classList.add('itc-modal');
        let html = this.#template.replace('{{title}}', options.title || 'Новое окно');
        html = html.replace('{{content}}', options.content || '');
        this.#elem.innerHTML = html;
        document.body.append(this.#elem);
        this.#elem.addEventListener('click', this.#handlerCloseModal.bind(this));
  }

    #handlerCloseModal(e) {
        if (e.target.closest('.itc-modal-btn-close') || e.target.classList.contains('itc-modal-backdrop')) {
            this.hide();
        }
    }

    show() {
        if (this.#disposed) {
            return;
        }
        this.#elem.classList.add('itc-modal-show');
        const scrollbarWidth = Math.abs(window.innerWidth - document.documentElement.clientWidth);
        if (window.innerWidth > document.body.clientWidth + scrollbarWidth) {
            return;
        }
        document.body.style.paddingRight = `${scrollbarWidth}px`;
        document.body.style.overflow = 'hidden';
        this.#elem.dispatchEvent(this.#eventShowModal);
    }

    hide() {
        this.#elem.classList.remove('itc-modal-show');
        this.#elem.dispatchEvent(this.#eventHideModal);
        document.body.style.paddingRight = '';
        document.body.offsetHeight;
        this.#elem.addEventListener('transitionend', () => {
            document.body.style.overflow = '';
        }, { once: true });
    }

    dispose() {
        this.#elem.remove(this.#elem);
        this.#elem.removeEventListener('click', this.#handlerCloseModal);
        this.#disposed = true;
    }

    setBody(html) {
        this.#elem.querySelector('.itc-modal-body').innerHTML = html;
    }

    setTitle(text) {
        this.#elem.querySelector('.itc-modal-title').innerHTML = text;
    }
}
