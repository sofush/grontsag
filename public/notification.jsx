/** @jsx h */
import h from 'vhtml';
import { v4 as uuidv4 } from 'uuid';

const createElement = (id) => {
    return (
        <div id={id} class="group select-none is-error flex max-w-[350px] w-[350px] py-[10px] pr-[10px] rounded-md border-[2px]">
            <i class="notification-icon flex-initial mx-[24px] text-[28px] content-center group-[.is-error]:text-red-700 group-[.is-success]:text-green-dark group-[.is-waiting]:text-yellow-700 group-[.is-waiting]:animate-spin"></i>
            <div class="flex flex-1 flex-col pl-[20px] border-l-[3px] group-[.is-error]:border-red-700 group-[.is-success]:border-green-dark group-[.is-waiting]:border-yellow-700">
                <div class="notification-title font-inter-medium"></div>
                <div class="notification-content"></div>
            </div>
        </div>
    );
};

class Notification {
    constructor(task, options, autoClose) {
        this.id = uuidv4();
        this.task = task;

        const el = createElement(this.id);
        const containerEl = document.getElementById('notification-container');
        containerEl.insertAdjacentHTML('beforeend', el);

        this.#update(options);

        if (this.task && autoClose)
            this.#doAfterTask(() => this.#removeElement())
    }

    #update(options) {
        const el = this.#getElement();
        console.log(options);

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
    }

    async #doAfterTask(cb) {
        await this.task;
        cb();
    }

    #removeElement() {
        const el = this.#getElement();
        el.remove();
    }

    #getElement() {
        return document.getElementById(this.id);
    }
}

export default Notification;
