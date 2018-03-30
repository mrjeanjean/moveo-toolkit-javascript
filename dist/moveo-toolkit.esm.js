var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var Popup = function () {
    function Popup(content, params) {
        classCallCheck(this, Popup);

        this.params = this.mergeParams(params);
        this.$popup = this.getTemplate(content);
        this.addEvents();
    }

    createClass(Popup, [{
        key: "mergeParams",
        value: function mergeParams(params) {
            return Object.assign({
                closeLabel: "Close",
                title: null,
                animationOpen: "fadeIn",
                animationClose: "fadeOut",
                popupClass: "default",
                onClose: function onClose() {},
                onOpen: function onOpen() {},
                data: {}
            }, params || {});
        }
    }, {
        key: "open",
        value: function open() {
            var _this = this;

            document.body.appendChild(this.$popup);
            this.playAnimation(this.params.animationOpen, function () {
                _this.params.onOpen();
            });
        }
    }, {
        key: "close",
        value: function close() {
            var _this2 = this;

            this.removeEvents();
            this.playAnimation(this.params.animationClose, function () {
                _this2.params.onClose();
                document.body.removeChild(_this2.$popup);
            });
        }
    }, {
        key: "getTemplate",
        value: function getTemplate(content) {
            var $overlay = document.createElement("div");
            $overlay.classList.add("popup-bg");

            var $popup = document.createElement("div");
            $popup.classList.add("popup");
            $popup.classList.add("popup-" + this.params.popupClass);

            var $popupInner = document.createElement("div");
            $popupInner.classList.add("popup-inner");

            var $popupContent = document.createElement("div");
            $popupContent.classList.add("popup-content");

            if (content instanceof Element) {
                $popupContent.appendChild(content);
            } else {
                $popupContent.innerHTML = content;
            }

            var $popupFooter = document.createElement("div");
            $popupFooter.classList.add("popup-footer");

            var $footerContent = this.getFooter();

            this.setHeader($popupInner);
            $popupInner.appendChild($popupContent);
            $popupFooter.appendChild($footerContent);
            $popupInner.appendChild($popupFooter);
            $popup.appendChild($popupInner);

            $overlay.appendChild($popup);

            return $overlay;
        }
    }, {
        key: "setHeader",
        value: function setHeader($popupInner) {
            if (!this.params.title) return;

            var $popupHeader = document.createElement("div");
            $popupHeader.classList.add("popup-header");
            $popupHeader.innerHTML = this.params.title;
            $popupInner.appendChild($popupHeader);
        }
    }, {
        key: "getFooter",
        value: function getFooter() {
            var $buttonClose = document.createElement("button");
            $buttonClose.classList.add("popup-button-close");
            $buttonClose.innerText = this.params.closeLabel;
            return $buttonClose;
        }
    }, {
        key: "playAnimation",
        value: function playAnimation(animationName, callback) {
            var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';

            var $popupInner = this.$popup.querySelector(".popup-inner");
            $popupInner.classList.add("animated", animationName);

            animationEnd.split(" ").map(function (type) {
                $popupInner.addEventListener(type, function () {
                    $popupInner.classList.remove("animated", animationName);
                    if (typeof callback === "function") {
                        callback();
                    }
                }, { once: true });
            });
        }
    }, {
        key: "keyPressed",
        value: function keyPressed(keyEvent) {
            if (keyEvent.keyCode == 27 || keyEvent.keyCode == 13) {
                this.close();
            }
        }
    }, {
        key: "addEvents",
        value: function addEvents() {
            this.$popup.querySelector(".popup-button-close").addEventListener("click", this.close.bind(this));
            this.$popup.addEventListener("click", this.close.bind(this));
            this.$popup.querySelector(".popup").addEventListener("click", function (e) {
                e.stopPropagation();
            });

            document.addEventListener("keyup", this.keyPressed.bind(this));
        }
    }, {
        key: "removeEvents",
        value: function removeEvents() {
            this.$popup.querySelector(".popup-button-close").removeEventListener("click", this.close.bind(this));
            this.$popup.removeEventListener("click", this.close.bind(this));
            this.$popup.querySelector(".popup").removeEventListener("click", function (e) {
                e.stopPropagation();
            });

            document.removeEventListener("keyup", this.keyPressed.bind(this));
        }
    }], [{
        key: "open",
        value: function open(content, params) {
            var popup = new Popup(content, params);
            popup.open();
            return popup;
        }
    }]);
    return Popup;
}();

