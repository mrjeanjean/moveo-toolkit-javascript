import {throttle} from './../utils';

class ScrollSpy {
    constructor(params) {
        this.init();
        this.params = this.mergeParams(params);
        this.currentVisibleItem = null;
        this.spyVisibleItem();
    }

    init() {
        this.items = this.getItems();
        this.attachEvents();
    }

    mergeParams(params) {
        return Object.assign({
            onCurrentItemChange: ()=>{}
        }, params || {});
    }


    getItems() {
        return document.querySelectorAll("[data-spy]");
    }

    attachEvents() {
        window.addEventListener("scroll", throttle(this.spyVisibleItem.bind(this), 200, this));
    }

    spyVisibleItem() {
        let itemsInView = Array.from(this.items).filter((item)=> {
            return this.isInView(item);
        });

        if(itemsInView.length <= 0) return;

        let currentItem = itemsInView[0].getAttribute("data-spy");

        if(currentItem != this.currentVisibleItem){
            this.params.onCurrentItemChange(currentItem, itemsInView[0]);
            this.currentVisibleItem = currentItem;
        }
    }

    isInView(item) {
        let itemBounds = item.getBoundingClientRect(),
            windowTop = window.pageYOffset || document.documentElement.scrollTop,
            windowBottom = windowTop + window.innerHeight,
            itemTop = itemBounds.top + windowTop,
            itemBottom = itemTop + item.offsetHeight;

        return (itemTop < windowBottom && itemTop > windowTop);
    }
}

export default ScrollSpy;