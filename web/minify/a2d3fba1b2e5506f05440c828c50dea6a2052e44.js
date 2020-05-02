window.yii=(function($){var pub={reloadableScripts:[],clickableSelector:'a, button, input[type="submit"], input[type="button"], input[type="reset"], '+'input[type="image"]',changeableSelector:'select, input, textarea',getCsrfParam:function(){return $('meta[name=csrf-param]').attr('content');},getCsrfToken:function(){return $('meta[name=csrf-token]').attr('content');},setCsrfToken:function(name,value){$('meta[name=csrf-param]').attr('content',name);$('meta[name=csrf-token]').attr('content',value);},refreshCsrfToken:function(){var token=pub.getCsrfToken();if(token){$('form input[name="'+pub.getCsrfParam()+'"]').val(token);}},confirm:function(message,ok,cancel){if(window.confirm(message)){!ok||ok();}else{!cancel||cancel();}},handleAction:function($e,event){var $form=$e.attr('data-form')?$('#'+$e.attr('data-form')):$e.closest('form'),method=!$e.data('method')&&$form?$form.attr('method'):$e.data('method'),action=$e.attr('href'),isValidAction=action&&action!=='#',params=$e.data('params'),areValidParams=params&&$.isPlainObject(params),pjax=$e.data('pjax'),usePjax=pjax!==undefined&&pjax!==0&&$.support.pjax,pjaxContainer,pjaxOptions={},conflictParams=['submit','reset','elements','length','name','acceptCharset','action','enctype','method','target'];$.each(conflictParams,function(index,param){if(areValidParams&&params.hasOwnProperty(param)){console.error("Parameter name '"+param+"' conflicts with a same named form property. "+"Please use another name.");}});if(usePjax){pjaxContainer=$e.data('pjax-container');if(pjaxContainer===undefined||!pjaxContainer.length){pjaxContainer=$e.closest('[data-pjax-container]').attr('id')?('#'+$e.closest('[data-pjax-container]').attr('id')):'';}
if(!pjaxContainer.length){pjaxContainer='body';}
pjaxOptions={container:pjaxContainer,push:!!$e.data('pjax-push-state'),replace:!!$e.data('pjax-replace-state'),scrollTo:$e.data('pjax-scrollto'),pushRedirect:$e.data('pjax-push-redirect'),replaceRedirect:$e.data('pjax-replace-redirect'),skipOuterContainers:$e.data('pjax-skip-outer-containers'),timeout:$e.data('pjax-timeout'),originalEvent:event,originalTarget:$e};}
if(method===undefined){if(isValidAction){usePjax?$.pjax.click(event,pjaxOptions):window.location.assign(action);}else if($e.is(':submit')&&$form.length){if(usePjax){$form.on('submit',function(e){$.pjax.submit(e,pjaxOptions);});}
$form.trigger('submit');}
return;}
var oldMethod,oldAction,newForm=!$form.length;if(!newForm){oldMethod=$form.attr('method');$form.attr('method',method);if(isValidAction){oldAction=$form.attr('action');$form.attr('action',action);}}else{if(!isValidAction){action=pub.getCurrentUrl();}
$form=$('<form/>',{method:method,action:action});var target=$e.attr('target');if(target){$form.attr('target',target);}
if(!/(get|post)/i.test(method)){$form.append($('<input/>',{name:'_method',value:method,type:'hidden'}));method='post';$form.attr('method',method);}
if(/post/i.test(method)){var csrfParam=pub.getCsrfParam();if(csrfParam){$form.append($('<input/>',{name:csrfParam,value:pub.getCsrfToken(),type:'hidden'}));}}
$form.hide().appendTo('body');}
var activeFormData=$form.data('yiiActiveForm');if(activeFormData){activeFormData.submitObject=$e;}
if(areValidParams){$.each(params,function(name,value){$form.append($('<input/>').attr({name:name,value:value,type:'hidden'}));});}
if(usePjax){$form.on('submit',function(e){$.pjax.submit(e,pjaxOptions);});}
$form.trigger('submit');$.when($form.data('yiiSubmitFinalizePromise')).done(function(){if(newForm){$form.remove();return;}
if(oldAction!==undefined){$form.attr('action',oldAction);}
$form.attr('method',oldMethod);if(areValidParams){$.each(params,function(name){$('input[name="'+name+'"]',$form).remove();});}});},getQueryParams:function(url){var pos=url.indexOf('?');if(pos<0){return{};}
var pairs=$.grep(url.substring(pos+1).split('#')[0].split('&'),function(value){return value!=='';});var params={};for(var i=0,len=pairs.length;i<len;i++){var pair=pairs[i].split('=');var name=decodeURIComponent(pair[0].replace(/\+/g,'%20'));var value=decodeURIComponent(pair[1].replace(/\+/g,'%20'));if(!name.length){continue;}
if(params[name]===undefined){params[name]=value||'';}else{if(!$.isArray(params[name])){params[name]=[params[name]];}
params[name].push(value||'');}}
return params;},initModule:function(module){if(module.isActive!==undefined&&!module.isActive){return;}
if($.isFunction(module.init)){module.init();}
$.each(module,function(){if($.isPlainObject(this)){pub.initModule(this);}});},init:function(){initCsrfHandler();initRedirectHandler();initAssetFilters();initDataMethods();},getBaseCurrentUrl:function(){return window.location.protocol+'//'+window.location.host;},getCurrentUrl:function(){return window.location.href;}};function initCsrfHandler(){$.ajaxPrefilter(function(options,originalOptions,xhr){if(!options.crossDomain&&pub.getCsrfParam()){xhr.setRequestHeader('X-CSRF-Token',pub.getCsrfToken());}});pub.refreshCsrfToken();}
function initRedirectHandler(){$(document).ajaxComplete(function(event,xhr){var url=xhr&&xhr.getResponseHeader('X-Redirect');if(url){window.location.assign(url);}});}
function initAssetFilters(){var loadedScripts={};$('script[src]').each(function(){var url=getAbsoluteUrl(this.src);loadedScripts[url]=true;});$.ajaxPrefilter('script',function(options,originalOptions,xhr){if(options.dataType=='jsonp'){return;}
var url=getAbsoluteUrl(options.url),forbiddenRepeatedLoad=loadedScripts[url]===true&&!isReloadableAsset(url),cleanupRunning=loadedScripts[url]!==undefined&&loadedScripts[url]['xhrDone']===true;if(forbiddenRepeatedLoad||cleanupRunning){xhr.abort();return;}
if(loadedScripts[url]===undefined||loadedScripts[url]===true){loadedScripts[url]={xhrList:[],xhrDone:false};}
xhr.done(function(data,textStatus,jqXHR){if(loadedScripts[jqXHR.yiiUrl]['xhrDone']===true){return;}
loadedScripts[jqXHR.yiiUrl]['xhrDone']=true;for(var i=0,len=loadedScripts[jqXHR.yiiUrl]['xhrList'].length;i<len;i++){var singleXhr=loadedScripts[jqXHR.yiiUrl]['xhrList'][i];if(singleXhr&&singleXhr.readyState!==XMLHttpRequest.DONE){singleXhr.abort();}}
loadedScripts[jqXHR.yiiUrl]=true;}).fail(function(jqXHR,textStatus){if(textStatus==='abort'){return;}
delete loadedScripts[jqXHR.yiiUrl]['xhrList'][jqXHR.yiiIndex];var allFailed=true;for(var i=0,len=loadedScripts[jqXHR.yiiUrl]['xhrList'].length;i<len;i++){if(loadedScripts[jqXHR.yiiUrl]['xhrList'][i]){allFailed=false;}}
if(allFailed){delete loadedScripts[jqXHR.yiiUrl];}});xhr.yiiIndex=loadedScripts[url]['xhrList'].length;xhr.yiiUrl=url;loadedScripts[url]['xhrList'][xhr.yiiIndex]=xhr;});$(document).ajaxComplete(function(){var styleSheets=[];$('link[rel=stylesheet]').each(function(){var url=getAbsoluteUrl(this.href);if(isReloadableAsset(url)){return;}
$.inArray(url,styleSheets)===-1?styleSheets.push(url):$(this).remove();});});}
function initDataMethods(){var handler=function(event){var $this=$(this),method=$this.data('method'),message=$this.data('confirm'),form=$this.data('form');if(method===undefined&&message===undefined&&form===undefined){return true;}
if(message!==undefined&&message!==false&&message!==''){$.proxy(pub.confirm,this)(message,function(){pub.handleAction($this,event);});}else{pub.handleAction($this,event);}
event.stopImmediatePropagation();return false;};$(document).on('click.yii',pub.clickableSelector,handler).on('change.yii',pub.changeableSelector,handler);}
function isReloadableAsset(url){for(var i=0;i<pub.reloadableScripts.length;i++){var rule=getAbsoluteUrl(pub.reloadableScripts[i]);var match=new RegExp("^"+escapeRegExp(rule).split('\\*').join('.+')+"$").test(url);if(match===true){return true;}}
return false;}
function escapeRegExp(str){return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g,"\\$&");}
function getAbsoluteUrl(url){return url.charAt(0)==='/'?pub.getBaseCurrentUrl()+url:url;}
return pub;})(window.jQuery);window.jQuery(function(){window.yii.initModule(window.yii);});;
/*!
* jquery.inputmask.bundle.js
* https://github.com/RobinHerbots/Inputmask
* Copyright (c) 2010 - 2017 Robin Herbots
* Licensed under the MIT license (http://www.opensource.org/licenses/mit-license.php)
* Version: 3.3.11
*/
!function(modules){function __webpack_require__(moduleId){if(installedModules[moduleId])return installedModules[moduleId].exports;var module=installedModules[moduleId]={i:moduleId,l:!1,exports:{}};return modules[moduleId].call(module.exports,module,module.exports,__webpack_require__),module.l=!0,module.exports;}
var installedModules={};__webpack_require__.m=modules,__webpack_require__.c=installedModules,__webpack_require__.d=function(exports,name,getter){__webpack_require__.o(exports,name)||Object.defineProperty(exports,name,{configurable:!1,enumerable:!0,get:getter});},__webpack_require__.n=function(module){var getter=module&&module.__esModule?function(){return module.default;}:function(){return module;};return __webpack_require__.d(getter,"a",getter),getter;},__webpack_require__.o=function(object,property){return Object.prototype.hasOwnProperty.call(object,property);},__webpack_require__.p="",__webpack_require__(__webpack_require__.s=3);}([function(module,exports,__webpack_require__){"use strict";var __WEBPACK_AMD_DEFINE_FACTORY__,__WEBPACK_AMD_DEFINE_ARRAY__,__WEBPACK_AMD_DEFINE_RESULT__;"function"==typeof Symbol&&Symbol.iterator;!function(factory){__WEBPACK_AMD_DEFINE_ARRAY__=[__webpack_require__(2)],void 0!==(__WEBPACK_AMD_DEFINE_RESULT__="function"==typeof(__WEBPACK_AMD_DEFINE_FACTORY__=factory)?__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports,__WEBPACK_AMD_DEFINE_ARRAY__):__WEBPACK_AMD_DEFINE_FACTORY__)&&(module.exports=__WEBPACK_AMD_DEFINE_RESULT__);}(function($){return $;});},function(module,exports,__webpack_require__){"use strict";var __WEBPACK_AMD_DEFINE_FACTORY__,__WEBPACK_AMD_DEFINE_ARRAY__,__WEBPACK_AMD_DEFINE_RESULT__,_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(obj){return typeof obj;}:function(obj){return obj&&"function"==typeof Symbol&&obj.constructor===Symbol&&obj!==Symbol.prototype?"symbol":typeof obj;};!function(factory){__WEBPACK_AMD_DEFINE_ARRAY__=[__webpack_require__(0),__webpack_require__(10),__webpack_require__(11)],void 0!==(__WEBPACK_AMD_DEFINE_RESULT__="function"==typeof(__WEBPACK_AMD_DEFINE_FACTORY__=factory)?__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports,__WEBPACK_AMD_DEFINE_ARRAY__):__WEBPACK_AMD_DEFINE_FACTORY__)&&(module.exports=__WEBPACK_AMD_DEFINE_RESULT__);}(function($,window,document,undefined){function Inputmask(alias,options,internal){if(!(this instanceof Inputmask))return new Inputmask(alias,options,internal);this.el=undefined,this.events={},this.maskset=undefined,this.refreshValue=!1,!0!==internal&&($.isPlainObject(alias)?options=alias:(options=options||{}).alias=alias,this.opts=$.extend(!0,{},this.defaults,options),this.noMasksCache=options&&options.definitions!==undefined,this.userOptions=options||{},this.isRTL=this.opts.numericInput,resolveAlias(this.opts.alias,options,this.opts));}
function resolveAlias(aliasStr,options,opts){var aliasDefinition=Inputmask.prototype.aliases[aliasStr];return aliasDefinition?(aliasDefinition.alias&&resolveAlias(aliasDefinition.alias,undefined,opts),$.extend(!0,opts,aliasDefinition),$.extend(!0,opts,options),!0):(null===opts.mask&&(opts.mask=aliasStr),!1);}
function generateMaskSet(opts,nocache){function generateMask(mask,metadata,opts){var regexMask=!1;if(null!==mask&&""!==mask||((regexMask=null!==opts.regex)?mask=(mask=opts.regex).replace(/^(\^)(.*)(\$)$/,"$2"):(regexMask=!0,mask=".*")),1===mask.length&&!1===opts.greedy&&0!==opts.repeat&&(opts.placeholder=""),opts.repeat>0||"*"===opts.repeat||"+"===opts.repeat){var repeatStart="*"===opts.repeat?0:"+"===opts.repeat?1:opts.repeat;mask=opts.groupmarker.start+mask+opts.groupmarker.end+opts.quantifiermarker.start+repeatStart+","+opts.repeat+opts.quantifiermarker.end;}
var masksetDefinition,maskdefKey=regexMask?"regex_"+opts.regex:opts.numericInput?mask.split("").reverse().join(""):mask;return Inputmask.prototype.masksCache[maskdefKey]===undefined||!0===nocache?(masksetDefinition={mask:mask,maskToken:Inputmask.prototype.analyseMask(mask,regexMask,opts),validPositions:{},_buffer:undefined,buffer:undefined,tests:{},metadata:metadata,maskLength:undefined},!0!==nocache&&(Inputmask.prototype.masksCache[maskdefKey]=masksetDefinition,masksetDefinition=$.extend(!0,{},Inputmask.prototype.masksCache[maskdefKey]))):masksetDefinition=$.extend(!0,{},Inputmask.prototype.masksCache[maskdefKey]),masksetDefinition;}
if($.isFunction(opts.mask)&&(opts.mask=opts.mask(opts)),$.isArray(opts.mask)){if(opts.mask.length>1){opts.keepStatic=null===opts.keepStatic||opts.keepStatic;var altMask=opts.groupmarker.start;return $.each(opts.numericInput?opts.mask.reverse():opts.mask,function(ndx,msk){altMask.length>1&&(altMask+=opts.groupmarker.end+opts.alternatormarker+opts.groupmarker.start),msk.mask===undefined||$.isFunction(msk.mask)?altMask+=msk:altMask+=msk.mask;}),altMask+=opts.groupmarker.end,generateMask(altMask,opts.mask,opts);}
opts.mask=opts.mask.pop();}
return opts.mask&&opts.mask.mask!==undefined&&!$.isFunction(opts.mask.mask)?generateMask(opts.mask.mask,opts.mask,opts):generateMask(opts.mask,opts.mask,opts);}
function maskScope(actionObj,maskset,opts){function getMaskTemplate(baseOnInput,minimalPos,includeMode){minimalPos=minimalPos||0;var ndxIntlzr,test,testPos,maskTemplate=[],pos=0,lvp=getLastValidPosition();do{!0===baseOnInput&&getMaskSet().validPositions[pos]?(test=(testPos=getMaskSet().validPositions[pos]).match,ndxIntlzr=testPos.locator.slice(),maskTemplate.push(!0===includeMode?testPos.input:!1===includeMode?test.nativeDef:getPlaceholder(pos,test))):(test=(testPos=getTestTemplate(pos,ndxIntlzr,pos-1)).match,ndxIntlzr=testPos.locator.slice(),(!1===opts.jitMasking||pos<lvp||"number"==typeof opts.jitMasking&&isFinite(opts.jitMasking)&&opts.jitMasking>pos)&&maskTemplate.push(!1===includeMode?test.nativeDef:getPlaceholder(pos,test))),pos++;}while((maxLength===undefined||pos<maxLength)&&(null!==test.fn||""!==test.def)||minimalPos>pos);return""===maskTemplate[maskTemplate.length-1]&&maskTemplate.pop(),getMaskSet().maskLength=pos+1,maskTemplate;}
function getMaskSet(){return maskset;}
function resetMaskSet(soft){var maskset=getMaskSet();maskset.buffer=undefined,!0!==soft&&(maskset.validPositions={},maskset.p=0);}
function getLastValidPosition(closestTo,strict,validPositions){var before=-1,after=-1,valids=validPositions||getMaskSet().validPositions;closestTo===undefined&&(closestTo=-1);for(var posNdx in valids){var psNdx=parseInt(posNdx);valids[psNdx]&&(strict||!0!==valids[psNdx].generatedInput)&&(psNdx<=closestTo&&(before=psNdx),psNdx>=closestTo&&(after=psNdx));}
return-1!==before&&closestTo-before>1||after<closestTo?before:after;}
function stripValidPositions(start,end,nocheck,strict){var i,startPos=start,positionsClone=$.extend(!0,{},getMaskSet().validPositions),needsValidation=!1;for(getMaskSet().p=start,i=end-1;i>=startPos;i--)getMaskSet().validPositions[i]!==undefined&&(!0!==nocheck&&(!getMaskSet().validPositions[i].match.optionality&&function(pos){var posMatch=getMaskSet().validPositions[pos];if(posMatch!==undefined&&null===posMatch.match.fn){var prevMatch=getMaskSet().validPositions[pos-1],nextMatch=getMaskSet().validPositions[pos+1];return prevMatch!==undefined&&nextMatch!==undefined;}
return!1;}(i)||!1===opts.canClearPosition(getMaskSet(),i,getLastValidPosition(),strict,opts))||delete getMaskSet().validPositions[i]);for(resetMaskSet(!0),i=startPos+1;i<=getLastValidPosition();){for(;getMaskSet().validPositions[startPos]!==undefined;)startPos++;if(i<startPos&&(i=startPos+1),getMaskSet().validPositions[i]===undefined&&isMask(i))i++;else{var t=getTestTemplate(i);!1===needsValidation&&positionsClone[startPos]&&positionsClone[startPos].match.def===t.match.def?(getMaskSet().validPositions[startPos]=$.extend(!0,{},positionsClone[startPos]),getMaskSet().validPositions[startPos].input=t.input,delete getMaskSet().validPositions[i],i++):positionCanMatchDefinition(startPos,t.match.def)?!1!==isValid(startPos,t.input||getPlaceholder(i),!0)&&(delete getMaskSet().validPositions[i],i++,needsValidation=!0):isMask(i)||(i++,startPos--),startPos++;}}
resetMaskSet(!0);}
function determineTestTemplate(tests,guessNextBest){for(var testPos,testPositions=tests,lvp=getLastValidPosition(),lvTest=getMaskSet().validPositions[lvp]||getTests(0)[0],lvTestAltArr=lvTest.alternation!==undefined?lvTest.locator[lvTest.alternation].toString().split(","):[],ndx=0;ndx<testPositions.length&&(!((testPos=testPositions[ndx]).match&&(opts.greedy&&!0!==testPos.match.optionalQuantifier||(!1===testPos.match.optionality||!1===testPos.match.newBlockMarker)&&!0!==testPos.match.optionalQuantifier)&&(lvTest.alternation===undefined||lvTest.alternation!==testPos.alternation||testPos.locator[lvTest.alternation]!==undefined&&checkAlternationMatch(testPos.locator[lvTest.alternation].toString().split(","),lvTestAltArr)))||!0===guessNextBest&&(null!==testPos.match.fn||/[0-9a-bA-Z]/.test(testPos.match.def)));ndx++);return testPos;}
function getTestTemplate(pos,ndxIntlzr,tstPs){return getMaskSet().validPositions[pos]||determineTestTemplate(getTests(pos,ndxIntlzr?ndxIntlzr.slice():ndxIntlzr,tstPs));}
function getTest(pos){return getMaskSet().validPositions[pos]?getMaskSet().validPositions[pos]:getTests(pos)[0];}
function positionCanMatchDefinition(pos,def){for(var valid=!1,tests=getTests(pos),tndx=0;tndx<tests.length;tndx++)if(tests[tndx].match&&tests[tndx].match.def===def){valid=!0;break;}
return valid;}
function getTests(pos,ndxIntlzr,tstPs){function resolveTestFromToken(maskToken,ndxInitializer,loopNdx,quantifierRecurse){function handleMatch(match,loopNdx,quantifierRecurse){function isFirstMatch(latestMatch,tokenGroup){var firstMatch=0===$.inArray(latestMatch,tokenGroup.matches);return firstMatch||$.each(tokenGroup.matches,function(ndx,match){if(!0===match.isQuantifier&&(firstMatch=isFirstMatch(latestMatch,tokenGroup.matches[ndx-1])))return!1;}),firstMatch;}
function resolveNdxInitializer(pos,alternateNdx,targetAlternation){var bestMatch,indexPos;if(getMaskSet().validPositions[pos-1]&&targetAlternation&&getMaskSet().tests[pos])for(var vpAlternation=getMaskSet().validPositions[pos-1].locator,tpAlternation=getMaskSet().tests[pos][0].locator,i=0;i<targetAlternation;i++)if(vpAlternation[i]!==tpAlternation[i])return vpAlternation.slice(targetAlternation+1);return(getMaskSet().tests[pos]||getMaskSet().validPositions[pos])&&$.each(getMaskSet().tests[pos]||[getMaskSet().validPositions[pos]],function(ndx,lmnt){var alternation=targetAlternation!==undefined?targetAlternation:lmnt.alternation,ndxPos=lmnt.locator[alternation]!==undefined?lmnt.locator[alternation].toString().indexOf(alternateNdx):-1;(indexPos===undefined||ndxPos<indexPos)&&-1!==ndxPos&&(bestMatch=lmnt,indexPos=ndxPos);}),bestMatch?bestMatch.locator.slice((targetAlternation!==undefined?targetAlternation:bestMatch.alternation)+1):targetAlternation!==undefined?resolveNdxInitializer(pos,alternateNdx):undefined;}
if(testPos>1e4)throw"Inputmask: There is probably an error in your mask definition or in the code. Create an issue on github with an example of the mask you are using. "+getMaskSet().mask;if(testPos===pos&&match.matches===undefined)return matches.push({match:match,locator:loopNdx.reverse(),cd:cacheDependency}),!0;if(match.matches!==undefined){if(match.isGroup&&quantifierRecurse!==match){if(match=handleMatch(maskToken.matches[$.inArray(match,maskToken.matches)+1],loopNdx))return!0;}else if(match.isOptional){var optionalToken=match;if(match=resolveTestFromToken(match,ndxInitializer,loopNdx,quantifierRecurse)){if(latestMatch=matches[matches.length-1].match,!isFirstMatch(latestMatch,optionalToken))return!0;insertStop=!0,testPos=pos;}}else if(match.isAlternator){var maltMatches,alternateToken=match,malternateMatches=[],currentMatches=matches.slice(),loopNdxCnt=loopNdx.length,altIndex=ndxInitializer.length>0?ndxInitializer.shift():-1;if(-1===altIndex||"string"==typeof altIndex){var amndx,currentPos=testPos,ndxInitializerClone=ndxInitializer.slice(),altIndexArr=[];if("string"==typeof altIndex)altIndexArr=altIndex.split(",");else for(amndx=0;amndx<alternateToken.matches.length;amndx++)altIndexArr.push(amndx);for(var ndx=0;ndx<altIndexArr.length;ndx++){if(amndx=parseInt(altIndexArr[ndx]),matches=[],ndxInitializer=resolveNdxInitializer(testPos,amndx,loopNdxCnt)||ndxInitializerClone.slice(),!0!==(match=handleMatch(alternateToken.matches[amndx]||maskToken.matches[amndx],[amndx].concat(loopNdx),quantifierRecurse)||match)&&match!==undefined&&altIndexArr[altIndexArr.length-1]<alternateToken.matches.length){var ntndx=$.inArray(match,maskToken.matches)+1;maskToken.matches.length>ntndx&&(match=handleMatch(maskToken.matches[ntndx],[ntndx].concat(loopNdx.slice(1,loopNdx.length)),quantifierRecurse))&&(altIndexArr.push(ntndx.toString()),$.each(matches,function(ndx,lmnt){lmnt.alternation=loopNdx.length-1;}));}
maltMatches=matches.slice(),testPos=currentPos,matches=[];for(var ndx1=0;ndx1<maltMatches.length;ndx1++){var altMatch=maltMatches[ndx1],dropMatch=!1;altMatch.alternation=altMatch.alternation||loopNdxCnt;for(var ndx2=0;ndx2<malternateMatches.length;ndx2++){var altMatch2=malternateMatches[ndx2];if("string"!=typeof altIndex||-1!==$.inArray(altMatch.locator[altMatch.alternation].toString(),altIndexArr)){if(function(source,target){return source.match.nativeDef===target.match.nativeDef||source.match.def===target.match.nativeDef||source.match.nativeDef===target.match.def;}(altMatch,altMatch2)){dropMatch=!0,altMatch.alternation===altMatch2.alternation&&-1===altMatch2.locator[altMatch2.alternation].toString().indexOf(altMatch.locator[altMatch.alternation])&&(altMatch2.locator[altMatch2.alternation]=altMatch2.locator[altMatch2.alternation]+","+altMatch.locator[altMatch.alternation],altMatch2.alternation=altMatch.alternation),altMatch.match.nativeDef===altMatch2.match.def&&(altMatch.locator[altMatch.alternation]=altMatch2.locator[altMatch2.alternation],malternateMatches.splice(malternateMatches.indexOf(altMatch2),1,altMatch));break;}
if(altMatch.match.def===altMatch2.match.def){dropMatch=!1;break;}
if(function(source,target){return null===source.match.fn&&null!==target.match.fn&&target.match.fn.test(source.match.def,getMaskSet(),pos,!1,opts,!1);}(altMatch,altMatch2)||function(source,target){return null!==source.match.fn&&null!==target.match.fn&&target.match.fn.test(source.match.def.replace(/[\[\]]/g,""),getMaskSet(),pos,!1,opts,!1);}(altMatch,altMatch2)){altMatch.alternation===altMatch2.alternation&&-1===altMatch.locator[altMatch.alternation].toString().indexOf(altMatch2.locator[altMatch2.alternation].toString().split("")[0])&&(altMatch.na=altMatch.na||altMatch.locator[altMatch.alternation].toString(),-1===altMatch.na.indexOf(altMatch.locator[altMatch.alternation].toString().split("")[0])&&(altMatch.na=altMatch.na+","+altMatch.locator[altMatch2.alternation].toString().split("")[0]),dropMatch=!0,altMatch.locator[altMatch.alternation]=altMatch2.locator[altMatch2.alternation].toString().split("")[0]+","+altMatch.locator[altMatch.alternation],malternateMatches.splice(malternateMatches.indexOf(altMatch2),0,altMatch));break;}}}
dropMatch||malternateMatches.push(altMatch);}}"string"==typeof altIndex&&(malternateMatches=$.map(malternateMatches,function(lmnt,ndx){if(isFinite(ndx)){var alternation=lmnt.alternation,altLocArr=lmnt.locator[alternation].toString().split(",");lmnt.locator[alternation]=undefined,lmnt.alternation=undefined;for(var alndx=0;alndx<altLocArr.length;alndx++)-1!==$.inArray(altLocArr[alndx],altIndexArr)&&(lmnt.locator[alternation]!==undefined?(lmnt.locator[alternation]+=",",lmnt.locator[alternation]+=altLocArr[alndx]):lmnt.locator[alternation]=parseInt(altLocArr[alndx]),lmnt.alternation=alternation);if(lmnt.locator[alternation]!==undefined)return lmnt;}})),matches=currentMatches.concat(malternateMatches),testPos=pos,insertStop=matches.length>0,match=malternateMatches.length>0,ndxInitializer=ndxInitializerClone.slice();}else match=handleMatch(alternateToken.matches[altIndex]||maskToken.matches[altIndex],[altIndex].concat(loopNdx),quantifierRecurse);if(match)return!0;}else if(match.isQuantifier&&quantifierRecurse!==maskToken.matches[$.inArray(match,maskToken.matches)-1])for(var qt=match,qndx=ndxInitializer.length>0?ndxInitializer.shift():0;qndx<(isNaN(qt.quantifier.max)?qndx+1:qt.quantifier.max)&&testPos<=pos;qndx++){var tokenGroup=maskToken.matches[$.inArray(qt,maskToken.matches)-1];if(match=handleMatch(tokenGroup,[qndx].concat(loopNdx),tokenGroup)){if(latestMatch=matches[matches.length-1].match,latestMatch.optionalQuantifier=qndx>qt.quantifier.min-1,isFirstMatch(latestMatch,tokenGroup)){if(qndx>qt.quantifier.min-1){insertStop=!0,testPos=pos;break;}
return!0;}
return!0;}}else if(match=resolveTestFromToken(match,ndxInitializer,loopNdx,quantifierRecurse))return!0;}else testPos++;}
for(var tndx=ndxInitializer.length>0?ndxInitializer.shift():0;tndx<maskToken.matches.length;tndx++)if(!0!==maskToken.matches[tndx].isQuantifier){var match=handleMatch(maskToken.matches[tndx],[tndx].concat(loopNdx),quantifierRecurse);if(match&&testPos===pos)return match;if(testPos>pos)break;}}
function filterTests(tests){if(opts.keepStatic&&pos>0&&tests.length>1+(""===tests[tests.length-1].match.def?1:0)&&!0!==tests[0].match.optionality&&!0!==tests[0].match.optionalQuantifier&&null===tests[0].match.fn&&!/[0-9a-bA-Z]/.test(tests[0].match.def)){if(getMaskSet().validPositions[pos-1]===undefined)return[determineTestTemplate(tests)];if(getMaskSet().validPositions[pos-1].alternation===tests[0].alternation)return[determineTestTemplate(tests)];if(getMaskSet().validPositions[pos-1])return[determineTestTemplate(tests)];}
return tests;}
var latestMatch,maskTokens=getMaskSet().maskToken,testPos=ndxIntlzr?tstPs:0,ndxInitializer=ndxIntlzr?ndxIntlzr.slice():[0],matches=[],insertStop=!1,cacheDependency=ndxIntlzr?ndxIntlzr.join(""):"";if(pos>-1){if(ndxIntlzr===undefined){for(var test,previousPos=pos-1;(test=getMaskSet().validPositions[previousPos]||getMaskSet().tests[previousPos])===undefined&&previousPos>-1;)previousPos--;test!==undefined&&previousPos>-1&&(ndxInitializer=function(tests){var locator=[];return $.isArray(tests)||(tests=[tests]),tests.length>0&&(tests[0].alternation===undefined?0===(locator=determineTestTemplate(tests.slice()).locator.slice()).length&&(locator=tests[0].locator.slice()):$.each(tests,function(ndx,tst){if(""!==tst.def)if(0===locator.length)locator=tst.locator.slice();else for(var i=0;i<locator.length;i++)tst.locator[i]&&-1===locator[i].toString().indexOf(tst.locator[i])&&(locator[i]+=","+tst.locator[i]);})),locator;}(test),cacheDependency=ndxInitializer.join(""),testPos=previousPos);}
if(getMaskSet().tests[pos]&&getMaskSet().tests[pos][0].cd===cacheDependency)return filterTests(getMaskSet().tests[pos]);for(var mtndx=ndxInitializer.shift();mtndx<maskTokens.length&&!(resolveTestFromToken(maskTokens[mtndx],ndxInitializer,[mtndx])&&testPos===pos||testPos>pos);mtndx++);}
return(0===matches.length||insertStop)&&matches.push({match:{fn:null,cardinality:0,optionality:!0,casing:null,def:"",placeholder:""},locator:[],cd:cacheDependency}),ndxIntlzr!==undefined&&getMaskSet().tests[pos]?filterTests($.extend(!0,[],matches)):(getMaskSet().tests[pos]=$.extend(!0,[],matches),filterTests(getMaskSet().tests[pos]));}
function getBufferTemplate(){return getMaskSet()._buffer===undefined&&(getMaskSet()._buffer=getMaskTemplate(!1,1),getMaskSet().buffer===undefined&&(getMaskSet().buffer=getMaskSet()._buffer.slice())),getMaskSet()._buffer;}
function getBuffer(noCache){return getMaskSet().buffer!==undefined&&!0!==noCache||(getMaskSet().buffer=getMaskTemplate(!0,getLastValidPosition(),!0)),getMaskSet().buffer;}
function refreshFromBuffer(start,end,buffer){var i,p;if(!0===start)resetMaskSet(),start=0,end=buffer.length;else for(i=start;i<end;i++)delete getMaskSet().validPositions[i];for(p=start,i=start;i<end;i++)if(resetMaskSet(!0),buffer[i]!==opts.skipOptionalPartCharacter){var valResult=isValid(p,buffer[i],!0,!0);!1!==valResult&&(resetMaskSet(!0),p=valResult.caret!==undefined?valResult.caret:valResult.pos+1);}}
function casing(elem,test,pos){switch(opts.casing||test.casing){case"upper":elem=elem.toUpperCase();break;case"lower":elem=elem.toLowerCase();break;case"title":var posBefore=getMaskSet().validPositions[pos-1];elem=0===pos||posBefore&&posBefore.input===String.fromCharCode(Inputmask.keyCode.SPACE)?elem.toUpperCase():elem.toLowerCase();break;default:if($.isFunction(opts.casing)){var args=Array.prototype.slice.call(arguments);args.push(getMaskSet().validPositions),elem=opts.casing.apply(this,args);}}
return elem;}
function checkAlternationMatch(altArr1,altArr2,na){for(var naNdx,altArrC=opts.greedy?altArr2:altArr2.slice(0,1),isMatch=!1,naArr=na!==undefined?na.split(","):[],i=0;i<naArr.length;i++)-1!==(naNdx=altArr1.indexOf(naArr[i]))&&altArr1.splice(naNdx,1);for(var alndx=0;alndx<altArr1.length;alndx++)if(-1!==$.inArray(altArr1[alndx],altArrC)){isMatch=!0;break;}
return isMatch;}
function isValid(pos,c,strict,fromSetValid,fromAlternate,validateOnly){function isSelection(posObj){var selection=isRTL?posObj.begin-posObj.end>1||posObj.begin-posObj.end==1:posObj.end-posObj.begin>1||posObj.end-posObj.begin==1;return selection&&0===posObj.begin&&posObj.end===getMaskSet().maskLength?"full":selection;}
function _isValid(position,c,strict){var rslt=!1;return $.each(getTests(position),function(ndx,tst){for(var test=tst.match,loopend=c?1:0,chrs="",i=test.cardinality;i>loopend;i--)chrs+=getBufferElement(position-(i-1));if(c&&(chrs+=c),getBuffer(!0),!1!==(rslt=null!=test.fn?test.fn.test(chrs,getMaskSet(),position,strict,opts,isSelection(pos)):(c===test.def||c===opts.skipOptionalPartCharacter)&&""!==test.def&&{c:getPlaceholder(position,test,!0)||test.def,pos:position})){var elem=rslt.c!==undefined?rslt.c:c;elem=elem===opts.skipOptionalPartCharacter&&null===test.fn?getPlaceholder(position,test,!0)||test.def:elem;var validatedPos=position,possibleModifiedBuffer=getBuffer();if(rslt.remove!==undefined&&($.isArray(rslt.remove)||(rslt.remove=[rslt.remove]),$.each(rslt.remove.sort(function(a,b){return b-a;}),function(ndx,lmnt){stripValidPositions(lmnt,lmnt+1,!0);})),rslt.insert!==undefined&&($.isArray(rslt.insert)||(rslt.insert=[rslt.insert]),$.each(rslt.insert.sort(function(a,b){return a-b;}),function(ndx,lmnt){isValid(lmnt.pos,lmnt.c,!0,fromSetValid);})),rslt.refreshFromBuffer){var refresh=rslt.refreshFromBuffer;if(refreshFromBuffer(!0===refresh?refresh:refresh.start,refresh.end,possibleModifiedBuffer),rslt.pos===undefined&&rslt.c===undefined)return rslt.pos=getLastValidPosition(),!1;if((validatedPos=rslt.pos!==undefined?rslt.pos:position)!==position)return rslt=$.extend(rslt,isValid(validatedPos,elem,!0,fromSetValid)),!1;}else if(!0!==rslt&&rslt.pos!==undefined&&rslt.pos!==position&&(validatedPos=rslt.pos,refreshFromBuffer(position,validatedPos,getBuffer().slice()),validatedPos!==position))return rslt=$.extend(rslt,isValid(validatedPos,elem,!0)),!1;return(!0===rslt||rslt.pos!==undefined||rslt.c!==undefined)&&(ndx>0&&resetMaskSet(!0),setValidPosition(validatedPos,$.extend({},tst,{input:casing(elem,test,validatedPos)}),fromSetValid,isSelection(pos))||(rslt=!1),!1);}}),rslt;}
function setValidPosition(pos,validTest,fromSetValid,isSelection){if(isSelection||opts.insertMode&&getMaskSet().validPositions[pos]!==undefined&&fromSetValid===undefined){var i,positionsClone=$.extend(!0,{},getMaskSet().validPositions),lvp=getLastValidPosition(undefined,!0);for(i=pos;i<=lvp;i++)delete getMaskSet().validPositions[i];getMaskSet().validPositions[pos]=$.extend(!0,{},validTest);var j,valid=!0,vps=getMaskSet().validPositions,needsValidation=!1,initialLength=getMaskSet().maskLength;for(i=j=pos;i<=lvp;i++){var t=positionsClone[i];if(t!==undefined)for(var posMatch=j;posMatch<getMaskSet().maskLength&&(null===t.match.fn&&vps[i]&&(!0===vps[i].match.optionalQuantifier||!0===vps[i].match.optionality)||null!=t.match.fn);){if(posMatch++,!1===needsValidation&&positionsClone[posMatch]&&positionsClone[posMatch].match.def===t.match.def)getMaskSet().validPositions[posMatch]=$.extend(!0,{},positionsClone[posMatch]),getMaskSet().validPositions[posMatch].input=t.input,fillMissingNonMask(posMatch),j=posMatch,valid=!0;else if(positionCanMatchDefinition(posMatch,t.match.def)){var result=isValid(posMatch,t.input,!0,!0);valid=!1!==result,j=result.caret||result.insert?getLastValidPosition():posMatch,needsValidation=!0;}else if(!(valid=!0===t.generatedInput)&&posMatch>=getMaskSet().maskLength-1)break;if(getMaskSet().maskLength<initialLength&&(getMaskSet().maskLength=initialLength),valid)break;}
if(!valid)break;}
if(!valid)return getMaskSet().validPositions=$.extend(!0,{},positionsClone),resetMaskSet(!0),!1;}else getMaskSet().validPositions[pos]=$.extend(!0,{},validTest);return resetMaskSet(!0),!0;}
function fillMissingNonMask(maskPos){for(var pndx=maskPos-1;pndx>-1&&!getMaskSet().validPositions[pndx];pndx--);var testTemplate,testsFromPos;for(pndx++;pndx<maskPos;pndx++)getMaskSet().validPositions[pndx]===undefined&&(!1===opts.jitMasking||opts.jitMasking>pndx)&&(""===(testsFromPos=getTests(pndx,getTestTemplate(pndx-1).locator,pndx-1).slice())[testsFromPos.length-1].match.def&&testsFromPos.pop(),(testTemplate=determineTestTemplate(testsFromPos))&&(testTemplate.match.def===opts.radixPointDefinitionSymbol||!isMask(pndx,!0)||$.inArray(opts.radixPoint,getBuffer())<pndx&&testTemplate.match.fn&&testTemplate.match.fn.test(getPlaceholder(pndx),getMaskSet(),pndx,!1,opts))&&!1!==(result=_isValid(pndx,getPlaceholder(pndx,testTemplate.match,!0)||(null==testTemplate.match.fn?testTemplate.match.def:""!==getPlaceholder(pndx)?getPlaceholder(pndx):getBuffer()[pndx]),!0))&&(getMaskSet().validPositions[result.pos||pndx].generatedInput=!0));}
strict=!0===strict;var maskPos=pos;pos.begin!==undefined&&(maskPos=isRTL&&!isSelection(pos)?pos.end:pos.begin);var result=!0,positionsClone=$.extend(!0,{},getMaskSet().validPositions);if($.isFunction(opts.preValidation)&&!strict&&!0!==fromSetValid&&!0!==validateOnly&&(result=opts.preValidation(getBuffer(),maskPos,c,isSelection(pos),opts)),!0===result){if(fillMissingNonMask(maskPos),isSelection(pos)&&(handleRemove(undefined,Inputmask.keyCode.DELETE,pos,!0,!0),maskPos=getMaskSet().p),maskPos<getMaskSet().maskLength&&(maxLength===undefined||maskPos<maxLength)&&(result=_isValid(maskPos,c,strict),(!strict||!0===fromSetValid)&&!1===result&&!0!==validateOnly)){var currentPosValid=getMaskSet().validPositions[maskPos];if(!currentPosValid||null!==currentPosValid.match.fn||currentPosValid.match.def!==c&&c!==opts.skipOptionalPartCharacter){if((opts.insertMode||getMaskSet().validPositions[seekNext(maskPos)]===undefined)&&!isMask(maskPos,!0))for(var nPos=maskPos+1,snPos=seekNext(maskPos);nPos<=snPos;nPos++)if(!1!==(result=_isValid(nPos,c,strict))){!function(originalPos,newPos){var vp=getMaskSet().validPositions[newPos];if(vp)for(var targetLocator=vp.locator,tll=targetLocator.length,ps=originalPos;ps<newPos;ps++)if(getMaskSet().validPositions[ps]===undefined&&!isMask(ps,!0)){var tests=getTests(ps).slice(),bestMatch=determineTestTemplate(tests,!0),equality=-1;""===tests[tests.length-1].match.def&&tests.pop(),$.each(tests,function(ndx,tst){for(var i=0;i<tll;i++){if(tst.locator[i]===undefined||!checkAlternationMatch(tst.locator[i].toString().split(","),targetLocator[i].toString().split(","),tst.na)){var targetAI=targetLocator[i],bestMatchAI=bestMatch.locator[i],tstAI=tst.locator[i];targetAI-bestMatchAI>Math.abs(targetAI-tstAI)&&(bestMatch=tst);break;}
equality<i&&(equality=i,bestMatch=tst);}}),(bestMatch=$.extend({},bestMatch,{input:getPlaceholder(ps,bestMatch.match,!0)||bestMatch.match.def})).generatedInput=!0,setValidPosition(ps,bestMatch,!0),getMaskSet().validPositions[newPos]=undefined,_isValid(newPos,vp.input,!0);}}(maskPos,result.pos!==undefined?result.pos:nPos),maskPos=nPos;break;}}else result={caret:seekNext(maskPos)};}
!1===result&&opts.keepStatic&&!strict&&!0!==fromAlternate&&(result=function(pos,c,strict){var lastAlt,alternation,altPos,prevAltPos,i,validPos,altNdxs,decisionPos,validPsClone=$.extend(!0,{},getMaskSet().validPositions),isValidRslt=!1,lAltPos=getLastValidPosition();for(prevAltPos=getMaskSet().validPositions[lAltPos];lAltPos>=0;lAltPos--)if((altPos=getMaskSet().validPositions[lAltPos])&&altPos.alternation!==undefined){if(lastAlt=lAltPos,alternation=getMaskSet().validPositions[lastAlt].alternation,prevAltPos.locator[altPos.alternation]!==altPos.locator[altPos.alternation])break;prevAltPos=altPos;}
if(alternation!==undefined){decisionPos=parseInt(lastAlt);var decisionTaker=prevAltPos.locator[prevAltPos.alternation||alternation]!==undefined?prevAltPos.locator[prevAltPos.alternation||alternation]:altNdxs[0];decisionTaker.length>0&&(decisionTaker=decisionTaker.split(",")[0]);var possibilityPos=getMaskSet().validPositions[decisionPos],prevPos=getMaskSet().validPositions[decisionPos-1];$.each(getTests(decisionPos,prevPos?prevPos.locator:undefined,decisionPos-1),function(ndx,test){altNdxs=test.locator[alternation]?test.locator[alternation].toString().split(","):[];for(var mndx=0;mndx<altNdxs.length;mndx++){var validInputs=[],staticInputsBeforePos=0,staticInputsBeforePosAlternate=0,verifyValidInput=!1;if(decisionTaker<altNdxs[mndx]&&(test.na===undefined||-1===$.inArray(altNdxs[mndx],test.na.split(","))||-1===$.inArray(decisionTaker.toString(),altNdxs))){getMaskSet().validPositions[decisionPos]=$.extend(!0,{},test);var possibilities=getMaskSet().validPositions[decisionPos].locator;for(getMaskSet().validPositions[decisionPos].locator[alternation]=parseInt(altNdxs[mndx]),null==test.match.fn?(possibilityPos.input!==test.match.def&&(verifyValidInput=!0,!0!==possibilityPos.generatedInput&&validInputs.push(possibilityPos.input)),staticInputsBeforePosAlternate++,getMaskSet().validPositions[decisionPos].generatedInput=!/[0-9a-bA-Z]/.test(test.match.def),getMaskSet().validPositions[decisionPos].input=test.match.def):getMaskSet().validPositions[decisionPos].input=possibilityPos.input,i=decisionPos+1;i<getLastValidPosition(undefined,!0)+1;i++)(validPos=getMaskSet().validPositions[i])&&!0!==validPos.generatedInput&&/[0-9a-bA-Z]/.test(validPos.input)?validInputs.push(validPos.input):i<pos&&staticInputsBeforePos++,delete getMaskSet().validPositions[i];for(verifyValidInput&&validInputs[0]===test.match.def&&validInputs.shift(),resetMaskSet(!0),isValidRslt=!0;validInputs.length>0;){var input=validInputs.shift();if(input!==opts.skipOptionalPartCharacter&&!(isValidRslt=isValid(getLastValidPosition(undefined,!0)+1,input,!1,fromSetValid,!0)))break;}
if(isValidRslt){getMaskSet().validPositions[decisionPos].locator=possibilities;var targetLvp=getLastValidPosition(pos)+1;for(i=decisionPos+1;i<getLastValidPosition()+1;i++)((validPos=getMaskSet().validPositions[i])===undefined||null==validPos.match.fn)&&i<pos+(staticInputsBeforePosAlternate-staticInputsBeforePos)&&staticInputsBeforePosAlternate++;isValidRslt=isValid((pos+=staticInputsBeforePosAlternate-staticInputsBeforePos)>targetLvp?targetLvp:pos,c,strict,fromSetValid,!0);}
if(isValidRslt)return!1;resetMaskSet(),getMaskSet().validPositions=$.extend(!0,{},validPsClone);}}});}
return isValidRslt;}(maskPos,c,strict)),!0===result&&(result={pos:maskPos});}
if($.isFunction(opts.postValidation)&&!1!==result&&!strict&&!0!==fromSetValid&&!0!==validateOnly){var postResult=opts.postValidation(getBuffer(!0),result,opts);if(postResult.refreshFromBuffer&&postResult.buffer){var refresh=postResult.refreshFromBuffer;refreshFromBuffer(!0===refresh?refresh:refresh.start,refresh.end,postResult.buffer);}
result=!0===postResult?result:postResult;}
return result&&result.pos===undefined&&(result.pos=maskPos),!1!==result&&!0!==validateOnly||(resetMaskSet(!0),getMaskSet().validPositions=$.extend(!0,{},positionsClone)),result;}
function isMask(pos,strict){var test=getTestTemplate(pos).match;if(""===test.def&&(test=getTest(pos).match),null!=test.fn)return test.fn;if(!0!==strict&&pos>-1){var tests=getTests(pos);return tests.length>1+(""===tests[tests.length-1].match.def?1:0);}
return!1;}
function seekNext(pos,newBlock){var maskL=getMaskSet().maskLength;if(pos>=maskL)return maskL;var position=pos;for(getTests(maskL+1).length>1&&(getMaskTemplate(!0,maskL+1,!0),maskL=getMaskSet().maskLength);++position<maskL&&(!0===newBlock&&(!0!==getTest(position).match.newBlockMarker||!isMask(position))||!0!==newBlock&&!isMask(position)););return position;}
function seekPrevious(pos,newBlock){var tests,position=pos;if(position<=0)return 0;for(;--position>0&&(!0===newBlock&&!0!==getTest(position).match.newBlockMarker||!0!==newBlock&&!isMask(position)&&((tests=getTests(position)).length<2||2===tests.length&&""===tests[1].match.def)););return position;}
function getBufferElement(position){return getMaskSet().validPositions[position]===undefined?getPlaceholder(position):getMaskSet().validPositions[position].input;}
function writeBuffer(input,buffer,caretPos,event,triggerInputEvent){if(event&&$.isFunction(opts.onBeforeWrite)){var result=opts.onBeforeWrite.call(inputmask,event,buffer,caretPos,opts);if(result){if(result.refreshFromBuffer){var refresh=result.refreshFromBuffer;refreshFromBuffer(!0===refresh?refresh:refresh.start,refresh.end,result.buffer||buffer),buffer=getBuffer(!0);}
caretPos!==undefined&&(caretPos=result.caret!==undefined?result.caret:caretPos);}}
input!==undefined&&(input.inputmask._valueSet(buffer.join("")),caretPos===undefined||event!==undefined&&"blur"===event.type?renderColorMask(input,caretPos,0===buffer.length):android&&event&&"input"===event.type?setTimeout(function(){caret(input,caretPos);},0):caret(input,caretPos),!0===triggerInputEvent&&(skipInputEvent=!0,$(input).trigger("input")));}
function getPlaceholder(pos,test,returnPL){if((test=test||getTest(pos).match).placeholder!==undefined||!0===returnPL)return $.isFunction(test.placeholder)?test.placeholder(opts):test.placeholder;if(null===test.fn){if(pos>-1&&getMaskSet().validPositions[pos]===undefined){var prevTest,tests=getTests(pos),staticAlternations=[];if(tests.length>1+(""===tests[tests.length-1].match.def?1:0))for(var i=0;i<tests.length;i++)if(!0!==tests[i].match.optionality&&!0!==tests[i].match.optionalQuantifier&&(null===tests[i].match.fn||prevTest===undefined||!1!==tests[i].match.fn.test(prevTest.match.def,getMaskSet(),pos,!0,opts))&&(staticAlternations.push(tests[i]),null===tests[i].match.fn&&(prevTest=tests[i]),staticAlternations.length>1&&/[0-9a-bA-Z]/.test(staticAlternations[0].match.def)))return opts.placeholder.charAt(pos%opts.placeholder.length);}
return test.def;}
return opts.placeholder.charAt(pos%opts.placeholder.length);}
function checkVal(input,writeOut,strict,nptvl,initiatingEvent){function isTemplateMatch(ndx,charCodes){return-1!==getBufferTemplate().slice(ndx,seekNext(ndx)).join("").indexOf(charCodes)&&!isMask(ndx)&&getTest(ndx).match.nativeDef===charCodes.charAt(charCodes.length-1);}
var inputValue=nptvl.slice(),charCodes="",initialNdx=-1,result=undefined;if(resetMaskSet(),strict||!0===opts.autoUnmask)initialNdx=seekNext(initialNdx);else{var staticInput=getBufferTemplate().slice(0,seekNext(-1)).join(""),matches=inputValue.join("").match(new RegExp("^"+Inputmask.escapeRegex(staticInput),"g"));matches&&matches.length>0&&(inputValue.splice(0,matches.length*staticInput.length),initialNdx=seekNext(initialNdx));}
if(-1===initialNdx?(getMaskSet().p=seekNext(initialNdx),initialNdx=0):getMaskSet().p=initialNdx,$.each(inputValue,function(ndx,charCode){if(charCode!==undefined)if(getMaskSet().validPositions[ndx]===undefined&&inputValue[ndx]===getPlaceholder(ndx)&&isMask(ndx,!0)&&!1===isValid(ndx,inputValue[ndx],!0,undefined,undefined,!0))getMaskSet().p++;else{var keypress=new $.Event("_checkval");keypress.which=charCode.charCodeAt(0),charCodes+=charCode;var lvp=getLastValidPosition(undefined,!0),lvTest=getMaskSet().validPositions[lvp],nextTest=getTestTemplate(lvp+1,lvTest?lvTest.locator.slice():undefined,lvp);if(!isTemplateMatch(initialNdx,charCodes)||strict||opts.autoUnmask){var pos=strict?ndx:null==nextTest.match.fn&&nextTest.match.optionality&&lvp+1<getMaskSet().p?lvp+1:getMaskSet().p;result=EventHandlers.keypressEvent.call(input,keypress,!0,!1,strict,pos),initialNdx=pos+1,charCodes="";}else result=EventHandlers.keypressEvent.call(input,keypress,!0,!1,!0,lvp+1);if(!1!==result&&!strict&&$.isFunction(opts.onBeforeWrite)){var origResult=result;if(result=opts.onBeforeWrite.call(inputmask,keypress,getBuffer(),result.forwardPosition,opts),(result=$.extend(origResult,result))&&result.refreshFromBuffer){var refresh=result.refreshFromBuffer;refreshFromBuffer(!0===refresh?refresh:refresh.start,refresh.end,result.buffer),resetMaskSet(!0),result.caret&&(getMaskSet().p=result.caret,result.forwardPosition=result.caret);}}}}),writeOut){var caretPos=undefined;document.activeElement===input&&result&&(caretPos=opts.numericInput?seekPrevious(result.forwardPosition):result.forwardPosition),writeBuffer(input,getBuffer(),caretPos,initiatingEvent||new $.Event("checkval"),initiatingEvent&&"input"===initiatingEvent.type);}}
function unmaskedvalue(input){if(input){if(input.inputmask===undefined)return input.value;input.inputmask&&input.inputmask.refreshValue&&EventHandlers.setValueEvent.call(input);}
var umValue=[],vps=getMaskSet().validPositions;for(var pndx in vps)vps[pndx].match&&null!=vps[pndx].match.fn&&umValue.push(vps[pndx].input);var unmaskedValue=0===umValue.length?"":(isRTL?umValue.reverse():umValue).join("");if($.isFunction(opts.onUnMask)){var bufferValue=(isRTL?getBuffer().slice().reverse():getBuffer()).join("");unmaskedValue=opts.onUnMask.call(inputmask,bufferValue,unmaskedValue,opts);}
return unmaskedValue;}
function caret(input,begin,end,notranslate){function translatePosition(pos){return!0===notranslate||!isRTL||"number"!=typeof pos||opts.greedy&&""===opts.placeholder||(pos=getBuffer().join("").length-pos),pos;}
var range;if(begin===undefined)return input.setSelectionRange?(begin=input.selectionStart,end=input.selectionEnd):window.getSelection?(range=window.getSelection().getRangeAt(0)).commonAncestorContainer.parentNode!==input&&range.commonAncestorContainer!==input||(begin=range.startOffset,end=range.endOffset):document.selection&&document.selection.createRange&&(end=(begin=0-(range=document.selection.createRange()).duplicate().moveStart("character",-input.inputmask._valueGet().length))+range.text.length),{begin:translatePosition(begin),end:translatePosition(end)};if(begin.begin!==undefined&&(end=begin.end,begin=begin.begin),"number"==typeof begin){begin=translatePosition(begin),end="number"==typeof(end=translatePosition(end))?end:begin;var scrollCalc=parseInt(((input.ownerDocument.defaultView||window).getComputedStyle?(input.ownerDocument.defaultView||window).getComputedStyle(input,null):input.currentStyle).fontSize)*end;if(input.scrollLeft=scrollCalc>input.scrollWidth?scrollCalc:0,mobile||!1!==opts.insertMode||begin!==end||end++,input.setSelectionRange)input.selectionStart=begin,input.selectionEnd=end;else if(window.getSelection){if(range=document.createRange(),input.firstChild===undefined||null===input.firstChild){var textNode=document.createTextNode("");input.appendChild(textNode);}
range.setStart(input.firstChild,begin<input.inputmask._valueGet().length?begin:input.inputmask._valueGet().length),range.setEnd(input.firstChild,end<input.inputmask._valueGet().length?end:input.inputmask._valueGet().length),range.collapse(!0);var sel=window.getSelection();sel.removeAllRanges(),sel.addRange(range);}else input.createTextRange&&((range=input.createTextRange()).collapse(!0),range.moveEnd("character",end),range.moveStart("character",begin),range.select());renderColorMask(input,{begin:begin,end:end});}}
function determineLastRequiredPosition(returnDefinition){var pos,testPos,buffer=getBuffer(),bl=buffer.length,lvp=getLastValidPosition(),positions={},lvTest=getMaskSet().validPositions[lvp],ndxIntlzr=lvTest!==undefined?lvTest.locator.slice():undefined;for(pos=lvp+1;pos<buffer.length;pos++)ndxIntlzr=(testPos=getTestTemplate(pos,ndxIntlzr,pos-1)).locator.slice(),positions[pos]=$.extend(!0,{},testPos);var lvTestAlt=lvTest&&lvTest.alternation!==undefined?lvTest.locator[lvTest.alternation]:undefined;for(pos=bl-1;pos>lvp&&(((testPos=positions[pos]).match.optionality||testPos.match.optionalQuantifier&&testPos.match.newBlockMarker||lvTestAlt&&(lvTestAlt!==positions[pos].locator[lvTest.alternation]&&null!=testPos.match.fn||null===testPos.match.fn&&testPos.locator[lvTest.alternation]&&checkAlternationMatch(testPos.locator[lvTest.alternation].toString().split(","),lvTestAlt.toString().split(","))&&""!==getTests(pos)[0].def))&&buffer[pos]===getPlaceholder(pos,testPos.match));pos--)bl--;return returnDefinition?{l:bl,def:positions[bl]?positions[bl].match:undefined}:bl;}
function clearOptionalTail(buffer){for(var validPos,rl=determineLastRequiredPosition(),bl=buffer.length,lv=getMaskSet().validPositions[getLastValidPosition()];rl<bl&&!isMask(rl,!0)&&(validPos=lv!==undefined?getTestTemplate(rl,lv.locator.slice(""),lv):getTest(rl))&&!0!==validPos.match.optionality&&(!0!==validPos.match.optionalQuantifier&&!0!==validPos.match.newBlockMarker||rl+1===bl&&""===(lv!==undefined?getTestTemplate(rl+1,lv.locator.slice(""),lv):getTest(rl+1)).match.def);)rl++;for(;(validPos=getMaskSet().validPositions[rl-1])&&validPos&&validPos.match.optionality&&validPos.input===opts.skipOptionalPartCharacter;)rl--;return buffer.splice(rl),buffer;}
function isComplete(buffer){if($.isFunction(opts.isComplete))return opts.isComplete(buffer,opts);if("*"===opts.repeat)return undefined;var complete=!1,lrp=determineLastRequiredPosition(!0),aml=seekPrevious(lrp.l);if(lrp.def===undefined||lrp.def.newBlockMarker||lrp.def.optionality||lrp.def.optionalQuantifier){complete=!0;for(var i=0;i<=aml;i++){var test=getTestTemplate(i).match;if(null!==test.fn&&getMaskSet().validPositions[i]===undefined&&!0!==test.optionality&&!0!==test.optionalQuantifier||null===test.fn&&buffer[i]!==getPlaceholder(i,test)){complete=!1;break;}}}
return complete;}
function handleRemove(input,k,pos,strict,fromIsValid){if((opts.numericInput||isRTL)&&(k===Inputmask.keyCode.BACKSPACE?k=Inputmask.keyCode.DELETE:k===Inputmask.keyCode.DELETE&&(k=Inputmask.keyCode.BACKSPACE),isRTL)){var pend=pos.end;pos.end=pos.begin,pos.begin=pend;}
k===Inputmask.keyCode.BACKSPACE&&(pos.end-pos.begin<1||!1===opts.insertMode)?(pos.begin=seekPrevious(pos.begin),getMaskSet().validPositions[pos.begin]!==undefined&&getMaskSet().validPositions[pos.begin].input===opts.groupSeparator&&pos.begin--):k===Inputmask.keyCode.DELETE&&pos.begin===pos.end&&(pos.end=isMask(pos.end,!0)&&getMaskSet().validPositions[pos.end]&&getMaskSet().validPositions[pos.end].input!==opts.radixPoint?pos.end+1:seekNext(pos.end)+1,getMaskSet().validPositions[pos.begin]!==undefined&&getMaskSet().validPositions[pos.begin].input===opts.groupSeparator&&pos.end++),stripValidPositions(pos.begin,pos.end,!1,strict),!0!==strict&&function(){if(opts.keepStatic){for(var validInputs=[],lastAlt=getLastValidPosition(-1,!0),positionsClone=$.extend(!0,{},getMaskSet().validPositions),prevAltPos=getMaskSet().validPositions[lastAlt];lastAlt>=0;lastAlt--){var altPos=getMaskSet().validPositions[lastAlt];if(altPos){if(!0!==altPos.generatedInput&&/[0-9a-bA-Z]/.test(altPos.input)&&validInputs.push(altPos.input),delete getMaskSet().validPositions[lastAlt],altPos.alternation!==undefined&&altPos.locator[altPos.alternation]!==prevAltPos.locator[altPos.alternation])break;prevAltPos=altPos;}}
if(lastAlt>-1)for(getMaskSet().p=seekNext(getLastValidPosition(-1,!0));validInputs.length>0;){var keypress=new $.Event("keypress");keypress.which=validInputs.pop().charCodeAt(0),EventHandlers.keypressEvent.call(input,keypress,!0,!1,!1,getMaskSet().p);}else getMaskSet().validPositions=$.extend(!0,{},positionsClone);}}();var lvp=getLastValidPosition(pos.begin,!0);if(lvp<pos.begin)getMaskSet().p=seekNext(lvp);else if(!0!==strict&&(getMaskSet().p=pos.begin,!0!==fromIsValid))for(;getMaskSet().p<lvp&&getMaskSet().validPositions[getMaskSet().p]===undefined;)getMaskSet().p++;}
function initializeColorMask(input){function findCaretPos(clientx){var caretPos,e=document.createElement("span");for(var style in computedStyle)isNaN(style)&&-1!==style.indexOf("font")&&(e.style[style]=computedStyle[style]);e.style.textTransform=computedStyle.textTransform,e.style.letterSpacing=computedStyle.letterSpacing,e.style.position="absolute",e.style.height="auto",e.style.width="auto",e.style.visibility="hidden",e.style.whiteSpace="nowrap",document.body.appendChild(e);var itl,inputText=input.inputmask._valueGet(),previousWidth=0;for(caretPos=0,itl=inputText.length;caretPos<=itl;caretPos++){if(e.innerHTML+=inputText.charAt(caretPos)||"_",e.offsetWidth>=clientx){var offset1=clientx-previousWidth,offset2=e.offsetWidth-clientx;e.innerHTML=inputText.charAt(caretPos),caretPos=(offset1-=e.offsetWidth/3)<offset2?caretPos-1:caretPos;break;}
previousWidth=e.offsetWidth;}
return document.body.removeChild(e),caretPos;}
var computedStyle=(input.ownerDocument.defaultView||window).getComputedStyle(input,null),template=document.createElement("div");template.style.width=computedStyle.width,template.style.textAlign=computedStyle.textAlign,(colorMask=document.createElement("div")).className="im-colormask",input.parentNode.insertBefore(colorMask,input),input.parentNode.removeChild(input),colorMask.appendChild(template),colorMask.appendChild(input),input.style.left=template.offsetLeft+"px",$(input).on("click",function(e){return caret(input,findCaretPos(e.clientX)),EventHandlers.clickEvent.call(input,[e]);}),$(input).on("keydown",function(e){e.shiftKey||!1===opts.insertMode||setTimeout(function(){renderColorMask(input);},0);});}
function renderColorMask(input,caretPos,clear){function handleStatic(){isStatic||null!==test.fn&&testPos.input!==undefined?isStatic&&(null!==test.fn&&testPos.input!==undefined||""===test.def)&&(isStatic=!1,maskTemplate+="</span>"):(isStatic=!0,maskTemplate+="<span class='im-static'>");}
function handleCaret(force){!0!==force&&pos!==caretPos.begin||document.activeElement!==input||(maskTemplate+="<span class='im-caret' style='border-right-width: 1px;border-right-style: solid;'></span>");}
var test,testPos,ndxIntlzr,maskTemplate="",isStatic=!1,pos=0;if(colorMask!==undefined){var buffer=getBuffer();if(caretPos===undefined?caretPos=caret(input):caretPos.begin===undefined&&(caretPos={begin:caretPos,end:caretPos}),!0!==clear){var lvp=getLastValidPosition();do{handleCaret(),getMaskSet().validPositions[pos]?(testPos=getMaskSet().validPositions[pos],test=testPos.match,ndxIntlzr=testPos.locator.slice(),handleStatic(),maskTemplate+=buffer[pos]):(testPos=getTestTemplate(pos,ndxIntlzr,pos-1),test=testPos.match,ndxIntlzr=testPos.locator.slice(),(!1===opts.jitMasking||pos<lvp||"number"==typeof opts.jitMasking&&isFinite(opts.jitMasking)&&opts.jitMasking>pos)&&(handleStatic(),maskTemplate+=getPlaceholder(pos,test))),pos++;}while((maxLength===undefined||pos<maxLength)&&(null!==test.fn||""!==test.def)||lvp>pos||isStatic);-1===maskTemplate.indexOf("im-caret")&&handleCaret(!0),isStatic&&handleStatic();}
var template=colorMask.getElementsByTagName("div")[0];template.innerHTML=maskTemplate,input.inputmask.positionColorMask(input,template);}}
maskset=maskset||this.maskset,opts=opts||this.opts;var undoValue,$el,maxLength,colorMask,inputmask=this,el=this.el,isRTL=this.isRTL,skipKeyPressEvent=!1,skipInputEvent=!1,ignorable=!1,mouseEnter=!1,EventRuler={on:function(input,eventName,eventHandler){var ev=function(e){if(this.inputmask===undefined&&"FORM"!==this.nodeName){var imOpts=$.data(this,"_inputmask_opts");imOpts?new Inputmask(imOpts).mask(this):EventRuler.off(this);}else{if("setvalue"===e.type||"FORM"===this.nodeName||!(this.disabled||this.readOnly&&!("keydown"===e.type&&e.ctrlKey&&67===e.keyCode||!1===opts.tabThrough&&e.keyCode===Inputmask.keyCode.TAB))){switch(e.type){case"input":if(!0===skipInputEvent)return skipInputEvent=!1,e.preventDefault();break;case"keydown":skipKeyPressEvent=!1,skipInputEvent=!1;break;case"keypress":if(!0===skipKeyPressEvent)return e.preventDefault();skipKeyPressEvent=!0;break;case"click":if(iemobile||iphone){var that=this,args=arguments;return setTimeout(function(){eventHandler.apply(that,args);},0),!1;}}
var returnVal=eventHandler.apply(this,arguments);return!1===returnVal&&(e.preventDefault(),e.stopPropagation()),returnVal;}
e.preventDefault();}};input.inputmask.events[eventName]=input.inputmask.events[eventName]||[],input.inputmask.events[eventName].push(ev),-1!==$.inArray(eventName,["submit","reset"])?null!==input.form&&$(input.form).on(eventName,ev):$(input).on(eventName,ev);},off:function(input,event){if(input.inputmask&&input.inputmask.events){var events;event?(events=[])[event]=input.inputmask.events[event]:events=input.inputmask.events,$.each(events,function(eventName,evArr){for(;evArr.length>0;){var ev=evArr.pop();-1!==$.inArray(eventName,["submit","reset"])?null!==input.form&&$(input.form).off(eventName,ev):$(input).off(eventName,ev);}
delete input.inputmask.events[eventName];});}}},EventHandlers={keydownEvent:function(e){var input=this,$input=$(input),k=e.keyCode,pos=caret(input);if(k===Inputmask.keyCode.BACKSPACE||k===Inputmask.keyCode.DELETE||iphone&&k===Inputmask.keyCode.BACKSPACE_SAFARI||e.ctrlKey&&k===Inputmask.keyCode.X&&!function(eventName){var el=document.createElement("input"),evName="on"+eventName,isSupported=evName in el;return isSupported||(el.setAttribute(evName,"return;"),isSupported="function"==typeof el[evName]),el=null,isSupported;}("cut"))e.preventDefault(),handleRemove(input,k,pos),writeBuffer(input,getBuffer(!0),getMaskSet().p,e,input.inputmask._valueGet()!==getBuffer().join("")),input.inputmask._valueGet()===getBufferTemplate().join("")?$input.trigger("cleared"):!0===isComplete(getBuffer())&&$input.trigger("complete");else if(k===Inputmask.keyCode.END||k===Inputmask.keyCode.PAGE_DOWN){e.preventDefault();var caretPos=seekNext(getLastValidPosition());opts.insertMode||caretPos!==getMaskSet().maskLength||e.shiftKey||caretPos--,caret(input,e.shiftKey?pos.begin:caretPos,caretPos,!0);}else k===Inputmask.keyCode.HOME&&!e.shiftKey||k===Inputmask.keyCode.PAGE_UP?(e.preventDefault(),caret(input,0,e.shiftKey?pos.begin:0,!0)):(opts.undoOnEscape&&k===Inputmask.keyCode.ESCAPE||90===k&&e.ctrlKey)&&!0!==e.altKey?(checkVal(input,!0,!1,undoValue.split("")),$input.trigger("click")):k!==Inputmask.keyCode.INSERT||e.shiftKey||e.ctrlKey?!0===opts.tabThrough&&k===Inputmask.keyCode.TAB?(!0===e.shiftKey?(null===getTest(pos.begin).match.fn&&(pos.begin=seekNext(pos.begin)),pos.end=seekPrevious(pos.begin,!0),pos.begin=seekPrevious(pos.end,!0)):(pos.begin=seekNext(pos.begin,!0),pos.end=seekNext(pos.begin,!0),pos.end<getMaskSet().maskLength&&pos.end--),pos.begin<getMaskSet().maskLength&&(e.preventDefault(),caret(input,pos.begin,pos.end))):e.shiftKey||!1===opts.insertMode&&(k===Inputmask.keyCode.RIGHT?setTimeout(function(){var caretPos=caret(input);caret(input,caretPos.begin);},0):k===Inputmask.keyCode.LEFT&&setTimeout(function(){var caretPos=caret(input);caret(input,isRTL?caretPos.begin+1:caretPos.begin-1);},0)):(opts.insertMode=!opts.insertMode,caret(input,opts.insertMode||pos.begin!==getMaskSet().maskLength?pos.begin:pos.begin-1));opts.onKeyDown.call(this,e,getBuffer(),caret(input).begin,opts),ignorable=-1!==$.inArray(k,opts.ignorables);},keypressEvent:function(e,checkval,writeOut,strict,ndx){var input=this,$input=$(input),k=e.which||e.charCode||e.keyCode;if(!(!0===checkval||e.ctrlKey&&e.altKey)&&(e.ctrlKey||e.metaKey||ignorable))return k===Inputmask.keyCode.ENTER&&undoValue!==getBuffer().join("")&&(undoValue=getBuffer().join(""),setTimeout(function(){$input.trigger("change");},0)),!0;if(k){46===k&&!1===e.shiftKey&&""!==opts.radixPoint&&(k=opts.radixPoint.charCodeAt(0));var forwardPosition,pos=checkval?{begin:ndx,end:ndx}:caret(input),c=String.fromCharCode(k);getMaskSet().writeOutBuffer=!0;var valResult=isValid(pos,c,strict);if(!1!==valResult&&(resetMaskSet(!0),forwardPosition=valResult.caret!==undefined?valResult.caret:checkval?valResult.pos+1:seekNext(valResult.pos),getMaskSet().p=forwardPosition),!1!==writeOut&&(setTimeout(function(){opts.onKeyValidation.call(input,k,valResult,opts);},0),getMaskSet().writeOutBuffer&&!1!==valResult)){var buffer=getBuffer();writeBuffer(input,buffer,opts.numericInput&&valResult.caret===undefined?seekPrevious(forwardPosition):forwardPosition,e,!0!==checkval),!0!==checkval&&setTimeout(function(){!0===isComplete(buffer)&&$input.trigger("complete");},0);}
if(e.preventDefault(),checkval)return!1!==valResult&&(valResult.forwardPosition=forwardPosition),valResult;}},pasteEvent:function(e){var tempValue,input=this,ev=e.originalEvent||e,$input=$(input),inputValue=input.inputmask._valueGet(!0),caretPos=caret(input);isRTL&&(tempValue=caretPos.end,caretPos.end=caretPos.begin,caretPos.begin=tempValue);var valueBeforeCaret=inputValue.substr(0,caretPos.begin),valueAfterCaret=inputValue.substr(caretPos.end,inputValue.length);if(valueBeforeCaret===(isRTL?getBufferTemplate().reverse():getBufferTemplate()).slice(0,caretPos.begin).join("")&&(valueBeforeCaret=""),valueAfterCaret===(isRTL?getBufferTemplate().reverse():getBufferTemplate()).slice(caretPos.end).join("")&&(valueAfterCaret=""),isRTL&&(tempValue=valueBeforeCaret,valueBeforeCaret=valueAfterCaret,valueAfterCaret=tempValue),window.clipboardData&&window.clipboardData.getData)inputValue=valueBeforeCaret+window.clipboardData.getData("Text")+valueAfterCaret;else{if(!ev.clipboardData||!ev.clipboardData.getData)return!0;inputValue=valueBeforeCaret+ev.clipboardData.getData("text/plain")+valueAfterCaret;}
var pasteValue=inputValue;if($.isFunction(opts.onBeforePaste)){if(!1===(pasteValue=opts.onBeforePaste.call(inputmask,inputValue,opts)))return e.preventDefault();pasteValue||(pasteValue=inputValue);}
return checkVal(input,!1,!1,isRTL?pasteValue.split("").reverse():pasteValue.toString().split("")),writeBuffer(input,getBuffer(),seekNext(getLastValidPosition()),e,undoValue!==getBuffer().join("")),!0===isComplete(getBuffer())&&$input.trigger("complete"),e.preventDefault();},inputFallBackEvent:function(e){var input=this,inputValue=input.inputmask._valueGet();if(getBuffer().join("")!==inputValue){var caretPos=caret(input);if(!1===function(input,inputValue,caretPos){if("."===inputValue.charAt(caretPos.begin-1)&&""!==opts.radixPoint&&((inputValue=inputValue.split(""))[caretPos.begin-1]=opts.radixPoint.charAt(0),inputValue=inputValue.join("")),inputValue.charAt(caretPos.begin-1)===opts.radixPoint&&inputValue.length>getBuffer().length){var keypress=new $.Event("keypress");return keypress.which=opts.radixPoint.charCodeAt(0),EventHandlers.keypressEvent.call(input,keypress,!0,!0,!1,caretPos.begin-1),!1;}}(input,inputValue,caretPos))return!1;if(inputValue=inputValue.replace(new RegExp("("+Inputmask.escapeRegex(getBufferTemplate().join(""))+")*"),""),!1===function(input,inputValue,caretPos){if(iemobile){var inputChar=inputValue.replace(getBuffer().join(""),"");if(1===inputChar.length){var keypress=new $.Event("keypress");return keypress.which=inputChar.charCodeAt(0),EventHandlers.keypressEvent.call(input,keypress,!0,!0,!1,getMaskSet().validPositions[caretPos.begin-1]?caretPos.begin:caretPos.begin-1),!1;}}}(input,inputValue,caretPos))return!1;caretPos.begin>inputValue.length&&(caret(input,inputValue.length),caretPos=caret(input));var buffer=getBuffer().join(""),frontPart=inputValue.substr(0,caretPos.begin),backPart=inputValue.substr(caretPos.begin),frontBufferPart=buffer.substr(0,caretPos.begin),backBufferPart=buffer.substr(caretPos.begin),selection=caretPos,entries="",isEntry=!1;if(frontPart!==frontBufferPart){selection.begin=0;for(var fpl=(isEntry=frontPart.length>=frontBufferPart.length)?frontPart.length:frontBufferPart.length,i=0;frontPart.charAt(i)===frontBufferPart.charAt(i)&&i<fpl;i++)selection.begin++;isEntry&&(entries+=frontPart.slice(selection.begin,selection.end));}
backPart!==backBufferPart&&(backPart.length>backBufferPart.length?isEntry&&(selection.end=selection.begin):backPart.length<backBufferPart.length?selection.end+=backBufferPart.length-backPart.length:backPart.charAt(0)!==backBufferPart.charAt(0)&&selection.end++),writeBuffer(input,getBuffer(),selection),entries.length>0?$.each(entries.split(""),function(ndx,entry){var keypress=new $.Event("keypress");keypress.which=entry.charCodeAt(0),ignorable=!1,EventHandlers.keypressEvent.call(input,keypress);}):(selection.begin===selection.end-1&&caret(input,seekPrevious(selection.begin+1),selection.end),e.keyCode=Inputmask.keyCode.DELETE,EventHandlers.keydownEvent.call(input,e)),e.preventDefault();}},setValueEvent:function(e){this.inputmask.refreshValue=!1;var input=this,value=input.inputmask._valueGet(!0);$.isFunction(opts.onBeforeMask)&&(value=opts.onBeforeMask.call(inputmask,value,opts)||value),value=value.split(""),checkVal(input,!0,!1,isRTL?value.reverse():value),undoValue=getBuffer().join(""),(opts.clearMaskOnLostFocus||opts.clearIncomplete)&&input.inputmask._valueGet()===getBufferTemplate().join("")&&input.inputmask._valueSet("");},focusEvent:function(e){var input=this,nptValue=input.inputmask._valueGet();opts.showMaskOnFocus&&(!opts.showMaskOnHover||opts.showMaskOnHover&&""===nptValue)&&(input.inputmask._valueGet()!==getBuffer().join("")?writeBuffer(input,getBuffer(),seekNext(getLastValidPosition())):!1===mouseEnter&&caret(input,seekNext(getLastValidPosition()))),!0===opts.positionCaretOnTab&&!1===mouseEnter&&""!==nptValue&&(writeBuffer(input,getBuffer(),caret(input)),EventHandlers.clickEvent.apply(input,[e,!0])),undoValue=getBuffer().join("");},mouseleaveEvent:function(e){var input=this;if(mouseEnter=!1,opts.clearMaskOnLostFocus&&document.activeElement!==input){var buffer=getBuffer().slice(),nptValue=input.inputmask._valueGet();nptValue!==input.getAttribute("placeholder")&&""!==nptValue&&(-1===getLastValidPosition()&&nptValue===getBufferTemplate().join("")?buffer=[]:clearOptionalTail(buffer),writeBuffer(input,buffer));}},clickEvent:function(e,tabbed){function doRadixFocus(clickPos){if(""!==opts.radixPoint){var vps=getMaskSet().validPositions;if(vps[clickPos]===undefined||vps[clickPos].input===getPlaceholder(clickPos)){if(clickPos<seekNext(-1))return!0;var radixPos=$.inArray(opts.radixPoint,getBuffer());if(-1!==radixPos){for(var vp in vps)if(radixPos<vp&&vps[vp].input!==getPlaceholder(vp))return!1;return!0;}}}
return!1;}
var input=this;setTimeout(function(){if(document.activeElement===input){var selectedCaret=caret(input);if(tabbed&&(isRTL?selectedCaret.end=selectedCaret.begin:selectedCaret.begin=selectedCaret.end),selectedCaret.begin===selectedCaret.end)switch(opts.positionCaretOnClick){case"none":break;case"radixFocus":if(doRadixFocus(selectedCaret.begin)){var radixPos=getBuffer().join("").indexOf(opts.radixPoint);caret(input,opts.numericInput?seekNext(radixPos):radixPos);break;}
default:var clickPosition=selectedCaret.begin,lvclickPosition=getLastValidPosition(clickPosition,!0),lastPosition=seekNext(lvclickPosition);if(clickPosition<lastPosition)caret(input,isMask(clickPosition,!0)||isMask(clickPosition-1,!0)?clickPosition:seekNext(clickPosition));else{var lvp=getMaskSet().validPositions[lvclickPosition],tt=getTestTemplate(lastPosition,lvp?lvp.match.locator:undefined,lvp),placeholder=getPlaceholder(lastPosition,tt.match);if(""!==placeholder&&getBuffer()[lastPosition]!==placeholder&&!0!==tt.match.optionalQuantifier&&!0!==tt.match.newBlockMarker||!isMask(lastPosition,!0)&&tt.match.def===placeholder){var newPos=seekNext(lastPosition);(clickPosition>=newPos||clickPosition===lastPosition)&&(lastPosition=newPos);}
caret(input,lastPosition);}}}},0);},dblclickEvent:function(e){var input=this;setTimeout(function(){caret(input,0,seekNext(getLastValidPosition()));},0);},cutEvent:function(e){var input=this,$input=$(input),pos=caret(input),ev=e.originalEvent||e,clipboardData=window.clipboardData||ev.clipboardData,clipData=isRTL?getBuffer().slice(pos.end,pos.begin):getBuffer().slice(pos.begin,pos.end);clipboardData.setData("text",isRTL?clipData.reverse().join(""):clipData.join("")),document.execCommand&&document.execCommand("copy"),handleRemove(input,Inputmask.keyCode.DELETE,pos),writeBuffer(input,getBuffer(),getMaskSet().p,e,undoValue!==getBuffer().join("")),input.inputmask._valueGet()===getBufferTemplate().join("")&&$input.trigger("cleared");},blurEvent:function(e){var $input=$(this),input=this;if(input.inputmask){var nptValue=input.inputmask._valueGet(),buffer=getBuffer().slice();""!==nptValue&&(opts.clearMaskOnLostFocus&&(-1===getLastValidPosition()&&nptValue===getBufferTemplate().join("")?buffer=[]:clearOptionalTail(buffer)),!1===isComplete(buffer)&&(setTimeout(function(){$input.trigger("incomplete");},0),opts.clearIncomplete&&(resetMaskSet(),buffer=opts.clearMaskOnLostFocus?[]:getBufferTemplate().slice())),writeBuffer(input,buffer,undefined,e)),undoValue!==getBuffer().join("")&&(undoValue=buffer.join(""),$input.trigger("change"));}},mouseenterEvent:function(e){var input=this;mouseEnter=!0,document.activeElement!==input&&opts.showMaskOnHover&&input.inputmask._valueGet()!==getBuffer().join("")&&writeBuffer(input,getBuffer());},submitEvent:function(e){undoValue!==getBuffer().join("")&&$el.trigger("change"),opts.clearMaskOnLostFocus&&-1===getLastValidPosition()&&el.inputmask._valueGet&&el.inputmask._valueGet()===getBufferTemplate().join("")&&el.inputmask._valueSet(""),opts.removeMaskOnSubmit&&(el.inputmask._valueSet(el.inputmask.unmaskedvalue(),!0),setTimeout(function(){writeBuffer(el,getBuffer());},0));},resetEvent:function(e){el.inputmask.refreshValue=!0,setTimeout(function(){$el.trigger("setvalue");},0);}};Inputmask.prototype.positionColorMask=function(input,template){input.style.left=template.offsetLeft+"px";};var valueBuffer;if(actionObj!==undefined)switch(actionObj.action){case"isComplete":return el=actionObj.el,isComplete(getBuffer());case"unmaskedvalue":return el!==undefined&&actionObj.value===undefined||(valueBuffer=actionObj.value,valueBuffer=($.isFunction(opts.onBeforeMask)?opts.onBeforeMask.call(inputmask,valueBuffer,opts)||valueBuffer:valueBuffer).split(""),checkVal(undefined,!1,!1,isRTL?valueBuffer.reverse():valueBuffer),$.isFunction(opts.onBeforeWrite)&&opts.onBeforeWrite.call(inputmask,undefined,getBuffer(),0,opts)),unmaskedvalue(el);case"mask":!function(elem){EventRuler.off(elem);var isSupported=function(input,opts){var elementType=input.getAttribute("type"),isSupported="INPUT"===input.tagName&&-1!==$.inArray(elementType,opts.supportsInputType)||input.isContentEditable||"TEXTAREA"===input.tagName;if(!isSupported)if("INPUT"===input.tagName){var el=document.createElement("input");el.setAttribute("type",elementType),isSupported="text"===el.type,el=null;}else isSupported="partial";return!1!==isSupported?function(npt){function getter(){return this.inputmask?this.inputmask.opts.autoUnmask?this.inputmask.unmaskedvalue():-1!==getLastValidPosition()||!0!==opts.nullable?document.activeElement===this&&opts.clearMaskOnLostFocus?(isRTL?clearOptionalTail(getBuffer().slice()).reverse():clearOptionalTail(getBuffer().slice())).join(""):valueGet.call(this):"":valueGet.call(this);}
function setter(value){valueSet.call(this,value),this.inputmask&&$(this).trigger("setvalue");}
var valueGet,valueSet;if(!npt.inputmask.__valueGet){if(!0!==opts.noValuePatching){if(Object.getOwnPropertyDescriptor){"function"!=typeof Object.getPrototypeOf&&(Object.getPrototypeOf="object"===_typeof("test".__proto__)?function(object){return object.__proto__;}:function(object){return object.constructor.prototype;});var valueProperty=Object.getPrototypeOf?Object.getOwnPropertyDescriptor(Object.getPrototypeOf(npt),"value"):undefined;valueProperty&&valueProperty.get&&valueProperty.set?(valueGet=valueProperty.get,valueSet=valueProperty.set,Object.defineProperty(npt,"value",{get:getter,set:setter,configurable:!0})):"INPUT"!==npt.tagName&&(valueGet=function(){return this.textContent;},valueSet=function(value){this.textContent=value;},Object.defineProperty(npt,"value",{get:getter,set:setter,configurable:!0}));}else document.__lookupGetter__&&npt.__lookupGetter__("value")&&(valueGet=npt.__lookupGetter__("value"),valueSet=npt.__lookupSetter__("value"),npt.__defineGetter__("value",getter),npt.__defineSetter__("value",setter));npt.inputmask.__valueGet=valueGet,npt.inputmask.__valueSet=valueSet;}
npt.inputmask._valueGet=function(overruleRTL){return isRTL&&!0!==overruleRTL?valueGet.call(this.el).split("").reverse().join(""):valueGet.call(this.el);},npt.inputmask._valueSet=function(value,overruleRTL){valueSet.call(this.el,null===value||value===undefined?"":!0!==overruleRTL&&isRTL?value.split("").reverse().join(""):value);},valueGet===undefined&&(valueGet=function(){return this.value;},valueSet=function(value){this.value=value;},function(type){if($.valHooks&&($.valHooks[type]===undefined||!0!==$.valHooks[type].inputmaskpatch)){var valhookGet=$.valHooks[type]&&$.valHooks[type].get?$.valHooks[type].get:function(elem){return elem.value;},valhookSet=$.valHooks[type]&&$.valHooks[type].set?$.valHooks[type].set:function(elem,value){return elem.value=value,elem;};$.valHooks[type]={get:function(elem){if(elem.inputmask){if(elem.inputmask.opts.autoUnmask)return elem.inputmask.unmaskedvalue();var result=valhookGet(elem);return-1!==getLastValidPosition(undefined,undefined,elem.inputmask.maskset.validPositions)||!0!==opts.nullable?result:"";}
return valhookGet(elem);},set:function(elem,value){var result,$elem=$(elem);return result=valhookSet(elem,value),elem.inputmask&&$elem.trigger("setvalue"),result;},inputmaskpatch:!0};}}(npt.type),function(npt){EventRuler.on(npt,"mouseenter",function(event){var $input=$(this);this.inputmask._valueGet()!==getBuffer().join("")&&$input.trigger("setvalue");});}(npt));}}(input):input.inputmask=undefined,isSupported;}(elem,opts);if(!1!==isSupported&&(el=elem,$el=$(el),-1===(maxLength=el!==undefined?el.maxLength:undefined)&&(maxLength=undefined),!0===opts.colorMask&&initializeColorMask(el),android&&(el.hasOwnProperty("inputmode")&&(el.inputmode=opts.inputmode,el.setAttribute("inputmode",opts.inputmode)),"rtfm"===opts.androidHack&&(!0!==opts.colorMask&&initializeColorMask(el),el.type="password")),!0===isSupported&&(EventRuler.on(el,"submit",EventHandlers.submitEvent),EventRuler.on(el,"reset",EventHandlers.resetEvent),EventRuler.on(el,"mouseenter",EventHandlers.mouseenterEvent),EventRuler.on(el,"blur",EventHandlers.blurEvent),EventRuler.on(el,"focus",EventHandlers.focusEvent),EventRuler.on(el,"mouseleave",EventHandlers.mouseleaveEvent),!0!==opts.colorMask&&EventRuler.on(el,"click",EventHandlers.clickEvent),EventRuler.on(el,"dblclick",EventHandlers.dblclickEvent),EventRuler.on(el,"paste",EventHandlers.pasteEvent),EventRuler.on(el,"dragdrop",EventHandlers.pasteEvent),EventRuler.on(el,"drop",EventHandlers.pasteEvent),EventRuler.on(el,"cut",EventHandlers.cutEvent),EventRuler.on(el,"complete",opts.oncomplete),EventRuler.on(el,"incomplete",opts.onincomplete),EventRuler.on(el,"cleared",opts.oncleared),android||!0===opts.inputEventOnly?el.removeAttribute("maxLength"):(EventRuler.on(el,"keydown",EventHandlers.keydownEvent),EventRuler.on(el,"keypress",EventHandlers.keypressEvent)),EventRuler.on(el,"compositionstart",$.noop),EventRuler.on(el,"compositionupdate",$.noop),EventRuler.on(el,"compositionend",$.noop),EventRuler.on(el,"keyup",$.noop),EventRuler.on(el,"input",EventHandlers.inputFallBackEvent),EventRuler.on(el,"beforeinput",$.noop)),EventRuler.on(el,"setvalue",EventHandlers.setValueEvent),undoValue=getBufferTemplate().join(""),""!==el.inputmask._valueGet(!0)||!1===opts.clearMaskOnLostFocus||document.activeElement===el)){var initialValue=$.isFunction(opts.onBeforeMask)?opts.onBeforeMask.call(inputmask,el.inputmask._valueGet(!0),opts)||el.inputmask._valueGet(!0):el.inputmask._valueGet(!0);""!==initialValue&&checkVal(el,!0,!1,isRTL?initialValue.split("").reverse():initialValue.split(""));var buffer=getBuffer().slice();undoValue=buffer.join(""),!1===isComplete(buffer)&&opts.clearIncomplete&&resetMaskSet(),opts.clearMaskOnLostFocus&&document.activeElement!==el&&(-1===getLastValidPosition()?buffer=[]:clearOptionalTail(buffer)),writeBuffer(el,buffer),document.activeElement===el&&caret(el,seekNext(getLastValidPosition()));}}(el);break;case"format":return valueBuffer=($.isFunction(opts.onBeforeMask)?opts.onBeforeMask.call(inputmask,actionObj.value,opts)||actionObj.value:actionObj.value).split(""),checkVal(undefined,!0,!1,isRTL?valueBuffer.reverse():valueBuffer),actionObj.metadata?{value:isRTL?getBuffer().slice().reverse().join(""):getBuffer().join(""),metadata:maskScope.call(this,{action:"getmetadata"},maskset,opts)}:isRTL?getBuffer().slice().reverse().join(""):getBuffer().join("");case"isValid":actionObj.value?(valueBuffer=actionObj.value.split(""),checkVal(undefined,!0,!0,isRTL?valueBuffer.reverse():valueBuffer)):actionObj.value=getBuffer().join("");for(var buffer=getBuffer(),rl=determineLastRequiredPosition(),lmib=buffer.length-1;lmib>rl&&!isMask(lmib);lmib--);return buffer.splice(rl,lmib+1-rl),isComplete(buffer)&&actionObj.value===getBuffer().join("");case"getemptymask":return getBufferTemplate().join("");case"remove":if(el&&el.inputmask){$el=$(el),el.inputmask._valueSet(opts.autoUnmask?unmaskedvalue(el):el.inputmask._valueGet(!0)),EventRuler.off(el);Object.getOwnPropertyDescriptor&&Object.getPrototypeOf?Object.getOwnPropertyDescriptor(Object.getPrototypeOf(el),"value")&&el.inputmask.__valueGet&&Object.defineProperty(el,"value",{get:el.inputmask.__valueGet,set:el.inputmask.__valueSet,configurable:!0}):document.__lookupGetter__&&el.__lookupGetter__("value")&&el.inputmask.__valueGet&&(el.__defineGetter__("value",el.inputmask.__valueGet),el.__defineSetter__("value",el.inputmask.__valueSet)),el.inputmask=undefined;}
return el;case"getmetadata":if($.isArray(maskset.metadata)){var maskTarget=getMaskTemplate(!0,0,!1).join("");return $.each(maskset.metadata,function(ndx,mtdt){if(mtdt.mask===maskTarget)return maskTarget=mtdt,!1;}),maskTarget;}
return maskset.metadata;}}
var ua=navigator.userAgent,mobile=/mobile/i.test(ua),iemobile=/iemobile/i.test(ua),iphone=/iphone/i.test(ua)&&!iemobile,android=/android/i.test(ua)&&!iemobile;return Inputmask.prototype={dataAttribute:"data-inputmask",defaults:{placeholder:"_",optionalmarker:{start:"[",end:"]"},quantifiermarker:{start:"{",end:"}"},groupmarker:{start:"(",end:")"},alternatormarker:"|",escapeChar:"\\",mask:null,regex:null,oncomplete:$.noop,onincomplete:$.noop,oncleared:$.noop,repeat:0,greedy:!0,autoUnmask:!1,removeMaskOnSubmit:!1,clearMaskOnLostFocus:!0,insertMode:!0,clearIncomplete:!1,alias:null,onKeyDown:$.noop,onBeforeMask:null,onBeforePaste:function(pastedValue,opts){return $.isFunction(opts.onBeforeMask)?opts.onBeforeMask.call(this,pastedValue,opts):pastedValue;},onBeforeWrite:null,onUnMask:null,showMaskOnFocus:!0,showMaskOnHover:!0,onKeyValidation:$.noop,skipOptionalPartCharacter:" ",numericInput:!1,rightAlign:!1,undoOnEscape:!0,radixPoint:"",radixPointDefinitionSymbol:undefined,groupSeparator:"",keepStatic:null,positionCaretOnTab:!0,tabThrough:!1,supportsInputType:["text","tel","password"],ignorables:[8,9,13,19,27,33,34,35,36,37,38,39,40,45,46,93,112,113,114,115,116,117,118,119,120,121,122,123,0,229],isComplete:null,canClearPosition:$.noop,preValidation:null,postValidation:null,staticDefinitionSymbol:undefined,jitMasking:!1,nullable:!0,inputEventOnly:!1,noValuePatching:!1,positionCaretOnClick:"lvp",casing:null,inputmode:"verbatim",colorMask:!1,androidHack:!1,importDataAttributes:!0},definitions:{"9":{validator:"[0-9１-９]",cardinality:1,definitionSymbol:"*"},a:{validator:"[A-Za-zА-яЁёÀ-ÿµ]",cardinality:1,definitionSymbol:"*"},"*":{validator:"[0-9１-９A-Za-zА-яЁёÀ-ÿµ]",cardinality:1}},aliases:{},masksCache:{},mask:function(elems){function importAttributeOptions(npt,opts,userOptions,dataAttribute){if(!0===opts.importDataAttributes){var option,dataoptions,optionData,p,importOption=function(option,optionData){null!==(optionData=optionData!==undefined?optionData:npt.getAttribute(dataAttribute+"-"+option))&&("string"==typeof optionData&&(0===option.indexOf("on")?optionData=window[optionData]:"false"===optionData?optionData=!1:"true"===optionData&&(optionData=!0)),userOptions[option]=optionData);},attrOptions=npt.getAttribute(dataAttribute);if(attrOptions&&""!==attrOptions&&(attrOptions=attrOptions.replace(new RegExp("'","g"),'"'),dataoptions=JSON.parse("{"+attrOptions+"}")),dataoptions){optionData=undefined;for(p in dataoptions)if("alias"===p.toLowerCase()){optionData=dataoptions[p];break;}}
importOption("alias",optionData),userOptions.alias&&resolveAlias(userOptions.alias,userOptions,opts);for(option in opts){if(dataoptions){optionData=undefined;for(p in dataoptions)if(p.toLowerCase()===option.toLowerCase()){optionData=dataoptions[p];break;}}
importOption(option,optionData);}}
return $.extend(!0,opts,userOptions),("rtl"===npt.dir||opts.rightAlign)&&(npt.style.textAlign="right"),("rtl"===npt.dir||opts.numericInput)&&(npt.dir="ltr",npt.removeAttribute("dir"),opts.isRTL=!0),opts;}
var that=this;return"string"==typeof elems&&(elems=document.getElementById(elems)||document.querySelectorAll(elems)),elems=elems.nodeName?[elems]:elems,$.each(elems,function(ndx,el){var scopedOpts=$.extend(!0,{},that.opts);importAttributeOptions(el,scopedOpts,$.extend(!0,{},that.userOptions),that.dataAttribute);var maskset=generateMaskSet(scopedOpts,that.noMasksCache);maskset!==undefined&&(el.inputmask!==undefined&&(el.inputmask.opts.autoUnmask=!0,el.inputmask.remove()),el.inputmask=new Inputmask(undefined,undefined,!0),el.inputmask.opts=scopedOpts,el.inputmask.noMasksCache=that.noMasksCache,el.inputmask.userOptions=$.extend(!0,{},that.userOptions),el.inputmask.isRTL=scopedOpts.isRTL||scopedOpts.numericInput,el.inputmask.el=el,el.inputmask.maskset=maskset,$.data(el,"_inputmask_opts",scopedOpts),maskScope.call(el.inputmask,{action:"mask"}));}),elems&&elems[0]?elems[0].inputmask||this:this;},option:function(options,noremask){return"string"==typeof options?this.opts[options]:"object"===(void 0===options?"undefined":_typeof(options))?($.extend(this.userOptions,options),this.el&&!0!==noremask&&this.mask(this.el),this):void 0;},unmaskedvalue:function(value){return this.maskset=this.maskset||generateMaskSet(this.opts,this.noMasksCache),maskScope.call(this,{action:"unmaskedvalue",value:value});},remove:function(){return maskScope.call(this,{action:"remove"});},getemptymask:function(){return this.maskset=this.maskset||generateMaskSet(this.opts,this.noMasksCache),maskScope.call(this,{action:"getemptymask"});},hasMaskedValue:function(){return!this.opts.autoUnmask;},isComplete:function(){return this.maskset=this.maskset||generateMaskSet(this.opts,this.noMasksCache),maskScope.call(this,{action:"isComplete"});},getmetadata:function(){return this.maskset=this.maskset||generateMaskSet(this.opts,this.noMasksCache),maskScope.call(this,{action:"getmetadata"});},isValid:function(value){return this.maskset=this.maskset||generateMaskSet(this.opts,this.noMasksCache),maskScope.call(this,{action:"isValid",value:value});},format:function(value,metadata){return this.maskset=this.maskset||generateMaskSet(this.opts,this.noMasksCache),maskScope.call(this,{action:"format",value:value,metadata:metadata});},analyseMask:function(mask,regexMask,opts){function MaskToken(isGroup,isOptional,isQuantifier,isAlternator){this.matches=[],this.openGroup=isGroup||!1,this.alternatorGroup=!1,this.isGroup=isGroup||!1,this.isOptional=isOptional||!1,this.isQuantifier=isQuantifier||!1,this.isAlternator=isAlternator||!1,this.quantifier={min:1,max:1};}
function insertTestDefinition(mtoken,element,position){position=position!==undefined?position:mtoken.matches.length;var prevMatch=mtoken.matches[position-1];if(regexMask)0===element.indexOf("[")||escaped&&/\\d|\\s|\\w]/i.test(element)||"."===element?mtoken.matches.splice(position++,0,{fn:new RegExp(element,opts.casing?"i":""),cardinality:1,optionality:mtoken.isOptional,newBlockMarker:prevMatch===undefined||prevMatch.def!==element,casing:null,def:element,placeholder:undefined,nativeDef:element}):(escaped&&(element=element[element.length-1]),$.each(element.split(""),function(ndx,lmnt){prevMatch=mtoken.matches[position-1],mtoken.matches.splice(position++,0,{fn:null,cardinality:0,optionality:mtoken.isOptional,newBlockMarker:prevMatch===undefined||prevMatch.def!==lmnt&&null!==prevMatch.fn,casing:null,def:opts.staticDefinitionSymbol||lmnt,placeholder:opts.staticDefinitionSymbol!==undefined?lmnt:undefined,nativeDef:lmnt});})),escaped=!1;else{var maskdef=(opts.definitions?opts.definitions[element]:undefined)||Inputmask.prototype.definitions[element];if(maskdef&&!escaped){for(var prevalidators=maskdef.prevalidator,prevalidatorsL=prevalidators?prevalidators.length:0,i=1;i<maskdef.cardinality;i++){var prevalidator=prevalidatorsL>=i?prevalidators[i-1]:[],validator=prevalidator.validator,cardinality=prevalidator.cardinality;mtoken.matches.splice(position++,0,{fn:validator?"string"==typeof validator?new RegExp(validator,opts.casing?"i":""):new function(){this.test=validator;}():new RegExp("."),cardinality:cardinality||1,optionality:mtoken.isOptional,newBlockMarker:prevMatch===undefined||prevMatch.def!==(maskdef.definitionSymbol||element),casing:maskdef.casing,def:maskdef.definitionSymbol||element,placeholder:maskdef.placeholder,nativeDef:element}),prevMatch=mtoken.matches[position-1];}
mtoken.matches.splice(position++,0,{fn:maskdef.validator?"string"==typeof maskdef.validator?new RegExp(maskdef.validator,opts.casing?"i":""):new function(){this.test=maskdef.validator;}():new RegExp("."),cardinality:maskdef.cardinality,optionality:mtoken.isOptional,newBlockMarker:prevMatch===undefined||prevMatch.def!==(maskdef.definitionSymbol||element),casing:maskdef.casing,def:maskdef.definitionSymbol||element,placeholder:maskdef.placeholder,nativeDef:element});}else mtoken.matches.splice(position++,0,{fn:null,cardinality:0,optionality:mtoken.isOptional,newBlockMarker:prevMatch===undefined||prevMatch.def!==element&&null!==prevMatch.fn,casing:null,def:opts.staticDefinitionSymbol||element,placeholder:opts.staticDefinitionSymbol!==undefined?element:undefined,nativeDef:element}),escaped=!1;}}
function verifyGroupMarker(maskToken){maskToken&&maskToken.matches&&$.each(maskToken.matches,function(ndx,token){var nextToken=maskToken.matches[ndx+1];(nextToken===undefined||nextToken.matches===undefined||!1===nextToken.isQuantifier)&&token&&token.isGroup&&(token.isGroup=!1,regexMask||(insertTestDefinition(token,opts.groupmarker.start,0),!0!==token.openGroup&&insertTestDefinition(token,opts.groupmarker.end))),verifyGroupMarker(token);});}
function defaultCase(){if(openenings.length>0){if(currentOpeningToken=openenings[openenings.length-1],insertTestDefinition(currentOpeningToken,m),currentOpeningToken.isAlternator){alternator=openenings.pop();for(var mndx=0;mndx<alternator.matches.length;mndx++)alternator.matches[mndx].isGroup=!1;openenings.length>0?(currentOpeningToken=openenings[openenings.length-1]).matches.push(alternator):currentToken.matches.push(alternator);}}else insertTestDefinition(currentToken,m);}
function reverseTokens(maskToken){maskToken.matches=maskToken.matches.reverse();for(var match in maskToken.matches)if(maskToken.matches.hasOwnProperty(match)){var intMatch=parseInt(match);if(maskToken.matches[match].isQuantifier&&maskToken.matches[intMatch+1]&&maskToken.matches[intMatch+1].isGroup){var qt=maskToken.matches[match];maskToken.matches.splice(match,1),maskToken.matches.splice(intMatch+1,0,qt);}
maskToken.matches[match].matches!==undefined?maskToken.matches[match]=reverseTokens(maskToken.matches[match]):maskToken.matches[match]=function(st){return st===opts.optionalmarker.start?st=opts.optionalmarker.end:st===opts.optionalmarker.end?st=opts.optionalmarker.start:st===opts.groupmarker.start?st=opts.groupmarker.end:st===opts.groupmarker.end&&(st=opts.groupmarker.start),st;}(maskToken.matches[match]);}
return maskToken;}
var match,m,openingToken,currentOpeningToken,alternator,lastMatch,groupToken,tokenizer=/(?:[?*+]|\{[0-9\+\*]+(?:,[0-9\+\*]*)?\})|[^.?*+^${[]()|\\]+|./g,regexTokenizer=/\[\^?]?(?:[^\\\]]+|\\[\S\s]?)*]?|\\(?:0(?:[0-3][0-7]{0,2}|[4-7][0-7]?)?|[1-9][0-9]*|x[0-9A-Fa-f]{2}|u[0-9A-Fa-f]{4}|c[A-Za-z]|[\S\s]?)|\((?:\?[:=!]?)?|(?:[?*+]|\{[0-9]+(?:,[0-9]*)?\})\??|[^.?*+^${[()|\\]+|./g,escaped=!1,currentToken=new MaskToken(),openenings=[],maskTokens=[];for(regexMask&&(opts.optionalmarker.start=undefined,opts.optionalmarker.end=undefined);match=regexMask?regexTokenizer.exec(mask):tokenizer.exec(mask);){if(m=match[0],regexMask)switch(m.charAt(0)){case"?":m="{0,1}";break;case"+":case"*":m="{"+m+"}";}
if(escaped)defaultCase();else switch(m.charAt(0)){case opts.escapeChar:escaped=!0,regexMask&&defaultCase();break;case opts.optionalmarker.end:case opts.groupmarker.end:if(openingToken=openenings.pop(),openingToken.openGroup=!1,openingToken!==undefined)if(openenings.length>0){if((currentOpeningToken=openenings[openenings.length-1]).matches.push(openingToken),currentOpeningToken.isAlternator){alternator=openenings.pop();for(var mndx=0;mndx<alternator.matches.length;mndx++)alternator.matches[mndx].isGroup=!1,alternator.matches[mndx].alternatorGroup=!1;openenings.length>0?(currentOpeningToken=openenings[openenings.length-1]).matches.push(alternator):currentToken.matches.push(alternator);}}else currentToken.matches.push(openingToken);else defaultCase();break;case opts.optionalmarker.start:openenings.push(new MaskToken(!1,!0));break;case opts.groupmarker.start:openenings.push(new MaskToken(!0));break;case opts.quantifiermarker.start:var quantifier=new MaskToken(!1,!1,!0),mq=(m=m.replace(/[{}]/g,"")).split(","),mq0=isNaN(mq[0])?mq[0]:parseInt(mq[0]),mq1=1===mq.length?mq0:isNaN(mq[1])?mq[1]:parseInt(mq[1]);if("*"!==mq1&&"+"!==mq1||(mq0="*"===mq1?0:1),quantifier.quantifier={min:mq0,max:mq1},openenings.length>0){var matches=openenings[openenings.length-1].matches;(match=matches.pop()).isGroup||((groupToken=new MaskToken(!0)).matches.push(match),match=groupToken),matches.push(match),matches.push(quantifier);}else(match=currentToken.matches.pop()).isGroup||(regexMask&&null===match.fn&&"."===match.def&&(match.fn=new RegExp(match.def,opts.casing?"i":"")),(groupToken=new MaskToken(!0)).matches.push(match),match=groupToken),currentToken.matches.push(match),currentToken.matches.push(quantifier);break;case opts.alternatormarker:if(openenings.length>0){var subToken=(currentOpeningToken=openenings[openenings.length-1]).matches[currentOpeningToken.matches.length-1];lastMatch=currentOpeningToken.openGroup&&(subToken.matches===undefined||!1===subToken.isGroup&&!1===subToken.isAlternator)?openenings.pop():currentOpeningToken.matches.pop();}else lastMatch=currentToken.matches.pop();if(lastMatch.isAlternator)openenings.push(lastMatch);else if(lastMatch.alternatorGroup?(alternator=openenings.pop(),lastMatch.alternatorGroup=!1):alternator=new MaskToken(!1,!1,!1,!0),alternator.matches.push(lastMatch),openenings.push(alternator),lastMatch.openGroup){lastMatch.openGroup=!1;var alternatorGroup=new MaskToken(!0);alternatorGroup.alternatorGroup=!0,openenings.push(alternatorGroup);}
break;default:defaultCase();}}
for(;openenings.length>0;)openingToken=openenings.pop(),currentToken.matches.push(openingToken);return currentToken.matches.length>0&&(verifyGroupMarker(currentToken),maskTokens.push(currentToken)),(opts.numericInput||opts.isRTL)&&reverseTokens(maskTokens[0]),maskTokens;}},Inputmask.extendDefaults=function(options){$.extend(!0,Inputmask.prototype.defaults,options);},Inputmask.extendDefinitions=function(definition){$.extend(!0,Inputmask.prototype.definitions,definition);},Inputmask.extendAliases=function(alias){$.extend(!0,Inputmask.prototype.aliases,alias);},Inputmask.format=function(value,options,metadata){return Inputmask(options).format(value,metadata);},Inputmask.unmask=function(value,options){return Inputmask(options).unmaskedvalue(value);},Inputmask.isValid=function(value,options){return Inputmask(options).isValid(value);},Inputmask.remove=function(elems){$.each(elems,function(ndx,el){el.inputmask&&el.inputmask.remove();});},Inputmask.escapeRegex=function(str){var specials=["/",".","*","+","?","|","(",")","[","]","{","}","\\","$","^"];return str.replace(new RegExp("(\\"+specials.join("|\\")+")","gim"),"\\$1");},Inputmask.keyCode={ALT:18,BACKSPACE:8,BACKSPACE_SAFARI:127,CAPS_LOCK:20,COMMA:188,COMMAND:91,COMMAND_LEFT:91,COMMAND_RIGHT:93,CONTROL:17,DELETE:46,DOWN:40,END:35,ENTER:13,ESCAPE:27,HOME:36,INSERT:45,LEFT:37,MENU:93,NUMPAD_ADD:107,NUMPAD_DECIMAL:110,NUMPAD_DIVIDE:111,NUMPAD_ENTER:108,NUMPAD_MULTIPLY:106,NUMPAD_SUBTRACT:109,PAGE_DOWN:34,PAGE_UP:33,PERIOD:190,RIGHT:39,SHIFT:16,SPACE:32,TAB:9,UP:38,WINDOWS:91,X:88},Inputmask;});},function(module,exports){module.exports=jQuery;},function(module,exports,__webpack_require__){"use strict";function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}
__webpack_require__(4),__webpack_require__(9),__webpack_require__(12),__webpack_require__(13),__webpack_require__(14),__webpack_require__(15);var _inputmask2=_interopRequireDefault(__webpack_require__(1)),_inputmask4=_interopRequireDefault(__webpack_require__(0)),_jquery2=_interopRequireDefault(__webpack_require__(2));_inputmask4.default===_jquery2.default&&__webpack_require__(16),window.Inputmask=_inputmask2.default;},function(module,exports,__webpack_require__){var content=__webpack_require__(5);"string"==typeof content&&(content=[[module.i,content,""]]);var options={hmr:!0};options.transform=void 0;__webpack_require__(7)(content,options);content.locals&&(module.exports=content.locals);},function(module,exports,__webpack_require__){(module.exports=__webpack_require__(6)(void 0)).push([module.i,"span.im-caret {\r\n    -webkit-animation: 1s blink step-end infinite;\r\n    animation: 1s blink step-end infinite;\r\n}\r\n\r\n@keyframes blink {\r\n    from, to {\r\n        border-right-color: black;\r\n    }\r\n    50% {\r\n        border-right-color: transparent;\r\n    }\r\n}\r\n\r\n@-webkit-keyframes blink {\r\n    from, to {\r\n        border-right-color: black;\r\n    }\r\n    50% {\r\n        border-right-color: transparent;\r\n    }\r\n}\r\n\r\nspan.im-static {\r\n    color: grey;\r\n}\r\n\r\ndiv.im-colormask {\r\n    display: inline-block;\r\n    border-style: inset;\r\n    border-width: 2px;\r\n    -webkit-appearance: textfield;\r\n    -moz-appearance: textfield;\r\n    appearance: textfield;\r\n}\r\n\r\ndiv.im-colormask > input {\r\n    position: absolute;\r\n    display: inline-block;\r\n    background-color: transparent;\r\n    color: transparent;\r\n    -webkit-appearance: caret;\r\n    -moz-appearance: caret;\r\n    appearance: caret;\r\n    border-style: none;\r\n    left: 0; /*calculated*/\r\n}\r\n\r\ndiv.im-colormask > input:focus {\r\n    outline: none;\r\n}\r\n\r\ndiv.im-colormask > input::-moz-selection{\r\n    background: none;\r\n}\r\n\r\ndiv.im-colormask > input::selection{\r\n    background: none;\r\n}\r\ndiv.im-colormask > input::-moz-selection{\r\n    background: none;\r\n}\r\n\r\ndiv.im-colormask > div {\r\n    color: black;\r\n    display: inline-block;\r\n    width: 100px; /*calculated*/\r\n}",""]);},function(module,exports){function cssWithMappingToString(item,useSourceMap){var content=item[1]||"",cssMapping=item[3];if(!cssMapping)return content;if(useSourceMap&&"function"==typeof btoa){var sourceMapping=toComment(cssMapping),sourceURLs=cssMapping.sources.map(function(source){return"/*# sourceURL="+cssMapping.sourceRoot+source+" */";});return[content].concat(sourceURLs).concat([sourceMapping]).join("\n");}
return[content].join("\n");}
function toComment(sourceMap){return"/*# "+("sourceMappingURL=data:application/json;charset=utf-8;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))))+" */";}
module.exports=function(useSourceMap){var list=[];return list.toString=function(){return this.map(function(item){var content=cssWithMappingToString(item,useSourceMap);return item[2]?"@media "+item[2]+"{"+content+"}":content;}).join("");},list.i=function(modules,mediaQuery){"string"==typeof modules&&(modules=[[null,modules,""]]);for(var alreadyImportedModules={},i=0;i<this.length;i++){var id=this[i][0];"number"==typeof id&&(alreadyImportedModules[id]=!0);}
for(i=0;i<modules.length;i++){var item=modules[i];"number"==typeof item[0]&&alreadyImportedModules[item[0]]||(mediaQuery&&!item[2]?item[2]=mediaQuery:mediaQuery&&(item[2]="("+item[2]+") and ("+mediaQuery+")"),list.push(item));}},list;};},function(module,exports,__webpack_require__){function addStylesToDom(styles,options){for(var i=0;i<styles.length;i++){var item=styles[i],domStyle=stylesInDom[item.id];if(domStyle){domStyle.refs++;for(j=0;j<domStyle.parts.length;j++)domStyle.parts[j](item.parts[j]);for(;j<item.parts.length;j++)domStyle.parts.push(addStyle(item.parts[j],options));}else{for(var parts=[],j=0;j<item.parts.length;j++)parts.push(addStyle(item.parts[j],options));stylesInDom[item.id]={id:item.id,refs:1,parts:parts};}}}
function listToStyles(list,options){for(var styles=[],newStyles={},i=0;i<list.length;i++){var item=list[i],id=options.base?item[0]+options.base:item[0],part={css:item[1],media:item[2],sourceMap:item[3]};newStyles[id]?newStyles[id].parts.push(part):styles.push(newStyles[id]={id:id,parts:[part]});}
return styles;}
function insertStyleElement(options,style){var target=getElement(options.insertInto);if(!target)throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");var lastStyleElementInsertedAtTop=stylesInsertedAtTop[stylesInsertedAtTop.length-1];if("top"===options.insertAt)lastStyleElementInsertedAtTop?lastStyleElementInsertedAtTop.nextSibling?target.insertBefore(style,lastStyleElementInsertedAtTop.nextSibling):target.appendChild(style):target.insertBefore(style,target.firstChild),stylesInsertedAtTop.push(style);else if("bottom"===options.insertAt)target.appendChild(style);else{if("object"!=typeof options.insertAt||!options.insertAt.before)throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");var nextSibling=getElement(options.insertInto+" "+options.insertAt.before);target.insertBefore(style,nextSibling);}}
function removeStyleElement(style){if(null===style.parentNode)return!1;style.parentNode.removeChild(style);var idx=stylesInsertedAtTop.indexOf(style);idx>=0&&stylesInsertedAtTop.splice(idx,1);}
function createStyleElement(options){var style=document.createElement("style");return options.attrs.type="text/css",addAttrs(style,options.attrs),insertStyleElement(options,style),style;}
function createLinkElement(options){var link=document.createElement("link");return options.attrs.type="text/css",options.attrs.rel="stylesheet",addAttrs(link,options.attrs),insertStyleElement(options,link),link;}
function addAttrs(el,attrs){Object.keys(attrs).forEach(function(key){el.setAttribute(key,attrs[key]);});}
function addStyle(obj,options){var style,update,remove,result;if(options.transform&&obj.css){if(!(result=options.transform(obj.css)))return function(){};obj.css=result;}
if(options.singleton){var styleIndex=singletonCounter++;style=singleton||(singleton=createStyleElement(options)),update=applyToSingletonTag.bind(null,style,styleIndex,!1),remove=applyToSingletonTag.bind(null,style,styleIndex,!0);}else obj.sourceMap&&"function"==typeof URL&&"function"==typeof URL.createObjectURL&&"function"==typeof URL.revokeObjectURL&&"function"==typeof Blob&&"function"==typeof btoa?(style=createLinkElement(options),update=updateLink.bind(null,style,options),remove=function(){removeStyleElement(style),style.href&&URL.revokeObjectURL(style.href);}):(style=createStyleElement(options),update=applyToTag.bind(null,style),remove=function(){removeStyleElement(style);});return update(obj),function(newObj){if(newObj){if(newObj.css===obj.css&&newObj.media===obj.media&&newObj.sourceMap===obj.sourceMap)return;update(obj=newObj);}else remove();};}
function applyToSingletonTag(style,index,remove,obj){var css=remove?"":obj.css;if(style.styleSheet)style.styleSheet.cssText=replaceText(index,css);else{var cssNode=document.createTextNode(css),childNodes=style.childNodes;childNodes[index]&&style.removeChild(childNodes[index]),childNodes.length?style.insertBefore(cssNode,childNodes[index]):style.appendChild(cssNode);}}
function applyToTag(style,obj){var css=obj.css,media=obj.media;if(media&&style.setAttribute("media",media),style.styleSheet)style.styleSheet.cssText=css;else{for(;style.firstChild;)style.removeChild(style.firstChild);style.appendChild(document.createTextNode(css));}}
function updateLink(link,options,obj){var css=obj.css,sourceMap=obj.sourceMap,autoFixUrls=void 0===options.convertToAbsoluteUrls&&sourceMap;(options.convertToAbsoluteUrls||autoFixUrls)&&(css=fixUrls(css)),sourceMap&&(css+="\n/*# sourceMappingURL=data:application/json;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))))+" */");var blob=new Blob([css],{type:"text/css"}),oldSrc=link.href;link.href=URL.createObjectURL(blob),oldSrc&&URL.revokeObjectURL(oldSrc);}
var stylesInDom={},isOldIE=function(fn){var memo;return function(){return void 0===memo&&(memo=fn.apply(this,arguments)),memo;};}(function(){return window&&document&&document.all&&!window.atob;}),getElement=function(fn){var memo={};return function(selector){if(void 0===memo[selector]){var styleTarget=fn.call(this,selector);if(styleTarget instanceof window.HTMLIFrameElement)try{styleTarget=styleTarget.contentDocument.head;}catch(e){styleTarget=null;}
memo[selector]=styleTarget;}
return memo[selector];};}(function(target){return document.querySelector(target);}),singleton=null,singletonCounter=0,stylesInsertedAtTop=[],fixUrls=__webpack_require__(8);module.exports=function(list,options){if("undefined"!=typeof DEBUG&&DEBUG&&"object"!=typeof document)throw new Error("The style-loader cannot be used in a non-browser environment");(options=options||{}).attrs="object"==typeof options.attrs?options.attrs:{},options.singleton||(options.singleton=isOldIE()),options.insertInto||(options.insertInto="head"),options.insertAt||(options.insertAt="bottom");var styles=listToStyles(list,options);return addStylesToDom(styles,options),function(newList){for(var mayRemove=[],i=0;i<styles.length;i++){var item=styles[i];(domStyle=stylesInDom[item.id]).refs--,mayRemove.push(domStyle);}
newList&&addStylesToDom(listToStyles(newList,options),options);for(i=0;i<mayRemove.length;i++){var domStyle=mayRemove[i];if(0===domStyle.refs){for(var j=0;j<domStyle.parts.length;j++)domStyle.parts[j]();delete stylesInDom[domStyle.id];}}};};var replaceText=function(){var textStore=[];return function(index,replacement){return textStore[index]=replacement,textStore.filter(Boolean).join("\n");};}();},function(module,exports){module.exports=function(css){var location="undefined"!=typeof window&&window.location;if(!location)throw new Error("fixUrls requires window.location");if(!css||"string"!=typeof css)return css;var baseUrl=location.protocol+"//"+location.host,currentDir=baseUrl+location.pathname.replace(/\/[^\/]*$/,"/");return css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi,function(fullMatch,origUrl){var unquotedOrigUrl=origUrl.trim().replace(/^"(.*)"$/,function(o,$1){return $1;}).replace(/^'(.*)'$/,function(o,$1){return $1;});if(/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl))return fullMatch;var newUrl;return newUrl=0===unquotedOrigUrl.indexOf("//")?unquotedOrigUrl:0===unquotedOrigUrl.indexOf("/")?baseUrl+unquotedOrigUrl:currentDir+unquotedOrigUrl.replace(/^\.\//,""),"url("+JSON.stringify(newUrl)+")";});};},function(module,exports,__webpack_require__){"use strict";var __WEBPACK_AMD_DEFINE_FACTORY__,__WEBPACK_AMD_DEFINE_ARRAY__,__WEBPACK_AMD_DEFINE_RESULT__;"function"==typeof Symbol&&Symbol.iterator;!function(factory){__WEBPACK_AMD_DEFINE_ARRAY__=[__webpack_require__(0),__webpack_require__(1)],void 0!==(__WEBPACK_AMD_DEFINE_RESULT__="function"==typeof(__WEBPACK_AMD_DEFINE_FACTORY__=factory)?__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports,__WEBPACK_AMD_DEFINE_ARRAY__):__WEBPACK_AMD_DEFINE_FACTORY__)&&(module.exports=__WEBPACK_AMD_DEFINE_RESULT__);}(function($,Inputmask){function isLeapYear(year){return isNaN(year)||29===new Date(year,2,0).getDate();}
return Inputmask.extendAliases({"dd/mm/yyyy":{mask:"1/2/y",placeholder:"dd/mm/yyyy",regex:{val1pre:new RegExp("[0-3]"),val1:new RegExp("0[1-9]|[12][0-9]|3[01]"),val2pre:function(separator){var escapedSeparator=Inputmask.escapeRegex.call(this,separator);return new RegExp("((0[1-9]|[12][0-9]|3[01])"+escapedSeparator+"[01])");},val2:function(separator){var escapedSeparator=Inputmask.escapeRegex.call(this,separator);return new RegExp("((0[1-9]|[12][0-9])"+escapedSeparator+"(0[1-9]|1[012]))|(30"+escapedSeparator+"(0[13-9]|1[012]))|(31"+escapedSeparator+"(0[13578]|1[02]))");}},leapday:"29/02/",separator:"/",yearrange:{minyear:1900,maxyear:2099},isInYearRange:function(chrs,minyear,maxyear){if(isNaN(chrs))return!1;var enteredyear=parseInt(chrs.concat(minyear.toString().slice(chrs.length))),enteredyear2=parseInt(chrs.concat(maxyear.toString().slice(chrs.length)));return!isNaN(enteredyear)&&(minyear<=enteredyear&&enteredyear<=maxyear)||!isNaN(enteredyear2)&&(minyear<=enteredyear2&&enteredyear2<=maxyear);},determinebaseyear:function(minyear,maxyear,hint){var currentyear=new Date().getFullYear();if(minyear>currentyear)return minyear;if(maxyear<currentyear){for(var maxYearPrefix=maxyear.toString().slice(0,2),maxYearPostfix=maxyear.toString().slice(2,4);maxyear<maxYearPrefix+hint;)maxYearPrefix--;var maxxYear=maxYearPrefix+maxYearPostfix;return minyear>maxxYear?minyear:maxxYear;}
if(minyear<=currentyear&&currentyear<=maxyear){for(var currentYearPrefix=currentyear.toString().slice(0,2);maxyear<currentYearPrefix+hint;)currentYearPrefix--;var currentYearAndHint=currentYearPrefix+hint;return currentYearAndHint<minyear?minyear:currentYearAndHint;}
return currentyear;},onKeyDown:function(e,buffer,caretPos,opts){var $input=$(this);if(e.ctrlKey&&e.keyCode===Inputmask.keyCode.RIGHT){var today=new Date();$input.val(today.getDate().toString()+(today.getMonth()+1).toString()+today.getFullYear().toString()),$input.trigger("setvalue");}},getFrontValue:function(mask,buffer,opts){for(var start=0,length=0,i=0;i<mask.length&&"2"!==mask.charAt(i);i++){var definition=opts.definitions[mask.charAt(i)];definition?(start+=length,length=definition.cardinality):length++;}
return buffer.join("").substr(start,length);},postValidation:function(buffer,currentResult,opts){var dayMonthValue,year,bufferStr=buffer.join("");return 0===opts.mask.indexOf("y")?(year=bufferStr.substr(0,4),dayMonthValue=bufferStr.substring(4,10)):(year=bufferStr.substring(6,10),dayMonthValue=bufferStr.substr(0,6)),currentResult&&(dayMonthValue!==opts.leapday||isLeapYear(year));},definitions:{"1":{validator:function(chrs,maskset,pos,strict,opts){var isValid=opts.regex.val1.test(chrs);return strict||isValid||chrs.charAt(1)!==opts.separator&&-1==="-./".indexOf(chrs.charAt(1))||!(isValid=opts.regex.val1.test("0"+chrs.charAt(0)))?isValid:(maskset.buffer[pos-1]="0",{refreshFromBuffer:{start:pos-1,end:pos},pos:pos,c:chrs.charAt(0)});},cardinality:2,prevalidator:[{validator:function(chrs,maskset,pos,strict,opts){var pchrs=chrs;isNaN(maskset.buffer[pos+1])||(pchrs+=maskset.buffer[pos+1]);var isValid=1===pchrs.length?opts.regex.val1pre.test(pchrs):opts.regex.val1.test(pchrs);if(isValid&&maskset.validPositions[pos]&&(opts.regex.val2(opts.separator).test(chrs+maskset.validPositions[pos].input)||(maskset.validPositions[pos].input="0"===chrs?"1":"0")),!strict&&!isValid){if(isValid=opts.regex.val1.test(chrs+"0"))return maskset.buffer[pos]=chrs,maskset.buffer[++pos]="0",{pos:pos,c:"0"};if(isValid=opts.regex.val1.test("0"+chrs))return maskset.buffer[pos]="0",pos++,{pos:pos};}
return isValid;},cardinality:1}]},"2":{validator:function(chrs,maskset,pos,strict,opts){var frontValue=opts.getFrontValue(maskset.mask,maskset.buffer,opts);-1!==frontValue.indexOf(opts.placeholder[0])&&(frontValue="01"+opts.separator);var isValid=opts.regex.val2(opts.separator).test(frontValue+chrs);return strict||isValid||chrs.charAt(1)!==opts.separator&&-1==="-./".indexOf(chrs.charAt(1))||!(isValid=opts.regex.val2(opts.separator).test(frontValue+"0"+chrs.charAt(0)))?isValid:(maskset.buffer[pos-1]="0",{refreshFromBuffer:{start:pos-1,end:pos},pos:pos,c:chrs.charAt(0)});},cardinality:2,prevalidator:[{validator:function(chrs,maskset,pos,strict,opts){isNaN(maskset.buffer[pos+1])||(chrs+=maskset.buffer[pos+1]);var frontValue=opts.getFrontValue(maskset.mask,maskset.buffer,opts);-1!==frontValue.indexOf(opts.placeholder[0])&&(frontValue="01"+opts.separator);var isValid=1===chrs.length?opts.regex.val2pre(opts.separator).test(frontValue+chrs):opts.regex.val2(opts.separator).test(frontValue+chrs);return isValid&&maskset.validPositions[pos]&&(opts.regex.val2(opts.separator).test(chrs+maskset.validPositions[pos].input)||(maskset.validPositions[pos].input="0"===chrs?"1":"0")),strict||isValid||!(isValid=opts.regex.val2(opts.separator).test(frontValue+"0"+chrs))?isValid:(maskset.buffer[pos]="0",pos++,{pos:pos});},cardinality:1}]},y:{validator:function(chrs,maskset,pos,strict,opts){return opts.isInYearRange(chrs,opts.yearrange.minyear,opts.yearrange.maxyear);},cardinality:4,prevalidator:[{validator:function(chrs,maskset,pos,strict,opts){var isValid=opts.isInYearRange(chrs,opts.yearrange.minyear,opts.yearrange.maxyear);if(!strict&&!isValid){var yearPrefix=opts.determinebaseyear(opts.yearrange.minyear,opts.yearrange.maxyear,chrs+"0").toString().slice(0,1);if(isValid=opts.isInYearRange(yearPrefix+chrs,opts.yearrange.minyear,opts.yearrange.maxyear))return maskset.buffer[pos++]=yearPrefix.charAt(0),{pos:pos};if(yearPrefix=opts.determinebaseyear(opts.yearrange.minyear,opts.yearrange.maxyear,chrs+"0").toString().slice(0,2),isValid=opts.isInYearRange(yearPrefix+chrs,opts.yearrange.minyear,opts.yearrange.maxyear))return maskset.buffer[pos++]=yearPrefix.charAt(0),maskset.buffer[pos++]=yearPrefix.charAt(1),{pos:pos};}
return isValid;},cardinality:1},{validator:function(chrs,maskset,pos,strict,opts){var isValid=opts.isInYearRange(chrs,opts.yearrange.minyear,opts.yearrange.maxyear);if(!strict&&!isValid){var yearPrefix=opts.determinebaseyear(opts.yearrange.minyear,opts.yearrange.maxyear,chrs).toString().slice(0,2);if(isValid=opts.isInYearRange(chrs[0]+yearPrefix[1]+chrs[1],opts.yearrange.minyear,opts.yearrange.maxyear))return maskset.buffer[pos++]=yearPrefix.charAt(1),{pos:pos};if(yearPrefix=opts.determinebaseyear(opts.yearrange.minyear,opts.yearrange.maxyear,chrs).toString().slice(0,2),isValid=opts.isInYearRange(yearPrefix+chrs,opts.yearrange.minyear,opts.yearrange.maxyear))return maskset.buffer[pos-1]=yearPrefix.charAt(0),maskset.buffer[pos++]=yearPrefix.charAt(1),maskset.buffer[pos++]=chrs.charAt(0),{refreshFromBuffer:{start:pos-3,end:pos},pos:pos};}
return isValid;},cardinality:2},{validator:function(chrs,maskset,pos,strict,opts){return opts.isInYearRange(chrs,opts.yearrange.minyear,opts.yearrange.maxyear);},cardinality:3}]}},insertMode:!1,autoUnmask:!1},"mm/dd/yyyy":{placeholder:"mm/dd/yyyy",alias:"dd/mm/yyyy",regex:{val2pre:function(separator){var escapedSeparator=Inputmask.escapeRegex.call(this,separator);return new RegExp("((0[13-9]|1[012])"+escapedSeparator+"[0-3])|(02"+escapedSeparator+"[0-2])");},val2:function(separator){var escapedSeparator=Inputmask.escapeRegex.call(this,separator);return new RegExp("((0[1-9]|1[012])"+escapedSeparator+"(0[1-9]|[12][0-9]))|((0[13-9]|1[012])"+escapedSeparator+"30)|((0[13578]|1[02])"+escapedSeparator+"31)");},val1pre:new RegExp("[01]"),val1:new RegExp("0[1-9]|1[012]")},leapday:"02/29/",onKeyDown:function(e,buffer,caretPos,opts){var $input=$(this);if(e.ctrlKey&&e.keyCode===Inputmask.keyCode.RIGHT){var today=new Date();$input.val((today.getMonth()+1).toString()+today.getDate().toString()+today.getFullYear().toString()),$input.trigger("setvalue");}}},"yyyy/mm/dd":{mask:"y/1/2",placeholder:"yyyy/mm/dd",alias:"mm/dd/yyyy",leapday:"/02/29",onKeyDown:function(e,buffer,caretPos,opts){var $input=$(this);if(e.ctrlKey&&e.keyCode===Inputmask.keyCode.RIGHT){var today=new Date();$input.val(today.getFullYear().toString()+(today.getMonth()+1).toString()+today.getDate().toString()),$input.trigger("setvalue");}}},"dd.mm.yyyy":{mask:"1.2.y",placeholder:"dd.mm.yyyy",leapday:"29.02.",separator:".",alias:"dd/mm/yyyy"},"dd-mm-yyyy":{mask:"1-2-y",placeholder:"dd-mm-yyyy",leapday:"29-02-",separator:"-",alias:"dd/mm/yyyy"},"mm.dd.yyyy":{mask:"1.2.y",placeholder:"mm.dd.yyyy",leapday:"02.29.",separator:".",alias:"mm/dd/yyyy"},"mm-dd-yyyy":{mask:"1-2-y",placeholder:"mm-dd-yyyy",leapday:"02-29-",separator:"-",alias:"mm/dd/yyyy"},"yyyy.mm.dd":{mask:"y.1.2",placeholder:"yyyy.mm.dd",leapday:".02.29",separator:".",alias:"yyyy/mm/dd"},"yyyy-mm-dd":{mask:"y-1-2",placeholder:"yyyy-mm-dd",leapday:"-02-29",separator:"-",alias:"yyyy/mm/dd"},datetime:{mask:"1/2/y h:s",placeholder:"dd/mm/yyyy hh:mm",alias:"dd/mm/yyyy",regex:{hrspre:new RegExp("[012]"),hrs24:new RegExp("2[0-4]|1[3-9]"),hrs:new RegExp("[01][0-9]|2[0-4]"),ampm:new RegExp("^[a|p|A|P][m|M]"),mspre:new RegExp("[0-5]"),ms:new RegExp("[0-5][0-9]")},timeseparator:":",hourFormat:"24",definitions:{h:{validator:function(chrs,maskset,pos,strict,opts){if("24"===opts.hourFormat&&24===parseInt(chrs,10))return maskset.buffer[pos-1]="0",maskset.buffer[pos]="0",{refreshFromBuffer:{start:pos-1,end:pos},c:"0"};var isValid=opts.regex.hrs.test(chrs);if(!strict&&!isValid&&(chrs.charAt(1)===opts.timeseparator||-1!=="-.:".indexOf(chrs.charAt(1)))&&(isValid=opts.regex.hrs.test("0"+chrs.charAt(0))))return maskset.buffer[pos-1]="0",maskset.buffer[pos]=chrs.charAt(0),pos++,{refreshFromBuffer:{start:pos-2,end:pos},pos:pos,c:opts.timeseparator};if(isValid&&"24"!==opts.hourFormat&&opts.regex.hrs24.test(chrs)){var tmp=parseInt(chrs,10);return 24===tmp?(maskset.buffer[pos+5]="a",maskset.buffer[pos+6]="m"):(maskset.buffer[pos+5]="p",maskset.buffer[pos+6]="m"),(tmp-=12)<10?(maskset.buffer[pos]=tmp.toString(),maskset.buffer[pos-1]="0"):(maskset.buffer[pos]=tmp.toString().charAt(1),maskset.buffer[pos-1]=tmp.toString().charAt(0)),{refreshFromBuffer:{start:pos-1,end:pos+6},c:maskset.buffer[pos]};}
return isValid;},cardinality:2,prevalidator:[{validator:function(chrs,maskset,pos,strict,opts){var isValid=opts.regex.hrspre.test(chrs);return strict||isValid||!(isValid=opts.regex.hrs.test("0"+chrs))?isValid:(maskset.buffer[pos]="0",pos++,{pos:pos});},cardinality:1}]},s:{validator:"[0-5][0-9]",cardinality:2,prevalidator:[{validator:function(chrs,maskset,pos,strict,opts){var isValid=opts.regex.mspre.test(chrs);return strict||isValid||!(isValid=opts.regex.ms.test("0"+chrs))?isValid:(maskset.buffer[pos]="0",pos++,{pos:pos});},cardinality:1}]},t:{validator:function(chrs,maskset,pos,strict,opts){return opts.regex.ampm.test(chrs+"m");},casing:"lower",cardinality:1}},insertMode:!1,autoUnmask:!1},datetime12:{mask:"1/2/y h:s t\\m",placeholder:"dd/mm/yyyy hh:mm xm",alias:"datetime",hourFormat:"12"},"mm/dd/yyyy hh:mm xm":{mask:"1/2/y h:s t\\m",placeholder:"mm/dd/yyyy hh:mm xm",alias:"datetime12",regex:{val2pre:function(separator){var escapedSeparator=Inputmask.escapeRegex.call(this,separator);return new RegExp("((0[13-9]|1[012])"+escapedSeparator+"[0-3])|(02"+escapedSeparator+"[0-2])");},val2:function(separator){var escapedSeparator=Inputmask.escapeRegex.call(this,separator);return new RegExp("((0[1-9]|1[012])"+escapedSeparator+"(0[1-9]|[12][0-9]))|((0[13-9]|1[012])"+escapedSeparator+"30)|((0[13578]|1[02])"+escapedSeparator+"31)");},val1pre:new RegExp("[01]"),val1:new RegExp("0[1-9]|1[012]")},leapday:"02/29/",onKeyDown:function(e,buffer,caretPos,opts){var $input=$(this);if(e.ctrlKey&&e.keyCode===Inputmask.keyCode.RIGHT){var today=new Date();$input.val((today.getMonth()+1).toString()+today.getDate().toString()+today.getFullYear().toString()),$input.trigger("setvalue");}}},"hh:mm t":{mask:"h:s t\\m",placeholder:"hh:mm xm",alias:"datetime",hourFormat:"12"},"h:s t":{mask:"h:s t\\m",placeholder:"hh:mm xm",alias:"datetime",hourFormat:"12"},"hh:mm:ss":{mask:"h:s:s",placeholder:"hh:mm:ss",alias:"datetime",autoUnmask:!1},"hh:mm":{mask:"h:s",placeholder:"hh:mm",alias:"datetime",autoUnmask:!1},date:{alias:"dd/mm/yyyy"},"mm/yyyy":{mask:"1/y",placeholder:"mm/yyyy",leapday:"donotuse",separator:"/",alias:"mm/dd/yyyy"},shamsi:{regex:{val2pre:function(separator){var escapedSeparator=Inputmask.escapeRegex.call(this,separator);return new RegExp("((0[1-9]|1[012])"+escapedSeparator+"[0-3])");},val2:function(separator){var escapedSeparator=Inputmask.escapeRegex.call(this,separator);return new RegExp("((0[1-9]|1[012])"+escapedSeparator+"(0[1-9]|[12][0-9]))|((0[1-9]|1[012])"+escapedSeparator+"30)|((0[1-6])"+escapedSeparator+"31)");},val1pre:new RegExp("[01]"),val1:new RegExp("0[1-9]|1[012]")},yearrange:{minyear:1300,maxyear:1499},mask:"y/1/2",leapday:"/12/30",placeholder:"yyyy/mm/dd",alias:"mm/dd/yyyy",clearIncomplete:!0},"yyyy-mm-dd hh:mm:ss":{mask:"y-1-2 h:s:s",placeholder:"yyyy-mm-dd hh:mm:ss",alias:"datetime",separator:"-",leapday:"-02-29",regex:{val2pre:function(separator){var escapedSeparator=Inputmask.escapeRegex.call(this,separator);return new RegExp("((0[13-9]|1[012])"+escapedSeparator+"[0-3])|(02"+escapedSeparator+"[0-2])");},val2:function(separator){var escapedSeparator=Inputmask.escapeRegex.call(this,separator);return new RegExp("((0[1-9]|1[012])"+escapedSeparator+"(0[1-9]|[12][0-9]))|((0[13-9]|1[012])"+escapedSeparator+"30)|((0[13578]|1[02])"+escapedSeparator+"31)");},val1pre:new RegExp("[01]"),val1:new RegExp("0[1-9]|1[012]")},onKeyDown:function(e,buffer,caretPos,opts){}}}),Inputmask;});},function(module,exports,__webpack_require__){"use strict";var __WEBPACK_AMD_DEFINE_RESULT__;"function"==typeof Symbol&&Symbol.iterator;void 0!==(__WEBPACK_AMD_DEFINE_RESULT__=function(){return window;}.call(exports,__webpack_require__,exports,module))&&(module.exports=__WEBPACK_AMD_DEFINE_RESULT__);},function(module,exports,__webpack_require__){"use strict";var __WEBPACK_AMD_DEFINE_RESULT__;"function"==typeof Symbol&&Symbol.iterator;void 0!==(__WEBPACK_AMD_DEFINE_RESULT__=function(){return document;}.call(exports,__webpack_require__,exports,module))&&(module.exports=__WEBPACK_AMD_DEFINE_RESULT__);},function(module,exports,__webpack_require__){"use strict";var __WEBPACK_AMD_DEFINE_FACTORY__,__WEBPACK_AMD_DEFINE_ARRAY__,__WEBPACK_AMD_DEFINE_RESULT__;"function"==typeof Symbol&&Symbol.iterator;!function(factory){__WEBPACK_AMD_DEFINE_ARRAY__=[__webpack_require__(0),__webpack_require__(1)],void 0!==(__WEBPACK_AMD_DEFINE_RESULT__="function"==typeof(__WEBPACK_AMD_DEFINE_FACTORY__=factory)?__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports,__WEBPACK_AMD_DEFINE_ARRAY__):__WEBPACK_AMD_DEFINE_FACTORY__)&&(module.exports=__WEBPACK_AMD_DEFINE_RESULT__);}(function($,Inputmask){return Inputmask.extendDefinitions({A:{validator:"[A-Za-zА-яЁёÀ-ÿµ]",cardinality:1,casing:"upper"},"&":{validator:"[0-9A-Za-zА-яЁёÀ-ÿµ]",cardinality:1,casing:"upper"},"#":{validator:"[0-9A-Fa-f]",cardinality:1,casing:"upper"}}),Inputmask.extendAliases({url:{definitions:{i:{validator:".",cardinality:1}},mask:"(\\http://)|(\\http\\s://)|(ftp://)|(ftp\\s://)i{+}",insertMode:!1,autoUnmask:!1,inputmode:"url"},ip:{mask:"i[i[i]].i[i[i]].i[i[i]].i[i[i]]",definitions:{i:{validator:function(chrs,maskset,pos,strict,opts){return pos-1>-1&&"."!==maskset.buffer[pos-1]?(chrs=maskset.buffer[pos-1]+chrs,chrs=pos-2>-1&&"."!==maskset.buffer[pos-2]?maskset.buffer[pos-2]+chrs:"0"+chrs):chrs="00"+chrs,new RegExp("25[0-5]|2[0-4][0-9]|[01][0-9][0-9]").test(chrs);},cardinality:1}},onUnMask:function(maskedValue,unmaskedValue,opts){return maskedValue;},inputmode:"numeric"},email:{mask:"*{1,64}[.*{1,64}][.*{1,64}][.*{1,63}]@-{1,63}.-{1,63}[.-{1,63}][.-{1,63}]",greedy:!1,onBeforePaste:function(pastedValue,opts){return(pastedValue=pastedValue.toLowerCase()).replace("mailto:","");},definitions:{"*":{validator:"[0-9A-Za-z!#$%&'*+/=?^_`{|}~-]",cardinality:1,casing:"lower"},"-":{validator:"[0-9A-Za-z-]",cardinality:1,casing:"lower"}},onUnMask:function(maskedValue,unmaskedValue,opts){return maskedValue;},inputmode:"email"},mac:{mask:"##:##:##:##:##:##"},vin:{mask:"V{13}9{4}",definitions:{V:{validator:"[A-HJ-NPR-Za-hj-npr-z\\d]",cardinality:1,casing:"upper"}},clearIncomplete:!0,autoUnmask:!0}}),Inputmask;});},function(module,exports,__webpack_require__){"use strict";var __WEBPACK_AMD_DEFINE_FACTORY__,__WEBPACK_AMD_DEFINE_ARRAY__,__WEBPACK_AMD_DEFINE_RESULT__;"function"==typeof Symbol&&Symbol.iterator;!function(factory){__WEBPACK_AMD_DEFINE_ARRAY__=[__webpack_require__(0),__webpack_require__(1)],void 0!==(__WEBPACK_AMD_DEFINE_RESULT__="function"==typeof(__WEBPACK_AMD_DEFINE_FACTORY__=factory)?__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports,__WEBPACK_AMD_DEFINE_ARRAY__):__WEBPACK_AMD_DEFINE_FACTORY__)&&(module.exports=__WEBPACK_AMD_DEFINE_RESULT__);}(function($,Inputmask,undefined){function autoEscape(txt,opts){for(var escapedTxt="",i=0;i<txt.length;i++)Inputmask.prototype.definitions[txt.charAt(i)]||opts.definitions[txt.charAt(i)]||opts.optionalmarker.start===txt.charAt(i)||opts.optionalmarker.end===txt.charAt(i)||opts.quantifiermarker.start===txt.charAt(i)||opts.quantifiermarker.end===txt.charAt(i)||opts.groupmarker.start===txt.charAt(i)||opts.groupmarker.end===txt.charAt(i)||opts.alternatormarker===txt.charAt(i)?escapedTxt+="\\"+txt.charAt(i):escapedTxt+=txt.charAt(i);return escapedTxt;}
return Inputmask.extendAliases({numeric:{mask:function(opts){if(0!==opts.repeat&&isNaN(opts.integerDigits)&&(opts.integerDigits=opts.repeat),opts.repeat=0,opts.groupSeparator===opts.radixPoint&&("."===opts.radixPoint?opts.groupSeparator=",":","===opts.radixPoint?opts.groupSeparator=".":opts.groupSeparator="")," "===opts.groupSeparator&&(opts.skipOptionalPartCharacter=undefined),opts.autoGroup=opts.autoGroup&&""!==opts.groupSeparator,opts.autoGroup&&("string"==typeof opts.groupSize&&isFinite(opts.groupSize)&&(opts.groupSize=parseInt(opts.groupSize)),isFinite(opts.integerDigits))){var seps=Math.floor(opts.integerDigits/opts.groupSize),mod=opts.integerDigits%opts.groupSize;opts.integerDigits=parseInt(opts.integerDigits)+(0===mod?seps-1:seps),opts.integerDigits<1&&(opts.integerDigits="*");}
opts.placeholder.length>1&&(opts.placeholder=opts.placeholder.charAt(0)),"radixFocus"===opts.positionCaretOnClick&&""===opts.placeholder&&!1===opts.integerOptional&&(opts.positionCaretOnClick="lvp"),opts.definitions[";"]=opts.definitions["~"],opts.definitions[";"].definitionSymbol="~",!0===opts.numericInput&&(opts.positionCaretOnClick="radixFocus"===opts.positionCaretOnClick?"lvp":opts.positionCaretOnClick,opts.digitsOptional=!1,isNaN(opts.digits)&&(opts.digits=2),opts.decimalProtect=!1);var mask="[+]";if(mask+=autoEscape(opts.prefix,opts),!0===opts.integerOptional?mask+="~{1,"+opts.integerDigits+"}":mask+="~{"+opts.integerDigits+"}",opts.digits!==undefined){opts.radixPointDefinitionSymbol=opts.decimalProtect?":":opts.radixPoint;var dq=opts.digits.toString().split(",");isFinite(dq[0]&&dq[1]&&isFinite(dq[1]))?mask+=opts.radixPointDefinitionSymbol+";{"+opts.digits+"}":(isNaN(opts.digits)||parseInt(opts.digits)>0)&&(opts.digitsOptional?mask+="["+opts.radixPointDefinitionSymbol+";{1,"+opts.digits+"}]":mask+=opts.radixPointDefinitionSymbol+";{"+opts.digits+"}");}
return mask+=autoEscape(opts.suffix,opts),mask+="[-]",opts.greedy=!1,mask;},placeholder:"",greedy:!1,digits:"*",digitsOptional:!0,enforceDigitsOnBlur:!1,radixPoint:".",positionCaretOnClick:"radixFocus",groupSize:3,groupSeparator:"",autoGroup:!1,allowMinus:!0,negationSymbol:{front:"-",back:""},integerDigits:"+",integerOptional:!0,prefix:"",suffix:"",rightAlign:!0,decimalProtect:!0,min:null,max:null,step:1,insertMode:!0,autoUnmask:!1,unmaskAsNumber:!1,inputmode:"numeric",preValidation:function(buffer,pos,c,isSelection,opts){if("-"===c||c===opts.negationSymbol.front)return!0===opts.allowMinus&&(opts.isNegative=opts.isNegative===undefined||!opts.isNegative,""===buffer.join("")||{caret:pos,dopost:!0});if(!1===isSelection&&c===opts.radixPoint&&opts.digits!==undefined&&(isNaN(opts.digits)||parseInt(opts.digits)>0)){var radixPos=$.inArray(opts.radixPoint,buffer);if(-1!==radixPos)return!0===opts.numericInput?pos===radixPos:{caret:radixPos+1};}
return!0;},postValidation:function(buffer,currentResult,opts){var suffix=opts.suffix.split(""),prefix=opts.prefix.split("");if(currentResult.pos===undefined&&currentResult.caret!==undefined&&!0!==currentResult.dopost)return currentResult;var caretPos=currentResult.caret!==undefined?currentResult.caret:currentResult.pos,maskedValue=buffer.slice();opts.numericInput&&(caretPos=maskedValue.length-caretPos-1,maskedValue=maskedValue.reverse());var charAtPos=maskedValue[caretPos];if(charAtPos===opts.groupSeparator&&(charAtPos=maskedValue[caretPos+=1]),caretPos===maskedValue.length-opts.suffix.length-1&&charAtPos===opts.radixPoint)return currentResult;charAtPos!==undefined&&charAtPos!==opts.radixPoint&&charAtPos!==opts.negationSymbol.front&&charAtPos!==opts.negationSymbol.back&&(maskedValue[caretPos]="?",opts.prefix.length>0&&caretPos>=(!1===opts.isNegative?1:0)&&caretPos<opts.prefix.length-1+(!1===opts.isNegative?1:0)?prefix[caretPos-(!1===opts.isNegative?1:0)]="?":opts.suffix.length>0&&caretPos>=maskedValue.length-opts.suffix.length-(!1===opts.isNegative?1:0)&&(suffix[caretPos-(maskedValue.length-opts.suffix.length-(!1===opts.isNegative?1:0))]="?")),prefix=prefix.join(""),suffix=suffix.join("");var processValue=maskedValue.join("").replace(prefix,"");if(processValue=processValue.replace(suffix,""),processValue=processValue.replace(new RegExp(Inputmask.escapeRegex(opts.groupSeparator),"g"),""),processValue=processValue.replace(new RegExp("[-"+Inputmask.escapeRegex(opts.negationSymbol.front)+"]","g"),""),processValue=processValue.replace(new RegExp(Inputmask.escapeRegex(opts.negationSymbol.back)+"$"),""),isNaN(opts.placeholder)&&(processValue=processValue.replace(new RegExp(Inputmask.escapeRegex(opts.placeholder),"g"),"")),processValue.length>1&&1!==processValue.indexOf(opts.radixPoint)&&("0"===charAtPos&&(processValue=processValue.replace(/^\?/g,"")),processValue=processValue.replace(/^0/g,"")),processValue.charAt(0)===opts.radixPoint&&""!==opts.radixPoint&&!0!==opts.numericInput&&(processValue="0"+processValue),""!==processValue){if(processValue=processValue.split(""),(!opts.digitsOptional||opts.enforceDigitsOnBlur&&"blur"===currentResult.event)&&isFinite(opts.digits)){var radixPosition=$.inArray(opts.radixPoint,processValue),rpb=$.inArray(opts.radixPoint,maskedValue);-1===radixPosition&&(processValue.push(opts.radixPoint),radixPosition=processValue.length-1);for(var i=1;i<=opts.digits;i++)opts.digitsOptional&&(!opts.enforceDigitsOnBlur||"blur"!==currentResult.event)||processValue[radixPosition+i]!==undefined&&processValue[radixPosition+i]!==opts.placeholder.charAt(0)?-1!==rpb&&maskedValue[rpb+i]!==undefined&&(processValue[radixPosition+i]=processValue[radixPosition+i]||maskedValue[rpb+i]):processValue[radixPosition+i]=currentResult.placeholder||opts.placeholder.charAt(0);}
if(!0!==opts.autoGroup||""===opts.groupSeparator||charAtPos===opts.radixPoint&&currentResult.pos===undefined&&!currentResult.dopost)processValue=processValue.join("");else{var addRadix=processValue[processValue.length-1]===opts.radixPoint&&currentResult.c===opts.radixPoint;processValue=Inputmask(function(buffer,opts){var postMask="";if(postMask+="("+opts.groupSeparator+"*{"+opts.groupSize+"}){*}",""!==opts.radixPoint){var radixSplit=buffer.join("").split(opts.radixPoint);radixSplit[1]&&(postMask+=opts.radixPoint+"*{"+radixSplit[1].match(/^\d*\??\d*/)[0].length+"}");}
return postMask;}(processValue,opts),{numericInput:!0,jitMasking:!0,definitions:{"*":{validator:"[0-9?]",cardinality:1}}}).format(processValue.join("")),addRadix&&(processValue+=opts.radixPoint),processValue.charAt(0)===opts.groupSeparator&&processValue.substr(1);}}
if(opts.isNegative&&"blur"===currentResult.event&&(opts.isNegative="0"!==processValue),processValue=prefix+processValue,processValue+=suffix,opts.isNegative&&(processValue=opts.negationSymbol.front+processValue,processValue+=opts.negationSymbol.back),processValue=processValue.split(""),charAtPos!==undefined)if(charAtPos!==opts.radixPoint&&charAtPos!==opts.negationSymbol.front&&charAtPos!==opts.negationSymbol.back)(caretPos=$.inArray("?",processValue))>-1?processValue[caretPos]=charAtPos:caretPos=currentResult.caret||0;else if(charAtPos===opts.radixPoint||charAtPos===opts.negationSymbol.front||charAtPos===opts.negationSymbol.back){var newCaretPos=$.inArray(charAtPos,processValue);-1!==newCaretPos&&(caretPos=newCaretPos);}
opts.numericInput&&(caretPos=processValue.length-caretPos-1,processValue=processValue.reverse());var rslt={caret:charAtPos===undefined||currentResult.pos!==undefined?caretPos+(opts.numericInput?-1:1):caretPos,buffer:processValue,refreshFromBuffer:currentResult.dopost||buffer.join("")!==processValue.join("")};return rslt.refreshFromBuffer?rslt:currentResult;},onBeforeWrite:function(e,buffer,caretPos,opts){if(e)switch(e.type){case"keydown":return opts.postValidation(buffer,{caret:caretPos,dopost:!0},opts);case"blur":case"checkval":var unmasked;if(function(opts){opts.parseMinMaxOptions===undefined&&(null!==opts.min&&(opts.min=opts.min.toString().replace(new RegExp(Inputmask.escapeRegex(opts.groupSeparator),"g"),""),","===opts.radixPoint&&(opts.min=opts.min.replace(opts.radixPoint,".")),opts.min=isFinite(opts.min)?parseFloat(opts.min):NaN,isNaN(opts.min)&&(opts.min=Number.MIN_VALUE)),null!==opts.max&&(opts.max=opts.max.toString().replace(new RegExp(Inputmask.escapeRegex(opts.groupSeparator),"g"),""),","===opts.radixPoint&&(opts.max=opts.max.replace(opts.radixPoint,".")),opts.max=isFinite(opts.max)?parseFloat(opts.max):NaN,isNaN(opts.max)&&(opts.max=Number.MAX_VALUE)),opts.parseMinMaxOptions="done");}(opts),null!==opts.min||null!==opts.max){if(unmasked=opts.onUnMask(buffer.join(""),undefined,$.extend({},opts,{unmaskAsNumber:!0})),null!==opts.min&&unmasked<opts.min)return opts.isNegative=opts.min<0,opts.postValidation(opts.min.toString().replace(".",opts.radixPoint).split(""),{caret:caretPos,dopost:!0,placeholder:"0"},opts);if(null!==opts.max&&unmasked>opts.max)return opts.isNegative=opts.max<0,opts.postValidation(opts.max.toString().replace(".",opts.radixPoint).split(""),{caret:caretPos,dopost:!0,placeholder:"0"},opts);}
return opts.postValidation(buffer,{caret:caretPos,placeholder:"0",event:"blur"},opts);case"_checkval":return{caret:caretPos};}},regex:{integerPart:function(opts,emptyCheck){return emptyCheck?new RegExp("["+Inputmask.escapeRegex(opts.negationSymbol.front)+"+]?"):new RegExp("["+Inputmask.escapeRegex(opts.negationSymbol.front)+"+]?\\d+");},integerNPart:function(opts){return new RegExp("[\\d"+Inputmask.escapeRegex(opts.groupSeparator)+Inputmask.escapeRegex(opts.placeholder.charAt(0))+"]+");}},definitions:{"~":{validator:function(chrs,maskset,pos,strict,opts,isSelection){var isValid=strict?new RegExp("[0-9"+Inputmask.escapeRegex(opts.groupSeparator)+"]").test(chrs):new RegExp("[0-9]").test(chrs);if(!0===isValid){if(!0!==opts.numericInput&&maskset.validPositions[pos]!==undefined&&"~"===maskset.validPositions[pos].match.def&&!isSelection){var processValue=maskset.buffer.join(""),pvRadixSplit=(processValue=(processValue=processValue.replace(new RegExp("[-"+Inputmask.escapeRegex(opts.negationSymbol.front)+"]","g"),"")).replace(new RegExp(Inputmask.escapeRegex(opts.negationSymbol.back)+"$"),"")).split(opts.radixPoint);pvRadixSplit.length>1&&(pvRadixSplit[1]=pvRadixSplit[1].replace(/0/g,opts.placeholder.charAt(0))),"0"===pvRadixSplit[0]&&(pvRadixSplit[0]=pvRadixSplit[0].replace(/0/g,opts.placeholder.charAt(0))),processValue=pvRadixSplit[0]+opts.radixPoint+pvRadixSplit[1]||"";var bufferTemplate=maskset._buffer.join("");for(processValue===opts.radixPoint&&(processValue=bufferTemplate);null===processValue.match(Inputmask.escapeRegex(bufferTemplate)+"$");)bufferTemplate=bufferTemplate.slice(1);isValid=(processValue=(processValue=processValue.replace(bufferTemplate,"")).split(""))[pos]===undefined?{pos:pos,remove:pos}:{pos:pos};}}else strict||chrs!==opts.radixPoint||maskset.validPositions[pos-1]!==undefined||(maskset.buffer[pos]="0",isValid={pos:pos+1});return isValid;},cardinality:1},"+":{validator:function(chrs,maskset,pos,strict,opts){return opts.allowMinus&&("-"===chrs||chrs===opts.negationSymbol.front);},cardinality:1,placeholder:""},"-":{validator:function(chrs,maskset,pos,strict,opts){return opts.allowMinus&&chrs===opts.negationSymbol.back;},cardinality:1,placeholder:""},":":{validator:function(chrs,maskset,pos,strict,opts){var radix="["+Inputmask.escapeRegex(opts.radixPoint)+"]",isValid=new RegExp(radix).test(chrs);return isValid&&maskset.validPositions[pos]&&maskset.validPositions[pos].match.placeholder===opts.radixPoint&&(isValid={caret:pos+1}),isValid;},cardinality:1,placeholder:function(opts){return opts.radixPoint;}}},onUnMask:function(maskedValue,unmaskedValue,opts){if(""===unmaskedValue&&!0===opts.nullable)return unmaskedValue;var processValue=maskedValue.replace(opts.prefix,"");return processValue=processValue.replace(opts.suffix,""),processValue=processValue.replace(new RegExp(Inputmask.escapeRegex(opts.groupSeparator),"g"),""),""!==opts.placeholder.charAt(0)&&(processValue=processValue.replace(new RegExp(opts.placeholder.charAt(0),"g"),"0")),opts.unmaskAsNumber?(""!==opts.radixPoint&&-1!==processValue.indexOf(opts.radixPoint)&&(processValue=processValue.replace(Inputmask.escapeRegex.call(this,opts.radixPoint),".")),processValue=processValue.replace(new RegExp("^"+Inputmask.escapeRegex(opts.negationSymbol.front)),"-"),processValue=processValue.replace(new RegExp(Inputmask.escapeRegex(opts.negationSymbol.back)+"$"),""),Number(processValue)):processValue;},isComplete:function(buffer,opts){var maskedValue=buffer.join("");if(buffer.slice().join("")!==maskedValue)return!1;var processValue=maskedValue.replace(opts.prefix,"");return processValue=processValue.replace(opts.suffix,""),processValue=processValue.replace(new RegExp(Inputmask.escapeRegex(opts.groupSeparator),"g"),""),","===opts.radixPoint&&(processValue=processValue.replace(Inputmask.escapeRegex(opts.radixPoint),".")),isFinite(processValue);},onBeforeMask:function(initialValue,opts){if(opts.isNegative=undefined,initialValue=initialValue.toString().charAt(initialValue.length-1)===opts.radixPoint?initialValue.toString().substr(0,initialValue.length-1):initialValue.toString(),""!==opts.radixPoint&&isFinite(initialValue)){var vs=initialValue.split("."),groupSize=""!==opts.groupSeparator?parseInt(opts.groupSize):0;2===vs.length&&(vs[0].length>groupSize||vs[1].length>groupSize||vs[0].length<=groupSize&&vs[1].length<groupSize)&&(initialValue=initialValue.replace(".",opts.radixPoint));}
var kommaMatches=initialValue.match(/,/g),dotMatches=initialValue.match(/\./g);if(initialValue=dotMatches&&kommaMatches?dotMatches.length>kommaMatches.length?(initialValue=initialValue.replace(/\./g,"")).replace(",",opts.radixPoint):kommaMatches.length>dotMatches.length?(initialValue=initialValue.replace(/,/g,"")).replace(".",opts.radixPoint):initialValue.indexOf(".")<initialValue.indexOf(",")?initialValue.replace(/\./g,""):initialValue.replace(/,/g,""):initialValue.replace(new RegExp(Inputmask.escapeRegex(opts.groupSeparator),"g"),""),0===opts.digits&&(-1!==initialValue.indexOf(".")?initialValue=initialValue.substring(0,initialValue.indexOf(".")):-1!==initialValue.indexOf(",")&&(initialValue=initialValue.substring(0,initialValue.indexOf(",")))),""!==opts.radixPoint&&isFinite(opts.digits)&&-1!==initialValue.indexOf(opts.radixPoint)){var decPart=initialValue.split(opts.radixPoint)[1].match(new RegExp("\\d*"))[0];if(parseInt(opts.digits)<decPart.toString().length){var digitsFactor=Math.pow(10,parseInt(opts.digits));initialValue=initialValue.replace(Inputmask.escapeRegex(opts.radixPoint),"."),initialValue=(initialValue=Math.round(parseFloat(initialValue)*digitsFactor)/digitsFactor).toString().replace(".",opts.radixPoint);}}
return initialValue;},canClearPosition:function(maskset,position,lvp,strict,opts){var vp=maskset.validPositions[position],canClear=vp.input!==opts.radixPoint||null!==maskset.validPositions[position].match.fn&&!1===opts.decimalProtect||vp.input===opts.radixPoint&&maskset.validPositions[position+1]&&null===maskset.validPositions[position+1].match.fn||isFinite(vp.input)||position===lvp||vp.input===opts.groupSeparator||vp.input===opts.negationSymbol.front||vp.input===opts.negationSymbol.back;return!canClear||"+"!==vp.match.nativeDef&&"-"!==vp.match.nativeDef||(opts.isNegative=!1),canClear;},onKeyDown:function(e,buffer,caretPos,opts){var $input=$(this);if(e.ctrlKey)switch(e.keyCode){case Inputmask.keyCode.UP:$input.val(parseFloat(this.inputmask.unmaskedvalue())+parseInt(opts.step)),$input.trigger("setvalue");break;case Inputmask.keyCode.DOWN:$input.val(parseFloat(this.inputmask.unmaskedvalue())-parseInt(opts.step)),$input.trigger("setvalue");}}},currency:{prefix:"$ ",groupSeparator:",",alias:"numeric",placeholder:"0",autoGroup:!0,digits:2,digitsOptional:!1,clearMaskOnLostFocus:!1},decimal:{alias:"numeric"},integer:{alias:"numeric",digits:0,radixPoint:""},percentage:{alias:"numeric",digits:2,digitsOptional:!0,radixPoint:".",placeholder:"0",autoGroup:!1,min:0,max:100,suffix:" %",allowMinus:!1}}),Inputmask;});},function(module,exports,__webpack_require__){"use strict";var __WEBPACK_AMD_DEFINE_FACTORY__,__WEBPACK_AMD_DEFINE_ARRAY__,__WEBPACK_AMD_DEFINE_RESULT__;"function"==typeof Symbol&&Symbol.iterator;!function(factory){__WEBPACK_AMD_DEFINE_ARRAY__=[__webpack_require__(0),__webpack_require__(1)],void 0!==(__WEBPACK_AMD_DEFINE_RESULT__="function"==typeof(__WEBPACK_AMD_DEFINE_FACTORY__=factory)?__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports,__WEBPACK_AMD_DEFINE_ARRAY__):__WEBPACK_AMD_DEFINE_FACTORY__)&&(module.exports=__WEBPACK_AMD_DEFINE_RESULT__);}(function($,Inputmask){function maskSort(a,b){var maska=(a.mask||a).replace(/#/g,"9").replace(/\)/,"9").replace(/[+()#-]/g,""),maskb=(b.mask||b).replace(/#/g,"9").replace(/\)/,"9").replace(/[+()#-]/g,""),maskas=(a.mask||a).split("#")[0],maskbs=(b.mask||b).split("#")[0];return 0===maskbs.indexOf(maskas)?-1:0===maskas.indexOf(maskbs)?1:maska.localeCompare(maskb);}
var analyseMaskBase=Inputmask.prototype.analyseMask;return Inputmask.prototype.analyseMask=function(mask,regexMask,opts){function reduceVariations(masks,previousVariation,previousmaskGroup){previousVariation=previousVariation||"",previousmaskGroup=previousmaskGroup||maskGroups,""!==previousVariation&&(previousmaskGroup[previousVariation]={});for(var variation="",maskGroup=previousmaskGroup[previousVariation]||previousmaskGroup,i=masks.length-1;i>=0;i--)maskGroup[variation=(mask=masks[i].mask||masks[i]).substr(0,1)]=maskGroup[variation]||[],maskGroup[variation].unshift(mask.substr(1)),masks.splice(i,1);for(var ndx in maskGroup)maskGroup[ndx].length>500&&reduceVariations(maskGroup[ndx].slice(),ndx,maskGroup);}
function rebuild(maskGroup){var mask="",submasks=[];for(var ndx in maskGroup)$.isArray(maskGroup[ndx])?1===maskGroup[ndx].length?submasks.push(ndx+maskGroup[ndx]):submasks.push(ndx+opts.groupmarker.start+maskGroup[ndx].join(opts.groupmarker.end+opts.alternatormarker+opts.groupmarker.start)+opts.groupmarker.end):submasks.push(ndx+rebuild(maskGroup[ndx]));return 1===submasks.length?mask+=submasks[0]:mask+=opts.groupmarker.start+submasks.join(opts.groupmarker.end+opts.alternatormarker+opts.groupmarker.start)+opts.groupmarker.end,mask;}
var maskGroups={};return opts.phoneCodes&&(opts.phoneCodes&&opts.phoneCodes.length>1e3&&(reduceVariations((mask=mask.substr(1,mask.length-2)).split(opts.groupmarker.end+opts.alternatormarker+opts.groupmarker.start)),mask=rebuild(maskGroups)),mask=mask.replace(/9/g,"\\9")),analyseMaskBase.call(this,mask,regexMask,opts);},Inputmask.extendAliases({abstractphone:{groupmarker:{start:"<",end:">"},countrycode:"",phoneCodes:[],mask:function(opts){return opts.definitions={"#":Inputmask.prototype.definitions[9]},opts.phoneCodes.sort(maskSort);},keepStatic:!0,onBeforeMask:function(value,opts){var processedValue=value.replace(/^0{1,2}/,"").replace(/[\s]/g,"");return(processedValue.indexOf(opts.countrycode)>1||-1===processedValue.indexOf(opts.countrycode))&&(processedValue="+"+opts.countrycode+processedValue),processedValue;},onUnMask:function(maskedValue,unmaskedValue,opts){return maskedValue.replace(/[()#-]/g,"");},inputmode:"tel"}}),Inputmask;});},function(module,exports,__webpack_require__){"use strict";var __WEBPACK_AMD_DEFINE_FACTORY__,__WEBPACK_AMD_DEFINE_ARRAY__,__WEBPACK_AMD_DEFINE_RESULT__;"function"==typeof Symbol&&Symbol.iterator;!function(factory){__WEBPACK_AMD_DEFINE_ARRAY__=[__webpack_require__(0),__webpack_require__(1)],void 0!==(__WEBPACK_AMD_DEFINE_RESULT__="function"==typeof(__WEBPACK_AMD_DEFINE_FACTORY__=factory)?__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports,__WEBPACK_AMD_DEFINE_ARRAY__):__WEBPACK_AMD_DEFINE_FACTORY__)&&(module.exports=__WEBPACK_AMD_DEFINE_RESULT__);}(function($,Inputmask){return Inputmask.extendAliases({Regex:{mask:"r",greedy:!1,repeat:"*",regex:null,regexTokens:null,tokenizer:/\[\^?]?(?:[^\\\]]+|\\[\S\s]?)*]?|\\(?:0(?:[0-3][0-7]{0,2}|[4-7][0-7]?)?|[1-9][0-9]*|x[0-9A-Fa-f]{2}|u[0-9A-Fa-f]{4}|c[A-Za-z]|[\S\s]?)|\((?:\?[:=!]?)?|(?:[?*+]|\{[0-9]+(?:,[0-9]*)?\})\??|[^.?*+^${[()|\\]+|./g,quantifierFilter:/[0-9]+[^,]/,isComplete:function(buffer,opts){return new RegExp(opts.regex,opts.casing?"i":"").test(buffer.join(""));},definitions:{r:{validator:function(chrs,maskset,pos,strict,opts){function RegexToken(isGroup,isQuantifier){this.matches=[],this.isGroup=isGroup||!1,this.isQuantifier=isQuantifier||!1,this.quantifier={min:1,max:1},this.repeaterPart=void 0;}
function validateRegexToken(token,fromGroup){var isvalid=!1;fromGroup&&(regexPart+="(",openGroupCount++);for(var mndx=0;mndx<token.matches.length;mndx++){var matchToken=token.matches[mndx];if(!0===matchToken.isGroup)isvalid=validateRegexToken(matchToken,!0);else if(!0===matchToken.isQuantifier){var crrntndx=$.inArray(matchToken,token.matches),matchGroup=token.matches[crrntndx-1],regexPartBak=regexPart;if(isNaN(matchToken.quantifier.max)){for(;matchToken.repeaterPart&&matchToken.repeaterPart!==regexPart&&matchToken.repeaterPart.length>regexPart.length&&!(isvalid=validateRegexToken(matchGroup,!0)););(isvalid=isvalid||validateRegexToken(matchGroup,!0))&&(matchToken.repeaterPart=regexPart),regexPart=regexPartBak+matchToken.quantifier.max;}else{for(var i=0,qm=matchToken.quantifier.max-1;i<qm&&!(isvalid=validateRegexToken(matchGroup,!0));i++);regexPart=regexPartBak+"{"+matchToken.quantifier.min+","+matchToken.quantifier.max+"}";}}else if(void 0!==matchToken.matches)for(var k=0;k<matchToken.length&&!(isvalid=validateRegexToken(matchToken[k],fromGroup));k++);else{var testExp;if("["==matchToken.charAt(0)){testExp=regexPart,testExp+=matchToken;for(j=0;j<openGroupCount;j++)testExp+=")";isvalid=(exp=new RegExp("^("+testExp+")$",opts.casing?"i":"")).test(bufferStr);}else for(var l=0,tl=matchToken.length;l<tl;l++)if("\\"!==matchToken.charAt(l)){testExp=regexPart,testExp=(testExp+=matchToken.substr(0,l+1)).replace(/\|$/,"");for(var j=0;j<openGroupCount;j++)testExp+=")";var exp=new RegExp("^("+testExp+")$",opts.casing?"i":"");if(isvalid=exp.test(bufferStr))break;}
regexPart+=matchToken;}
if(isvalid)break;}
return fromGroup&&(regexPart+=")",openGroupCount--),isvalid;}
var bufferStr,groupToken,cbuffer=maskset.buffer.slice(),regexPart="",isValid=!1,openGroupCount=0;null===opts.regexTokens&&function(){var match,m,currentToken=new RegexToken(),opengroups=[];for(opts.regexTokens=[];match=opts.tokenizer.exec(opts.regex);)switch((m=match[0]).charAt(0)){case"(":opengroups.push(new RegexToken(!0));break;case")":groupToken=opengroups.pop(),opengroups.length>0?opengroups[opengroups.length-1].matches.push(groupToken):currentToken.matches.push(groupToken);break;case"{":case"+":case"*":var quantifierToken=new RegexToken(!1,!0),mq=(m=m.replace(/[{}]/g,"")).split(","),mq0=isNaN(mq[0])?mq[0]:parseInt(mq[0]),mq1=1===mq.length?mq0:isNaN(mq[1])?mq[1]:parseInt(mq[1]);if(quantifierToken.quantifier={min:mq0,max:mq1},opengroups.length>0){var matches=opengroups[opengroups.length-1].matches;(match=matches.pop()).isGroup||((groupToken=new RegexToken(!0)).matches.push(match),match=groupToken),matches.push(match),matches.push(quantifierToken);}else(match=currentToken.matches.pop()).isGroup||((groupToken=new RegexToken(!0)).matches.push(match),match=groupToken),currentToken.matches.push(match),currentToken.matches.push(quantifierToken);break;default:opengroups.length>0?opengroups[opengroups.length-1].matches.push(m):currentToken.matches.push(m);}
currentToken.matches.length>0&&opts.regexTokens.push(currentToken);}(),cbuffer.splice(pos,0,chrs),bufferStr=cbuffer.join("");for(var i=0;i<opts.regexTokens.length;i++){var regexToken=opts.regexTokens[i];if(isValid=validateRegexToken(regexToken,regexToken.isGroup))break;}
return isValid;},cardinality:1}}}}),Inputmask;});},function(module,exports,__webpack_require__){"use strict";var __WEBPACK_AMD_DEFINE_FACTORY__,__WEBPACK_AMD_DEFINE_ARRAY__,__WEBPACK_AMD_DEFINE_RESULT__,_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(obj){return typeof obj;}:function(obj){return obj&&"function"==typeof Symbol&&obj.constructor===Symbol&&obj!==Symbol.prototype?"symbol":typeof obj;};!function(factory){__WEBPACK_AMD_DEFINE_ARRAY__=[__webpack_require__(2),__webpack_require__(1)],void 0!==(__WEBPACK_AMD_DEFINE_RESULT__="function"==typeof(__WEBPACK_AMD_DEFINE_FACTORY__=factory)?__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports,__WEBPACK_AMD_DEFINE_ARRAY__):__WEBPACK_AMD_DEFINE_FACTORY__)&&(module.exports=__WEBPACK_AMD_DEFINE_RESULT__);}(function($,Inputmask){return void 0===$.fn.inputmask&&($.fn.inputmask=function(fn,options){var nptmask,input=this[0];if(void 0===options&&(options={}),"string"==typeof fn)switch(fn){case"unmaskedvalue":return input&&input.inputmask?input.inputmask.unmaskedvalue():$(input).val();case"remove":return this.each(function(){this.inputmask&&this.inputmask.remove();});case"getemptymask":return input&&input.inputmask?input.inputmask.getemptymask():"";case"hasMaskedValue":return!(!input||!input.inputmask)&&input.inputmask.hasMaskedValue();case"isComplete":return!input||!input.inputmask||input.inputmask.isComplete();case"getmetadata":return input&&input.inputmask?input.inputmask.getmetadata():void 0;case"setvalue":$(input).val(options),input&&void 0===input.inputmask&&$(input).triggerHandler("setvalue");break;case"option":if("string"!=typeof options)return this.each(function(){if(void 0!==this.inputmask)return this.inputmask.option(options);});if(input&&void 0!==input.inputmask)return input.inputmask.option(options);break;default:return options.alias=fn,nptmask=new Inputmask(options),this.each(function(){nptmask.mask(this);});}else{if("object"==(void 0===fn?"undefined":_typeof(fn)))return nptmask=new Inputmask(fn),void 0===fn.mask&&void 0===fn.alias?this.each(function(){if(void 0!==this.inputmask)return this.inputmask.option(fn);nptmask.mask(this);}):this.each(function(){nptmask.mask(this);});if(void 0===fn)return this.each(function(){(nptmask=new Inputmask(options)).mask(this);});}}),$.fn.inputmask;});}]);;(function($){$.fn.yiiActiveForm=function(method){if(methods[method]){return methods[method].apply(this,Array.prototype.slice.call(arguments,1));}else if(typeof method==='object'||!method){return methods.init.apply(this,arguments);}else{$.error('Method '+method+' does not exist on jQuery.yiiActiveForm');return false;}};var events={beforeValidate:'beforeValidate',afterValidate:'afterValidate',beforeValidateAttribute:'beforeValidateAttribute',afterValidateAttribute:'afterValidateAttribute',beforeSubmit:'beforeSubmit',ajaxBeforeSend:'ajaxBeforeSend',ajaxComplete:'ajaxComplete',afterInit:'afterInit'};var defaults={encodeErrorSummary:true,errorSummary:'.error-summary',validateOnSubmit:true,errorCssClass:'has-error',successCssClass:'has-success',validatingCssClass:'validating',ajaxParam:'ajax',ajaxDataType:'json',validationUrl:undefined,scrollToError:true,scrollToErrorOffset:0,validationStateOn:'container'};var attributeDefaults={id:undefined,name:undefined,container:undefined,input:undefined,error:'.help-block',encodeError:true,validateOnChange:true,validateOnBlur:true,validateOnType:false,validationDelay:500,enableAjaxValidation:false,validate:undefined,status:0,cancelled:false,value:undefined,updateAriaInvalid:true};var submitDefer;var setSubmitFinalizeDefer=function($form){submitDefer=$.Deferred();$form.data('yiiSubmitFinalizePromise',submitDefer.promise());};var submitFinalize=function($form){if(submitDefer){submitDefer.resolve();submitDefer=undefined;$form.removeData('yiiSubmitFinalizePromise');}};var methods={init:function(attributes,options){return this.each(function(){var $form=$(this);if($form.data('yiiActiveForm')){return;}
var settings=$.extend({},defaults,options||{});if(settings.validationUrl===undefined){settings.validationUrl=$form.attr('action');}
$.each(attributes,function(i){attributes[i]=$.extend({value:getValue($form,this)},attributeDefaults,this);watchAttribute($form,attributes[i]);});$form.data('yiiActiveForm',{settings:settings,attributes:attributes,submitting:false,validated:false,options:getFormOptions($form)});$form.on('reset.yiiActiveForm',methods.resetForm);if(settings.validateOnSubmit){$form.on('mouseup.yiiActiveForm keyup.yiiActiveForm',':submit',function(){$form.data('yiiActiveForm').submitObject=$(this);});$form.on('submit.yiiActiveForm',methods.submitForm);}
var event=$.Event(events.afterInit);$form.trigger(event);});},add:function(attribute){var $form=$(this);attribute=$.extend({value:getValue($form,attribute)},attributeDefaults,attribute);$form.data('yiiActiveForm').attributes.push(attribute);watchAttribute($form,attribute);},remove:function(id){var $form=$(this),attributes=$form.data('yiiActiveForm').attributes,index=-1,attribute=undefined;$.each(attributes,function(i){if(attributes[i]['id']==id){index=i;attribute=attributes[i];return false;}});if(index>=0){attributes.splice(index,1);unwatchAttribute($form,attribute);}
return attribute;},validateAttribute:function(id){var attribute=methods.find.call(this,id);if(attribute!=undefined){validateAttribute($(this),attribute,true);}},find:function(id){var attributes=$(this).data('yiiActiveForm').attributes,result=undefined;$.each(attributes,function(i){if(attributes[i]['id']==id){result=attributes[i];return false;}});return result;},destroy:function(){return this.each(function(){$(this).off('.yiiActiveForm');$(this).removeData('yiiActiveForm');});},data:function(){return this.data('yiiActiveForm');},validate:function(forceValidate){if(forceValidate){$(this).data('yiiActiveForm').submitting=true;}
var $form=$(this),data=$form.data('yiiActiveForm'),needAjaxValidation=false,messages={},deferreds=deferredArray(),submitting=data.submitting;if(submitting){var event=$.Event(events.beforeValidate);$form.trigger(event,[messages,deferreds]);if(event.result===false){data.submitting=false;submitFinalize($form);return;}}
$.each(data.attributes,function(){this.$form=$form;var $input=findInput($form,this);if($input.is(":disabled")){return true;}
if($input.length&&$input[0].tagName.toLowerCase()==='select'){if(!$input[0].options.length){return true;}else if(($input[0].options.length===1)&&($input[0].options[0].value==='')){return true;}}
this.cancelled=false;if(data.submitting||this.status===2||this.status===3){var msg=messages[this.id];if(msg===undefined){msg=[];messages[this.id]=msg;}
var event=$.Event(events.beforeValidateAttribute);$form.trigger(event,[this,msg,deferreds]);if(event.result!==false){if(this.validate){this.validate(this,getValue($form,this),msg,deferreds,$form);}
if(this.enableAjaxValidation){needAjaxValidation=true;}}else{this.cancelled=true;}}});$.when.apply(this,deferreds).always(function(){for(var i in messages){if(0===messages[i].length){delete messages[i];}}
if(needAjaxValidation&&($.isEmptyObject(messages)||data.submitting)){var $button=data.submitObject,extData='&'+data.settings.ajaxParam+'='+$form.attr('id');if($button&&$button.length&&$button.attr('name')){extData+='&'+$button.attr('name')+'='+$button.attr('value');}
$.ajax({url:data.settings.validationUrl,type:$form.attr('method'),data:$form.serialize()+extData,dataType:data.settings.ajaxDataType,complete:function(jqXHR,textStatus){$form.trigger(events.ajaxComplete,[jqXHR,textStatus]);},beforeSend:function(jqXHR,settings){$form.trigger(events.ajaxBeforeSend,[jqXHR,settings]);},success:function(msgs){if(msgs!==null&&typeof msgs==='object'){$.each(data.attributes,function(){if(!this.enableAjaxValidation||this.cancelled){delete msgs[this.id];}});updateInputs($form,$.extend(messages,msgs),submitting);}else{updateInputs($form,messages,submitting);}},error:function(){data.submitting=false;submitFinalize($form);}});}else if(data.submitting){window.setTimeout(function(){updateInputs($form,messages,submitting);},200);}else{updateInputs($form,messages,submitting);}});},submitForm:function(){var $form=$(this),data=$form.data('yiiActiveForm');if(data.validated){data.submitting=false;var event=$.Event(events.beforeSubmit);$form.trigger(event);if(event.result===false){data.validated=false;submitFinalize($form);return false;}
updateHiddenButton($form);return true;}else{setSubmitFinalizeDefer($form);if(data.settings.timer!==undefined){clearTimeout(data.settings.timer);}
data.submitting=true;methods.validate.call($form);return false;}},resetForm:function(){var $form=$(this);var data=$form.data('yiiActiveForm');window.setTimeout(function(){$.each(data.attributes,function(){this.value=getValue($form,this);this.status=0;var $container=$form.find(this.container),$input=findInput($form,this),$errorElement=data.settings.validationStateOn==='input'?$input:$container;$errorElement.removeClass(data.settings.validatingCssClass+' '+
data.settings.errorCssClass+' '+
data.settings.successCssClass);$container.find(this.error).html('');});$form.find(data.settings.errorSummary).hide().find('ul').html('');},1);},updateMessages:function(messages,summary){var $form=$(this);var data=$form.data('yiiActiveForm');$.each(data.attributes,function(){updateInput($form,this,messages);});if(summary){updateSummary($form,messages);}},updateAttribute:function(id,messages){var attribute=methods.find.call(this,id);if(attribute!=undefined){var msg={};msg[id]=messages;updateInput($(this),attribute,msg);}}};var watchAttribute=function($form,attribute){var $input=findInput($form,attribute);if(attribute.validateOnChange){$input.on('change.yiiActiveForm',function(){validateAttribute($form,attribute,false);});}
if(attribute.validateOnBlur){$input.on('blur.yiiActiveForm',function(){if(attribute.status==0||attribute.status==1){validateAttribute($form,attribute,true);}});}
if(attribute.validateOnType){$input.on('keyup.yiiActiveForm',function(e){if($.inArray(e.which,[16,17,18,37,38,39,40])!==-1){return;}
if(attribute.value!==getValue($form,attribute)){validateAttribute($form,attribute,false,attribute.validationDelay);}});}};var unwatchAttribute=function($form,attribute){findInput($form,attribute).off('.yiiActiveForm');};var validateAttribute=function($form,attribute,forceValidate,validationDelay){var data=$form.data('yiiActiveForm');if(forceValidate){attribute.status=2;}
$.each(data.attributes,function(){if(!isEqual(this.value,getValue($form,this))){this.status=2;forceValidate=true;}});if(!forceValidate){return;}
if(data.settings.timer!==undefined){clearTimeout(data.settings.timer);}
data.settings.timer=window.setTimeout(function(){if(data.submitting||$form.is(':hidden')){return;}
$.each(data.attributes,function(){if(this.status===2){this.status=3;$form.find(this.container).addClass(data.settings.validatingCssClass);}});methods.validate.call($form);},validationDelay?validationDelay:200);};var isEqual=function(val1,val2){if(val1 instanceof Object){return isObjectsEqual(val1,val2)}
if(Array.isArray(val1)){return isArraysEqual(val1,val2);}
return val1===val2;};var isObjectsEqual=function(obj1,obj2){if(!(obj1 instanceof Object)||!(obj2 instanceof Object)){return false;}
var keys1=Object.keys(obj1);var keys2=Object.keys(obj2);if(keys1.length!==keys2.length){return false;}
for(var i=0;i<keys1.length;i+=1){if(!obj2.hasOwnProperty(keys1[i])){return false;}
if(obj1[keys1[i]]!==obj2[keys1[i]]){return false;}}
return true;};var isArraysEqual=function(arr1,arr2){if(!Array.isArray(arr1)||!Array.isArray(arr2)){return false;}
if(arr1.length!==arr2.length){return false;}
for(var i=0;i<arr1.length;i+=1){if(arr1[i]!==arr2[i]){return false;}}
return true;};var deferredArray=function(){var array=[];array.add=function(callback){this.push(new $.Deferred(callback));};return array;};var buttonOptions=['action','target','method','enctype'];var getFormOptions=function($form){var attributes={};for(var i=0;i<buttonOptions.length;i++){attributes[buttonOptions[i]]=$form.attr(buttonOptions[i]);}
return attributes;};var applyButtonOptions=function($form,$button){for(var i=0;i<buttonOptions.length;i++){var value=$button.attr('form'+buttonOptions[i]);if(value){$form.attr(buttonOptions[i],value);}}};var restoreButtonOptions=function($form){var data=$form.data('yiiActiveForm');for(var i=0;i<buttonOptions.length;i++){$form.attr(buttonOptions[i],data.options[buttonOptions[i]]||null);}};var updateInputs=function($form,messages,submitting){var data=$form.data('yiiActiveForm');if(data===undefined){return false;}
var errorAttributes=[],$input;$.each(data.attributes,function(){var hasError=(submitting&&updateInput($form,this,messages))||(!submitting&&attrHasError($form,this,messages));$input=findInput($form,this);if(!$input.is(":disabled")&&!this.cancelled&&hasError){errorAttributes.push(this);}});$form.trigger(events.afterValidate,[messages,errorAttributes]);if(submitting){updateSummary($form,messages);if(errorAttributes.length){if(data.settings.scrollToError){var top=$form.find($.map(errorAttributes,function(attribute){return attribute.input;}).join(',')).first().closest(':visible').offset().top-data.settings.scrollToErrorOffset;if(top<0){top=0;}else if(top>$(document).height()){top=$(document).height();}
var wtop=$(window).scrollTop();if(top<wtop||top>wtop+$(window).height()){$(window).scrollTop(top);}}
data.submitting=false;}else{data.validated=true;if(data.submitObject){applyButtonOptions($form,data.submitObject);}
$form.submit();if(data.submitObject){restoreButtonOptions($form);}}}else{$.each(data.attributes,function(){if(!this.cancelled&&(this.status===2||this.status===3)){updateInput($form,this,messages);}});}
submitFinalize($form);};var updateHiddenButton=function($form){var data=$form.data('yiiActiveForm');var $button=data.submitObject||$form.find(':submit:first');if($button.length&&$button.attr('type')=='submit'&&$button.attr('name')){var $hiddenButton=$('input[type="hidden"][name="'+$button.attr('name')+'"]',$form);if(!$hiddenButton.length){$('<input>').attr({type:'hidden',name:$button.attr('name'),value:$button.attr('value')}).appendTo($form);}else{$hiddenButton.attr('value',$button.attr('value'));}}};var updateInput=function($form,attribute,messages){var data=$form.data('yiiActiveForm'),$input=findInput($form,attribute),hasError=attrHasError($form,attribute,messages);if(!$.isArray(messages[attribute.id])){messages[attribute.id]=[];}
attribute.status=1;if($input.length){var $container=$form.find(attribute.container);var $error=$container.find(attribute.error);updateAriaInvalid($form,attribute,hasError);var $errorElement=data.settings.validationStateOn==='input'?$input:$container;if(hasError){if(attribute.encodeError){$error.text(messages[attribute.id][0]);}else{$error.html(messages[attribute.id][0]);}
$errorElement.removeClass(data.settings.validatingCssClass+' '+data.settings.successCssClass).addClass(data.settings.errorCssClass);}else{$error.empty();$errorElement.removeClass(data.settings.validatingCssClass+' '+data.settings.errorCssClass+' ').addClass(data.settings.successCssClass);}
attribute.value=getValue($form,attribute);}
$form.trigger(events.afterValidateAttribute,[attribute,messages[attribute.id]]);return hasError;};var attrHasError=function($form,attribute,messages){var $input=findInput($form,attribute),hasError=false;if(!$.isArray(messages[attribute.id])){messages[attribute.id]=[];}
if($input.length){hasError=messages[attribute.id].length>0;}
return hasError;};var updateSummary=function($form,messages){var data=$form.data('yiiActiveForm'),$summary=$form.find(data.settings.errorSummary),$ul=$summary.find('ul').empty();if($summary.length&&messages){$.each(data.attributes,function(){if($.isArray(messages[this.id])&&messages[this.id].length){var error=$('<li/>');if(data.settings.encodeErrorSummary){error.text(messages[this.id][0]);}else{error.html(messages[this.id][0]);}
$ul.append(error);}});$summary.toggle($ul.find('li').length>0);}};var getValue=function($form,attribute){var $input=findInput($form,attribute);var type=$input.attr('type');if(type==='checkbox'||type==='radio'){var $realInput=$input.filter(':checked');if($realInput.length>1){var values=[];$realInput.each(function(index){values.push($($realInput.get(index)).val());});return values;}
if(!$realInput.length){$realInput=$form.find('input[type=hidden][name="'+$input.attr('name')+'"]');}
return $realInput.val();}else{return $input.val();}};var findInput=function($form,attribute){var $input=$form.find(attribute.input);if($input.length&&$input[0].tagName.toLowerCase()==='div'){return $input.find('input');}else{return $input;}};var updateAriaInvalid=function($form,attribute,hasError){if(attribute.updateAriaInvalid){$form.find(attribute.input).attr('aria-invalid',hasError?'true':'false');}}})(window.jQuery);;
/*!
 * Copyright 2012, Chris Wanstrath
 * Released under the MIT License
 * https://github.com/defunkt/jquery-pjax
 */
