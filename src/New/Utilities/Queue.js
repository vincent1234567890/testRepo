/**
 * Created by eugeneseah on 2/3/17.
 */
/*

 Queue.js

 A function to represent a queue

 Created by Stephen Morley - http://code.stephenmorley.org/ - and released under
 the terms of the CC0 1.0 Universal legal code:

 http://creativecommons.org/publicdomain/zero/1.0/legalcode

 */

/* Creates a new queue. A queue is a first-in-first-out (FIFO) data structure -
 * items are added to the end of the queue and removed from the front.
 */
function Queue(){

    // initialise the queue and offset
    var queue  = [];
    var offset = 0;

    // Returns the length of the queue.
    this.getLength = function(){
        return (queue.length - offset);
    };

    // Returns true if the queue is empty, and false otherwise.
    this.isEmpty = function(){
        return (queue.length == 0);
    };

    /* Enqueues the specified item. The parameter is:
     *
     * item - the item to enqueue
     */
    this.enqueue = function(item){
        // for (let i in queue) {
        //     console.log("enqueue:", queue[i]._parent.__instanceId, ", i: ", i, ", queue[i]._moveAmount", queue[i]._moveAmount );
        // }
        console.log("enqueue:");
        queue.push(item);
    };

    /* Dequeues an item and returns it. If the queue is empty, the value
     * 'undefined' is returned.
     */
    this.dequeue = function(){

        // if the queue is empty, return immediately
        if (queue.length == 0) return undefined;

        // store the item at the front of the queue
        var item = queue[offset];

        // increment the offset and remove the free space if necessary
        if (++ offset * 2 >= queue.length){
            queue  = queue.slice(offset);
            offset = 0;
        }
        console.log("dequeue:offset:", offset, ", this.getLength()", this.getLength());
        // return the dequeued item
        return item;

    };

    /* Returns the item at the front of the queue (without dequeuing it). If the
     * queue is empty then undefined is returned.
     */
    this.peek = function(){
        return (queue.length > 0 ? queue[offset] : undefined);
    };

    this.getQueue = function(){
        // console.log()
        for (let i in queue) {
            console.log("getQueue:", queue[i]._parent.__instanceId, ", i: ", i, ", queue[i]._moveAmount", queue[i]._moveAmount );
        }
        const temp = queue.slice(offset - 1, offset + this.getLength());
        console.log("offset:", offset, ", this.getLength()", this.getLength() );
        for (let i in temp) {
            console.log("getQueue2:", temp[i]._parent.__instanceId, ", i: ", i, ", queue[i]._moveAmount", temp[i]._moveAmount );
        }
        return queue.slice(offset, queue.length);

    }
}

