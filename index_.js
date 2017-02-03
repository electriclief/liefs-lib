var liefsError = {
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
function uniqueArray(array, optionalConcatArray) {
    if (optionalConcatArray === void 0) { optionalConcatArray = []; }
    var a = array.concat(optionalConcatArray);
    for (var i = 0; i < a.length; ++i)
        for (var j = i + 1; j < a.length; ++j)
            if (a[i] === a[j])
                a.splice(j--, 1);
    return a;
}
function nthIndex(str, pat, n) {
    var L = str.length, i = -1;
    while (n-- && i++ < L) {
        i = str.indexOf(pat, i);
        if (i < 0)
            break;
    }
    return i;
}
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
function trimCompare(a, b) {
    if (occurrences(b, ":") < occurrences(a, ":"))
        a = a.slice(0, nthIndex(a, ":", occurrences(b, ":") + 1));
    return (a === b);
}
function isStart(value) {
    return value.slice(-1) === "%" || value.slice(-2) === "px";
}
function px(value) { return value.toString() + "px"; }
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
function CheckArgTypes(args, types, reference, checkLength) {
    if (reference === void 0) { reference = ""; }
    if (checkLength === void 0) { checkLength = true; }
    reference += " typeCheck";
    if (checkLength && args.length !== types.length)
        liefsError.matchLength(types.length, args.length, reference);
    for (var i = 0; i < types.length; i++)
        if (TypeOf(args[i]) !== types[i])
            liefsError.typeMismatch(types[i], args[i], reference);
    return true;
}
function el(id) {
    CheckArgTypes(arguments, ["string"], "el()");
    return document.getElementById(id);
}
function isUniqueSelector(selector) {
    return ((document.querySelectorAll(selector)).length === 1);
}
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
function loadDoc(eid, page) {
    var _this = this;
    CheckArgTypes(arguments, ["string", "string"], "loadDoc()");
    var e = document.getElementById(eid);
    if (e) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (_this.readyState === 4 && _this.status === 200)
                e.innerHTML = _this.responseText;
        };
        xhttp.open("GET", page, true);
        xhttp.send();
    }
}
function directiveSetStyles(el, stylesObject) {
    for (var key in stylesObject)
        el["style"][key] = stylesObject[key];
}
function waitForIt(conditionFunction, actionFunction) {
    CheckArgTypes(arguments, ["function", "function"], "waitForIt()");
    if (!conditionFunction())
        window.setTimeout(waitForIt.bind(null, conditionFunction, actionFunction), 100);
    else
        actionFunction();
}
function createElement(type) {
    CheckArgTypes(arguments, ["string"], "createElement()");
    return document.createElement(type);
}
function fillDivWithText(text, element) {
    return element["createTextNode"](text);
}
function addAttribute(element, name, value) {
    var att = document.createAttribute(name);
    att.value = value;
    element.setAttributeNode(att);
    return element;
}
function obid(id) {
    CheckArgTypes(arguments, ["string"], "obid()");
    return document.getElementById(id);
}
function pauseEvent(e, key) {
    if (key === void 0) { key = "selection"; }
    if (document[key]) {
        document[key].empty();
    }
    else if (window.getSelection) {
        window.getSelection().removeAllRanges();
    }
    if (e.stopPropagation)
        e.stopPropagation();
    if (e.preventDefault)
        e.preventDefault();
    e.cancelBubble = true;
    e.returnValue = false;
    return false;
}
function isItIn(key, object) {
    CheckArgTypes(arguments, ["string", "object"], "isItIn()");
    var keys = Object.keys(object);
    if (keys.indexOf(key) === -1)
        return null;
    return object[key];
}
function throwType(expected, received, reference) {
    if (reference === void 0) { reference = ""; }
    CheckArgTypes(arguments, ["string", "string", "string"], reference + " throwType()", false);
    throw "Invalid Type Entered " + reference + " expected type " + expected + " received type " + received;
}
function Objectassign(obj) {
    var ro = {};
    for (var key in obj)
        ro[key] = obj[key];
    return ro;
}
