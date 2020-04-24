
function ShowAlertConfirm(content, title, callback) {
    ons.notification.confirm({
        messageHTML: content, title: title, buttonLabels: [Language.CANCEL, Language.OK], callback: function (idx) {
            if (callback != null)
                callback(idx);
        }
    });
}

   
//Contain string
function ContainString(strDataContain, strValue) {
    if (!CheckIsnullUndefined(strDataContain) && !CheckIsnullUndefined(strValue)) {
        return strDataContain.toLowerCase().includes(strValue.toLowerCase());
    } else {
        return false;
    }
}

// event.type must be keypress
function getChar(event) {
    if (event.which == null) {
        return String.fromCharCode(event.keyCode); // IE
    } else if (event.which !== 0 && event.charCode !== 0) {
        return String.fromCharCode(event.which); // the rest
    } else {
        return null; // special key
    }
}

var valuKeyPress = 0;
//Event keypress
function CheckIsNumber(ev, isInterger) {
    try {
        ev = ev || event;
        var chr = getChar(ev);
        if (ev.keyCode === 8 || (ev.keyCode === 46 && isInterger !== true)) { //|| ev.key==='.') 
            return true;
        }
        //Check is numeric?
        if (isNaN(chr)) return false;
        //var iValue = ConvertToFloat(ev.currentTarget.value + chr);valueAsNumber
        valuKeyPress = ConvertToFloat(ev.currentTarget.value);
        //if (iValue < min || iValue > max)
        //    return false;
        return true;
    } catch (e) {
        return false;
    }
};

//Event keyup
function CheckNumberMinMax(ev, min, max) {
    try {
        //return ev.target.value;
        var valueResult = 0; //ev.target.valueAsNumber
        var iValue = ConvertToFloat(ev.currentTarget.value);
        //var iValue = ConvertToFloat(ev.target.valueAsNumber);
        iValue = isNaN(iValue) ? 0 : iValue;
        if (iValue < min || iValue > max) {
            if (iValue < min) {
                valueResult = iValue; //min;
            } else if (iValue > max) {
                valueResult = max;
            } else if (iValue === 0) {
                valueResult = iValue; //min;
            } else {
                valueResult = iValue; // valuKeyPress;
            }
        } else {
            if (CheckIsnullUndefined(ev.currentTarget.value)) {
                valueResult = iValue; //valuKeyPress;
            } else {
                valueResult = iValue;
            }
        }
        valuKeyPress = valueResult;
        return ConvertToFloat(valueResult);

    } catch (e) {
        return 0;
    }
};

//Check valid key
function CheckValidKey(ev) {
    var result = false;
    if (!CompareString(ev.keyCode, 37) && !CompareString(ev.keyCode, 39) && !CompareString(ev.type, EventType.MouseUp)) {
        result = true;
    }
    return result;
}

//Check valid control
function CheckValidControl(ev, min, max, controlId, isInterger) {
    //if (CompareString(ev.type, EventType.KeyUp) ) {
    //CheckIsNumber(ev, isInterger);
    //return false;
    //}
    if (CompareString(ev.type, EventType.KeyPress)) {
        CheckIsNumber(ev, isInterger);
        return false;
    } else if (CompareString(ev.type, EventType.MouseDown)) {
        valuKeyPress = ConvertToFloat(ev.currentTarget.value);
        return false;
    } else if ((CompareString(ev.type, EventType.KeyUp) || CompareString(ev.type, EventType.MouseUp))) { // && !CheckIsnullUndefined(ev.keyCode)
        //console.log(ev.keyCode);
        if (ConvertToFloat(ev.currentTarget.value) !== valuKeyPress || CheckIsnullUndefined(ev.currentTarget.value)) {
            if (CheckNumberMinMax(ev, min, max) >= min) {
                if (ev.keyCode !== 8 && ev.keyCode !== 46) {  //Backspace or Delete
                    $('#' + controlId).val(CheckNumberMinMax(ev, min, max));
                }
            } else {
                return false;
            }
            return true;
        } else if (CheckValidKey(ev)) {
            //$('#' + controlId).val(ConvertToFloat(ev.target.value));
        }
    } else if (CheckValidKey(ev)) {
        //$('#' + controlId).val(ConvertToFloat(ev.target.value));
    }
    return false;
};

