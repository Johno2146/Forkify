export default class Likes {
    constructor(){
        this.likes = [];
    }

    addLike(id, title, author, img){
        const like = {id, title, author, img};
        this.like.push(like);

        // Persist data in local Storage
        this.persistdata();
        return like;
    }

    deleteLike(id){
        const index = this.likes.findIndex(el => el.id === id);
        this.likes.splice(index, 1);

        // Persist data in local Storage
        this.persistdata();

    }

    isLiked(id){
        return this.likes.findIndex(el => el.id === id) !== -1;
    }

    getNumLikes(){
        return this.likes.length;
    }

    persistdata(){
        localStorage.setItem('likes', JSON.stringify(this.likes));
    }
    readStorage(){
        const storage = JSON.parse(localStorage.getItem('likes'));
        //Restoring likes from localStorage
        if(storage) this.likes = storage;
    }


};