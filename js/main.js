let $menuList;
let $activeElement;
let $hovElement;
let $magicLine;
let $activeElementLPadding;
let $activeElementRpadding;
let $activeElementWidth;
let $activeElementXpos;
let $hovElementLPadding;
let $hovElementRpadding;
let $hovElementWidth;
let $hovElementXpos;
let $nav;
let $prevScrollPos = 0;
let $newScrollPos;
let $logo;
let $burger;
let $allMenuElements;
let $allMenuElementsNames = [];
let $elementNow;
let $allMenuElementsY = [];
let $actualScrollPos;
let $menuElementsSpeed = 100;
let $timer;
let $timerScroll = null;
let $fitedElementsPosY;
let $prevFitedElementsPosY;
let $windowHeight;
let $spyActive;
let $actScrollingPos;



const main = () => {
    prepareFirstElements();
    prepareEvents();
}

const scrollSpy = () => {
    if ($spyActive) {

        $actualScrollPos = window.scrollY + $windowHeight / 3;
        for (let el = $allMenuElementsY.length; el >= 0; el--) {
            if ($actualScrollPos >= $allMenuElementsY[el]) {
                $fitedElementsPosY = $allMenuElementsY[el];
                break;
            }
        }
        if ($fitedElementsPosY != $prevFitedElementsPosY) {
            $prevFitedElementsPosY = $fitedElementsPosY;
            $activeElement.classList.remove('active');
            $activeElement = $allMenuElements[$allMenuElementsY.indexOf($fitedElementsPosY)];
            $activeElement.classList.add('active');
            $magicLine.style.transition = 'transform .5s';
            $activeElementXpos = $activeElement.getBoundingClientRect().x;
            $activeElementWidth = ($activeElement.getBoundingClientRect().width) - $activeElementLPadding - $activeElementRpadding;
            $magicLine.style.transform = `translateX(${$activeElementXpos + $activeElementWidth/2 + $activeElementLPadding}px) scaleX(${$activeElementWidth})`
        }

    }

}

const getWindowHeight = () => {
    $windowHeight = window.innerHeight;
}

const getAllMenuElementsY = () => {
    $allMenuElementsY = [];
    for (let el = 0; el < $allMenuElementsNames.length; el++) {
        let temporaryName;
        temporaryName = document.getElementById($allMenuElementsNames[el]).getBoundingClientRect().y + window.scrollY;
        $allMenuElementsY.push(temporaryName);
    }
}

const prepareFirstElements = () => {
    $menuList = document.querySelector('.nav-magic-line ul');
    $activeElement = document.querySelector('.active');
    $magicLine = document.querySelector('.magic-line');
    $logo = document.querySelector('.logo');
    $burger = document.querySelector('.burger');
    $nav = document.querySelector('.nav-magic-line');
    $allMenuElements = document.querySelectorAll('.menu-element');
    $allMenuElements.forEach((el) => $allMenuElementsNames.push(el.getAttribute('href').slice(1)));
    getAllMenuElementsY();
    getWindowHeight();
    $spyActive = 1;
}

const prepareEvents = () => {
    $menuList.addEventListener('mouseover', moveMagicLine);
    $menuList.addEventListener('click', delayCloseExpand);
    window.addEventListener('resize', correctLineResize);
    window.addEventListener('resize', getAllMenuElementsY);
    window.addEventListener('resize', getWindowHeight);
    $menuList.addEventListener('click', changeActiveEl);
    $menuList.addEventListener('mouseout', moveBackMagicLine);
    window.addEventListener('scroll', menuHeight);
    window.addEventListener('scroll', scrollSpy);
    window.addEventListener('scroll', checkMove);
    $burger.addEventListener('click', menuOpen);
}

const menuHeight = () => {
    $newScrollPos = window.scrollY;
    if ($newScrollPos > $prevScrollPos) {
        $nav.classList.remove('nav-wide');
        $logo.classList.remove('big-logo');
        $prevScrollPos = $newScrollPos;
    } else {
        $nav.classList.add('nav-wide');
        $logo.classList.add('big-logo');
        $prevScrollPos = $newScrollPos;
    }
}

