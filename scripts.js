if(window["Prototype"]){
Event.observe(window,"load",initForm);
}else{
var oldonload=window.onload;
window.onload=typeof window.onload=="function"?function(){
oldonload();
initForm();
}:window.onload=initForm;
}
function initForm(){
logic_fields.each(function(id){
var _2=$A(document.getElementsByName("field"+id));
_2=_2.concat($A(document.getElementsByName("field"+id+"[]")));
_2.each(function(_3){
if(_3.type.toLowerCase()=="radio"){
Event.observe(_3,"click",function(){
checkLogic(id);
});
}else{
new Form.Element.EventObserver(_3,function(){
checkLogic(id);
});
}
});
checkLogic(id);
});
calc_fields.each(function(id){
var _5=$A(document.getElementsByName("field"+id));
_5=_5.concat($A(document.getElementsByName("field"+id+"[]")));
_5.each(function(_6){
if(_6.type.toLowerCase()=="radio"){
Event.observe(_6,"click",function(){
updateCalculations(id);
});
}else{
new Form.Element.EventObserver(_6,function(){
updateCalculations(id);
});
}
});
});
$$(".otherField").each(function(_7){
Event.observe(_7,"change",function(){
var id=_7.id.split("_");
$(id[0]+"_other").checked=$F(_7)!="";
});
});
calculations.each(function(_9){
evalCalculation(_9);
});
updateProgress(1);
};
function checkRequired(_a){
clearError(_a);
var _b=$A(document.getElementsByName("formPage"+_a+"Required"));
var _c=document.getElementsByClassName("formPage"+_a+"Required");
var _d=_b.length?_b:_c;
var _e=0;
_d.each(function(_f){
var _10;
if(_f.name=="formPage"+_a+"Required"){
if(_f.value.indexOf("-")>=0){
var m=_f.value.split("-");
_f=$(m[0]);
_10=m[1];
}else{
_f=$(_f.value);
}
}else{
_10=_f.hasClassName("fsFormatEmail")?"email":"";
}
if(_f&&fieldIsVisible(_f)){
var bad=0;
switch(_f.type.toLowerCase()){
case "text":
case "password":
case "textarea":
case "file":
bad=_f.value==""?1:0;
if(!bad&&_10){
switch(_10){
case "email":
bad=_f.value.match(/.+\@.+\..+/)?0:1;
break;
}
}
break;
case "select-one":
bad=_f.options[_f.selectedIndex].value==""?1:0;
break;
case "select-multiple":
bad=1;
var _13=_f.options;
for(var j=0;j<_13.length;j++){
if(_13[j].selected&&_13[j].value!=""){
bad=0;
}
}
break;
case "radio":
case "checkbox":
bad=1;
var _15=document.getElementsByName(_f.name);
for(var j=0;j<_15.length;j++){
if(_15[j].checked){
bad=0;
}
}
break;
}
_e+=bad;
if(bad){
highlightField(_f,bad);
}
}
});
if(_e){
new Insertion.Before("formMainDiv","<div id=\"checkFormError\" class=\"formError\">Please fill in a valid value for all required fields</div>");
Element.scrollTo("checkFormError");
return false;
}
return checkUploads(_a);
};
function checkUploads(_16){
var _17=true;
var up1=$A(document.getElementsByName("formPage"+_16+"Uploads"));
var up2=document.getElementsByClassName("formPage"+_16+"Upload");
var _1a=up1.length?up1:up2;
var _1b=0;
_1a.each(function(_1c){
var _1d=[];
if(_1c.name=="formPage"+_16+"Uploads"){
var m=_1c.value.split("-");
_1c=$(m[0]);
_1d=m[1].split(",");
}else{
_1c.classNames().each(function(_1f){
if(/^uploadTypes-/.test(_1f)){
var m=_1f.split("-");
_1d=m[1].split(",");
}
});
}
for(var i=0;i<_1d.length;i++){
_1d[i]=_1d[i].toLowerCase();
}
if(_1d.indexOf("*")<0&&_1c&&_1c.value!=""&&fieldIsVisible(_1c)){
var ext=_1c.value.match(/\.(\w+)$/);
var bad=ext&&_1d.indexOf(ext[1].toLowerCase())>=0?0:1;
_1b+=bad;
if(bad){
highlightField(_1c,bad);
alert("You must upload one of the following file types for the selected field: "+_1d.join(", "));
_17=false;
}
}
});
return _17;
};
function clearError(_24){
document.getElementsByClassName("formPage"+_24+"Required").each(function(_25){
highlightField(_25,0);
});
document.getElementsByClassName("formPage"+_24+"Upload").each(function(_26){
highlightField(_26,0);
});
var _27;
if(_27=$("checkFormError")){
_27.parentNode.removeChild(_27);
}
};
function highlightField(_28,on){
_28.style.background=on?"#ffcccc":"";
var _2a=_28.parentNode.parentNode;
if(_2a.className=="formRow"){
var _2b=_2a.getElementsByTagName("label");
for(var i=0;i<_2b.length;i++){
_2b[i].style.color=on?"red":"";
}
}
};
function checkSelected(_2d,_2e){
var _2f=$("mainForm");
if(!_2f){
return;
}
var _30=false;
var _31=$A(document.getElementsByName(_2d));
if(!_31.length){
_31=$A(document.getElementsByName(_2d+"[]"));
}
_31.each(function(_32){
if(_32.type=="checkbox"||_32.type=="radio"){
if(_32.checked&&_32.value==_2e){
_30=true;
}
}else{
if(_32.type=="select-one"){
_30=_32.options[_32.selectedIndex].value==_2e?true:false;
}else{
if(_32.type=="select-multiple"){
$A(_32.options).each(function(_33){
if(_33.selected&&_33.value==_2e){
_30=true;
}
});
}
}
}
});
return _30;
};
function checkLogic(id){
checks.each(function(_35){
if(_35.fields.indexOf(id)>=0){
var _36=_35.bool=="AND"?true:false;
_35.checks.each(function(_37){
var _38=checkSelected("field"+_37.field,_37.option);
if(_37.condition=="!="){
_38=!_38;
}
if(_35.bool=="AND"){
_36=_36?_38:false;
}else{
_36=_36?true:_38;
}
});
var _39=$("fieldRow"+_35.target);
if(_39.hasClassName("formSection")){
_39=$("formSection"+_35.target);
}
if(_36){
if(_35.action=="Show"){
showFields(_39);
}else{
hideFields(_39);
}
}else{
if(_35.action=="Show"){
hideFields(_39);
}else{
showFields(_39);
}
}
}
});
};
function showFields(row){
var _3b="#"+row.id+" ";
$$(_3b+"input",_3b+"textarea",_3b+"select").each(function(_3c){
if(_3c.type!="file"){
_3c.enable();
}
});
Element.show(row);
};
function hideFields(row){
Element.hide(row);
var _3e="#"+row.id+" ";
$$(_3e+"input",_3e+"textarea",_3e+"select").each(function(_3f){
if(_3f.type!="file"){
_3f.disable();
}
});
};
function updateCalculations(id){
calculations.each(function(_41){
if(_41.fields.indexOf(id)>=0){
evalCalculation(_41);
}
});
};
function evalCalculation(_42){
var _43=_42.equation;
var _44="";
_42.fields.each(function(id){
var _46=new RegExp("\\["+id+"\\]","g");
var val=0;
var _48=$A(document.getElementsByName("field"+id));
_48=_48.concat($A(document.getElementsByName("field"+id+"[]")));
_48.each(function(_49){
var _4a;
switch(_49.type.toLowerCase()){
case "checkbox":
_4a=_49.value;
var v=getNumber(_49.value);
if(_49.checked&&!isNaN(v)){
val+=v;
}
break;
case "select-multiple":
var _4c=_49.options;
for(var i=0;i<_4c.length;i++){
var v=getNumber(_4c[i].value);
if(_4c[i].selected&&!isNaN(v)){
_4a=_4c[i].value;
val+=v;
}
}
break;
default:
_4a=$F(_49);
var v=getNumber($F(_49));
if(!isNaN(v)){
val=v;
}
}
if(_4a&&_4a.indexOf("$")!=-1){
_44="$";
}
});
_43=_43.replace(_46,val);
});
var _4e=0;
try{
_4e=eval(_43);
}
catch(e){
}
$("field"+_42.target).value=_44+_4e.toFixed(2);
updateCalculations(_42.target);
};
function getNumber(str){
if(!str){
return;
}
if(str.indexOf(" == ")!=-1){
var _50=str.split(" == ");
str=_50[1];
}
return parseFloat(str.replace(/[^\d\.\-]/,""));
};
function previousPage(_51){
var _52=$("formPage"+_51);
if(!_52){
return;
}
if(_51<=1){
return;
}
var _53=_51-1;
while(!pageIsVisible(_53)&&_53>1){
_53--;
}
var _54=$("formPage"+_53);
Element.hide(_52);
Element.show(_54);
updateProgress(_53);
clearError(_51);
Element.hide("formSubmitButton");
Element.scrollTo("formMainDiv");
};
function nextPage(_55){
var _56=$("formPage"+_55);
if(!_56){
return;
}
if(_55>=lastPage){
return;
}
if(checkRequired(_55)){
var _57=_55+1;
while(!pageIsVisible(_57)&&_57<lastPage){
_57++;
}
updateProgress(_57);
var _58=$("formPage"+_57);
Element.hide(_56);
Element.show(_58);
if(_57==lastPage){
Element.show("formSubmitButton");
}
Element.scrollTo("formMainDiv");
}
};
function pageIsVisible(_59){
var _5a=false;
$$("#formPage"+_59+" .formRow").each(function(row){
if(Element.visible(row)){
var _5c=row.parentNode;
while(_5c&&_5c.className!="formSectionWrap"){
_5c=_5c.parentNode;
}
if(!_5c||Element.visible(_5c)){
_5a=true;
}
}
});
$$("#formPage"+_59+" .formSectionWrap").each(function(_5d){
if(Element.visible(_5d)&&$$("#"+_5d.id+" .formSection .formSpacer").size()==0){
_5a=true;
}
});
return _5a;
};
function fieldIsVisible(_5e){
var row=_5e.parentNode;
while(row&&row.className!="formRow"){
row=row.parentNode;
}
var _60=row&&Element.visible(row)?true:false;
if(!_60){
return false;
}
var _61=row.parentNode;
while(_61&&_61.className!="formSectionWrap"){
_61=_61.parentNode;
}
if(!_61){
return _60;
}
return Element.visible(_61);
};
function checkForm(){
var res=checkRequired(lastPage);
if(res){
var _63=[];
for(var i=1;i<=lastPage;i++){
var _65=$A(document.getElementsByName("formPage"+i+"Required"));
var _66=document.getElementsByClassName("formPage"+i+"Required");
var _67=_65.length?_65:_66;
_67.each(function(_68){
if(!fieldIsVisible(_68)){
if(_68.name=="formPage"+i+"Required"){
if(_68.value.indexOf("-")>=0){
var m=_68.value.split("-");
_63.push(m[0]);
}else{
if(_68.value.indexOf("_")>=0){
var m=_68.value.split("_");
_63.push(m[0]);
}else{
_63.push(_68.value);
}
}
}else{
if(_68.id.indexOf("_")>=0){
var m=_68.id.split("_");
_63.push(m[0]);
}else{
_63.push(_68.name);
}
}
}
});
}
if($("hidden_fields")){
$("hidden_fields").value=_63.join(",");
}
if($("captcha")){
if($F("captcha_code")==""){
captchaError();
return false;
}
}
return true;
}else{
return false;
}
};
function updateProgress(_6a){
if(!$("FSProgress")){
return;
}
var _6b=$$(".FSPage").length;
if(_6b<=1){
$("FSProgress").hide();
return;
}
var _6c=$("FSProgressBarContainer");
var _6d=$("FSProgressBar");
var _6e=_6c.getWidth()-2;
var _6f=_6a/_6b;
if(_6f<0){
_6f=0;
}
if(_6f>1){
_6f=1;
}
var _70=(_6e*_6f)+"px";
_6d.setStyle({width:_70});
};
function submitForm(){
if(!checkForm()){
return;
}
if($("captcha")){
$("submitButton").disabled=true;
scriptRequest($("mainForm").action.replace(/index.php$/,"captcha.php")+"?action=test&captcha_code="+$F("captcha_code")+"&fspublicsession="+$F("session_id")+"&r="+(new Date()).getTime());
}else{
$("mainForm").submit();
}
};
function captchaError(){
clearError();
highlightField($("captcha_code"),1);
$("captcha_code_label").style.color="red";
$("captcha_code_label").style.fontWeight="bold";
Element.scrollTo("captcha");
};
var scriptRequestCounter=1;
function scriptRequest(req){
var _72=$$("head").first();
if(!_72){
$("mainForm").submit();
return;
}
var _73=document.createElement("script");
_73.setAttribute("type","text/javascript");
_73.setAttribute("charset","utf-8");
_73.setAttribute("src",req);
_73.setAttribute("id","scriptRequest"+scriptRequestCounter);
_72.appendChild(_73);
scriptRequestCounter++;
};
function captchaTestCallback(_74){
_74=$H(_74);
if(_74.res=="OK"){
$("mainForm").submit();
}else{
captchaError();
}
$("submitButton").disabled=false;
};

