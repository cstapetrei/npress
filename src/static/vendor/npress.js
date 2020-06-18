Noty.overrideDefaults({
    timeout: 2000
});
const ajax = async (url, params = {}) => {

    params.method = params.method && params.method.toUpperCase() || 'GET';
    params.headers = params.headers || {};
    if (!params.file){
        params.headers["Content-Type"] = "application/json";
    }
    params.body = params.data && JSON.stringify(params.data) || null;

    const removeLoaderFromForm = async (response) => {
        NPress.removeLoaderFrom(params.form);
        return Promise.resolve(response);
    }

    const status = async (response) => {
        response.form = params.form || null;
        if ([ 400, 401, 403, 500 ].indexOf(response.status) !== -1){
            const json = await response.json();
            const err = new Error(response.statusText);
            err.errors = json;
            err.status = response.status;
            err.form = response.form;
            return Promise.reject(err);
        }
        return Promise.resolve(response);
    }

    const validationErrorHandler = async (error) => {
        if ([ 400, 401, 403 ].indexOf(error.status) === -1){
            return Promise.reject(error);
        }
        NPress.clearErrors(error.form);
        NPress.outputErrors(error.form, error.errors);
        return Promise.reject(error);
    }

    const parseResponse = async (response) => {
        let itemCount = response.headers.get('X-Item-Count') || 0,
            totalCount = response.headers.get('X-Item-Total-Count') || 0,
            json = await response.json();
        return Promise.resolve((totalCount && itemCount) ? { data: json, count: itemCount, total: totalCount } : json);
    }

    const clearValidationErrors = function(form){
        if (!form || !(form instanceof HTMLElement)){
            return;
        }
        let validationSpans = form.querySelectorAll('span.danger');
        for(let i = 0, len = validationSpans.length; i < len; i++){
            validationSpans[i].remove();
        }
    }

    NPress.addLoaderTo(params.form);
    clearValidationErrors(params.form);
    return fetch(url, params)
        .then(removeLoaderFromForm)
        .then(status)
        .then(parseResponse)
        .catch(validationErrorHandler);
}

/** polyfills */
if (!Element.prototype.matches) {
    Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
}

if (typeof Object.assign !== 'function') {
    // Must be writable: true, enumerable: false, configurable: true
    Object.defineProperty(Object, "assign", {
      value: function assign(target, varArgs) { // .length of function is 2
        'use strict';
        if (target === null || target === undefined) {
          throw new TypeError('Cannot convert undefined or null to object');
        }

        var to = Object(target);

        for (var index = 1; index < arguments.length; index++) {
          var nextSource = arguments[index];

          if (nextSource !== null && nextSource !== undefined) {
            for (var nextKey in nextSource) {
              // Avoid bugs when hasOwnProperty is shadowed
              if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                to[nextKey] = nextSource[nextKey];
              }
            }
          }
        }
        return to;
      },
      writable: true,
      configurable: true
    });
}
/* --- */

var NPress = NPress || {};

NPress.live = (element, type, selector, callback, context, useCapture) => {
    element.addEventListener(type, function(ev) {
        var target = ev.target;
        if (!selector) {
            return callback.call((context || target), ev, element);
        }
        while (target) {
            if (target.matches(selector)) {
                return target.disabled
                    ? null
                    : callback.call((context || target), ev, target);
            }
            if (target === element) {
                return;
            }
            target = target.parentNode;
        }
    }, !!useCapture);
};

NPress.trigger = (element, name, data = {}) => {
    element.dispatchEvent(new CustomEvent(name, {bubbles:true, cancelable:true, detail: data}));
};

NPress.serializeElementInputs = (el) => {
    let i, j, len, field, resultObj = {};
    let elInputs = el.querySelectorAll('input, select, textarea');
    for (i = 0, len = elInputs.length; i < len; i++) {
        field = elInputs[i];
        if (field.name && field.type !== 'file' && field.type !== 'reset'){
            if (field.name.indexOf('[]') !== -1 && !resultObj[field.name]){
                resultObj[field.name] = [];
            }
            if (field.type === 'select-multiple' && el.tagName.toLowerCase() === 'form'){
                for (j = el.elements[i].options.length - 1; j >= 0; j--) {
                    if (field.options[j].selected) {
                        resultObj[field.name] = field.options[j].value;
                    }
                }
            } else {
                if (field.type !== 'submit' && field.type !== 'button') {
                    if (field.type !== 'checkbox' && field.type !== 'radio') {
                        if (Array.isArray(resultObj[field.name])){
                            resultObj[field.name].push(field.value);
                            continue;
                        }
                        resultObj[field.name] = field.value;
                    } else {
                        resultObj[field.name] = field.checked | 0;
                    }
                }
            }
        }
    }
    return resultObj;
};