const menuOpen = () => {
    if (!$burger.classList.contains('cross')) {
        $nav.classList.add('nav-wide');
        $logo.classList.add('big-logo');
        $burger.classList.add('cross');
        $nav.classList.add('nav-expand');
        let i = 0;
        const moveElementNext = () => {
            $timer = setTimeout(moveElement, $menuElementsSpeed);
        }
        const moveElement = () => {
            if (i < $allMenuElements.length) {
                $allMenuElements[i].classList.remove('hide');
                i++;
                moveElementNext();
            }
        }
        moveElementNext();
    } else {
        clearTimeout($timer);
        menuClose();
    }
}

const menuClose = () => {
    clearTimeout($timer);
    $burger.classList.remove('cross');
    $nav.classList.remove('nav-expand');
    for (let el = 0; el < $allMenuElements.length; el++) {
        $allMenuElements[el].classList.add('hide');
    }
}

const delayCloseExpand = () => {
    if ($burger.classList.contains('cross')) {
        setTimeout(menuClose, 400)
    }
}

const startMagicLine = () => {
    $activeElementLPadding = window.getComputedStyle($activeElement).getPropertyValue('padding-left').replace('px', '') * 1;
    $activeElementRpadding = window.getComputedStyle($activeElement).getPropertyValue('padding-right').replace('px', '') * 1;
    $activeElementWidth = $activeElement.getBoundingClientRect().width - $activeElementLPadding - $activeElementRpadding
    $activeElementXpos = $activeElement.getBoundingClientRect().x;
    $magicLine.style.transition = 'transform 0s';
    $magicLine.style.transform = `translateX(${$activeElementXpos + $activeElementWidth/2 + $activeElementLPadding}px) scaleX(${$activeElementWidth})`;
}

const moveMagicLine = (hover) => {
    if (hover.target.tagName == 'A') {
        $magicLine.style.transition = 'transform .5s';
        $hovElement = hover.target.closest('a');
        $hovElementLPadding = window.getComputedStyle($hovElement).getPropertyValue('padding-left').replace('px', '') * 1;
        $hovElementRpadding = window.getComputedStyle($hovElement).getPropertyValue('padding-right').replace('px', '') * 1;
        $hovElementXpos = $hovElement.getBoundingClientRect().x;
        $hovElementWidth = ($hovElement.getBoundingClientRect().width) - $hovElementLPadding - $hovElementRpadding;
        $magicLine.style.transform = `translateX(${$hovElementXpos + $hovElementWidth/2 + $hovElementLPadding}px) scaleX(${$hovElementWidth})`;
    };
}

const moveBackMagicLine = () => {
    $activeElement = document.querySelector('.active');
    $activeElementLPadding = window.getComputedStyle($activeElement).getPropertyValue('padding-left').replace('px', '') * 1;
    $activeElementRpadding = window.getComputedStyle($activeElement).getPropertyValue('padding-right').replace('px', '') * 1;
    $activeElementWidth = $activeElement.getBoundingClientRect().width - $activeElementLPadding - $activeElementRpadding
    $activeElementXpos = $activeElement.getBoundingClientRect().x;

    $magicLine.style.transform = `translateX(${$activeElementXpos + $activeElementWidth/2 + $activeElementLPadding}px) scaleX(${$activeElementWidth})`;
}

const correctLineResize = () => {
    $magicLine.style.transition = 'transform 0s';
    $activeElementXpos = $activeElement.getBoundingClientRect().x;
    $activeElementWidth = ($activeElement.getBoundingClientRect().width) - $activeElementLPadding - $activeElementRpadding;
    $magicLine.style.transform = `translateX(${$activeElementXpos + $activeElementWidth/2 + $activeElementLPadding}px) scaleX(${$activeElementWidth})`
}

const changeActiveEl = (click) => {
    $spyActive = 0;
    if (click.target.tagName == 'A') {
        $activeElement.classList.remove('active');
        $activeElement = click.target.closest('a');
        $activeElement.classList.add('active');
    };
    // if (window.scrollY)
}

const checkMove = () => {
    if ($timerScroll !== null) {
        clearTimeout($timerScroll);
    }
    $timerScroll = setTimeout(() => {
        $spyActive = 1;
    }, 100)
}

window.addEventListener('DOMContentLoaded', () => {
    main();
    startMagicLine();
})