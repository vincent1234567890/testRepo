/**
 * Created by eugeneseah on 13/2/17.
 */

const BookCollector = {
    addToCollection (name) {
        this.collection().push(name);
        return this;
    },
    collection () {
        return this._collected_books || (this._collected_books = []);
    }
};