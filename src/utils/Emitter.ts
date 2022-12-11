export class Emitter<T> {
    callbacks: EmitterCallback<T>[] = [];

    add(cb: EmitterCallback<T>) {
        if (this.callbacks.includes(cb)) return;
        this.callbacks.push(cb);
    }

    remove(cb: EmitterCallback<T>) {
        const idx = this.callbacks.indexOf(cb);
        if (idx != -1) this.callbacks.splice(idx, 1);
    }

    emit(obj: T) {
        this.callbacks.forEach(cb => cb(obj));
    }
}

export type EmitterCallback<T> = (obj: T) => any;