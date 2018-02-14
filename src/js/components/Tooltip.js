class Tooltip{
    constructor($tooltipElement, $tooltipContent){
        this.$tooltipElement = $tooltipElement;
        this.tooltipContent = $tooltipContent;

        this.initTooltip();
    }

    initTooltip(){
        this.$tooltipSpan = this.getTemplate();

        this.$tooltipElement.classList.add("tooltip-parent");
        this.$tooltipElement.appendChild(this.$tooltipSpan);

        this.$tooltipElement.addEventListener("mouseenter", ()=>{
            this.$tooltipElement.classList.add("tooltip-active");
        });

        this.$tooltipElement.addEventListener("mouseleave", ()=>{
            this.$tooltipElement.classList.remove("tooltip-active");
        });
    }

    getTemplate(){
        let $tooltipSpan = document.createElement("span");
        $tooltipSpan.classList.add("tooltip");
        $tooltipSpan.innerText = this.tooltipContent;

        return $tooltipSpan;
    }

    static init($tooltipElement){
        let content = $tooltipElement.getAttribute("data-tooltip-content");
        new Tooltip($tooltipElement, content);
    }

    static initAll($selector){
        let $tooltips = document.querySelectorAll("[data-tooltip-content]");
        $tooltips.forEach(($tooltip)=>{
            Tooltip.init($tooltip);
        })
    }
}

export default Tooltip;