'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Class responsible for slider
var Slider = function () {
    function Slider(imagesContainer) {
        _classCallCheck(this, Slider);

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

    _createClass(Slider, [{
        key: 'init',
        value: function init() {
            var galleryItems = this.imagesContainer.getElementsByTagName('figure');
            galleryItems = [].slice.call(galleryItems);
            galleryItems = galleryItems.filter(function (element) {
                return element.getElementsByTagName('img').length > 0;
            });
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
    }, {
        key: 'whichTransitionEvent',
        value: function whichTransitionEvent() {
            var t = void 0;
            var el = document.createElement('fakeelement');
            var transitions = {
                'transition': 'transitionend',
                'OTransition': 'oTransitionEnd',
                'MozTransition': 'transitionend',
                'WebkitTransition': 'webkitTransitionEnd'
            };

            for (t in transitions) {
                if (el.style[t] !== undefined) {
                    return transitions[t];
                }
            }
        }
    }, {
        key: 'bindEvents',
        value: function bindEvents() {
            var _this2 = this;

            this.previousButton.addEventListener('click', function (e) {
                return _this2.showPreviousImage(e);
            });
            this.nextButton.addEventListener('click', function (e) {
                return _this2.showNextImage(e);
            });

            this.previousButton.addEventListener('touchstart', function (e) {
                return _this2.disableZoomOnDoubleClick(e, _this2.previousButton);
            });
            this.nextButton.addEventListener('touchstart', function (e) {
                return _this2.disableZoomOnDoubleClick(e, _this2.nextButton);
            });

            document.addEventListener('keydown', function (e) {
                return _this2.keyDownHandler(e);
            });

            this.slider.addEventListener('touchstart', function (e) {
                return _this2.touchStart(e);
            });
            this.slider.addEventListener('touchmove', function (e) {
                return _this2.touchMove(e);
            });
            this.slider.addEventListener('touchend', function (e) {
                return _this2.touchEnd(e);
            });

            var transitionEvent = this.whichTransitionEvent();
            var _this = this;

            transitionEvent && this.sliderList.addEventListener(transitionEvent, function () {
                if (_this.sliderList.classList.contains(_this.animateClassName)) {
                    _this.sliderList.classList.remove(_this.animateClassName);
                }
                _this.hideSliderButtonsOnFirstOrLastImages(_this.currentIndex);
            });
        }
    }, {
        key: 'createImagesDataList',
        value: function createImagesDataList(galleryItems) {
            var image = void 0;
            var src = void 0;

            this.sliderItemsCounter = galleryItems.length;

            for (var i = 0; i < this.sliderItemsCounter; i++) {
                image = galleryItems[i].getElementsByTagName('img')[0];

                if (image.getAttribute('src') !== '' && image.getAttribute('src') !== null) {
                    src = image.getAttribute('src');
                } else {
                    src = image.getAttribute('data-src');
                }

                this.imagesData.push({
                    'src': src,
                    'alt': image.getAttribute('alt')
                });
            }
        }
    }, {
        key: 'updateCurrentImageSrc',
        value: function updateCurrentImageSrc(index) {
            var sliderItems = this.sliderList.getElementsByTagName("li");
            sliderItems = [].slice.call(sliderItems);
            var image = sliderItems[index].getElementsByTagName("img")[0];
            var src = image.getAttribute('data-src');

            image.onload = function () {
                sliderItems[index].getElementsByTagName("figure")[0].classList.remove('c-loader');
            };

            image.setAttribute('src', src);
        }
    }, {
        key: 'showNextImage',
        value: function showNextImage(e) {
            e.stopPropagation();

            if (this.currentIndex >= this.sliderItemsCounter - 1) {
                return false;
            }

            this.sliderList.classList.add(this.animateClassName);
            this.currentIndex = this.currentIndex + 1;
            this.updateOffset(this.currentIndex);
            this.updateCurrentImageSrc(this.currentIndex);
        }
    }, {
        key: 'showPreviousImage',
        value: function showPreviousImage(e) {
            e.stopPropagation();

            if (this.currentIndex <= 0) {
                return false;
            }

            this.sliderList.classList.add(this.animateClassName);
            this.currentIndex = this.currentIndex - 1;
            this.updateOffset(this.currentIndex);
            this.updateCurrentImageSrc(this.currentIndex);
        }
    }, {
        key: 'updateOffset',
        value: function updateOffset(index) {
            var offset = -index * 100 + '%';
            this.sliderList.style.transform = 'translate3d(' + offset + ', 0, 0)';
        }
    }, {
        key: 'hideSliderButtonsOnFirstOrLastImages',
        value: function hideSliderButtonsOnFirstOrLastImages(index) {
            var className = 'u-hidden';
            if (index >= this.sliderItemsCounter - 1) {
                this.nextButton.classList.add(className);
            } else if (this.nextButton.classList.contains(className)) {
                this.nextButton.classList.remove(className);
            }

            if (index <= 0) {
                this.previousButton.classList.add(className);
            } else if (this.previousButton.classList.contains(className)) {
                this.previousButton.classList.remove(className);
            }
        }
    }, {
        key: 'keyDownHandler',
        value: function keyDownHandler(e) {
            switch (e.keyCode) {
                case 37:
                    // Left arrow
                    this.previousButton.focus();
                    this.showPreviousImage(e);
                    break;
                case 39:
                    // Right arrow
                    this.nextButton.focus();
                    this.showNextImage(e);
                    break;
            }
        }
    }, {
        key: 'touchStart',
        value: function touchStart(e) {
            this.touch.count++;

            if (this.touch.count > 1) {
                this.touch.multitouch = true;
            }

            this.touch.startX = e.changedTouches[0].pageX;
            this.touch.startY = e.changedTouches[0].pageY;
        }
    }, {
        key: 'touchMove',
        value: function touchMove(e) {
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
    }, {
        key: 'touchEnd',
        value: function touchEnd() {
            this.touch.count--;
            if (this.touch.count <= 0) {
                this.touch.multitouch = false;
            }
            this.touchFlag = false;
        }
    }, {
        key: 'disableZoomOnDoubleClick',
        value: function disableZoomOnDoubleClick(e, button) {
            var t2 = e.timeStamp,
                t1 = button.getAttribute('lastTouch') || t2,
                dt = t2 - t1,
                fingers = e.touches.length;

            button.setAttribute('lastTouch', t2);
            if (!dt || dt > 500 || fingers > 1) return;

            e.preventDefault();
        }
    }]);

    return Slider;
}();

// Initiate Slider component


window.addEventListener('DOMContentLoaded', function () {
    var imagesContainer = document.querySelector('.js-slider');
    if (imagesContainer) {
        new Slider(imagesContainer);
    }
});