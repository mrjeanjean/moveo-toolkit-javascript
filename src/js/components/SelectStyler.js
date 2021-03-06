class SelectStyler {

    constructor($select, params = {}) {
        this.params = this.mergeParams(params);
        this.$selectElement = $select;
        this.$selectElement.style.display = 'none';

        this.initSelect();
        this.initEvents();
    }

    initSelect() {
        this.$template = this.getTemplate();
        this.$selectElement.parentNode.insertBefore(this.$template, this.$selectElement.nextSibling);

        this.refreshValue();
    }

    initEvents() {
        document.body.addEventListener("click", () => {
            this.close();
        });

        this.$selectElement.addEventListener("reset", this.reset.bind(this));
    }

    reset() {
        this.$template.remove();
        this.$selectElement.value = "";
        this.initSelect();
    }

    refreshValue() {
        let value = CSS.escape(this.$selectElement.value);

        let currentSelect;
        if (value === "" || typeof value === "undefined") {
            currentSelect = this.$selectElement.querySelector("option");
        } else {
            currentSelect = this.$selectElement.querySelector("option[value='" + value + "']");
        }

        this.$selectValue.innerText = currentSelect.innerText;

        let lis = this.$template.querySelector("li.active");

        if (lis != null) {
            lis.classList.remove("active");
        }

        let active;

        if (value !== "" && typeof value !== "undefined") {
            active = this.$template.querySelector("li[data-option-id='" + value + "']");
        }

        if (active) {
            active.classList.add("active");
        }
    }

    onOptionSelect(e) {
        let optionValue = e.target.getAttribute('data-option-id');
        e.stopPropagation();

        if (optionValue != undefined) {
            this.$selectElement.value = optionValue;
        }

        this.$selectElement.dispatchEvent(new Event('change'));

        this.refreshValue();
        this.close();
    }

    close() {
        this.$template.classList.remove("open");
    }

    getTemplate() {

        let $template = document.createElement("div");
        $template.classList.add("select-styler");

        this.$selectValue = document.createElement("p");
        this.$selectValue.classList.add("select-value");

        this.$selectValue.addEventListener("click", (e) => {
            e.stopPropagation();
            $template.classList.toggle("open");
        });

        $template.appendChild(this.$selectValue);

        let $optionsList = document.createElement("ul");
        $template.appendChild($optionsList);

        let $options = this.$selectElement.querySelectorAll("option");

        $options.forEach((option, index) => {
            if (!this.params.hideFirst || index !== 0) {
                let $option = document.createElement("li");
                $option.textContent = option.textContent;
                $option.setAttribute("data-option-id", option.value);
                $option.addEventListener("click", this.onOptionSelect.bind(this));
                $optionsList.appendChild($option);
            }
        });


        return $template;
    }

    mergeParams(params) {
        return Object.assign({
            hideFirst: false
        }, params);
    }


    static select($select, params = {}) {
        new SelectStyler($select, params);
    }

    static selectAll($selector, params = {}) {
        let selects = document.querySelectorAll($selector);

        selects.forEach(($select) => {
            SelectStyler.select($select, params);
        });
    }
}

export default SelectStyler;