(function($){function fnPjax(selector,container,options){options=optionsFor(container,options)
var handler=function(event){var opts=options
if(!opts.container){opts=$.extend({history:true},options)
opts.container=$(this).attr('data-pjax')}
handleClick(event,opts)}
$(selector).removeClass('data-pjax');return this.off('click.pjax',selector,handler).on('click.pjax',selector,handler);}
function handleClick(event,container,options){options=optionsFor(container,options)
var link=event.currentTarget
var $link=$(link)
if(parseInt($link.data('pjax'))===0){return}
if(link.tagName.toUpperCase()!=='A')
throw"$.fn.pjax or $.pjax.click requires an anchor element"
if(event.which>1||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)
return
if(location.protocol!==link.protocol||location.hostname!==link.hostname)
return
if(link.href.indexOf('#')>-1&&stripHash(link)==stripHash(location))
return
if(event.isDefaultPrevented())
return
var defaults={url:link.href,container:$link.attr('data-pjax'),target:link}
var opts=$.extend({},defaults,options)
var clickEvent=$.Event('pjax:click')
$link.trigger(clickEvent,[opts])
if(!clickEvent.isDefaultPrevented()){pjax(opts)
event.preventDefault()
$link.trigger('pjax:clicked',[opts])}}
function handleSubmit(event,container,options){if(event.result===false)
return false;options=optionsFor(container,options)
var form=event.currentTarget
var $form=$(form)
if(form.tagName.toUpperCase()!=='FORM')
throw"$.pjax.submit requires a form element"
var defaults={type:($form.attr('method')||'GET').toUpperCase(),url:$form.attr('action'),container:$form.attr('data-pjax'),target:form}
if(defaults.type!=='GET'&&window.FormData!==undefined){defaults.data=new FormData(form)
defaults.processData=false
defaults.contentType=false}else{if($form.find(':file').length){return}
defaults.data=$form.serializeArray()}
pjax($.extend({},defaults,options))
event.preventDefault()}
function pjax(options){options=$.extend(true,{},$.ajaxSettings,pjax.defaults,options)
if($.isFunction(options.url)){options.url=options.url()}
var hash=parseURL(options.url).hash
var containerType=$.type(options.container)
if(containerType!=='string'){throw"expected string value for 'container' option; got "+containerType}
var context=options.context=$(options.container)
if(!context.length){throw"the container selector '"+options.container+"' did not match anything"}
if(!options.data)options.data={}
if($.isArray(options.data)){options.data=$.grep(options.data,function(obj){return'_pjax'!==obj.name})
options.data.push({name:'_pjax',value:options.container})}else{options.data._pjax=options.container}
function fire(type,args,props){if(!props)props={}
props.relatedTarget=options.target
var event=$.Event(type,props)
context.trigger(event,args)
return!event.isDefaultPrevented()}
var timeoutTimer
options.beforeSend=function(xhr,settings){if(settings.type!=='GET'){settings.timeout=0}
xhr.setRequestHeader('X-PJAX','true')
xhr.setRequestHeader('X-PJAX-Container',options.container)
if(settings.ieRedirectCompatibility){var ua=window.navigator.userAgent
if(ua.indexOf('MSIE ')>0||ua.indexOf('Trident/')>0||ua.indexOf('Edge/')>0){xhr.setRequestHeader('X-Ie-Redirect-Compatibility','true')}}
if(!fire('pjax:beforeSend',[xhr,settings]))
return false
if(settings.timeout>0){timeoutTimer=setTimeout(function(){if(fire('pjax:timeout',[xhr,options]))
xhr.abort('timeout')},settings.timeout)
settings.timeout=0}
var url=parseURL(settings.url)
if(hash)url.hash=hash
options.requestUrl=stripInternalParams(url)}
options.complete=function(xhr,textStatus){if(timeoutTimer)
clearTimeout(timeoutTimer)
fire('pjax:complete',[xhr,textStatus,options])
fire('pjax:end',[xhr,options])}
options.error=function(xhr,textStatus,errorThrown){var container=extractContainer("",xhr,options)
var redirect=xhr.status>=301&&xhr.status<=303
var allowed=redirect||fire('pjax:error',[xhr,textStatus,errorThrown,options])
if(redirect||options.type=='GET'&&textStatus!=='abort'&&allowed){if(options.replaceRedirect){locationReplace(container.url)}else if(options.pushRedirect){window.history.pushState(null,"",container.url)
window.location.replace(container.url)}}}
options.success=function(data,status,xhr){var previousState=pjax.state
var currentVersion=typeof $.pjax.defaults.version==='function'?$.pjax.defaults.version():$.pjax.defaults.version
var latestVersion=xhr.getResponseHeader('X-PJAX-Version')
var container=extractContainer(data,xhr,options)
var url=parseURL(container.url)
if(hash){url.hash=hash
container.url=url.href}
if(currentVersion&&latestVersion&&currentVersion!==latestVersion){locationReplace(container.url)
return}
if(!container.contents){locationReplace(container.url)
return}
pjax.state={id:options.id||uniqueId(),url:container.url,title:container.title,container:options.container,fragment:options.fragment,timeout:options.timeout,cache:options.cache}
if(options.history&&(options.push||options.replace)){window.history.replaceState(pjax.state,container.title,container.url)}
var blurFocus=$.contains(context,document.activeElement)
if(blurFocus){try{document.activeElement.blur()}catch(e){}}
if(container.title)document.title=container.title
fire('pjax:beforeReplace',[container.contents,options],{state:pjax.state,previousState:previousState})
context.html(container.contents)
var autofocusEl=context.find('input[autofocus], textarea[autofocus]').last()[0]
if(autofocusEl&&document.activeElement!==autofocusEl){autofocusEl.focus()}
executeScriptTags(container.scripts,context)
loadLinkTags(container.links)
if(typeof options.scrollTo==='function'){var scrollTo=options.scrollTo(context,hash)}else{var scrollTo=options.scrollTo
if(hash||true===scrollTo){var name=decodeURIComponent(hash.slice(1))
var target=true===scrollTo?context:(document.getElementById(name)||document.getElementsByName(name)[0])
if(target)scrollTo=$(target).offset().top}}
if(typeof options.scrollOffset==='function')
var scrollOffset=options.scrollOffset(scrollTo)
else
var scrollOffset=options.scrollOffset
if(typeof scrollTo==='number'){scrollTo=scrollTo+scrollOffset;if(scrollTo<0)scrollTo=0
$(window).scrollTop(scrollTo)}
fire('pjax:success',[data,status,xhr,options])}
if(!pjax.state){pjax.state={id:uniqueId(),url:window.location.href,title:document.title,container:options.container,fragment:options.fragment,timeout:options.timeout,cache:options.cache}
if(options.history)
window.history.replaceState(pjax.state,document.title)}
if(pjax.xhr&&pjax.xhr.readyState<4&&pjax.options.skipOuterContainers){return}
abortXHR(pjax.xhr)
pjax.options=options
var xhr=pjax.xhr=$.ajax(options)
if(xhr.readyState>0){if(options.history&&(options.push&&!options.replace)){cachePush(pjax.state.id,[options.container,cloneContents(context)])
window.history.pushState(null,"",options.requestUrl)}
fire('pjax:start',[xhr,options])
fire('pjax:send',[xhr,options])}
return pjax.xhr}
function pjaxReload(container,options){var defaults={url:window.location.href,push:false,replace:true,scrollTo:false}
return pjax($.extend(defaults,optionsFor(container,options)))}
function locationReplace(url){if(!pjax.options.history)return
window.history.replaceState(null,"",pjax.state.url)
window.location.replace(url)}
var initialPop=true
var initialURL=window.location.href
var initialState=window.history.state
if(initialState&&initialState.container){pjax.state=initialState}
if('state'in window.history){initialPop=false}
function onPjaxPopstate(event){if(!initialPop){abortXHR(pjax.xhr)}
var previousState=pjax.state
var state=event.state
var direction
if(state&&state.container){if(initialPop&&initialURL==state.url)return
if(previousState){if(previousState.id===state.id)return
direction=previousState.id<state.id?'forward':'back'}
var cache=cacheMapping[state.id]||[]
var containerSelector=cache[0]||state.container
var container=$(containerSelector),contents=cache[1]
if(container.length){var options={id:state.id,url:state.url,container:containerSelector,push:false,fragment:state.fragment,timeout:state.timeout,cache:state.cache,scrollTo:false}
if(previousState&&options.cache){cachePop(direction,previousState.id,[containerSelector,cloneContents(container)])}
var popstateEvent=$.Event('pjax:popstate',{state:state,direction:direction})
container.trigger(popstateEvent)
if(contents){container.trigger('pjax:start',[null,options])
pjax.state=state
if(state.title)document.title=state.title
var beforeReplaceEvent=$.Event('pjax:beforeReplace',{state:state,previousState:previousState})
container.trigger(beforeReplaceEvent,[contents,options])
container.html(contents)
container.trigger('pjax:end',[null,options])}else{pjax(options)}
container[0].offsetHeight}else{locationReplace(location.href)}}
initialPop=false}
function fallbackPjax(options){var url=$.isFunction(options.url)?options.url():options.url,method=options.type?options.type.toUpperCase():'GET'
var form=$('<form>',{method:method==='GET'?'GET':'POST',action:url,style:'display:none'})
if(method!=='GET'&&method!=='POST'){form.append($('<input>',{type:'hidden',name:'_method',value:method.toLowerCase()}))}
var data=options.data
if(typeof data==='string'){$.each(data.split('&'),function(index,value){var pair=value.split('=')
form.append($('<input>',{type:'hidden',name:pair[0],value:pair[1]}))})}else if($.isArray(data)){$.each(data,function(index,value){form.append($('<input>',{type:'hidden',name:value.name,value:value.value}))})}else if(typeof data==='object'){var key
for(key in data)
form.append($('<input>',{type:'hidden',name:key,value:data[key]}))}
$(document.body).append(form)
form.submit()}
function abortXHR(xhr){if(xhr&&xhr.readyState<4){xhr.onreadystatechange=$.noop
xhr.abort()}}
function uniqueId(){return(new Date).getTime()}
function cloneContents(container){var cloned=container.clone()
cloned.find('script').each(function(){if(!this.src)$._data(this,'globalEval',false)})
return cloned.contents()}
function stripInternalParams(url){url.search=url.search.replace(/([?&])(_pjax|_)=[^&]*/g,'').replace(/^&/,'')
return url.href.replace(/\?($|#)/,'$1')}
function parseURL(url){var a=document.createElement('a')
a.href=url
return a}
function stripHash(location){return location.href.replace(/#.*/,'')}
function optionsFor(container,options){if(container&&options){options=$.extend({},options)
options.container=container
return options}else if($.isPlainObject(container)){return container}else{return{container:container}}}
function findAll(elems,selector){return elems.filter(selector).add(elems.find(selector))}
function parseHTML(html){return $.parseHTML(html,document,true)}
function extractContainer(data,xhr,options){var obj={},fullDocument=/<html/i.test(data)
var serverUrl=xhr.getResponseHeader('X-PJAX-URL')
obj.url=serverUrl?stripInternalParams(parseURL(serverUrl)):options.requestUrl
var $head,$body
if(fullDocument){$body=$(parseHTML(data.match(/<body[^>]*>([\s\S.]*)<\/body>/i)[0]))
var head=data.match(/<head[^>]*>([\s\S.]*)<\/head>/i)
$head=head!=null?$(parseHTML(head[0])):$body}else{$head=$body=$(parseHTML(data))}
if($body.length===0)
return obj
obj.title=findAll($head,'title').last().text()
if(options.fragment){var $fragment=$body
if(options.fragment!=='body'){$fragment=findAll($fragment,options.fragment).first()}
if($fragment.length){obj.contents=options.fragment==='body'?$fragment:$fragment.contents()
if(!obj.title)
obj.title=$fragment.attr('title')||$fragment.data('title')}}else if(!fullDocument){obj.contents=$body}
if(obj.contents){obj.contents=obj.contents.not(function(){return $(this).is('title')})
obj.contents.find('title').remove()
obj.scripts=findAll(obj.contents,'script').remove()
obj.contents=obj.contents.not(obj.scripts)
obj.links=findAll(obj.contents,'link[href]').remove()
obj.contents=obj.contents.not(obj.links)}
if(obj.title)obj.title=$.trim(obj.title)
return obj}
function executeScriptTags(scripts,context){if(!scripts)return
var existingScripts=$('script[src]')
var cb=function(next){var src=this.src
var matchedScripts=existingScripts.filter(function(){return this.src===src})
if(matchedScripts.length){next()
return}
if(src){$.getScript(src).done(next).fail(next)
document.head.appendChild(this)}else{context.append(this)
next()}}
var i=0
var next=function(){if(i>=scripts.length){return}
var script=scripts[i]
i++
cb.call(script,next)}
next()}
function loadLinkTags(links){if(!links)return
var existingLinks=$('link[href]')
links.each(function(){var href=this.href,alreadyLoadedLinks=existingLinks.filter(function(){return this.href===href})
if(alreadyLoadedLinks.length)return
document.head.appendChild(this)})}
var cacheMapping={}
var cacheForwardStack=[]
var cacheBackStack=[]
function cachePush(id,value){if(!pjax.options.cache){return}
cacheMapping[id]=value
cacheBackStack.push(id)
trimCacheStack(cacheForwardStack,0)
trimCacheStack(cacheBackStack,pjax.defaults.maxCacheLength)}
function cachePop(direction,id,value){var pushStack,popStack
cacheMapping[id]=value
if(direction==='forward'){pushStack=cacheBackStack
popStack=cacheForwardStack}else{pushStack=cacheForwardStack
popStack=cacheBackStack}
pushStack.push(id)
id=popStack.pop()
if(id)delete cacheMapping[id]
trimCacheStack(pushStack,pjax.defaults.maxCacheLength)}
function trimCacheStack(stack,length){while(stack.length>length)
delete cacheMapping[stack.shift()]}
function findVersion(){return $('meta').filter(function(){var name=$(this).attr('http-equiv')
return name&&name.toUpperCase()==='X-PJAX-VERSION'}).attr('content')}
function enable(){$.fn.pjax=fnPjax
$.pjax=pjax
$.pjax.enable=$.noop
$.pjax.disable=disable
$.pjax.click=handleClick
$.pjax.submit=handleSubmit
$.pjax.reload=pjaxReload
$.pjax.defaults={history:true,cache:true,timeout:650,push:true,replace:false,type:'GET',dataType:'html',scrollTo:0,scrollOffset:0,maxCacheLength:20,version:findVersion,pushRedirect:false,replaceRedirect:true,skipOuterContainers:false,ieRedirectCompatibility:true}
$(window).on('popstate.pjax',onPjaxPopstate)}
function disable(){$.fn.pjax=function(){return this}
$.pjax=fallbackPjax
$.pjax.enable=enable
$.pjax.disable=$.noop
$.pjax.click=$.noop
$.pjax.submit=$.noop
$.pjax.reload=function(){window.location.reload()}
$(window).off('popstate.pjax',onPjaxPopstate)}
if($.event.props&&$.inArray('state',$.event.props)<0){$.event.props.push('state')}else if(!('state'in $.Event.prototype)){$.event.addProp('state')}
$.support.pjax=window.history&&window.history.pushState&&window.history.replaceState&&!navigator.userAgent.match(/((iPod|iPhone|iPad).+\bOS\s+[1-4]\D|WebApps\/.+CFNetwork)/)
if($.support.pjax){enable()}else{disable()}})(jQuery);;
/*!
 * Bootstrap v3.4.1 (https://getbootstrap.com/)
 * Copyright 2011-2019 Twitter, Inc.
 * Licensed under the MIT license
 */
if(typeof jQuery==='undefined'){throw new Error('Bootstrap\'s JavaScript requires jQuery')}
+function($){'use strict';var version=$.fn.jquery.split(' ')[0].split('.')
if((version[0]<2&&version[1]<9)||(version[0]==1&&version[1]==9&&version[2]<1)||(version[0]>3)){throw new Error('Bootstrap\'s JavaScript requires jQuery version 1.9.1 or higher, but lower than version 4')}}(jQuery);+function($){'use strict';function transitionEnd(){var el=document.createElement('bootstrap')
var transEndEventNames={WebkitTransition:'webkitTransitionEnd',MozTransition:'transitionend',OTransition:'oTransitionEnd otransitionend',transition:'transitionend'}
for(var name in transEndEventNames){if(el.style[name]!==undefined){return{end:transEndEventNames[name]}}}
return false}
$.fn.emulateTransitionEnd=function(duration){var called=false
var $el=this
$(this).one('bsTransitionEnd',function(){called=true})
var callback=function(){if(!called)$($el).trigger($.support.transition.end)}
setTimeout(callback,duration)
return this}
$(function(){$.support.transition=transitionEnd()
if(!$.support.transition)return
$.event.special.bsTransitionEnd={bindType:$.support.transition.end,delegateType:$.support.transition.end,handle:function(e){if($(e.target).is(this))return e.handleObj.handler.apply(this,arguments)}}})}(jQuery);+function($){'use strict';var dismiss='[data-dismiss="alert"]'
var Alert=function(el){$(el).on('click',dismiss,this.close)}
Alert.VERSION='3.4.1'
Alert.TRANSITION_DURATION=150
Alert.prototype.close=function(e){var $this=$(this)
var selector=$this.attr('data-target')
if(!selector){selector=$this.attr('href')
selector=selector&&selector.replace(/.*(?=#[^\s]*$)/,'')}
selector=selector==='#'?[]:selector
var $parent=$(document).find(selector)
if(e)e.preventDefault()
if(!$parent.length){$parent=$this.closest('.alert')}
$parent.trigger(e=$.Event('close.bs.alert'))
if(e.isDefaultPrevented())return
$parent.removeClass('in')
function removeElement(){$parent.detach().trigger('closed.bs.alert').remove()}
$.support.transition&&$parent.hasClass('fade')?$parent.one('bsTransitionEnd',removeElement).emulateTransitionEnd(Alert.TRANSITION_DURATION):removeElement()}
function Plugin(option){return this.each(function(){var $this=$(this)
var data=$this.data('bs.alert')
if(!data)$this.data('bs.alert',(data=new Alert(this)))
if(typeof option=='string')data[option].call($this)})}
var old=$.fn.alert
$.fn.alert=Plugin
$.fn.alert.Constructor=Alert
$.fn.alert.noConflict=function(){$.fn.alert=old
return this}
$(document).on('click.bs.alert.data-api',dismiss,Alert.prototype.close)}(jQuery);+function($){'use strict';var Button=function(element,options){this.$element=$(element)
this.options=$.extend({},Button.DEFAULTS,options)
this.isLoading=false}
Button.VERSION='3.4.1'
Button.DEFAULTS={loadingText:'loading...'}
Button.prototype.setState=function(state){var d='disabled'
var $el=this.$element
var val=$el.is('input')?'val':'html'
var data=$el.data()
state+='Text'
if(data.resetText==null)$el.data('resetText',$el[val]())
setTimeout($.proxy(function(){$el[val](data[state]==null?this.options[state]:data[state])
if(state=='loadingText'){this.isLoading=true
$el.addClass(d).attr(d,d).prop(d,true)}else if(this.isLoading){this.isLoading=false
$el.removeClass(d).removeAttr(d).prop(d,false)}},this),0)}
Button.prototype.toggle=function(){var changed=true
var $parent=this.$element.closest('[data-toggle="buttons"]')
if($parent.length){var $input=this.$element.find('input')
if($input.prop('type')=='radio'){if($input.prop('checked'))changed=false
$parent.find('.active').removeClass('active')
this.$element.addClass('active')}else if($input.prop('type')=='checkbox'){if(($input.prop('checked'))!==this.$element.hasClass('active'))changed=false
this.$element.toggleClass('active')}
$input.prop('checked',this.$element.hasClass('active'))
if(changed)$input.trigger('change')}else{this.$element.attr('aria-pressed',!this.$element.hasClass('active'))
this.$element.toggleClass('active')}}
function Plugin(option){return this.each(function(){var $this=$(this)
var data=$this.data('bs.button')
var options=typeof option=='object'&&option
if(!data)$this.data('bs.button',(data=new Button(this,options)))
if(option=='toggle')data.toggle()
else if(option)data.setState(option)})}
var old=$.fn.button
$.fn.button=Plugin
$.fn.button.Constructor=Button
$.fn.button.noConflict=function(){$.fn.button=old
return this}
$(document).on('click.bs.button.data-api','[data-toggle^="button"]',function(e){var $btn=$(e.target).closest('.btn')
Plugin.call($btn,'toggle')
if(!($(e.target).is('input[type="radio"], input[type="checkbox"]'))){e.preventDefault()
if($btn.is('input,button'))$btn.trigger('focus')
else $btn.find('input:visible,button:visible').first().trigger('focus')}}).on('focus.bs.button.data-api blur.bs.button.data-api','[data-toggle^="button"]',function(e){$(e.target).closest('.btn').toggleClass('focus',/^focus(in)?$/.test(e.type))})}(jQuery);+function($){'use strict';var Carousel=function(element,options){this.$element=$(element)
this.$indicators=this.$element.find('.carousel-indicators')
this.options=options
this.paused=null
this.sliding=null
this.interval=null
this.$active=null
this.$items=null
this.options.keyboard&&this.$element.on('keydown.bs.carousel',$.proxy(this.keydown,this))
this.options.pause=='hover'&&!('ontouchstart'in document.documentElement)&&this.$element.on('mouseenter.bs.carousel',$.proxy(this.pause,this)).on('mouseleave.bs.carousel',$.proxy(this.cycle,this))}
Carousel.VERSION='3.4.1'
Carousel.TRANSITION_DURATION=600
Carousel.DEFAULTS={interval:5000,pause:'hover',wrap:true,keyboard:true}
Carousel.prototype.keydown=function(e){if(/input|textarea/i.test(e.target.tagName))return
switch(e.which){case 37:this.prev();break
case 39:this.next();break
default:return}
e.preventDefault()}
Carousel.prototype.cycle=function(e){e||(this.paused=false)
this.interval&&clearInterval(this.interval)
this.options.interval&&!this.paused&&(this.interval=setInterval($.proxy(this.next,this),this.options.interval))
return this}
Carousel.prototype.getItemIndex=function(item){this.$items=item.parent().children('.item')
return this.$items.index(item||this.$active)}
Carousel.prototype.getItemForDirection=function(direction,active){var activeIndex=this.getItemIndex(active)
var willWrap=(direction=='prev'&&activeIndex===0)||(direction=='next'&&activeIndex==(this.$items.length-1))
if(willWrap&&!this.options.wrap)return active
var delta=direction=='prev'?-1:1
var itemIndex=(activeIndex+delta)%this.$items.length
return this.$items.eq(itemIndex)}
Carousel.prototype.to=function(pos){var that=this
var activeIndex=this.getItemIndex(this.$active=this.$element.find('.item.active'))
if(pos>(this.$items.length-1)||pos<0)return
if(this.sliding)return this.$element.one('slid.bs.carousel',function(){that.to(pos)})
if(activeIndex==pos)return this.pause().cycle()
return this.slide(pos>activeIndex?'next':'prev',this.$items.eq(pos))}
Carousel.prototype.pause=function(e){e||(this.paused=true)
if(this.$element.find('.next, .prev').length&&$.support.transition){this.$element.trigger($.support.transition.end)
this.cycle(true)}
this.interval=clearInterval(this.interval)
return this}
Carousel.prototype.next=function(){if(this.sliding)return
return this.slide('next')}
Carousel.prototype.prev=function(){if(this.sliding)return
return this.slide('prev')}
Carousel.prototype.slide=function(type,next){var $active=this.$element.find('.item.active')
var $next=next||this.getItemForDirection(type,$active)
var isCycling=this.interval
var direction=type=='next'?'left':'right'
var that=this
if($next.hasClass('active'))return(this.sliding=false)
var relatedTarget=$next[0]
var slideEvent=$.Event('slide.bs.carousel',{relatedTarget:relatedTarget,direction:direction})
this.$element.trigger(slideEvent)
if(slideEvent.isDefaultPrevented())return
this.sliding=true
isCycling&&this.pause()
if(this.$indicators.length){this.$indicators.find('.active').removeClass('active')
var $nextIndicator=$(this.$indicators.children()[this.getItemIndex($next)])
$nextIndicator&&$nextIndicator.addClass('active')}
var slidEvent=$.Event('slid.bs.carousel',{relatedTarget:relatedTarget,direction:direction})
if($.support.transition&&this.$element.hasClass('slide')){$next.addClass(type)
if(typeof $next==='object'&&$next.length){$next[0].offsetWidth}
$active.addClass(direction)
$next.addClass(direction)
$active.one('bsTransitionEnd',function(){$next.removeClass([type,direction].join(' ')).addClass('active')
$active.removeClass(['active',direction].join(' '))
that.sliding=false
setTimeout(function(){that.$element.trigger(slidEvent)},0)}).emulateTransitionEnd(Carousel.TRANSITION_DURATION)}else{$active.removeClass('active')
$next.addClass('active')
this.sliding=false
this.$element.trigger(slidEvent)}
isCycling&&this.cycle()
return this}
function Plugin(option){return this.each(function(){var $this=$(this)
var data=$this.data('bs.carousel')
var options=$.extend({},Carousel.DEFAULTS,$this.data(),typeof option=='object'&&option)
var action=typeof option=='string'?option:options.slide
if(!data)$this.data('bs.carousel',(data=new Carousel(this,options)))
if(typeof option=='number')data.to(option)
else if(action)data[action]()
else if(options.interval)data.pause().cycle()})}
var old=$.fn.carousel
$.fn.carousel=Plugin
$.fn.carousel.Constructor=Carousel
$.fn.carousel.noConflict=function(){$.fn.carousel=old
return this}
var clickHandler=function(e){var $this=$(this)
var href=$this.attr('href')
if(href){href=href.replace(/.*(?=#[^\s]+$)/,'')}
var target=$this.attr('data-target')||href
var $target=$(document).find(target)
if(!$target.hasClass('carousel'))return
var options=$.extend({},$target.data(),$this.data())
var slideIndex=$this.attr('data-slide-to')
if(slideIndex)options.interval=false
Plugin.call($target,options)
if(slideIndex){$target.data('bs.carousel').to(slideIndex)}
e.preventDefault()}
$(document).on('click.bs.carousel.data-api','[data-slide]',clickHandler).on('click.bs.carousel.data-api','[data-slide-to]',clickHandler)
$(window).on('load',function(){$('[data-ride="carousel"]').each(function(){var $carousel=$(this)
Plugin.call($carousel,$carousel.data())})})}(jQuery);+function($){'use strict';var Collapse=function(element,options){this.$element=$(element)
this.options=$.extend({},Collapse.DEFAULTS,options)
this.$trigger=$('[data-toggle="collapse"][href="#'+element.id+'"],'+'[data-toggle="collapse"][data-target="#'+element.id+'"]')
this.transitioning=null
if(this.options.parent){this.$parent=this.getParent()}else{this.addAriaAndCollapsedClass(this.$element,this.$trigger)}
if(this.options.toggle)this.toggle()}
Collapse.VERSION='3.4.1'
Collapse.TRANSITION_DURATION=350
Collapse.DEFAULTS={toggle:true}
Collapse.prototype.dimension=function(){var hasWidth=this.$element.hasClass('width')
return hasWidth?'width':'height'}
Collapse.prototype.show=function(){if(this.transitioning||this.$element.hasClass('in'))return
var activesData
var actives=this.$parent&&this.$parent.children('.panel').children('.in, .collapsing')
if(actives&&actives.length){activesData=actives.data('bs.collapse')
if(activesData&&activesData.transitioning)return}
var startEvent=$.Event('show.bs.collapse')
this.$element.trigger(startEvent)
if(startEvent.isDefaultPrevented())return
if(actives&&actives.length){Plugin.call(actives,'hide')
activesData||actives.data('bs.collapse',null)}
var dimension=this.dimension()
this.$element.removeClass('collapse').addClass('collapsing')[dimension](0).attr('aria-expanded',true)
this.$trigger.removeClass('collapsed').attr('aria-expanded',true)
this.transitioning=1
var complete=function(){this.$element.removeClass('collapsing').addClass('collapse in')[dimension]('')
this.transitioning=0
this.$element.trigger('shown.bs.collapse')}
if(!$.support.transition)return complete.call(this)
var scrollSize=$.camelCase(['scroll',dimension].join('-'))
this.$element.one('bsTransitionEnd',$.proxy(complete,this)).emulateTransitionEnd(Collapse.TRANSITION_DURATION)[dimension](this.$element[0][scrollSize])}
Collapse.prototype.hide=function(){if(this.transitioning||!this.$element.hasClass('in'))return
var startEvent=$.Event('hide.bs.collapse')
this.$element.trigger(startEvent)
if(startEvent.isDefaultPrevented())return
var dimension=this.dimension()
this.$element[dimension](this.$element[dimension]())[0].offsetHeight
this.$element.addClass('collapsing').removeClass('collapse in').attr('aria-expanded',false)
this.$trigger.addClass('collapsed').attr('aria-expanded',false)
this.transitioning=1
var complete=function(){this.transitioning=0
this.$element.removeClass('collapsing').addClass('collapse').trigger('hidden.bs.collapse')}
if(!$.support.transition)return complete.call(this)
this.$element
[dimension](0).one('bsTransitionEnd',$.proxy(complete,this)).emulateTransitionEnd(Collapse.TRANSITION_DURATION)}
Collapse.prototype.toggle=function(){this[this.$element.hasClass('in')?'hide':'show']()}
Collapse.prototype.getParent=function(){return $(document).find(this.options.parent).find('[data-toggle="collapse"][data-parent="'+this.options.parent+'"]').each($.proxy(function(i,element){var $element=$(element)
this.addAriaAndCollapsedClass(getTargetFromTrigger($element),$element)},this)).end()}
Collapse.prototype.addAriaAndCollapsedClass=function($element,$trigger){var isOpen=$element.hasClass('in')
$element.attr('aria-expanded',isOpen)
$trigger.toggleClass('collapsed',!isOpen).attr('aria-expanded',isOpen)}
function getTargetFromTrigger($trigger){var href
var target=$trigger.attr('data-target')||(href=$trigger.attr('href'))&&href.replace(/.*(?=#[^\s]+$)/,'')
return $(document).find(target)}
function Plugin(option){return this.each(function(){var $this=$(this)
var data=$this.data('bs.collapse')
var options=$.extend({},Collapse.DEFAULTS,$this.data(),typeof option=='object'&&option)
if(!data&&options.toggle&&/show|hide/.test(option))options.toggle=false
if(!data)$this.data('bs.collapse',(data=new Collapse(this,options)))
if(typeof option=='string')data[option]()})}
var old=$.fn.collapse
$.fn.collapse=Plugin
$.fn.collapse.Constructor=Collapse
$.fn.collapse.noConflict=function(){$.fn.collapse=old
return this}
$(document).on('click.bs.collapse.data-api','[data-toggle="collapse"]',function(e){var $this=$(this)
if(!$this.attr('data-target'))e.preventDefault()
var $target=getTargetFromTrigger($this)
var data=$target.data('bs.collapse')
var option=data?'toggle':$this.data()
Plugin.call($target,option)})}(jQuery);+function($){'use strict';var backdrop='.dropdown-backdrop'
var toggle='[data-toggle="dropdown"]'
var Dropdown=function(element){$(element).on('click.bs.dropdown',this.toggle)}
Dropdown.VERSION='3.4.1'
function getParent($this){var selector=$this.attr('data-target')
if(!selector){selector=$this.attr('href')
selector=selector&&/#[A-Za-z]/.test(selector)&&selector.replace(/.*(?=#[^\s]*$)/,'')}
var $parent=selector!=='#'?$(document).find(selector):null
return $parent&&$parent.length?$parent:$this.parent()}
function clearMenus(e){if(e&&e.which===3)return
$(backdrop).remove()
$(toggle).each(function(){var $this=$(this)
var $parent=getParent($this)
var relatedTarget={relatedTarget:this}
if(!$parent.hasClass('open'))return
if(e&&e.type=='click'&&/input|textarea/i.test(e.target.tagName)&&$.contains($parent[0],e.target))return
$parent.trigger(e=$.Event('hide.bs.dropdown',relatedTarget))
if(e.isDefaultPrevented())return
$this.attr('aria-expanded','false')
$parent.removeClass('open').trigger($.Event('hidden.bs.dropdown',relatedTarget))})}
Dropdown.prototype.toggle=function(e){var $this=$(this)
if($this.is('.disabled, :disabled'))return
var $parent=getParent($this)
var isActive=$parent.hasClass('open')
clearMenus()
if(!isActive){if('ontouchstart'in document.documentElement&&!$parent.closest('.navbar-nav').length){$(document.createElement('div')).addClass('dropdown-backdrop').insertAfter($(this)).on('click',clearMenus)}
var relatedTarget={relatedTarget:this}
$parent.trigger(e=$.Event('show.bs.dropdown',relatedTarget))
if(e.isDefaultPrevented())return
$this.trigger('focus').attr('aria-expanded','true')
$parent.toggleClass('open').trigger($.Event('shown.bs.dropdown',relatedTarget))}
return false}
Dropdown.prototype.keydown=function(e){if(!/(38|40|27|32)/.test(e.which)||/input|textarea/i.test(e.target.tagName))return
var $this=$(this)
e.preventDefault()
e.stopPropagation()
if($this.is('.disabled, :disabled'))return
var $parent=getParent($this)
var isActive=$parent.hasClass('open')
if(!isActive&&e.which!=27||isActive&&e.which==27){if(e.which==27)$parent.find(toggle).trigger('focus')
return $this.trigger('click')}
var desc=' li:not(.disabled):visible a'
var $items=$parent.find('.dropdown-menu'+desc)
if(!$items.length)return
var index=$items.index(e.target)
if(e.which==38&&index>0)index--
if(e.which==40&&index<$items.length-1)index++
if(!~index)index=0
$items.eq(index).trigger('focus')}
function Plugin(option){return this.each(function(){var $this=$(this)
var data=$this.data('bs.dropdown')
if(!data)$this.data('bs.dropdown',(data=new Dropdown(this)))
if(typeof option=='string')data[option].call($this)})}
var old=$.fn.dropdown
$.fn.dropdown=Plugin
$.fn.dropdown.Constructor=Dropdown
$.fn.dropdown.noConflict=function(){$.fn.dropdown=old
return this}
$(document).on('click.bs.dropdown.data-api',clearMenus).on('click.bs.dropdown.data-api','.dropdown form',function(e){e.stopPropagation()}).on('click.bs.dropdown.data-api',toggle,Dropdown.prototype.toggle).on('keydown.bs.dropdown.data-api',toggle,Dropdown.prototype.keydown).on('keydown.bs.dropdown.data-api','.dropdown-menu',Dropdown.prototype.keydown)}(jQuery);+function($){'use strict';var Modal=function(element,options){this.options=options
this.$body=$(document.body)
this.$element=$(element)
this.$dialog=this.$element.find('.modal-dialog')
this.$backdrop=null
this.isShown=null
this.originalBodyPad=null
this.scrollbarWidth=0
this.ignoreBackdropClick=false
this.fixedContent='.navbar-fixed-top, .navbar-fixed-bottom'
if(this.options.remote){this.$element.find('.modal-content').load(this.options.remote,$.proxy(function(){this.$element.trigger('loaded.bs.modal')},this))}}
Modal.VERSION='3.4.1'
Modal.TRANSITION_DURATION=300
Modal.BACKDROP_TRANSITION_DURATION=150
Modal.DEFAULTS={backdrop:true,keyboard:true,show:true}
Modal.prototype.toggle=function(_relatedTarget){return this.isShown?this.hide():this.show(_relatedTarget)}
Modal.prototype.show=function(_relatedTarget){var that=this
var e=$.Event('show.bs.modal',{relatedTarget:_relatedTarget})
this.$element.trigger(e)
if(this.isShown||e.isDefaultPrevented())return
this.isShown=true
this.checkScrollbar()
this.setScrollbar()
this.$body.addClass('modal-open')
this.escape()
this.resize()
this.$element.on('click.dismiss.bs.modal','[data-dismiss="modal"]',$.proxy(this.hide,this))
this.$dialog.on('mousedown.dismiss.bs.modal',function(){that.$element.one('mouseup.dismiss.bs.modal',function(e){if($(e.target).is(that.$element))that.ignoreBackdropClick=true})})
this.backdrop(function(){var transition=$.support.transition&&that.$element.hasClass('fade')
if(!that.$element.parent().length){that.$element.appendTo(that.$body)}
that.$element.show().scrollTop(0)
that.adjustDialog()
if(transition){that.$element[0].offsetWidth}
that.$element.addClass('in')
that.enforceFocus()
var e=$.Event('shown.bs.modal',{relatedTarget:_relatedTarget})
transition?that.$dialog.one('bsTransitionEnd',function(){that.$element.trigger('focus').trigger(e)}).emulateTransitionEnd(Modal.TRANSITION_DURATION):that.$element.trigger('focus').trigger(e)})}
Modal.prototype.hide=function(e){if(e)e.preventDefault()
e=$.Event('hide.bs.modal')
this.$element.trigger(e)
if(!this.isShown||e.isDefaultPrevented())return
this.isShown=false
this.escape()
this.resize()
$(document).off('focusin.bs.modal')
this.$element.removeClass('in').off('click.dismiss.bs.modal').off('mouseup.dismiss.bs.modal')
this.$dialog.off('mousedown.dismiss.bs.modal')
$.support.transition&&this.$element.hasClass('fade')?this.$element.one('bsTransitionEnd',$.proxy(this.hideModal,this)).emulateTransitionEnd(Modal.TRANSITION_DURATION):this.hideModal()}
Modal.prototype.enforceFocus=function(){$(document).off('focusin.bs.modal').on('focusin.bs.modal',$.proxy(function(e){if(document!==e.target&&this.$element[0]!==e.target&&!this.$element.has(e.target).length){this.$element.trigger('focus')}},this))}
Modal.prototype.escape=function(){if(this.isShown&&this.options.keyboard){this.$element.on('keydown.dismiss.bs.modal',$.proxy(function(e){e.which==27&&this.hide()},this))}else if(!this.isShown){this.$element.off('keydown.dismiss.bs.modal')}}
Modal.prototype.resize=function(){if(this.isShown){$(window).on('resize.bs.modal',$.proxy(this.handleUpdate,this))}else{$(window).off('resize.bs.modal')}}
Modal.prototype.hideModal=function(){var that=this
this.$element.hide()
this.backdrop(function(){that.$body.removeClass('modal-open')
that.resetAdjustments()
that.resetScrollbar()
that.$element.trigger('hidden.bs.modal')})}
Modal.prototype.removeBackdrop=function(){this.$backdrop&&this.$backdrop.remove()
this.$backdrop=null}
Modal.prototype.backdrop=function(callback){var that=this
var animate=this.$element.hasClass('fade')?'fade':''
if(this.isShown&&this.options.backdrop){var doAnimate=$.support.transition&&animate
this.$backdrop=$(document.createElement('div')).addClass('modal-backdrop '+animate).appendTo(this.$body)
this.$element.on('click.dismiss.bs.modal',$.proxy(function(e){if(this.ignoreBackdropClick){this.ignoreBackdropClick=false
return}
if(e.target!==e.currentTarget)return
this.options.backdrop=='static'?this.$element[0].focus():this.hide()},this))
if(doAnimate)this.$backdrop[0].offsetWidth
this.$backdrop.addClass('in')
if(!callback)return
doAnimate?this.$backdrop.one('bsTransitionEnd',callback).emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION):callback()}else if(!this.isShown&&this.$backdrop){this.$backdrop.removeClass('in')
var callbackRemove=function(){that.removeBackdrop()
callback&&callback()}
$.support.transition&&this.$element.hasClass('fade')?this.$backdrop.one('bsTransitionEnd',callbackRemove).emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION):callbackRemove()}else if(callback){callback()}}
Modal.prototype.handleUpdate=function(){this.adjustDialog()}
Modal.prototype.adjustDialog=function(){var modalIsOverflowing=this.$element[0].scrollHeight>document.documentElement.clientHeight
this.$element.css({paddingLeft:!this.bodyIsOverflowing&&modalIsOverflowing?this.scrollbarWidth:'',paddingRight:this.bodyIsOverflowing&&!modalIsOverflowing?this.scrollbarWidth:''})}
Modal.prototype.resetAdjustments=function(){this.$element.css({paddingLeft:'',paddingRight:''})}
Modal.prototype.checkScrollbar=function(){var fullWindowWidth=window.innerWidth
if(!fullWindowWidth){var documentElementRect=document.documentElement.getBoundingClientRect()
fullWindowWidth=documentElementRect.right-Math.abs(documentElementRect.left)}
this.bodyIsOverflowing=document.body.clientWidth<fullWindowWidth
this.scrollbarWidth=this.measureScrollbar()}
Modal.prototype.setScrollbar=function(){var bodyPad=parseInt((this.$body.css('padding-right')||0),10)
this.originalBodyPad=document.body.style.paddingRight||''
var scrollbarWidth=this.scrollbarWidth
if(this.bodyIsOverflowing){this.$body.css('padding-right',bodyPad+scrollbarWidth)
$(this.fixedContent).each(function(index,element){var actualPadding=element.style.paddingRight
var calculatedPadding=$(element).css('padding-right')
$(element).data('padding-right',actualPadding).css('padding-right',parseFloat(calculatedPadding)+scrollbarWidth+'px')})}}
Modal.prototype.resetScrollbar=function(){this.$body.css('padding-right',this.originalBodyPad)
$(this.fixedContent).each(function(index,element){var padding=$(element).data('padding-right')
$(element).removeData('padding-right')
element.style.paddingRight=padding?padding:''})}
Modal.prototype.measureScrollbar=function(){var scrollDiv=document.createElement('div')
scrollDiv.className='modal-scrollbar-measure'
this.$body.append(scrollDiv)
var scrollbarWidth=scrollDiv.offsetWidth-scrollDiv.clientWidth
this.$body[0].removeChild(scrollDiv)
return scrollbarWidth}
function Plugin(option,_relatedTarget){return this.each(function(){var $this=$(this)
var data=$this.data('bs.modal')
var options=$.extend({},Modal.DEFAULTS,$this.data(),typeof option=='object'&&option)
if(!data)$this.data('bs.modal',(data=new Modal(this,options)))
if(typeof option=='string')data[option](_relatedTarget)
else if(options.show)data.show(_relatedTarget)})}
var old=$.fn.modal
$.fn.modal=Plugin
$.fn.modal.Constructor=Modal
$.fn.modal.noConflict=function(){$.fn.modal=old
return this}
$(document).on('click.bs.modal.data-api','[data-toggle="modal"]',function(e){var $this=$(this)
var href=$this.attr('href')
var target=$this.attr('data-target')||(href&&href.replace(/.*(?=#[^\s]+$)/,''))
var $target=$(document).find(target)
var option=$target.data('bs.modal')?'toggle':$.extend({remote:!/#/.test(href)&&href},$target.data(),$this.data())
if($this.is('a'))e.preventDefault()
$target.one('show.bs.modal',function(showEvent){if(showEvent.isDefaultPrevented())return
$target.one('hidden.bs.modal',function(){$this.is(':visible')&&$this.trigger('focus')})})
Plugin.call($target,option,this)})}(jQuery);+function($){'use strict';var DISALLOWED_ATTRIBUTES=['sanitize','whiteList','sanitizeFn']
var uriAttrs=['background','cite','href','itemtype','longdesc','poster','src','xlink:href']
var ARIA_ATTRIBUTE_PATTERN=/^aria-[\w-]*$/i
var DefaultWhitelist={'*':['class','dir','id','lang','role',ARIA_ATTRIBUTE_PATTERN],a:['target','href','title','rel'],area:[],b:[],br:[],col:[],code:[],div:[],em:[],hr:[],h1:[],h2:[],h3:[],h4:[],h5:[],h6:[],i:[],img:['src','alt','title','width','height'],li:[],ol:[],p:[],pre:[],s:[],small:[],span:[],sub:[],sup:[],strong:[],u:[],ul:[]}
var SAFE_URL_PATTERN=/^(?:(?:https?|mailto|ftp|tel|file):|[^&:/?#]*(?:[/?#]|$))/gi
var DATA_URL_PATTERN=/^data:(?:image\/(?:bmp|gif|jpeg|jpg|png|tiff|webp)|video\/(?:mpeg|mp4|ogg|webm)|audio\/(?:mp3|oga|ogg|opus));base64,[a-z0-9+/]+=*$/i
function allowedAttribute(attr,allowedAttributeList){var attrName=attr.nodeName.toLowerCase()
if($.inArray(attrName,allowedAttributeList)!==-1){if($.inArray(attrName,uriAttrs)!==-1){return Boolean(attr.nodeValue.match(SAFE_URL_PATTERN)||attr.nodeValue.match(DATA_URL_PATTERN))}
return true}
var regExp=$(allowedAttributeList).filter(function(index,value){return value instanceof RegExp})
for(var i=0,l=regExp.length;i<l;i++){if(attrName.match(regExp[i])){return true}}
return false}
function sanitizeHtml(unsafeHtml,whiteList,sanitizeFn){if(unsafeHtml.length===0){return unsafeHtml}
if(sanitizeFn&&typeof sanitizeFn==='function'){return sanitizeFn(unsafeHtml)}
if(!document.implementation||!document.implementation.createHTMLDocument){return unsafeHtml}
var createdDocument=document.implementation.createHTMLDocument('sanitization')
createdDocument.body.innerHTML=unsafeHtml
var whitelistKeys=$.map(whiteList,function(el,i){return i})
var elements=$(createdDocument.body).find('*')
for(var i=0,len=elements.length;i<len;i++){var el=elements[i]
var elName=el.nodeName.toLowerCase()
if($.inArray(elName,whitelistKeys)===-1){el.parentNode.removeChild(el)
continue}
var attributeList=$.map(el.attributes,function(el){return el})
var whitelistedAttributes=[].concat(whiteList['*']||[],whiteList[elName]||[])
for(var j=0,len2=attributeList.length;j<len2;j++){if(!allowedAttribute(attributeList[j],whitelistedAttributes)){el.removeAttribute(attributeList[j].nodeName)}}}
return createdDocument.body.innerHTML}
var Tooltip=function(element,options){this.type=null
this.options=null
this.enabled=null
this.timeout=null
this.hoverState=null
this.$element=null
this.inState=null
this.init('tooltip',element,options)}
Tooltip.VERSION='3.4.1'
Tooltip.TRANSITION_DURATION=150
Tooltip.DEFAULTS={animation:true,placement:'top',selector:false,template:'<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',trigger:'hover focus',title:'',delay:0,html:false,container:false,viewport:{selector:'body',padding:0},sanitize:true,sanitizeFn:null,whiteList:DefaultWhitelist}
Tooltip.prototype.init=function(type,element,options){this.enabled=true
this.type=type
this.$element=$(element)
this.options=this.getOptions(options)
this.$viewport=this.options.viewport&&$(document).find($.isFunction(this.options.viewport)?this.options.viewport.call(this,this.$element):(this.options.viewport.selector||this.options.viewport))
this.inState={click:false,hover:false,focus:false}
if(this.$element[0]instanceof document.constructor&&!this.options.selector){throw new Error('`selector` option must be specified when initializing '+this.type+' on the window.document object!')}
var triggers=this.options.trigger.split(' ')
for(var i=triggers.length;i--;){var trigger=triggers[i]
if(trigger=='click'){this.$element.on('click.'+this.type,this.options.selector,$.proxy(this.toggle,this))}else if(trigger!='manual'){var eventIn=trigger=='hover'?'mouseenter':'focusin'
var eventOut=trigger=='hover'?'mouseleave':'focusout'
this.$element.on(eventIn+'.'+this.type,this.options.selector,$.proxy(this.enter,this))
this.$element.on(eventOut+'.'+this.type,this.options.selector,$.proxy(this.leave,this))}}
this.options.selector?(this._options=$.extend({},this.options,{trigger:'manual',selector:''})):this.fixTitle()}
Tooltip.prototype.getDefaults=function(){return Tooltip.DEFAULTS}
Tooltip.prototype.getOptions=function(options){var dataAttributes=this.$element.data()
for(var dataAttr in dataAttributes){if(dataAttributes.hasOwnProperty(dataAttr)&&$.inArray(dataAttr,DISALLOWED_ATTRIBUTES)!==-1){delete dataAttributes[dataAttr]}}
options=$.extend({},this.getDefaults(),dataAttributes,options)
if(options.delay&&typeof options.delay=='number'){options.delay={show:options.delay,hide:options.delay}}
if(options.sanitize){options.template=sanitizeHtml(options.template,options.whiteList,options.sanitizeFn)}
return options}
Tooltip.prototype.getDelegateOptions=function(){var options={}
var defaults=this.getDefaults()
this._options&&$.each(this._options,function(key,value){if(defaults[key]!=value)options[key]=value})
return options}
Tooltip.prototype.enter=function(obj){var self=obj instanceof this.constructor?obj:$(obj.currentTarget).data('bs.'+this.type)
if(!self){self=new this.constructor(obj.currentTarget,this.getDelegateOptions())
$(obj.currentTarget).data('bs.'+this.type,self)}
if(obj instanceof $.Event){self.inState[obj.type=='focusin'?'focus':'hover']=true}
if(self.tip().hasClass('in')||self.hoverState=='in'){self.hoverState='in'
return}
clearTimeout(self.timeout)
self.hoverState='in'
if(!self.options.delay||!self.options.delay.show)return self.show()
self.timeout=setTimeout(function(){if(self.hoverState=='in')self.show()},self.options.delay.show)}
Tooltip.prototype.isInStateTrue=function(){for(var key in this.inState){if(this.inState[key])return true}
return false}
Tooltip.prototype.leave=function(obj){var self=obj instanceof this.constructor?obj:$(obj.currentTarget).data('bs.'+this.type)
if(!self){self=new this.constructor(obj.currentTarget,this.getDelegateOptions())
$(obj.currentTarget).data('bs.'+this.type,self)}
if(obj instanceof $.Event){self.inState[obj.type=='focusout'?'focus':'hover']=false}
if(self.isInStateTrue())return
clearTimeout(self.timeout)
self.hoverState='out'
if(!self.options.delay||!self.options.delay.hide)return self.hide()
self.timeout=setTimeout(function(){if(self.hoverState=='out')self.hide()},self.options.delay.hide)}
Tooltip.prototype.show=function(){var e=$.Event('show.bs.'+this.type)
if(this.hasContent()&&this.enabled){this.$element.trigger(e)
var inDom=$.contains(this.$element[0].ownerDocument.documentElement,this.$element[0])
if(e.isDefaultPrevented()||!inDom)return
var that=this
var $tip=this.tip()
var tipId=this.getUID(this.type)
this.setContent()
$tip.attr('id',tipId)
this.$element.attr('aria-describedby',tipId)
if(this.options.animation)$tip.addClass('fade')
var placement=typeof this.options.placement=='function'?this.options.placement.call(this,$tip[0],this.$element[0]):this.options.placement
var autoToken=/\s?auto?\s?/i
var autoPlace=autoToken.test(placement)
if(autoPlace)placement=placement.replace(autoToken,'')||'top'
$tip.detach().css({top:0,left:0,display:'block'}).addClass(placement).data('bs.'+this.type,this)
this.options.container?$tip.appendTo($(document).find(this.options.container)):$tip.insertAfter(this.$element)
this.$element.trigger('inserted.bs.'+this.type)
var pos=this.getPosition()
var actualWidth=$tip[0].offsetWidth
var actualHeight=$tip[0].offsetHeight
if(autoPlace){var orgPlacement=placement
var viewportDim=this.getPosition(this.$viewport)
placement=placement=='bottom'&&pos.bottom+actualHeight>viewportDim.bottom?'top':placement=='top'&&pos.top-actualHeight<viewportDim.top?'bottom':placement=='right'&&pos.right+actualWidth>viewportDim.width?'left':placement=='left'&&pos.left-actualWidth<viewportDim.left?'right':placement
$tip.removeClass(orgPlacement).addClass(placement)}
var calculatedOffset=this.getCalculatedOffset(placement,pos,actualWidth,actualHeight)
this.applyPlacement(calculatedOffset,placement)
var complete=function(){var prevHoverState=that.hoverState
that.$element.trigger('shown.bs.'+that.type)
that.hoverState=null
if(prevHoverState=='out')that.leave(that)}
$.support.transition&&this.$tip.hasClass('fade')?$tip.one('bsTransitionEnd',complete).emulateTransitionEnd(Tooltip.TRANSITION_DURATION):complete()}}
Tooltip.prototype.applyPlacement=function(offset,placement){var $tip=this.tip()
var width=$tip[0].offsetWidth
var height=$tip[0].offsetHeight
var marginTop=parseInt($tip.css('margin-top'),10)
var marginLeft=parseInt($tip.css('margin-left'),10)
if(isNaN(marginTop))marginTop=0
if(isNaN(marginLeft))marginLeft=0
offset.top+=marginTop
offset.left+=marginLeft
$.offset.setOffset($tip[0],$.extend({using:function(props){$tip.css({top:Math.round(props.top),left:Math.round(props.left)})}},offset),0)
$tip.addClass('in')
var actualWidth=$tip[0].offsetWidth
var actualHeight=$tip[0].offsetHeight
if(placement=='top'&&actualHeight!=height){offset.top=offset.top+height-actualHeight}
var delta=this.getViewportAdjustedDelta(placement,offset,actualWidth,actualHeight)
if(delta.left)offset.left+=delta.left
else offset.top+=delta.top
var isVertical=/top|bottom/.test(placement)
var arrowDelta=isVertical?delta.left*2-width+actualWidth:delta.top*2-height+actualHeight
var arrowOffsetPosition=isVertical?'offsetWidth':'offsetHeight'
$tip.offset(offset)
this.replaceArrow(arrowDelta,$tip[0][arrowOffsetPosition],isVertical)}
Tooltip.prototype.replaceArrow=function(delta,dimension,isVertical){this.arrow().css(isVertical?'left':'top',50*(1-delta/dimension)+'%').css(isVertical?'top':'left','')}
Tooltip.prototype.setContent=function(){var $tip=this.tip()
var title=this.getTitle()
if(this.options.html){if(this.options.sanitize){title=sanitizeHtml(title,this.options.whiteList,this.options.sanitizeFn)}
$tip.find('.tooltip-inner').html(title)}else{$tip.find('.tooltip-inner').text(title)}
$tip.removeClass('fade in top bottom left right')}
Tooltip.prototype.hide=function(callback){var that=this
var $tip=$(this.$tip)
var e=$.Event('hide.bs.'+this.type)
function complete(){if(that.hoverState!='in')$tip.detach()
if(that.$element){that.$element.removeAttr('aria-describedby').trigger('hidden.bs.'+that.type)}
callback&&callback()}
this.$element.trigger(e)
if(e.isDefaultPrevented())return
$tip.removeClass('in')
$.support.transition&&$tip.hasClass('fade')?$tip.one('bsTransitionEnd',complete).emulateTransitionEnd(Tooltip.TRANSITION_DURATION):complete()
this.hoverState=null
return this}
Tooltip.prototype.fixTitle=function(){var $e=this.$element
if($e.attr('title')||typeof $e.attr('data-original-title')!='string'){$e.attr('data-original-title',$e.attr('title')||'').attr('title','')}}
Tooltip.prototype.hasContent=function(){return this.getTitle()}
Tooltip.prototype.getPosition=function($element){$element=$element||this.$element
var el=$element[0]
var isBody=el.tagName=='BODY'
var elRect=el.getBoundingClientRect()
if(elRect.width==null){elRect=$.extend({},elRect,{width:elRect.right-elRect.left,height:elRect.bottom-elRect.top})}
var isSvg=window.SVGElement&&el instanceof window.SVGElement
var elOffset=isBody?{top:0,left:0}:(isSvg?null:$element.offset())
var scroll={scroll:isBody?document.documentElement.scrollTop||document.body.scrollTop:$element.scrollTop()}
var outerDims=isBody?{width:$(window).width(),height:$(window).height()}:null
return $.extend({},elRect,scroll,outerDims,elOffset)}
Tooltip.prototype.getCalculatedOffset=function(placement,pos,actualWidth,actualHeight){return placement=='bottom'?{top:pos.top+pos.height,left:pos.left+pos.width/2-actualWidth/2}:placement=='top'?{top:pos.top-actualHeight,left:pos.left+pos.width/2-actualWidth/2}:placement=='left'?{top:pos.top+pos.height/2-actualHeight/2,left:pos.left-actualWidth}:{top:pos.top+pos.height/2-actualHeight/2,left:pos.left+pos.width}}
Tooltip.prototype.getViewportAdjustedDelta=function(placement,pos,actualWidth,actualHeight){var delta={top:0,left:0}
if(!this.$viewport)return delta
var viewportPadding=this.options.viewport&&this.options.viewport.padding||0
var viewportDimensions=this.getPosition(this.$viewport)
if(/right|left/.test(placement)){var topEdgeOffset=pos.top-viewportPadding-viewportDimensions.scroll
var bottomEdgeOffset=pos.top+viewportPadding-viewportDimensions.scroll+actualHeight
if(topEdgeOffset<viewportDimensions.top){delta.top=viewportDimensions.top-topEdgeOffset}else if(bottomEdgeOffset>viewportDimensions.top+viewportDimensions.height){delta.top=viewportDimensions.top+viewportDimensions.height-bottomEdgeOffset}}else{var leftEdgeOffset=pos.left-viewportPadding
var rightEdgeOffset=pos.left+viewportPadding+actualWidth
if(leftEdgeOffset<viewportDimensions.left){delta.left=viewportDimensions.left-leftEdgeOffset}else if(rightEdgeOffset>viewportDimensions.right){delta.left=viewportDimensions.left+viewportDimensions.width-rightEdgeOffset}}
return delta}
Tooltip.prototype.getTitle=function(){var title
var $e=this.$element
var o=this.options
title=$e.attr('data-original-title')||(typeof o.title=='function'?o.title.call($e[0]):o.title)
return title}
Tooltip.prototype.getUID=function(prefix){do prefix+=~~(Math.random()*1000000)
while(document.getElementById(prefix))
return prefix}
Tooltip.prototype.tip=function(){if(!this.$tip){this.$tip=$(this.options.template)
if(this.$tip.length!=1){throw new Error(this.type+' `template` option must consist of exactly 1 top-level element!')}}
return this.$tip}
Tooltip.prototype.arrow=function(){return(this.$arrow=this.$arrow||this.tip().find('.tooltip-arrow'))}
Tooltip.prototype.enable=function(){this.enabled=true}
Tooltip.prototype.disable=function(){this.enabled=false}
Tooltip.prototype.toggleEnabled=function(){this.enabled=!this.enabled}
Tooltip.prototype.toggle=function(e){var self=this
if(e){self=$(e.currentTarget).data('bs.'+this.type)
if(!self){self=new this.constructor(e.currentTarget,this.getDelegateOptions())
$(e.currentTarget).data('bs.'+this.type,self)}}
if(e){self.inState.click=!self.inState.click
if(self.isInStateTrue())self.enter(self)
else self.leave(self)}else{self.tip().hasClass('in')?self.leave(self):self.enter(self)}}
Tooltip.prototype.destroy=function(){var that=this
clearTimeout(this.timeout)
this.hide(function(){that.$element.off('.'+that.type).removeData('bs.'+that.type)
if(that.$tip){that.$tip.detach()}
that.$tip=null
that.$arrow=null
that.$viewport=null
that.$element=null})}
Tooltip.prototype.sanitizeHtml=function(unsafeHtml){return sanitizeHtml(unsafeHtml,this.options.whiteList,this.options.sanitizeFn)}
function Plugin(option){return this.each(function(){var $this=$(this)
var data=$this.data('bs.tooltip')
var options=typeof option=='object'&&option
if(!data&&/destroy|hide/.test(option))return
if(!data)$this.data('bs.tooltip',(data=new Tooltip(this,options)))
if(typeof option=='string')data[option]()})}
var old=$.fn.tooltip
$.fn.tooltip=Plugin
$.fn.tooltip.Constructor=Tooltip
$.fn.tooltip.noConflict=function(){$.fn.tooltip=old
return this}}(jQuery);+function($){'use strict';var Popover=function(element,options){this.init('popover',element,options)}
if(!$.fn.tooltip)throw new Error('Popover requires tooltip.js')
Popover.VERSION='3.4.1'
Popover.DEFAULTS=$.extend({},$.fn.tooltip.Constructor.DEFAULTS,{placement:'right',trigger:'click',content:'',template:'<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'})
Popover.prototype=$.extend({},$.fn.tooltip.Constructor.prototype)
Popover.prototype.constructor=Popover
Popover.prototype.getDefaults=function(){return Popover.DEFAULTS}
Popover.prototype.setContent=function(){var $tip=this.tip()
var title=this.getTitle()
var content=this.getContent()
if(this.options.html){var typeContent=typeof content
if(this.options.sanitize){title=this.sanitizeHtml(title)
if(typeContent==='string'){content=this.sanitizeHtml(content)}}
$tip.find('.popover-title').html(title)
$tip.find('.popover-content').children().detach().end()[typeContent==='string'?'html':'append'](content)}else{$tip.find('.popover-title').text(title)
$tip.find('.popover-content').children().detach().end().text(content)}
$tip.removeClass('fade top bottom left right in')
if(!$tip.find('.popover-title').html())$tip.find('.popover-title').hide()}
Popover.prototype.hasContent=function(){return this.getTitle()||this.getContent()}
Popover.prototype.getContent=function(){var $e=this.$element
var o=this.options
return $e.attr('data-content')||(typeof o.content=='function'?o.content.call($e[0]):o.content)}
Popover.prototype.arrow=function(){return(this.$arrow=this.$arrow||this.tip().find('.arrow'))}
function Plugin(option){return this.each(function(){var $this=$(this)
var data=$this.data('bs.popover')
var options=typeof option=='object'&&option
if(!data&&/destroy|hide/.test(option))return
if(!data)$this.data('bs.popover',(data=new Popover(this,options)))
if(typeof option=='string')data[option]()})}
var old=$.fn.popover
$.fn.popover=Plugin
$.fn.popover.Constructor=Popover
$.fn.popover.noConflict=function(){$.fn.popover=old
return this}}(jQuery);+function($){'use strict';function ScrollSpy(element,options){this.$body=$(document.body)
this.$scrollElement=$(element).is(document.body)?$(window):$(element)
this.options=$.extend({},ScrollSpy.DEFAULTS,options)
this.selector=(this.options.target||'')+' .nav li > a'
this.offsets=[]
this.targets=[]
this.activeTarget=null
this.scrollHeight=0
this.$scrollElement.on('scroll.bs.scrollspy',$.proxy(this.process,this))
this.refresh()
this.process()}
ScrollSpy.VERSION='3.4.1'
ScrollSpy.DEFAULTS={offset:10}
ScrollSpy.prototype.getScrollHeight=function(){return this.$scrollElement[0].scrollHeight||Math.max(this.$body[0].scrollHeight,document.documentElement.scrollHeight)}
ScrollSpy.prototype.refresh=function(){var that=this
var offsetMethod='offset'
var offsetBase=0
this.offsets=[]
this.targets=[]
this.scrollHeight=this.getScrollHeight()
if(!$.isWindow(this.$scrollElement[0])){offsetMethod='position'
offsetBase=this.$scrollElement.scrollTop()}
this.$body.find(this.selector).map(function(){var $el=$(this)
var href=$el.data('target')||$el.attr('href')
var $href=/^#./.test(href)&&$(href)
return($href&&$href.length&&$href.is(':visible')&&[[$href[offsetMethod]().top+offsetBase,href]])||null}).sort(function(a,b){return a[0]-b[0]}).each(function(){that.offsets.push(this[0])
that.targets.push(this[1])})}
ScrollSpy.prototype.process=function(){var scrollTop=this.$scrollElement.scrollTop()+this.options.offset
var scrollHeight=this.getScrollHeight()
var maxScroll=this.options.offset+scrollHeight-this.$scrollElement.height()
var offsets=this.offsets
var targets=this.targets
var activeTarget=this.activeTarget
var i
if(this.scrollHeight!=scrollHeight){this.refresh()}
if(scrollTop>=maxScroll){return activeTarget!=(i=targets[targets.length-1])&&this.activate(i)}
if(activeTarget&&scrollTop<offsets[0]){this.activeTarget=null
return this.clear()}
for(i=offsets.length;i--;){activeTarget!=targets[i]&&scrollTop>=offsets[i]&&(offsets[i+1]===undefined||scrollTop<offsets[i+1])&&this.activate(targets[i])}}
ScrollSpy.prototype.activate=function(target){this.activeTarget=target
this.clear()
var selector=this.selector+'[data-target="'+target+'"],'+
this.selector+'[href="'+target+'"]'
var active=$(selector).parents('li').addClass('active')
if(active.parent('.dropdown-menu').length){active=active.closest('li.dropdown').addClass('active')}
active.trigger('activate.bs.scrollspy')}
ScrollSpy.prototype.clear=function(){$(this.selector).parentsUntil(this.options.target,'.active').removeClass('active')}
function Plugin(option){return this.each(function(){var $this=$(this)
var data=$this.data('bs.scrollspy')
var options=typeof option=='object'&&option
if(!data)$this.data('bs.scrollspy',(data=new ScrollSpy(this,options)))
if(typeof option=='string')data[option]()})}
var old=$.fn.scrollspy
$.fn.scrollspy=Plugin
$.fn.scrollspy.Constructor=ScrollSpy
$.fn.scrollspy.noConflict=function(){$.fn.scrollspy=old
return this}
$(window).on('load.bs.scrollspy.data-api',function(){$('[data-spy="scroll"]').each(function(){var $spy=$(this)
Plugin.call($spy,$spy.data())})})}(jQuery);+function($){'use strict';var Tab=function(element){this.element=$(element)}
Tab.VERSION='3.4.1'
Tab.TRANSITION_DURATION=150
Tab.prototype.show=function(){var $this=this.element
var $ul=$this.closest('ul:not(.dropdown-menu)')
var selector=$this.data('target')
if(!selector){selector=$this.attr('href')
selector=selector&&selector.replace(/.*(?=#[^\s]*$)/,'')}
if($this.parent('li').hasClass('active'))return
var $previous=$ul.find('.active:last a')
var hideEvent=$.Event('hide.bs.tab',{relatedTarget:$this[0]})
var showEvent=$.Event('show.bs.tab',{relatedTarget:$previous[0]})
$previous.trigger(hideEvent)
$this.trigger(showEvent)
if(showEvent.isDefaultPrevented()||hideEvent.isDefaultPrevented())return
var $target=$(document).find(selector)
this.activate($this.closest('li'),$ul)
this.activate($target,$target.parent(),function(){$previous.trigger({type:'hidden.bs.tab',relatedTarget:$this[0]})
$this.trigger({type:'shown.bs.tab',relatedTarget:$previous[0]})})}
Tab.prototype.activate=function(element,container,callback){var $active=container.find('> .active')
var transition=callback&&$.support.transition&&($active.length&&$active.hasClass('fade')||!!container.find('> .fade').length)
function next(){$active.removeClass('active').find('> .dropdown-menu > .active').removeClass('active').end().find('[data-toggle="tab"]').attr('aria-expanded',false)
element.addClass('active').find('[data-toggle="tab"]').attr('aria-expanded',true)
if(transition){element[0].offsetWidth
element.addClass('in')}else{element.removeClass('fade')}
if(element.parent('.dropdown-menu').length){element.closest('li.dropdown').addClass('active').end().find('[data-toggle="tab"]').attr('aria-expanded',true)}
callback&&callback()}
$active.length&&transition?$active.one('bsTransitionEnd',next).emulateTransitionEnd(Tab.TRANSITION_DURATION):next()
$active.removeClass('in')}
function Plugin(option){return this.each(function(){var $this=$(this)
var data=$this.data('bs.tab')
if(!data)$this.data('bs.tab',(data=new Tab(this)))
if(typeof option=='string')data[option]()})}
var old=$.fn.tab
$.fn.tab=Plugin
$.fn.tab.Constructor=Tab
$.fn.tab.noConflict=function(){$.fn.tab=old
return this}
var clickHandler=function(e){e.preventDefault()
Plugin.call($(this),'show')}
$(document).on('click.bs.tab.data-api','[data-toggle="tab"]',clickHandler).on('click.bs.tab.data-api','[data-toggle="pill"]',clickHandler)}(jQuery);+function($){'use strict';var Affix=function(element,options){this.options=$.extend({},Affix.DEFAULTS,options)
var target=this.options.target===Affix.DEFAULTS.target?$(this.options.target):$(document).find(this.options.target)
this.$target=target.on('scroll.bs.affix.data-api',$.proxy(this.checkPosition,this)).on('click.bs.affix.data-api',$.proxy(this.checkPositionWithEventLoop,this))
this.$element=$(element)
this.affixed=null
this.unpin=null
this.pinnedOffset=null
this.checkPosition()}
Affix.VERSION='3.4.1'
Affix.RESET='affix affix-top affix-bottom'
Affix.DEFAULTS={offset:0,target:window}
Affix.prototype.getState=function(scrollHeight,height,offsetTop,offsetBottom){var scrollTop=this.$target.scrollTop()
var position=this.$element.offset()
var targetHeight=this.$target.height()
if(offsetTop!=null&&this.affixed=='top')return scrollTop<offsetTop?'top':false
if(this.affixed=='bottom'){if(offsetTop!=null)return(scrollTop+this.unpin<=position.top)?false:'bottom'
return(scrollTop+targetHeight<=scrollHeight-offsetBottom)?false:'bottom'}
var initializing=this.affixed==null
var colliderTop=initializing?scrollTop:position.top
var colliderHeight=initializing?targetHeight:height
if(offsetTop!=null&&scrollTop<=offsetTop)return'top'
if(offsetBottom!=null&&(colliderTop+colliderHeight>=scrollHeight-offsetBottom))return'bottom'
return false}
Affix.prototype.getPinnedOffset=function(){if(this.pinnedOffset)return this.pinnedOffset
this.$element.removeClass(Affix.RESET).addClass('affix')
var scrollTop=this.$target.scrollTop()
var position=this.$element.offset()
return(this.pinnedOffset=position.top-scrollTop)}
Affix.prototype.checkPositionWithEventLoop=function(){setTimeout($.proxy(this.checkPosition,this),1)}
Affix.prototype.checkPosition=function(){if(!this.$element.is(':visible'))return
var height=this.$element.height()
var offset=this.options.offset
var offsetTop=offset.top
var offsetBottom=offset.bottom
var scrollHeight=Math.max($(document).height(),$(document.body).height())
if(typeof offset!='object')offsetBottom=offsetTop=offset
if(typeof offsetTop=='function')offsetTop=offset.top(this.$element)
if(typeof offsetBottom=='function')offsetBottom=offset.bottom(this.$element)
var affix=this.getState(scrollHeight,height,offsetTop,offsetBottom)
if(this.affixed!=affix){if(this.unpin!=null)this.$element.css('top','')
var affixType='affix'+(affix?'-'+affix:'')
var e=$.Event(affixType+'.bs.affix')
this.$element.trigger(e)
if(e.isDefaultPrevented())return
this.affixed=affix
this.unpin=affix=='bottom'?this.getPinnedOffset():null
this.$element.removeClass(Affix.RESET).addClass(affixType).trigger(affixType.replace('affix','affixed')+'.bs.affix')}
if(affix=='bottom'){this.$element.offset({top:scrollHeight-height-offsetBottom})}}
function Plugin(option){return this.each(function(){var $this=$(this)
var data=$this.data('bs.affix')
var options=typeof option=='object'&&option
if(!data)$this.data('bs.affix',(data=new Affix(this,options)))
if(typeof option=='string')data[option]()})}
var old=$.fn.affix
$.fn.affix=Plugin
$.fn.affix.Constructor=Affix
$.fn.affix.noConflict=function(){$.fn.affix=old
return this}
$(window).on('load',function(){$('[data-spy="affix"]').each(function(){var $spy=$(this)
var data=$spy.data()
data.offset=data.offset||{}
if(data.offsetBottom!=null)data.offset.bottom=data.offsetBottom
if(data.offsetTop!=null)data.offset.top=data.offsetTop
Plugin.call($spy,data)})})}(jQuery);;"use strict";function parse_hash(){var hash=document.location.hash.slice(2);if(hash){if(hash.indexOf('news')<0){var title;switch(hash){case'contact':title='Контактная информация группы веб-разработчиков Алекс-арт21';document.title=title;break;case'portfolio':title='Портфолио группы веб-разработчиков Алекс-арт21';document.title=title;break;}}else{var arr=hash.split('|');var my_title;if(arr.length==1){my_title='Разные интересности из мира веб разработки';}else if(arr.length==2){hash_link_color('news');my_title=$('h2.news_title').text();}else if(arr.length==3){hash_link_color('news');my_title='Разные интересности из мира веб разработки страница '+arr[2];}
window.document.title=my_title;}}}
function get_query(param,result_block){var bl;if((param=='id=zvonok')||(param=='id=mail'))bl='container';else bl='inc';$.ajax({url:'/response.php',data:param,success:function(data){if(param=='id=zvonok'){showModal('#zvonok');}
if(param=='id=mail'){showModal('#mail');}
$('#'+result_block).html(data);},error:function(xhr,str){document.body.style.cursor='default';alert('Возникла ошибка: '+xhr.responseCode);},cache:false,beforeSend:function(){loading(bl);},complete:function(){document.body.style.cursor='default';parse_hash();komplete(bl);}});}
function form_call(result_block){var msg=$('.send').serialize();$.ajax({type:'POST',url:'/response.php',data:msg,success:function(data){$('#'+result_block).html(data);},error:function(xhr,str){document.body.style.cursor='default';alert('Возникла ошибка: '+xhr.responseCode);},cache:false,beforeSend:function(){document.body.style.cursor='progress';},complete:function(){document.body.style.cursor='default';}});}
function zayavka(site){$.ajax({url:'/response.php',type:'GET',data:site,success:function(data){$('#inc').html(data);},error:function(xhr,str){document.body.style.cursor='default';alert('Возникла ошибка: '+xhr.responseCode);},cache:false,beforeSend:function(){loading('inc');},complete:function(){komplete();}});}
function showModal(modal){document.querySelector(modal).style.display='block';}
function hideModal(modal,animTime){document.querySelector(modal).style.display='none';komplete(false,true);}
function loading(block){if(block=='inc'){$('#inc').prepend('<div id="overlay"></div>');$('#inc').prepend('<output id="inc_loading" class="loading spinner"><div class="dot1"></div><div class="dot2"></div></output>');$('#overlay').css('border-radius','10px');document.querySelector('#overlay').style.display='block';document.querySelector('#inc_loading').style.display='block';}else{$('#container').prepend('<div id="overlay"></div>');$('#overlay').css('border-radius','none');document.querySelector('#overlay').style.display='block';document.querySelector('#container_loading').style.display='block';}
document.body.style.cursor='progress';}
function komplete(result_block,flag){if(result_block=='container')document.querySelector('#container_loading').style.display='none';if(flag){document.getElementById('mail').style.display='none';document.getElementById('zvonok').style.display='none';}
document.body.style.cursor='default';if(!result_block){$('#overlay').remove();}}
function mobLeft(){var menuBtn=document.querySelector('.mob-menu-button');var menu=document.querySelector('.mob-menu-list');var menuCol=document.querySelector('.mob-menu-col');var mobLink=document.querySelectorAll('.mob-link');menu.style.height=screen_h+'px';menuBtn.addEventListener('click',function(){var has=menuBtn.classList.contains('btn-pos');menu.classList.toggle('menu-animate');menuBtn.classList.toggle('btn-pos');menuCol.classList.toggle('open');});var c=mobLink.length;for(var i=0;i<c;i++){mobLink[i].addEventListener('click',function(){menu.classList.toggle('menu-animate');menuBtn.classList.toggle('btn-pos');menuCol.classList.toggle('open');});}}
function onLoad(){var shtorka=document.querySelector('.shtorka');shtorka.classList.add('shtorka-animate');mobLeft();var z=document.querySelectorAll('.scroll-top');var l=z.length;for(var i=0;i<l;i++){z[i].addEventListener('click',function(){scrollTo(0,0);});}
if(!location.hash){$(window).scroll(function(){menu_fix();});}else{var j=0;document.onscroll=function(){j++;if(j>1)menu_fix();};}
my_hash();if("addEventListener"in window){window.addEventListener("hashchange",my_hash);}else if("attachEvent"in window){window.attachEvent("onhashchange",my_hash);}
price_replace();}
function hash_link_color(hash_link){var l=['главная','создание сайтов','продвижение','портфолио','контакты','новости'];var link=document.querySelectorAll('.resp li a');for(var i=0;i<link.length;i++){var y=link[i].hash.slice(2);if(y==hash_link){link[i].classList.add('a_activ');link[i].removeAttribute('data-m');}else{link[i].classList.remove('a_activ');link[i].setAttribute('data-m',l[i]);}}}
function price_replace(){var r=document.getElementsByClassName('rubl');for(var i=0;i<r.length;i++){var rub=r[i].innerHTML;rub=rub.replace('руб.','<span class="rub_img"></span>');r[i].innerHTML=rub;}}
function my_hash(){var s=window.location.hash;if(s){var hash_link=s.indexOf('#!');if(hash_link>-1){hash_link=s.slice(2);get_query('id='+hash_link,'inc');hash_link_color(hash_link);}}}
function contactHover(){var li=document.getElementById('contact').getElementsByTagName('li');for(var i=0;i<li.length;i++){li[i].addEventListener("mouseover",function(e){e=e||event;var obj=e.target||e.srcElement;if(obj.nodeName!='LI'){while(obj.nodeName!='LI'){obj=obj.parentNode;}}
var rot=obj.firstChild;rot.classList.add('rotate');});li[i].addEventListener("mouseout",function(e){e=e||event;var obj=e.target||e.srcElement;if(obj.nodeName!='LI'){while(obj.nodeName!='LI'){obj=obj.parentNode;}}
var rot=obj.firstChild;rot.classList.remove('rotate');});}}
function menu_fix(){var h_hght=500;var h_mrg=0;if(screen_w>=930){$(function(){var top=$(this).scrollTop();var elem=$('#menu_outer');if((top+h_mrg)>h_hght){elem.css({'top':h_mrg,'position':'fixed','border-bottom':'2px solid #003333','border-radius':'0 0 5px 5px','box-shadow':'0 0 20px #777','background-color':'#eee','z-index':'10'});$('nav.resp ul').css('background-color','#eee');$('nav.resp ul').css('border','none');}else{elem.css({'top':0,'position':'relative','border':'','border-radius':'','box-shadow':'','background-color':'','z-index':''});$('nav.resp ul').css('background-color','');$('nav.resp ul').css('border','');}});}}
function maskTogl(tabindex){$(".phone").mask('+7   (999) 999-99-99');document.getElementById('tel').focus();var ms=document.getElementsByClassName('mask-togl')[0];var flag=true;ms.addEventListener('click',function(){var rep=document.getElementById('rep');if(flag){rep.innerHTML='<input tabindex="'+tabindex+'" id="tel" type="text" name="tel"  class="send" placeholder="в любом формате"  autofocus required />';ms.innerText='включить маску';flag=false;}else{rep.innerHTML='<input tabindex="'+tabindex+'" id="tel" name="tel" type="tel" class="send phone"  autofocus required />';$(".phone").mask('+7 (999) 999-99-99');ms.innerText='выключить маску';flag=true;}
document.getElementById('tel').focus();});}
function preloadImages(){for(var i=0;i<arguments.length;i++){new Image().src=arguments[i];}}
function titleSave(title){window.document.title=title;};$("textarea").blur(function(){$("#hire textarea").each(function(){$this=$(this);if(this.value!=""){$this.addClass("focused");$("textarea + label + span").css({opacity:1})}else{$this.removeClass("focused");$("textarea + label + span").css({opacity:0})}})});$("#hire .field:first-child input").blur(function(){$("#hire .field:first-child input").each(function(){$this=$(this);if(this.value!=""){$this.addClass("focused");$(".field:first-child input + label + span").css({opacity:1})}else{$this.removeClass("focused");$(".field:first-child input + label + span").css({opacity:0})}})});$("#hire .field:nth-child(2) input").blur(function(){$("#hire .field:nth-child(2) input").each(function(){$this=$(this);if(this.value!=""){$this.addClass("focused");$(".field:nth-child(2) input + label + span").css({opacity:1})}else{$this.removeClass("focused");$(".field:nth-child(2) input + label + span").css({opacity:0})}})});;;
/*! WOW - v0.1.6 - 2014-03-19
* Copyright (c) 2014 Matthieu Aussaguel; Licensed MIT */
(function(){var a,b=function(a,b){return function(){return a.apply(b,arguments)}};a=function(){function a(){}return a.prototype.extend=function(a,b){var c,d;for(c in a)d=a[c],null!=d&&(b[c]=d);return b},a.prototype.isMobile=function(a){return/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(a)},a}(),this.WOW=function(){function c(a){null==a&&(a={}),this.scrollCallback=b(this.scrollCallback,this),this.scrollHandler=b(this.scrollHandler,this),this.start=b(this.start,this),this.scrolled=!0,this.config=this.util().extend(a,this.defaults)}return c.prototype.defaults={boxClass:"wow",animateClass:"animated",offset:0,mobile:!0},c.prototype.init=function(){var a;return this.element=window.document.documentElement,"interactive"===(a=document.readyState)||"complete"===a?this.start():document.addEventListener("DOMContentLoaded",this.start)},c.prototype.start=function(){var a,b,c,d;if(this.boxes=this.element.getElementsByClassName(this.config.boxClass),this.boxes.length){if(this.disabled())return this.resetStyle();for(d=this.boxes,b=0,c=d.length;c>b;b++)a=d[b],this.applyStyle(a,!0);return window.addEventListener("scroll",this.scrollHandler,!1),window.addEventListener("resize",this.scrollHandler,!1),this.interval=setInterval(this.scrollCallback,50)}},c.prototype.stop=function(){return window.removeEventListener("scroll",this.scrollHandler,!1),window.removeEventListener("resize",this.scrollHandler,!1),null!=this.interval?clearInterval(this.interval):void 0},c.prototype.show=function(a){return this.applyStyle(a),a.className=""+a.className+" "+this.config.animateClass},c.prototype.applyStyle=function(a,b){var c,d,e;return d=a.getAttribute("data-wow-duration"),c=a.getAttribute("data-wow-delay"),e=a.getAttribute("data-wow-iteration"),a.setAttribute("style",this.customStyle(b,d,c,e))},c.prototype.resetStyle=function(){var a,b,c,d,e;for(d=this.boxes,e=[],b=0,c=d.length;c>b;b++)a=d[b],e.push(a.setAttribute("style","visibility: visible;"));return e},c.prototype.customStyle=function(a,b,c,d){var e;return e=a?"visibility: hidden; -webkit-animation-name: none; -moz-animation-name: none; animation-name: none;":"visibility: visible;",b&&(e+="-webkit-animation-duration: "+b+"; -moz-animation-duration: "+b+"; animation-duration: "+b+";"),c&&(e+="-webkit-animation-delay: "+c+"; -moz-animation-delay: "+c+"; animation-delay: "+c+";"),d&&(e+="-webkit-animation-iteration-count: "+d+"; -moz-animation-iteration-count: "+d+"; animation-iteration-count: "+d+";"),e},c.prototype.scrollHandler=function(){return this.scrolled=!0},c.prototype.scrollCallback=function(){var a;return this.scrolled&&(this.scrolled=!1,this.boxes=function(){var b,c,d,e;for(d=this.boxes,e=[],b=0,c=d.length;c>b;b++)a=d[b],a&&(this.isVisible(a)?this.show(a):e.push(a));return e}.call(this),!this.boxes.length)?this.stop():void 0},c.prototype.offsetTop=function(a){var b;for(b=a.offsetTop;a=a.offsetParent;)b+=a.offsetTop;return b},c.prototype.isVisible=function(a){var b,c,d,e,f;return c=a.getAttribute("data-wow-offset")||this.config.offset,f=window.pageYOffset,e=f+this.element.clientHeight-c,d=this.offsetTop(a),b=d+a.clientHeight,e>=d&&b>=f},c.prototype.util=function(){return this._util||(this._util=new a)},c.prototype.disabled=function(){return!this.config.mobile&&this.util().isMobile(navigator.userAgent)},c}()}).call(this);;