//Check is number control
function CheckIsNumberControl(ev) {
    try {
        ev = ev || event;
        var chr = getChar(ev);
        if (ev.keyCode === 8 || ev.keyCode === 46) { //|| ev.key==='.')  Backspace or Delete
            return true;
        }
        if (ev.keyCode === 32) {
            return false;
        }
        //Check is numeric?
        if (!isNaN(chr)) return true;
        else {
            return false;
        }
    } catch (e) {
        return false;
    }

};

//Event keyup
function CheckNumberMinMaxData(ctrl, min, max) {
    try {
        //return ev.target.value;
        var valueResult = 0; //ev.target.valueAsNumber
        //var iValue = ConvertToFloat(ev.currentTarget.value);
        var iValue = ConvertToFloat(ctrl.val());
        iValue = isNaN(iValue) ? 0 : iValue;

        if (iValue < min || iValue > max) {
            if (iValue < min) {
                valueResult = iValue; //min;
            } else if (iValue > max) {
                valueResult = max;
            } else if (iValue === 0) {
                valueResult = iValue; //min;
            } else {
                valueResult = iValue; // valuKeyPress;
            }
        } else {
            if (CheckIsnullUndefined(ctrl.va())) {
                valueResult = iValue; //valuKeyPress;
            } else {
                valueResult = iValue;
            }
        }
        valuKeyPress = valueResult;
        return ConvertToFloat(valueResult);

    } catch (e) {
        return 0;
    }
};

//Check valid data
function CheckValidData(min, max, controlId) {
    var ctrl = document.getElementById(controlId);
    if (CheckNumberMinMax(ctrl, min, max) >= min) {
        $('#' + controlId).val(CheckNumberMinMax(ctrl, min, max));
    } else {
        return false;
    }
    return true;
};

//Check is number data
function CheckIsNumberData(ctrl) {
    try {
        //Check is numeric?
        if (!isNaN(ctrl.val())) return true;
        else {
            return false;
        }
    } catch (e) {
        return false;
    }

};

//Compare string
function CompareString(strValue, strValueCompare) {
    try {
        if (CheckIsnullUndefined(strValue) || CheckIsnullUndefined(strValueCompare))
            return false;
        if (strValue.toString().toLowerCase() === strValueCompare.toString().toLowerCase()) {
            return true;
        }
    } catch (e) {
        return false;
    }

    return false;
}

//Check is null or undefined
function CheckIsnullUndefined(value) {
    if (value === undefined || value == 'undefined' || value === null || value === 'null' || value === "") {
        return true;
    }else if(value.type != undefined)
    {
        return false;
    }else if(value.toString().trim().length == 0)
    {
        return true;
    }

    return false;
}

//Convert to int 
function ConvertToInt(value) {
    if (CheckIsnullUndefined(value)) {
        return 0;
    } else {
        return parseInt(value);
    }
};

//Convert to float
function ConvertToFloat(value, numDecimal) {
    if (CheckIsnullUndefined(value)) {
        return 0;
    } else {
        var result= parseFloat(value).toFixed(CheckIsnullUndefined(numDecimal)?3:numDecimal);
        return parseFloat(result);
    }
};

  
var EventType = {
    KeyPress: 'keypress',
    KeyUp: 'keyup',
    MouseUp: 'mouseup',
    MouseMove: 'mousemove',
    MouseDown: 'mousedown'
};


//Set visible control
function SetVisibleControl(property, isVisible) {
    var prop = document.getElementById(property);
    if (!CheckIsnullUndefined(prop)) {
        //$('#' + property).css('visibility', isVisible ? 'visible' : 'hidden');
        prop.style.display = isVisible ? 'block' : 'none';
    }
};

function SetVisibleClassControl(classname, isVisible) {

    //$('.' + classname).toggle(isVisible);
    //return;
    var prop = document.getElementsByClassName(classname);

    if (!CheckIsnullUndefined(prop)) {
        //$('#' + property).css('visibility', isVisible ? 'visible' : 'hidden');
        prop.display = isVisible ? 'block' : 'none !important';
        //prop.display = isVisible ? '-webkit-box' : 'none !important';
    }
};

function DangPhatTrien(){
    ShowAlert("Chức năng đang phát triển","Thông báo");
}

function CheckIsIOS(){
    if(CompareString( device.platform,'ios')){
        return true;
    }else{
        return false;
    }
}