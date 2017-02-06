"use strict";
exports.liefsError = {
    matchLength: function (expected, received, reference) {
        if (reference === void 0) { reference = ""; }
        var plus = "";
        if (expected < 0) {
            expected *= -1;
            plus = "or more ";
        }
        throw {
            message: "Expected " + plus + expected.toString() + " received " + received.toString() + ".",
            name: "Incorrect Number Of Arguments Error"
        };
    },
    typeMismatch: function (expected, received, reference) {
        if (reference === void 0) { reference = ""; }
        var msg = reference + " Expected type " + expected.replace("|", " or ") + " received type " + received + ".";
        throw new TypeError(msg);
    },
    badArgs: function (expected, received, reference) {
        if (reference === void 0) { reference = ""; }
        throw reference + " Expected " + expected + " received " + received + ".";
    }
};
function onEvent(el, eventType, eventFunction) {
    if (el.addEventListener)
        el.addEventListener(eventType, eventFunction, false);
    else if (el.attachEvent)
        el.attachEvent(eventType, eventFunction);
}
exports.onEvent = onEvent;
/*
export function uniqueArray(array: Array<any>, optionalConcatArray: Array<any> = []) {
    let a = array.concat(optionalConcatArray);
    for (let i = 0; i < a.length; ++i) for (let j = i + 1; j < a.length; ++j) if (a[i] === a[j]) a.splice(j--, 1);
    return a;
}
*/
function nthIndex(str, pat, n) {
    var L = str.length, i = -1;
    while (n-- && i++ < L) {
        i = str.indexOf(pat, i);
        if (i < 0)
            break;
    }
    return i;
}
exports.nthIndex = nthIndex;
function occurrences(thisString, subString, allowOverlapping) {
    if (allowOverlapping === void 0) { allowOverlapping = false; }
    thisString += "";
    subString += "";
    if (subString.length <= 0)
        return (thisString.length + 1);
    var n = 0, pos = 0, step = allowOverlapping ? 1 : subString.length;
    while (true) {
        pos = thisString.indexOf(subString, pos);
        if (pos >= 0) {
            ++n;
            pos += step;
        }
        else
            break;
    }
    return n;
}
exports.occurrences = occurrences;
function trimCompare(a, b) {
    if (occurrences(b, ":") < occurrences(a, ":"))
        a = a.slice(0, nthIndex(a, ":", occurrences(b, ":") + 1));
    return (a === b);
}
exports.trimCompare = trimCompare;
function isStart(value) {
    return value.slice(-1) === "%" || value.slice(-2) === "px";
}
exports.isStart = isStart;
function px(value) { return value.toString() + "px"; }
exports.px = px;
function vpx(value) { return parseInt(value.slice(0, -2)); }
exports.vpx = vpx;
function TypeOf(value, match) {
    if (match === void 0) { match = undefined; }
    var ctype = typeof value, temp;
    if (ctype === "object")
        if (Array.isArray(value))
            ctype = "array:" + TypeOf(value[0]);
        else if ((value["constructor"] && value.constructor["name"])
            && (typeof value["constructor"] === "function")
            && (["Object", "Array"].indexOf(value.constructor.name) === -1))
            ctype = value.constructor.name;
        else
            ctype = "object:" + TypeOf(value[Object.keys(value)[0]]);
    else if (ctype === "string")
        if (isStart(value))
            ctype = "start";
    if (match)
        if (match.indexOf("|") === -1)
            return trimCompare(ctype, match);
        else {
            for (var _i = 0, _a = match.split("|"); _i < _a.length; _i++) {
                var each = _a[_i];
                if (trimCompare(ctype, each))
                    return true;
            }
            return false;
        }
    return ctype;
}
exports.TypeOf = TypeOf;
function setArgsObj(key, index, ref) {
    if (index === void 0) { index = 0; }
    if (ref === void 0) { ref = ""; }
    var target;
    if (!(this.myArgsObj))
        throw "setArgsObj Empty";
    if ((key in this.myArgsObj) && (index < this.myArgsObj[key].length)) {
        /*    console.log(ref + "setting to " + this.myArgsObj[key][index]); */
        target = this.myArgsObj[key][index];
    } // else console.log("index fail -" + key);
    return target;
}
exports.setArgsObj = setArgsObj;
function argsObj(args) {
    var retObj = {}, ctype;
    for (var i = 0; i < args.length; i++) {
        ctype = TypeOf(args[i]).replace(":", "_");
        if (!(ctype in retObj))
            retObj[ctype] = [];
        retObj[ctype].push(args[i]);
    }
    return retObj;
}
exports.argsObj = argsObj;
function CheckArgTypes(args, types, reference, checkLength) {
    if (reference === void 0) { reference = ""; }
    if (checkLength === void 0) { checkLength = true; }
    reference += " typeCheck";
    if (checkLength && args.length !== types.length)
        exports.liefsError.matchLength(types.length, args.length, reference);
    for (var i = 0; i < types.length; i++)
        if (TypeOf(args[i]) !== types[i])
            exports.liefsError.typeMismatch(types[i], args[i], reference);
    return true;
}
exports.CheckArgTypes = CheckArgTypes;
function el(id) {
    CheckArgTypes(arguments, ["string"], "el()");
    return document.getElementById(id);
}
exports.el = el;
function isUniqueSelector(selector) {
    return ((document.querySelectorAll(selector)).length === 1);
}
exports.isUniqueSelector = isUniqueSelector;
function directive(querrySelectorAll, attributesList) {
    CheckArgTypes(arguments, ["string", "array:string"], "directive()");
    var returnArray = [];
    var Obj;
    var NodeList = document.querySelectorAll(querrySelectorAll);
    for (var i = 0; i < NodeList.length; i++) {
        Obj = { el: NodeList[i], tagname: NodeList[i].tagName };
        for (var _i = 0, attributesList_1 = attributesList; _i < attributesList_1.length; _i++) {
            var eachAttribute = attributesList_1[_i];
            if (NodeList[i].getAttribute(eachAttribute) === undefined) {
                Obj[eachAttribute] = undefined;
                if (NodeList[i].id !== undefined)
                    for (var each in document.querySelectorAll("[" + eachAttribute + "]"))
                        if (each["id"] !== undefined)
                            if (each["id"] === NodeList[i].id)
                                Obj[eachAttribute] = true;
            }
            else
                Obj[eachAttribute] = NodeList[i].getAttribute(eachAttribute);
        }
        returnArray.push(Objectassign(Obj));
    }
    return returnArray;
}
exports.directive = directive;
/*
export function loadDoc(eid: string, page: string): void {
    CheckArgTypes(arguments, ["string", "string"], "loadDoc()");
    let e = document.getElementById(eid);
    if (e) {
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = () => {
            if (this.readyState === 4 && this.status === 200)
                e.innerHTML = this.responseText;
        };
        xhttp.open("GET", page, true);
        xhttp.send();
    }
}
*/
function directiveSetStyles(el, stylesObject) {
    for (var _i = 0, _a = Object.keys(stylesObject); _i < _a.length; _i++) {
        var key = _a[_i];
        el["style"][key] = stylesObject[key];
    }
}
exports.directiveSetStyles = directiveSetStyles;
/*
export function waitForIt(conditionFunction: Function, actionFunction: Function): void {
    CheckArgTypes(arguments, ["function", "function"], "waitForIt()");
    if (!conditionFunction())
        window.setTimeout(waitForIt.bind(null, conditionFunction, actionFunction), 100);
    else
        actionFunction();
}

export function createElement(type: string): Element {
    CheckArgTypes(arguments, ["string"], "createElement()");
    return document.createElement(type);
}
export function fillDivWithText(text: string, element: Element): Element {
    return element["createTextNode"](text);
}
export function addAttribute(element: Element, name: string, value: string): Element {
    let att = document.createAttribute(name);
    att.value = value;
    element.setAttributeNode(att);
    return element;
}
export function obid(id: string): Element {
    CheckArgTypes(arguments, ["string"], "obid()");
    return document.getElementById(id);
}
export function pauseEvent(e: Event, key: string = "selection"): boolean { // makes it so so
    if (document[key]) {
        document[key].empty();
    } else if (window.getSelection) {
        window.getSelection().removeAllRanges();
    }

    if (e.stopPropagation) e.stopPropagation();
    if (e.preventDefault) e.preventDefault();
    e.cancelBubble = true;
    e.returnValue = false;
    return false;
}
 */
function isItIn(key, object) {
    //    CheckArgTypes(arguments, ["string", "object"], "isItIn()");
    var keys = Object.keys(object);
    if (keys.indexOf(key) === -1)
        return null;
    return object[key];
}
exports.isItIn = isItIn;
/*
export function throwType(expected: string, received: string, reference: string = "") {
    CheckArgTypes(arguments, ["string", "string", "string"], reference + " throwType()", false);
    throw "Invalid Type Entered " + reference + " expected type " + expected + " received type " + received;
}
*/
function Objectassign(obj) {
    var ro = {};
    for (var key in obj)
        ro[key] = obj[key];
    return ro;
}
exports.Objectassign = Objectassign;
function myIndexOf(sstring, search, occurance, start) {
    if (occurance) {
        start = sstring.indexOf(search, start) + 1;
        --occurance;
        if (occurance)
            return myIndexOf(sstring.slice(start), search, occurance, start);
        else
            return sstring.slice(start);
    }
    else
        return sstring;
}
exports.myIndexOf = myIndexOf;
