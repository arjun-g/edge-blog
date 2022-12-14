export class TitleModifier{

    title: String

    constructor(title: String){
        this.title = `${title} - Arjun Ganesan's Blog`;
    }

    element(element) {
        element.setInnerContent(this.title);
    }
}