NPress.outputErrors = (element, errorArray) => {
    element = element || document;
    if (!Array.isArray(errorArray)){
        errorArray = [errorArray];
    }

    errorArray.forEach(item => {
        let target = element.form || document;
        let input = target.querySelector(`[name="${item.property}"]`);
        if (input){
            for(let constraintName in item.constraints){
                input.parentNode.appendChild(NPress.node(`<span class="text-danger">${item.constraints[constraintName]}</span>`));
            }
        }
    });
}

NPress.clearErrors = (element) => {
    element.querySelectorAll('.text-danger').forEach( (item) => {
        item.parentNode.removeChild(item);
    });
}

NPress.validateElInputs = (element) => {
    NPress.clearErrors(element);

    let elementHasErrors = false;
    element.querySelectorAll('[data-validate]').forEach( (input) => {
        if (typeof input.value === 'undefined'){
            return;
        }
        let errors = [];
        let validateUrl = input.hasAttribute('data-validate-url');
        if (validateUrl){
            let message = input.getAttribute('data-validate-url-message');
            let relativeUrlResult = v8n().pattern(/^\/[\w\-_~:/?#[\]@!\$&'\(\)\*\+,;=]+$/).test(input.value);
            let absoluteUrlResult = v8n().pattern(/^(?:http(s)?:)?(\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/).test(input.value);
            if (!relativeUrlResult && !absoluteUrlResult){
                errors.push({ property: input.getAttribute('name'), constraints: [message || 'Invalid Url'] });
            }
        }

        let validatePresence = input.hasAttribute('data-validate-presence');
        if (validatePresence){
            let message = input.getAttribute('data-validate-presence-message');
            if (v8n().empty().test(input.value)){
                errors.push({ property: input.getAttribute('name'), constraints: [message || 'Empty not allowed'] });
            }
        }

        if (errors.length){
            NPress.outputErrors(element, errors);
            elementHasErrors = true;
        }
    });

    return !elementHasErrors;
}

NPress.addLoaderTo = (element, variation = 1) => {
    if (!(element instanceof HTMLElement)){
        return;
    }
    let currentLoader = element.querySelector('.loader');
    if (currentLoader){
        return;
    }
    let l = document.createElement('div');
    l.classList.add('loader');
    l.classList.add('var-'+variation);
    element.appendChild(l);
}

NPress.removeLoaderFrom = (element) => {
    if (!(element instanceof HTMLElement)){
        return;
    }
    let currentLoader = element.querySelector('.loader');
    if (!currentLoader){
        return;
    }
    currentLoader.remove();
}

NPress.node = (content) => {
    let div = document.createElement('div');
    div.innerHTML = content;
    return div.firstChild;
}

NPress.randomString = (length) => {
    let chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = length; i > 0; --i){
        result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
}

NPress.getUrlVars = () => {
    var vars = {}, hash;
    var query_string = window.location.search;
    var regex = /\+/g;

    if (query_string) {
        var hashes = query_string.slice(1).split('&');
        for (var i = 0; i < hashes.length; i++) {
            hash = hashes[i].split('=');
            vars[hash[0]] = hash[1] ? decodeURIComponent(hash[1]).replace(regex, " ") : false;
        }
    }
    return vars;
};

NPress.refreshTooltips = () => {
    if (window.BSN && window.BSN.Tooltip){
        Array.from(document.querySelectorAll('[title]')).map(
            tip => new window.BSN.Tooltip(tip)
        )
        return;
    }
    if ($){
        $('[title]').tooltip();
    }
}

// find all elements with title attribute and attach a tooltip for each
NPress.refreshTooltips();