export class ObjectPool {
    constructor(object) {
        this.object = object;
        this.list = [];
        this.pool = [];
    }

    create(...args) { // Take an object from the pool, else create a new one
        // this.list.push(this.pool.length > 0 ? this.pool.pop().init(...args) : new Test(...args)); // TODO WHY ONELINE BEAUTY DOESNT WORK

        let test;
        if (this.pool.length > 0) {
            // test = this.pool.pop().init(...args); // WHY?

            test = this.pool.pop();
            test.init(...args);
        } else {
            test = new this.object(...args);
        }

        this.list.push(test);
    }

    destroy(i) { // Put the inactive object back to the pool to avoid garbage collect
        this.pool.push(this.list[i]);
        this.list.splice(i, 1);
    }
}
