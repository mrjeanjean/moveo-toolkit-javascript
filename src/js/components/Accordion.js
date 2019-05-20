class Accordion{
    constructor($element){
        this.current = 0;
        this.$element = $element;

        this.$element.classList.add("accordion");

        this.addEvents();
    }


    addEvents(){
        this.$element.querySelectorAll(".accordion-section").forEach(($section, index)=>{
            $section.addEventListener('click', ()=>{
                $section.classList.toggle("open");

            })
        })
    }

}

export default Accordion;