import './css/styles.scss';
import './css/components/_tooltip.scss';

import './js/polyfill/index';


import Popup from './js/components/Popup';
import SelectStyler from './js/components/SelectStyler';
import Tooltip from './js/components/Tooltip';
import ScrollSpy from './js/components/ScrollSpy';
import Accordion from './js/components/Accordion';

import {animate } from './js/utils'

export {
    Popup,
    SelectStyler,
    Tooltip,
    ScrollSpy,
    Accordion
};


/*document.querySelectorAll(".menu a").forEach((link)=>{
    link.addEventListener("click", (e)=>{
        let anchor = e.target.getAttribute("href");
        e.preventDefault();
        animate({
            duration: 300,
            timing(timeFraction) {
                return timeFraction;
            },
            draw:(progress)=>{
                window.scrollTo(0, progress * 600);
            }
        })
    })
});*/
