/**
 * dat-gui JavaScript Controller Library
 * http://code.google.com/p/dat-gui
 *
 * Copyright 2011 Data Arts Team, Google Creative Lab
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 */

import NumberController from './NumberController';
import dom from '../dom/dom';
import common from '../utils/common';

function roundToDecimal(value, decimals) {
  const tenTo = Math.pow(10, decimals);
  return Math.round(value * tenTo) / tenTo;
}

/**
 * @class Represents a given property of an object that is a number and
 * provides an input element with which to manipulate it.
 *
 * @extends dat.controllers.Controller
 * @extends dat.controllers.NumberController
 *
 * @param {Object} object The object to be manipulated
 * @param {string} property The name of the property to be manipulated
 * @param {Object} [params] Optional parameters
 * @param {Number} [params.min] Minimum allowed value
 * @param {Number} [params.max] Maximum allowed value
 * @param {Number} [params.step] Increment by which to change value
 */
class NumberControllerBox extends NumberController {
  constructor(object, property, params) {
    super(object, property, params);

    this.__truncationSuspended = false;

    const _this = this;

    /**
     * {Number} Previous mouse y position
     * @ignore
     */
    // let prevY;

    function onChange() {
      const attempted = parseFloat(_this.__input.value);

      if (common.isNumber(attempted)) {
        _this.setValue(attempted);
      }
    }

    function onInput(e) {
      let attempted = _this.getValue();
      const _valCurrent = e.currentTarget.value;

      if (/^[-+0-9０-９+-+.+,]+?$/gm.test(_valCurrent) || !_valCurrent) {
        attempted = _valCurrent;
      }
      _this.__input.value = attempted;
    }

    function onFinish() {
      if (_this.__onFinishChange) {
        const value = _this.getValue().toFixed(2);
        _this.__onFinishChange.call(_this, value);
      }
    }

    function onBlur() {
      onFinish();
    }

    function onMousewheel(e) {
      e.preventDefault();
    }

    // function onMouseDrag(e) {
    //   const diff = prevY - e.clientY;
    //   _this.setValue(_this.getValue() + diff * _this.__impliedStep);
    //
    //   prevY = e.clientY;
    // }

    // function onMouseUp() {
    //   dom.unbind(window, 'mousemove', onMouseDrag);
    //   dom.unbind(window, 'mouseup', onMouseUp);
    //   onFinish();
    // }

    // function onMouseDown(e) {
    //   dom.bind(window, 'mousemove', onMouseDrag);
    //   dom.bind(window, 'mouseup', onMouseUp);
    //   prevY = e.clientY;
    // }

    this.__input = document.createElement('input');
    this.__input.setAttribute('type', 'text');

    // Makes it so manually specified values are not truncated.

    dom.bind(this.__input, 'change', onChange);
    dom.bind(this.__input, 'input', onInput);
    dom.bind(this.__input, 'blur', onBlur);
    dom.bind(this.__input, 'mousewheel', onMousewheel);
    // dom.bind(this.__input, 'mousedown', onMouseDown);
    dom.bind(this.__input, 'keydown', function(e) {
      // When pressing enter, you can be as precise as you want.
      const keyCode = e.keyCode || e.which;
      if (keyCode === 13) {
        _this.__truncationSuspended = true;
        this.blur();
        _this.__truncationSuspended = false;
        onFinish();
      }
      if (!(keyCode === 8 || keyCode === 109 || keyCode === 107 ||
        keyCode === 110 || keyCode === 187 || keyCode === 189 ||
        keyCode === 190 || keyCode === 37 || keyCode === 39 || keyCode === 46 ||
        (keyCode >= 48 && keyCode <= 57) || (keyCode >= 96 && keyCode <= 105))
      ) {
        e.returnValue = false;
        if (e.preventDefault) e.preventDefault();
      }
    });
    dom.bind(this.__input, 'focusout', function (e) {
      if (!e.target.value) {
        const value = _this.getValue()
        _this.__input.value = roundToDecimal(value, 2);
      }
    });

    this.updateDisplay();

    this.domElement.appendChild(this.__input);
  }

  updateDisplay() {
    this.__input.value = roundToDecimal(this.getValue(), this.__precision);
    return super.updateDisplay();
  }
}

export default NumberControllerBox;
