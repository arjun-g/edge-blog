export class Base {

    db: D1Database

    constructor(db: D1Database){
        this.db = db;
    }

    formatDate(date: Date | number){
        const dateObj = new Date(date);
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return `${months[dateObj.getMonth()]} ${dateObj.getDate()}, ${dateObj.getFullYear()}`;
    }

    randomString(){
        return (Math.random() + 1).toString(36).substring(2);
    }

    randomNumber(min, max){
        return Math.round(Math.random() * (max - min) + min);
    }

}