// Class responsible for slider
class Slider {
    constructor(imagesContainer) {
        this.imagesContainer = imagesContainer;
        this.slider;
        this.sliderList;
        this.previousButton;
        this.nextButton;
        this.closeButton;
        this.currentIndex = 0;
        this.imagesData = [];
        this.sliderItemsCounter = 0;
        this.animateClassName = 'c-slider__list--animate';
        this.touch = {};
        this.touchFlag = false;
        this.init();
    }


    init() {
        let galleryItems = this.imagesContainer.getElementsByTagName('figure');
        galleryItems = [].slice.call(galleryItems);
        galleryItems = galleryItems.filter(element => element.getElementsByTagName('img').length > 0);
        if (galleryItems.length === 0) {
            return false;
        }

        this.createImagesDataList(galleryItems);

        this.slider = document.getElementById('slider');
        this.sliderList = document.getElementById('sliderList');
        this.previousButton = document.getElementById('sliderButtonPrev');
        this.nextButton = document.getElementById('sliderButtonNext');
        this.closeButton = document.getElementById('sliderButtonClose');
        this.bindEvents();
        this.hideSliderButtonsOnFirstOrLastImages(0);
        this.updateCurrentImageSrc(0);
    }

    whichTransitionEvent(){
        let t;
        const el = document.createElement('fakeelement');
        const transitions = {
            'transition':'transitionend',
            'OTransition':'oTransitionEnd',
            'MozTransition':'transitionend',
            'WebkitTransition':'webkitTransitionEnd'
        };

        for(t in transitions){
            if( el.style[t] !== undefined ){
                return transitions[t];
            }
        }
    }

    bindEvents() {
        this.previousButton.addEventListener('click', (e) => this.showPreviousImage(e));
        this.nextButton.addEventListener('click', (e) => this.showNextImage(e));

        this.previousButton.addEventListener('touchstart', (e) => this.disableZoomOnDoubleClick(e, this.previousButton));
        this.nextButton.addEventListener('touchstart', (e) => this.disableZoomOnDoubleClick(e, this.nextButton));

        document.addEventListener('keydown', (e) => this.keyDownHandler(e));

        this.slider.addEventListener('touchstart', (e) => this.touchStart(e));
        this.slider.addEventListener('touchmove', (e) => this.touchMove(e));
        this.slider.addEventListener('touchend', (e) => this.touchEnd(e));

        const transitionEvent = this.whichTransitionEvent();
        const _this = this;

        transitionEvent && this.sliderList.addEventListener(transitionEvent, () => {
            if(_this.sliderList.classList.contains(_this.animateClassName)) {
                _this.sliderList.classList.remove(_this.animateClassName);
            }
            _this.hideSliderButtonsOnFirstOrLastImages(_this.currentIndex);
        });
    }

    createImagesDataList(galleryItems) {
        let image;
        let src;

        this.sliderItemsCounter = galleryItems.length;

        for (let i = 0; i < this.sliderItemsCounter; i++) {
            image = galleryItems[i].getElementsByTagName('img')[0];

            if(image.getAttribute('src') !== '' && image.getAttribute('src') !== null) {
                src = image.getAttribute('src');
            } else {
                src = image.getAttribute('data-src');
            }

            this.imagesData.push({
                'src': src,
                'alt': image.getAttribute('alt'),
            });
        }
    }

    updateCurrentImageSrc(index) {
        let sliderItems = this.sliderList.getElementsByTagName("li");
        sliderItems = [].slice.call(sliderItems);
        const image = sliderItems[index].getElementsByTagName("img")[0];
        const src = image.getAttribute('data-src');

        image.onload = () => {
            sliderItems[index].getElementsByTagName("figure")[0].classList.remove('c-loader');
        };

        image.setAttribute('src', src);
    }

    showNextImage(e) {
        e.stopPropagation();

        if(this.currentIndex >= (this.sliderItemsCounter - 1)) {
            return false;
        }

        this.sliderList.classList.add(this.animateClassName);
        this.currentIndex = this.currentIndex + 1;
        this.updateOffset(this.currentIndex);
        this.updateCurrentImageSrc(this.currentIndex);
    }

    showPreviousImage(e) {
        e.stopPropagation();

        if(this.currentIndex <= 0) {
            return false;
        }

        this.sliderList.classList.add(this.animateClassName);
        this.currentIndex = this.currentIndex - 1;
        this.updateOffset(this.currentIndex);
        this.updateCurrentImageSrc(this.currentIndex);
    }

    updateOffset(index) {
        let offset = - index * 100 + '%';
        this.sliderList.style.transform = `translate3d(${offset}, 0, 0)`;
    }

    hideSliderButtonsOnFirstOrLastImages(index) {
        const className = 'u-hidden';
        if(index >= (this.sliderItemsCounter - 1)) {
            this.nextButton.classList.add(className);
        } else if(this.nextButton.classList.contains(className)) {
            this.nextButton.classList.remove(className);
        }

        if(index <= 0) {
            this.previousButton.classList.add(className);
        } else if(this.previousButton.classList.contains(className)) {
            this.previousButton.classList.remove(className);
        }
    }

    keyDownHandler(e) {
        switch (e.keyCode) {
            case 37: // Left arrow
                this.previousButton.focus();
                this.showPreviousImage(e);
                break;
            case 39: // Right arrow
                this.nextButton.focus();
                this.showNextImage(e);
                break;
        }
    }

    touchStart(e) {
        this.touch.count++;

        if (this.touch.count > 1) {
            this.touch.multitouch = true;
        }

        this.touch.startX = e.changedTouches[0].pageX;
        this.touch.startY = e.changedTouches[0].pageY;
    }

    touchMove(e) {
        if (this.touchFlag || this.touch.multitouch) {
            return;
        }

        e.preventDefault ? e.preventDefault() : e.returnValue = false;
        var touchEvent = e.touches[0] || e.changedTouches[0];

        if (touchEvent.pageX - this.touch.startX > 40) {
            this.touchFlag = true;
            this.showPreviousImage(e);
        } else if (touchEvent.pageX - this.touch.startX < -40) {
            this.touchFlag = true;
            this.showNextImage(e);
        }
    }

    touchEnd() {
        this.touch.count--;
        if (this.touch.count <= 0) {
            this.touch.multitouch = false;
        }
        this.touchFlag = false;
    }

    disableZoomOnDoubleClick(e, button) {
        let t2 = e.timeStamp,
            t1 = button.getAttribute('lastTouch') || t2,
            dt = t2 - t1,
            fingers = e.touches.length;

        button.setAttribute('lastTouch', t2);
        if (!dt || dt > 500 || fingers > 1) return;

        e.preventDefault();
    };
}

// Initiate Slider component
window.addEventListener('DOMContentLoaded', () => {
    const imagesContainer = document.querySelector('.js-slider');
    if(imagesContainer) {
        new Slider(imagesContainer);
    }
});
