import {Directive} from "../liefs-interfaces/liefs-interfaces";
export let liefsError = {
    matchLength: (expected: number, received: number, reference: string = "") => {
        let plus: string = "";
        if (expected < 0) { expected *= -1; plus = "or more "; }
        throw {
            message: "Expected " + plus + expected.toString() + " received " + received.toString() + ".",
            name: "Incorrect Number Of Arguments Error"
        };
    },
    typeMismatch: (expected: string, received: string, reference: string = "") => {
        let msg = reference + " Expected type " + expected.replace("|", " or ") + " received type " + received + ".";
        throw new TypeError(msg);
    },
    badArgs: (expected: string, received: string, reference: string = "") => {
        throw reference + " Expected " + expected + " received " + received + ".";
    }
};

export function nthIndex(str: string, pat: string, n: number): number {
    let L = str.length, i = -1;
    while (n-- && i++ < L) {
        i = str.indexOf(pat, i);
        if (i < 0) break;
    }
    return i;
}

export function occurrences(thisString: string, subString: string, allowOverlapping: boolean = false): number {
    thisString += "";
    subString += "";
    if (subString.length <= 0) return (thisString.length + 1);
    let n = 0, pos = 0, step = allowOverlapping ? 1 : subString.length;
    while (true) {
        pos = thisString.indexOf(subString, pos);
        if (pos >= 0) {
            ++n;
            pos += step;
        } else break;
    }
    return n;
}
export function trimCompare(a: string, b: string): boolean {
    if (occurrences(b, ":") < occurrences(a, ":"))
        a = a.slice(0, nthIndex(a, ":", occurrences(b, ":") + 1));
    return (a === b);
}

export function isStart(value: string): boolean {
    return value.slice(-1) === "%" || value.slice(-2) === "px";
}

export function isItem(value: any): boolean {
    for (let thisone in ["label", "start", "current"]) if (!(thisone in value)) return false;
    return true;
}

export function isContainer(value: any): boolean {
    for (let thisone in ["label", "margin", "direction"]) if (!(thisone in value)) return false;
    return true;
}

export function TypeOf(value: any, match: string = undefined): string|boolean {
    let ctype: string = typeof value, temp: string;
    if (ctype === "object")
        if (Array.isArray(value)) ctype = "array:" + TypeOf(<Array<any>> value[0]);
        else if ((value["constructor"] && value.constructor["name"])
          && (typeof value["constructor"] === "function")
            && (["Object", "Array"].indexOf(value.constructor.name) === -1))
              ctype = value.constructor.name;
        else ctype = "object:" + TypeOf(<Object> value[Object.keys(value)[0]]);
    else if (ctype === "string") if (isStart(value)) ctype = "start";
    if (match)
        if (match.indexOf("|") === -1) return trimCompare(ctype, match);
        else {
            for (let each of match.split("|")) if (trimCompare(ctype, each)) return true;
            return false;
        }
    return ctype;
}

export function setArgsObj (target: any, key: string, index: number = 0 ) {
  if ((key in this.myArgsObj) && (index < this.myArgsObj[key].length))
    target = this.myArgsObj[key][index];
}

export function argsObj(args: IArguments): any {
    let retObj: any = {}, ctype: string;
    for (let i = 0; i < args.length; i++) {
        ctype = (<string>TypeOf(args[i])).replace(":", "_");
        if (!(ctype in retObj)) retObj[ctype] = [];
        retObj[ctype].push(args[i]);
    }
    return retObj;
}

export function CheckArgTypes(args: IArguments, types: string[], reference: string = "", checkLength: boolean = true): boolean {
    reference += " typeCheck";
    if (checkLength && args.length !== types.length)
        liefsError.matchLength(types.length, args.length, reference);
    for (let i = 0; i < types.length; i++)
        if (TypeOf(args[i]) !== types[i])
            liefsError.typeMismatch(types[i], args[i], reference);
    return true;
}

export function el(id: string): HTMLElement {
    CheckArgTypes(arguments, ["string"], "el()");
    return document.getElementById(id);
}

export function directive(querrySelectorAll: string, attributesList: Array<string>): Array<{}> {
    CheckArgTypes(arguments, ["string", "array:string"], "directive()");
    let returnArray: Array<{}> = [];
    let Obj: Directive;
    let NodeList = document.querySelectorAll(querrySelectorAll);
    for (let i = 0; i < NodeList.length; i++) {
        Obj = {el: NodeList[i], tagname: NodeList[i].tagName};
        for (let eachAttribute of attributesList)
            if (NodeList[i].getAttribute(eachAttribute) === undefined) {
                Obj[eachAttribute] = undefined;
                if (NodeList[i].id !== undefined)
                    for (let each in document.querySelectorAll("[" + eachAttribute + "]"))
                        if (each["id"] !== undefined)
                            if (each["id"] === NodeList[i].id)
                                Obj[eachAttribute] = true;
            }
            else
                Obj[eachAttribute] = NodeList[i].getAttribute(eachAttribute);
        returnArray.push(Objectassign(Obj));
    }
    return returnArray;
}

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

export function directiveSetStyles(el: HTMLElement, stylesObject: {}): void {
    for (let key in stylesObject)
        el["style"][key] = stylesObject[key];
}

export function waitForIt(conditionFunction: Function, actionFunction: Function): void {
    CheckArgTypes(arguments, ["function", "function"], "waitForIt()");
    if (!conditionFunction())
        window.setTimeout(waitForIt.bind(null, conditionFunction, actionFunction), 100);
    else
        actionFunction();
}
export function createElement(type: string): HTMLElement {
    CheckArgTypes(arguments, ["string"], "createElement()");
    return document.createElement(type);
}
export function fillDivWithText(text: string, element: HTMLElement): HTMLElement {
    return element["createTextNode"](text);
}
export function addAttribute(element: HTMLElement, name: string, value: string): HTMLElement {
    let att = document.createAttribute(name);
    att.value = value;
    element.setAttributeNode(att);
    return element;
}
export function obid(id: string): HTMLElement {
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
export function isItIn(key: string, object: {}) {
    CheckArgTypes(arguments, ["string", "object"], "isItIn()");
    let keys = Object.keys(object);
    if (keys.indexOf(key) === -1) return null;
    return object[key];
}

export function throwType(expected: string, received: string, reference: string = "") {
    CheckArgTypes(arguments, ["string", "string", "string"], reference + " throwType()", false);
    throw "Invalid Type Entered " + reference + " expected type " + expected + " received type " + received;
}
export function Objectassign(obj: any): {} { // where obj is Directive object
    let ro = {};
    for (let key in obj) ro[key] = obj[key];
    return ro;
}
