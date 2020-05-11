import uniqueID from 'uniqueid';

export default class List {
 
    constructor(){
        this.items = [];
    }
 
    addItem (count, unit, ingredient) {
        const item = {
            id: uniqueID(),
            count,
            unit,
            ingredient
        }
        this.items.push(item);
        return item;
    }
 
    deleteItem(id) {
 
        console.log(id);
 
        const index = this.items.findIndex(el => el.id === id);
        this.items.splice(index,1);
    }
 
    updateCount(id, newCount) {
        this.items.find(el => el.id).count = newCount;
    }
}