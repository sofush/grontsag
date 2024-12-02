/** @jsx h */
import h from 'vhtml';
import { v4 as uuidv4 } from 'uuid';

const createElement = (id) => {
    return (
        <div id={id} class="group transition ease-in-out duration-500 select-none flex max-w-[350px] w-[350px] py-[10px] pr-[10px] rounded-md border-[2px]">
            <i class="notification-icon flex-initial mx-[24px] text-[28px] content-center group-[.is-error]:text-red-700 group-[.is-success]:text-green-dark group-[.is-waiting]:text-yellow-700 group-[.is-waiting]:animate-spin"></i>
            <div class="flex flex-1 flex-col pl-[20px] border-l-[3px] group-[.is-error]:border-red-700 group-[.is-success]:border-green-dark group-[.is-waiting]:border-yellow-700">
                <div class="notification-title font-inter-medium"></div>
                <div class="notification-content"></div>
            </div>
        </div>
    );
};

class Notification {
    constructor(options) {
        this.id = uuidv4();

        const el = createElement(this.id);
        const containerEl = document.getElementById('notification-container');
        containerEl.insertAdjacentHTML('beforeend', el);

        this.update(options);
    }

    update(options) {
        const el = this.getElement();

        if (this.state !== options.state) {
            switch (this.state) {
                case 'error': el.classList.remove('is-error'); break;
                case 'waiting': el.classList.remove('is-waiting'); break;
                case 'success': el.classList.remove('is-success'); break;
            }

            this.state = options.state;
            const iconEl = el.getElementsByClassName('notification-icon')[0];

            switch (this.state) {
                case 'error':
                    el.classList.add('is-error');
                    iconEl.textContent = '';
                    break;
                case 'waiting':
                    el.classList.add('is-waiting');
                    iconEl.textContent = '';
                    break;
                case 'success':
                    el.classList.add('is-success');
                    iconEl.textContent = '';
                    break;
            }
        }

        if (options.content) {
            const contentEl = el.getElementsByClassName('notification-content')[0];
            contentEl.textContent = options.content;
        }

        if (options.title) {
            const titleEl = el.getElementsByClassName('notification-title')[0];
            titleEl.textContent = options.title;
        }

        if (options.closeMs === 0) {
            this.getElement.remove();
        } else if (options.closeMs > 0) {
            setTimeout(() => {
                this.getElement().remove();
            }, options.closeMs);
        }
    }

    getElement() {
        if (this.el)
            return this.el;

        this.el = document.getElementById(this.id);
        return this.el;
    }
}

export default Notification;
