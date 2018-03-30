class Tooltip{
    constructor($element, params){
        this.$parent = $element;
        this.params = this.mergeParams(params);
        this.$tooltip = this.getTemplate();
        this.initTooltip();
    }

    mergeParams(params) {
        return Object.assign({
            content: "",
            animationShow: "fadeInUp",
            animationHide: "fadeOut"
        }, params || {});
    }

    initTooltip(){
        this.$parent.appendChild(this.$tooltip);
        this.$parent.addEventListener("mouseenter", ()=>{
            this.$tooltip.style.display = "block";
            this.playAnimation(this.params.animationShow);
        });

        this.$parent.addEventListener("mouseleave", ()=>{
            this.playAnimation(this.params.animationHide, () => {
                this.$tooltip.style.display = "none";
            });
        });
    }

    getTemplate(){
        let $tooltipSpan = document.createElement("span");
        $tooltipSpan.classList.add("tooltip");
        $tooltipSpan.innerText = this.params.content;

        return $tooltipSpan;
    }

    playAnimation(animationName, callback) {
        let animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';

        this.$tooltip.classList.add("animated", animationName);

        animationEnd.split(" ").map((type)=>{
            this.$tooltip.addEventListener(type, ()=>{
                this.$tooltip.classList.remove("animated", animationName);
                if(typeof callback === "function"){
                    callback();
                }
            }, {once: true})
        });
    }
}

export default Tooltip;