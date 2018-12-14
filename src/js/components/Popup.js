class Popup {
    constructor(content, params){
        this.params = this.mergeParams(params);
        this.$popup = this.getTemplate(content);
        this.addEvents();
    }

    mergeParams(params) {
        return Object.assign({
            closeLabel: "Close",
            title: null,
            animationOpen: "fadeIn",
            animationClose: "fadeOut",
            popupClass: "default",
            onClose: this.onClose,
            onOpen: this.onOpen,
            data: {}
        }, params || {});
    }

    open(){
        document.body.appendChild(this.$popup);
        this.playAnimation(this.params.animationOpen, ()=>{
            this.params.onOpen(this.$popup);
        });
    }

    close(){
        this.removeEvents();
        this.playAnimation(this.params.animationClose, ()=>{
            this.params.onClose(this.$popup);
            document.body.removeChild(this.$popup);
        });
    }

    onOpen($popup){
        // Can be overrided
    }

    onClose($popup){
        // Can be overrided
    }

    getTemplate(content){
        let $overlay = document.createElement("div");
        $overlay.classList.add("popup-bg");

        let $popup = document.createElement("div");
        $popup.classList.add("popup");
        $popup.classList.add("popup-" + this.params.popupClass);

        let $popupInner = document.createElement("div");
        $popupInner.classList.add("popup-inner");

        let $popupContent = document.createElement("div");
        $popupContent.classList.add("popup-content");

        if(content instanceof Element){
            $popupContent.appendChild(content)
        }else{
            $popupContent.innerHTML = content
        }

        let $popupFooter = document.createElement("div");
        $popupFooter.classList.add("popup-footer");

        let $footerContent = this.getFooter();

        this.setHeader($popupInner);
        $popupInner.appendChild($popupContent);
        $popupFooter.appendChild($footerContent);
        $popupInner.appendChild($popupFooter);
        $popup.appendChild($popupInner);

        $overlay.appendChild($popup);

        return $overlay;
    }

    setHeader($popupInner){
        if(!this.params.title) return;

        let $popupHeader = document.createElement("div");
        $popupHeader.classList.add("popup-header");
        $popupHeader.innerHTML = this.params.title;
        $popupInner.appendChild($popupHeader);
    }

    getFooter() {
        let $buttonClose = document.createElement("button");
        $buttonClose.classList.add("popup-button-close");
        $buttonClose.innerText = this.params.closeLabel;
        return $buttonClose;
    }

    playAnimation(animationName, callback) {
        let animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';

        let $popupInner = this.$popup.querySelector(".popup-inner");
        $popupInner.classList.add("animated", animationName);

        animationEnd.split(" ").map((type)=>{
            $popupInner.addEventListener(type, ()=>{
                $popupInner.classList.remove("animated", animationName);
                if(typeof callback === "function"){
                    callback();
                }
            }, {once: true})
        });
    }

    static open(content, params){
        let popupType = params.popupType || Popup;
        let popup = new popupType(content, params);
        popup.open();
        return popup;
    }

    keyPressed(keyEvent){
        if(keyEvent.keyCode == 27 || keyEvent.keyCode == 13){
            this.close();
        }
    }

    addEvents() {
        this.$popup.querySelector(".popup-button-close").addEventListener("click", this.close.bind(this));
        this.$popup.addEventListener("click", this.close.bind(this));
        this.$popup.querySelector(".popup").addEventListener("click", (e)=>{e.stopPropagation();});

        document.addEventListener("keyup", this.keyPressed.bind(this));
    }

    removeEvents() {
        this.$popup.querySelector(".popup-button-close").removeEventListener("click", this.close.bind(this));
        this.$popup.removeEventListener("click", this.close.bind(this));
        this.$popup.querySelector(".popup").removeEventListener("click", (e)=>{e.stopPropagation();});

        document.removeEventListener("keyup", this.keyPressed.bind(this));
    }


}

export default Popup;