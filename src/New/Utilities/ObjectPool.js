/**
 * Created by eugeneseah on 21/2/17.
 */
// const ObjectPool = (function () {
//     const _objectPool = {};
//     const ObjectPool = function () {
//
//     }
// }());

const ObjectPool = (function (){


    /**
     * Create a new object pool of a certain class
     *
     * @param objectClass the class
     */
    const ObjectPool = function(objectClass) {
        this.objectClass = objectClass;

        // metrics for tracking internals
        // this.metrics = {};
        // this._clearMetrics();

        // [private] the objpool stack
        this._objpool = [];
    };

    /**
     * Allocate a new object from the pool
     *
     * @return the object
     */
    ObjectPool.prototype.alloc = function alloc() {

        var obj;

        if (this._objpool.length == 0) {
            // console.log(arguments);
            // nothing in the free list, so allocate a new object
            //this works:
            obj = Object.create(this.objectClass.prototype);
            this.objectClass.apply(obj, arguments);

            // obj = new (Function.prototype.bind.apply(this.objectClass, arguments));
            // obj = new (this.objectClass.bind.apply(this.objectClass, arguments));

            // this.metrics.totalalloc++;

        } else {
            // grab one from the top of the objpool
            obj = this._objpool.pop();
            // obj.applySettings.apply(obj, arguments);
            this.objectClass.apply(obj, arguments);

            // this.metrics.totalfree--;
        }

        return obj;
    };

    /**
     * Return an object to the object pool
     */
    ObjectPool.prototype.free = function(obj) {

        // fix up the free list pointers
        this._objpool.push(obj);

        // this.metrics.totalfree++;
    };

    /**
     * Allow collection of all objects in the pool
     */
    ObjectPool.prototype.collect = function() {
        // just forget the list and let the garbage collector reap them
        this._objpool = []; // fresh and new

        // but we might have allocated objects that are in use/not in
        // the pool--track them in the metrics:
        // var inUse = this.metrics.totalalloc - this.metrics.totalfree;
        // this._clearMetrics(inUse);
    };

    /**
     * [private] Clear internal metrics
     */

    // ObjectPool.prototype._clearMetrics = function(allocated) {
    //     this.metrics.totalalloc = allocated || 0;
    //     this.metrics.totalfree = 0;
    // };

    return ObjectPool;

}());