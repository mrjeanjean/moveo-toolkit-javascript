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
    function Popup(content) {
        var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
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
                onClose: this.onClose,
                onOpen: this.onOpen,
                beforeOpen: function beforeOpen() {
                    return true;
                },
                beforeClose: function beforeClose() {
                    return true;
                },
                data: {}
            }, params || {});
        }
    }, {
        key: "open",
        value: function open() {
            var _this = this;

            this.params.beforeOpen(this.$popup, this);
            document.body.appendChild(this.$popup);
            this.playAnimation(this.params.animationOpen, function () {
                _this.params.onOpen(_this.$popup, _this);
            });
        }
    }, {
        key: "close",
        value: function close() {
            var _this2 = this;

            this.params.beforeClose(this.$popup, this);
            this.removeEvents();
            this.playAnimation(this.params.animationClose, function () {
                _this2.params.onClose(_this2.$popup, _this2);
                document.body.removeChild(_this2.$popup);
            });
        }
    }, {
        key: "onOpen",
        value: function onOpen($popup) {
            // Can be overrided
        }
    }, {
        key: "onClose",
        value: function onClose($popup) {
            // Can be overrided
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
            var popupType = params.popupType || Popup;
            var popup = new popupType(content, params);
            popup.open();
            return popup;
        }
    }]);
    return Popup;
}();

var SelectStyler = function () {
    function SelectStyler($select) {
        var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        classCallCheck(this, SelectStyler);

        this.params = this.mergeParams(params);
        this.$selectElement = $select;
        this.$selectElement.style.display = 'none';

        this.initSelect();
        this.initEvents();
    }

    createClass(SelectStyler, [{
        key: "initSelect",
        value: function initSelect() {
            this.$template = this.getTemplate();
            this.$selectElement.parentNode.insertBefore(this.$template, this.$selectElement.nextSibling);

            this.refreshValue();
        }
    }, {
        key: "initEvents",
        value: function initEvents() {
            var _this = this;

            document.body.addEventListener("click", function () {
                _this.close();
            });

            this.$selectElement.addEventListener("reset", this.reset.bind(this));
        }
    }, {
        key: "reset",
        value: function reset() {
            this.$template.remove();
            this.$selectElement.value = "";
            this.initSelect();
        }
    }, {
        key: "refreshValue",
        value: function refreshValue() {
            var value = CSS.escape(this.$selectElement.value);

            var currentSelect = void 0;
            if (value === "" || typeof value === "undefined") {
                currentSelect = this.$selectElement.querySelector("option");
            } else {
                currentSelect = this.$selectElement.querySelector("option[value='" + value + "']");
            }

            this.$selectValue.innerText = currentSelect.innerText;

            var lis = this.$template.querySelector("li.active");

            if (lis != null) {
                lis.classList.remove("active");
            }

            var active = void 0;

            if (value !== "" && typeof value !== "undefined") {
                active = this.$template.querySelector("li[data-option-id='" + value + "']");
            }

            if (active) {
                active.classList.add("active");
            }
        }
    }, {
        key: "onOptionSelect",
        value: function onOptionSelect(e) {
            var optionValue = e.target.getAttribute('data-option-id');
            e.stopPropagation();

            if (optionValue != undefined) {
                this.$selectElement.value = optionValue;
            }

            this.$selectElement.dispatchEvent(new Event('change'));

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

            $options.forEach(function (option, index) {
                if (!_this2.params.hideFirst || index !== 0) {
                    var $option = document.createElement("li");
                    $option.textContent = option.textContent;
                    $option.setAttribute("data-option-id", option.value);
                    $option.addEventListener("click", _this2.onOptionSelect.bind(_this2));
                    $optionsList.appendChild($option);
                }
            });

            return $template;
        }
    }, {
        key: "mergeParams",
        value: function mergeParams(params) {
            return Object.assign({
                hideFirst: false
            }, params);
        }
    }], [{
        key: "select",
        value: function select($select) {
            var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            new SelectStyler($select, params);
        }
    }, {
        key: "selectAll",
        value: function selectAll($selector) {
            var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            var selects = document.querySelectorAll($selector);

            selects.forEach(function ($select) {
                SelectStyler.select($select, params);
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

// Throttle function to increase performance
// from _underscore
var throttle = function throttle(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    if (!options) options = {};
    var later = function later() {
        previous = options.leading === false ? 0 : Date.now();
        timeout = null;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
    };
    return function () {
        var now = Date.now();
        if (!previous && options.leading === false) previous = now;
        var remaining = wait - (now - previous);
        context = this;
        args = arguments;
        if (remaining <= 0 || remaining > wait) {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            previous = now;
            result = func.apply(context, args);
            if (!timeout) context = args = null;
        } else if (!timeout && options.trailing !== false) {
            timeout = setTimeout(later, remaining);
        }
        return result;
    };
};

var ScrollSpy = function () {
    function ScrollSpy(params) {
        classCallCheck(this, ScrollSpy);

        this.init();
        this.params = this.mergeParams(params);
        this.currentVisibleItem = null;
        this.spyVisibleItem();
    }

    createClass(ScrollSpy, [{
        key: "init",
        value: function init() {
            this.items = this.getItems();
            this.attachEvents();
        }
    }, {
        key: "mergeParams",
        value: function mergeParams(params) {
            return Object.assign({
                onCurrentItemChange: function onCurrentItemChange() {}
            }, params || {});
        }
    }, {
        key: "getItems",
        value: function getItems() {
            return document.querySelectorAll("[data-spy]");
        }
    }, {
        key: "attachEvents",
        value: function attachEvents() {
            window.addEventListener("scroll", throttle(this.spyVisibleItem.bind(this), 200, this));
        }
    }, {
        key: "spyVisibleItem",
        value: function spyVisibleItem() {
            var _this = this;

            var itemsInView = Array.from(this.items).filter(function (item) {
                return _this.isInView(item);
            });

            if (itemsInView.length <= 0) return;

            var currentItem = itemsInView[0].getAttribute("data-spy");

            if (currentItem != this.currentVisibleItem) {
                this.params.onCurrentItemChange(currentItem, itemsInView[0]);
                this.currentVisibleItem = currentItem;
            }
        }
    }, {
        key: "isInView",
        value: function isInView(item) {
            var itemBounds = item.getBoundingClientRect(),
                windowTop = window.pageYOffset || document.documentElement.scrollTop,
                windowBottom = windowTop + window.innerHeight,
                itemTop = itemBounds.top + windowTop;
                itemTop + item.offsetHeight;

            return itemTop < windowBottom && itemTop > windowTop;
        }
    }]);
    return ScrollSpy;
}();

var Accordion = function () {
    function Accordion($element) {
        classCallCheck(this, Accordion);

        this.current = 0;
        this.$element = $element;

        this.$element.classList.add("accordion");

        this.addEvents();
    }

    createClass(Accordion, [{
        key: "addEvents",
        value: function addEvents() {
            this.$element.querySelectorAll(".accordion-section").forEach(function ($section, index) {
                $section.querySelector(".accordion-title").addEventListener('click', function () {
                    $section.classList.toggle("open");
                });
            });
        }
    }]);
    return Accordion;
}();

export { Accordion, Popup, ScrollSpy, SelectStyler, Tooltip };