var SelectStyler = function () {
    function SelectStyler($select) {
        var _this = this;

        classCallCheck(this, SelectStyler);

        this.$selectElement = $select;
        this.$selectElement.style.display = 'none';

        this.initSelect();

        document.body.addEventListener("click", function () {
            _this.close();
        });
    }

    createClass(SelectStyler, [{
        key: "initSelect",
        value: function initSelect() {
            this.$template = this.getTemplate();
            this.$selectElement.parentNode.insertBefore(this.$template, this.$selectElement.nextSibling);

            this.refreshValue();
        }
    }, {
        key: "refreshValue",
        value: function refreshValue() {
            var value = this.$selectElement.value;

            var currentSelect = this.$selectElement.querySelector("option[value='" + value + "'");
            this.$selectValue.innerText = currentSelect.innerText;

            var lis = this.$template.querySelector("li.active");

            if (lis != null) {
                lis.classList.remove("active");
            }

            var active = this.$template.querySelector("li[data-option-id='" + value + "'");
            active.classList.add("active");
        }
    }, {
        key: "onOptionSelect",
        value: function onOptionSelect(e) {
            var optionValue = e.target.getAttribute('data-option-id');
            e.stopPropagation();

            if (optionValue != undefined) {
                this.$selectElement.value = optionValue;
            }

            this.refreshValue();
            this.close();
        }
    }, {
        key: "close",
        value: function close() {
            this.$template.classList.remove("open");
        }
    }, {
        key: "getTemplate",
        value: function getTemplate() {
            var _this2 = this;

            var $template = document.createElement("div");
            $template.classList.add("select-styler");

            this.$selectValue = document.createElement("p");
            this.$selectValue.classList.add("select-value");

            this.$selectValue.addEventListener("click", function (e) {
                e.stopPropagation();
                $template.classList.toggle("open");
            });

            $template.appendChild(this.$selectValue);

            var $optionsList = document.createElement("ul");
            $template.appendChild($optionsList);

            var $options = this.$selectElement.querySelectorAll("option");

            $options.forEach(function (option) {
                var $option = document.createElement("li");
                $option.textContent = option.textContent;
                $option.setAttribute("data-option-id", option.value);
                $option.addEventListener("click", _this2.onOptionSelect.bind(_this2));
                $optionsList.appendChild($option);
            });

            return $template;
        }
    }], [{
        key: "select",
        value: function select($select) {
            new SelectStyler($select);
        }
    }, {
        key: "selectAll",
        value: function selectAll($selector) {
            var selects = document.querySelectorAll($selector);

            selects.forEach(function ($select) {
                SelectStyler.select($select);
            });
        }
    }]);
    return SelectStyler;
}();

var Tooltip = function () {
    function Tooltip($element, params) {
        classCallCheck(this, Tooltip);

        this.$parent = $element;
        this.params = this.mergeParams(params);
        this.$tooltip = this.getTemplate();
        this.initTooltip();
    }

    createClass(Tooltip, [{
        key: "mergeParams",
        value: function mergeParams(params) {
            return Object.assign({
                content: "",
                animationShow: "fadeInUp",
                animationHide: "fadeOut"
            }, params || {});
        }
    }, {
        key: "initTooltip",
        value: function initTooltip() {
            var _this = this;

            this.$parent.appendChild(this.$tooltip);
            this.$parent.addEventListener("mouseenter", function () {
                _this.$tooltip.style.display = "block";
                _this.playAnimation(_this.params.animationShow);
            });

            this.$parent.addEventListener("mouseleave", function () {
                _this.playAnimation(_this.params.animationHide, function () {
                    _this.$tooltip.style.display = "none";
                });
            });
        }
    }, {
        key: "getTemplate",
        value: function getTemplate() {
            var $tooltipSpan = document.createElement("span");
            $tooltipSpan.classList.add("tooltip");
            $tooltipSpan.innerText = this.params.content;

            return $tooltipSpan;
        }
    }, {
        key: "playAnimation",
        value: function playAnimation(animationName, callback) {
            var _this2 = this;

            var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';

            this.$tooltip.classList.add("animated", animationName);

            animationEnd.split(" ").map(function (type) {
                _this2.$tooltip.addEventListener(type, function () {
                    _this2.$tooltip.classList.remove("animated", animationName);
                    if (typeof callback === "function") {
                        callback();
                    }
                }, { once: true });
            });
        }
    }]);
    return Tooltip;
}();

export { Popup, SelectStyler, Tooltip };
