"use strict";class t{constructor(){this.events={}}on(t,e){this.events[t]||(this.events[t]=[]),this.events[t].push(e)}emit(t,e){this.events[t]&&this.events[t].forEach((t=>t(e)))}}class e{constructor(t,e={}){this.text=t;const n=document.getElementById("fontFamily"),i=document.getElementById("fontSize");let s="Arial",o="16px";n&&(s=n.value),i&&(o=i.value),this.attributes={bold:e.bold||!1,italic:e.italic||!1,underline:e.underline||!1,undo:e.undo||!1,redo:e.redo||!1,fontFamily:e.fontFamily||s,fontSize:e.fontSize||o}}isBold(){return this.attributes.bold}setBold(t){this.attributes.bold=t}isItalic(){return this.attributes.italic}isUndo(){return this.attributes.undo}isRedo(){return this.attributes.redo}setItalic(t){this.attributes.italic=t}isUnderline(){return this.attributes.underline}setUnderline(t){this.attributes.underline=t}setUndo(t){this.attributes.undo=t}setRedo(t){this.attributes.redo=t}clone(){return new e(this.text,Object.assign({},this.attributes))}hasSameAttributes(t){return this.attributes.bold===t.attributes.bold&&this.attributes.italic===t.attributes.italic&&this.attributes.underline===t.attributes.underline&&this.attributes.undo===t.attributes.undo&&this.attributes.redo===t.attributes.redo&&this.attributes.fontFamily===t.attributes.fontFamily&&this.attributes.fontSize===t.attributes.fontSize}}class n extends t{get selectedBlockId(){return this._selectedBlockId}set selectedBlockId(t){if(this._selectedBlockId!==t){this._selectedBlockId=t;const e=this.getCursorOffset(document.querySelector('[id="editor"]')),n=this.getCursorOffset(document.querySelector('[data-id="'+t+'"]'));this.currentOffset=e-n}}constructor(){super(),this.undoStack=[],this.redoStack=[],this.dataIds=[],this._selectedBlockId=null,this.pieces=[new e("")],this.blocks=[{dataId:"data-id-1734604240404",class:"paragraph-block",alignment:"left",pieces:[new e(" ")]}],this.selectedBlockId="data-id-1734604240404",this.currentOffset=0}getPlainText(){return this.pieces.map((t=>t.text)).join("")}insertAt(t,n,i,s="",o=0,l="",c=""){let d=0,r=[],a=!1,u=0;""===s&&null===s||(u=this.blocks.findIndex((t=>t.dataId===s)),d=this.currentOffset);const h=this.getRangeText(i,i);console.log("run1..",t,i,h);for(let s of this.blocks[u].pieces){const o=d+s.text.length;if(!a&&i<=o){const o=i-d;o>0&&r.push(new e(s.text.slice(0,o),Object.assign({},s.attributes))),r.push(new e(t,{bold:n.bold||!1,italic:n.italic||!1,underline:n.underline||!1})),o<s.text.length&&r.push(new e(s.text.slice(o),Object.assign({},s.attributes))),a=!0}else r.push(s.clone());d=o}if(!a){const i=r[r.length-1];i&&i.hasSameAttributes(new e("",{bold:n.bold||!1,italic:n.italic||!1,underline:n.underline||!1}))?i.text+=t:r.push(new e(t,{bold:n.bold||!1,italic:n.italic||!1,underline:n.underline||!1}))}const g=this.mergePieces(r);this.blocks[u].pieces=g;const m=this.getRangeText(i,i+t.length);if("redo"!==c){0===this.redoStack.filter((t=>t.id===l)).length&&(this.undoStack.push({id:Date.now().toString(),start:i,end:i+t.length,action:"insert",previousValue:h,newValue:m}),this.redoStack=[])}this.emit("documentChanged",this);const f=document.querySelector('[data-id="'+s+'"]');f.focus(),this.setCursorPositionUsingOffset(f,d)}setCursorPositionUsingOffset(t,e){t.focus();const n=window.getSelection();if(!n)return;const i=document.createRange();let s=0;const o=t=>{if(3===t.nodeType){const n=t,o=s+n.length;if(console.log("data",o,n),e>=s&&e<=o)return i.setStart(n,e-s),i.collapse(!0),!0;s=o}else if(1===t.nodeType){const e=Array.from(t.childNodes);for(const t of e)if(o(t))return!0}return!1};o(t),console.log(i,"data"),n.removeAllRanges(),n.addRange(i)}deleteRange(t,n,i="",s=0){if(t===n)return;let o=[],l=0,c=0;""===i&&null===i||(c=this.blocks.findIndex((t=>t.dataId===i)),l=s);const d=this.getRangeText(t,n);console.log("run11",d);for(let i of this.blocks[c].pieces){const s=l+i.text.length;if(s<=t||l>=n)o.push(i.clone());else{const c=l,d=i.text;t>c&&t<s&&o.push(new e(d.slice(0,t-c),Object.assign({},i.attributes))),n<s&&o.push(new e(d.slice(n-c),Object.assign({},i.attributes)))}l=s}console.log(i,"dataId",this.currentOffset,"offset",l,"currentOffset",s);const r=this.mergePieces(o);this.blocks[c].pieces=r,0===r.length&&this.blocks.length>1&&(this.blocks=this.blocks.filter((t=>0!==t.pieces.length)));const a=this.getRangeText(t-1,n-1);console.log(a),this.emit("documentChanged",this)}getSelectedTextDataId(){const t=window.getSelection();if(!t||0===t.rangeCount)return null;const e=t.getRangeAt(0).startContainer,n=(e.nodeType===Node.TEXT_NODE?e.parentElement:e).closest("[data-id]");return(null==n?void 0:n.getAttribute("data-id"))||null}getAllSelectedDataIds(){var t;const e=window.getSelection();if(!e||0===e.rangeCount)return[];const n=e.getRangeAt(0),i=[],s=document.createNodeIterator(n.commonAncestorContainer,NodeFilter.SHOW_ELEMENT|NodeFilter.SHOW_TEXT);let o;for(;o=s.nextNode();)if(n.intersectsNode(o)){const e=o.nodeType===Node.TEXT_NODE?o.parentElement:o,n=null===(t=null==e?void 0:e.closest("[data-id]"))||void 0===t?void 0:t.getAttribute("data-id");n&&!i.includes(n)&&i.push(n)}return this.dataIds=i,i}getCursorOffset(t){const e=window.getSelection();if(!e||0===e.rangeCount)return-1;const n=e.getRangeAt(0);let i=0;const s=t=>{var e;return t===n.startContainer?(i+=n.startOffset,!0):(3===t.nodeType&&(i+=(null===(e=t.textContent)||void 0===e?void 0:e.length)||0),Array.from(t.childNodes).some(s))};return s(t),i}formatAttribute(t,n,i,s){console.log(i,"attribute");let o=[],l=0,c=-1;""===this.selectedBlockId&&null===this.selectedBlockId||(c=this.blocks.findIndex((t=>t.dataId===this.selectedBlockId)),l=this.currentOffset);for(let d of this.blocks[c].pieces){const c=l+d.text.length;if(c<=t||l>=n)o.push(d.clone());else{const c=l,r=d.text,a=Math.max(t-c,0),u=Math.min(n-c,r.length);a>0&&o.push(new e(r.slice(0,a),Object.assign({},d.attributes)));const h=new e(r.slice(a,u),Object.assign({},d.attributes));("bold"!==i&&"italic"!==i&&"underline"!==i&&"undo"!==i&&"redo"!==i||"boolean"!=typeof s)&&("fontFamily"!==i&&"fontSize"!==i||"string"!=typeof s)||(h.attributes[i]=s),o.push(h),u<r.length&&o.push(new e(r.slice(u),Object.assign({},d.attributes)))}l=c}const d=this.mergePieces(o);this.blocks[c].pieces=d,this.emit("documentChanged",this)}toggleOrderedList(t){const e=this.blocks.findIndex((e=>e.dataId===t)),n=this.blocks.find((e=>e.dataId===t));n&&(n.listType="ol"===n.listType?null:"ol",n.listStart=1,this.blocks[e].listType=n.listType,console.log(n,"action -- block ol ",e,this.blocks[e].listType),this.emit("documentChanged",this))}toggleUnorderedList(t){const e=this.blocks.find((e=>e.dataId===t));e&&(e.listType="ul"===e.listType?null:"ul",this.emit("documentChanged",this))}getRangeText(t,e){let n="",i=0;for(const s of this.blocks){for(const o of s.pieces){const s=o.text.length;if(i+s>=t&&i<e){const l=Math.max(0,t-i),c=Math.min(s,e-i);n+=o.text.substring(l,c)}if(i+=s,i>=e)break}if(i>=e)break}return n}undo(){const t=this.undoStack.pop();console.log(t,"action undo"),t&&(this.redoStack.push(t),this.revertAction(t))}redo(){const t=this.redoStack.pop();console.log(t,"action redo"),t&&(this.undoStack.push(t),this.applyAction(t))}revertAction(t){switch(t.action){case"bold":this.toggleBoldRange(t.start,t.end,t.id);break;case"italic":this.toggleItalicRange(t.start,t.end,t.id);break;case"underline":this.toggleUnderlineRange(t.start,t.end,t.id);break;case"insert":console.log("insert... delete"),this.deleteRange(t.start,t.end,this.selectedBlockId,this.currentOffset)}}applyAction(t){switch(t.action){case"bold":this.toggleBoldRange1(t.start,t.end,t.id);break;case"italic":this.toggleItalicRange1(t.start,t.end,t.id);break;case"underline":this.toggleUnderlineRange1(t.start,t.end,t.id);break;case"insert":console.log("insert... insert"),this.insertAt(t.newValue||"",{},t.start,this.selectedBlockId,this.currentOffset,t.id,"redo")}}toggleBoldRange1(t,e,n=""){const i=this.isRangeEntirelyAttribute(t,e,"bold");this.formatAttribute(t,e,"bold",!i)}toggleItalicRange1(t,e,n=""){const i=this.isRangeEntirelyAttribute(t,e,"italic");this.formatAttribute(t,e,"italic",!i)}toggleUnderlineRange1(t,e,n=""){const i=this.isRangeEntirelyAttribute(t,e,"underline");this.formatAttribute(t,e,"underline",!i)}toggleBoldRange(t,e,n=""){const i=this.getRangeText(t,e),s=this.isRangeEntirelyAttribute(t,e,"bold");this.formatAttribute(t,e,"bold",!s);const o=this.getRangeText(t,e);0===this.redoStack.filter((t=>t.id===n)).length&&(this.undoStack.push({id:Date.now().toString(),start:t,end:e,action:"bold",previousValue:i,newValue:o}),this.redoStack=[])}toggleItalicRange(t,e,n=""){const i=this.getRangeText(t,e),s=this.isRangeEntirelyAttribute(t,e,"italic");this.formatAttribute(t,e,"italic",!s);const o=this.getRangeText(t,e);0===this.redoStack.filter((t=>t.id===n)).length&&(this.undoStack.push({id:Date.now().toString(),start:t,end:e,action:"italic",previousValue:i,newValue:o}),this.redoStack=[])}toggleUnderlineRange(t,e,n=""){const i=this.getRangeText(t,e),s=this.isRangeEntirelyAttribute(t,e,"underline");this.formatAttribute(t,e,"underline",!s);const o=this.getRangeText(t,e);0===this.redoStack.filter((t=>t.id===n)).length&&(this.undoStack.push({id:Date.now().toString(),start:t,end:e,action:"underline",previousValue:i,newValue:o}),this.redoStack=[])}toggleUndoRange(t,e,n=""){const i=this.isRangeEntirelyAttribute(t,e,"undo");this.formatAttribute(t,e,"undo",!i)}toggleRedoRange(t,e){const n=this.isRangeEntirelyAttribute(t,e,"redo");this.formatAttribute(t,e,"redo",!n)}isRangeEntirelyAttribute(t,e,n){let i=this.currentOffset,s=!0;if(""!==this.selectedBlockId){const o=this.blocks.findIndex((t=>t.dataId===this.selectedBlockId));for(let l of this.blocks[o].pieces){const o=i+l.text.length;if(o>t&&i<e&&!l.attributes[n]){s=!1;break}i=o}}return s}mergePieces(t){let e=[];for(let n of t){const t=e[e.length-1];t&&t.hasSameAttributes(n)?t.text+=n.text:e.push(n)}return e}findPieceAtOffset(t,e=""){let n=this.currentOffset;if(""!==e){const i=this.blocks.findIndex((t=>t.dataId===e));for(let e of this.blocks[i].pieces){const i=n+e.text.length;if(t>=n&&t<=i)return e;n=i}}return null}setFontFamily(t,e,n){this.formatAttribute(t,e,"fontFamily",n)}setFontSize(t,e,n){this.formatAttribute(t,e,"fontSize",n)}setAlignment(t,e){const n=this.blocks.find((t=>t.dataId===e));n&&(n.alignment=t,this.emit("documentChanged",this))}}function i(t){const e=window.getSelection();if(!e||0===e.rangeCount)return null;const n=e.getRangeAt(0),i=n.cloneRange();i.selectNodeContents(t),i.setEnd(n.startContainer,n.startOffset);const s=i.toString().length;i.setEnd(n.endContainer,n.endOffset);return{start:s,end:i.toString().length}}class s{constructor(t,e){this.container=t,this.document=e}render(){const t=i(this.container);this.container.innerHTML="",console.log(this.document.blocks,"action -- block editorview"),this.document.blocks.forEach((t=>{if(""!==t.dataId){let e,n;"ol"===t.listType?(e=document.createElement("ol"),e.setAttribute("start",null==t?void 0:t.listStart.toString())):e="ul"===t.listType?document.createElement("ul"):document.createElement("div"),e.setAttribute("data-id",t.dataId),e.setAttribute("class",t.class),e.style.textAlign=t.alignment||"left","ol"===t.listType||"ul"===t.listType?(n=document.createElement("li"),t.pieces.forEach((t=>{n.appendChild(this.renderPiece(t))})),e.append(n)):t.pieces.forEach((t=>{e.appendChild(this.renderPiece(t))})),this.container.appendChild(e)}})),function(t,e){if(!e)return;let n=0;const i=document.createRange();i.setStart(t,0),i.collapse(!0);const s=[t];let o,l=!1,c=!1;for(;!c&&(o=s.pop());)if(3===o.nodeType){const t=o,s=n+t.length;!l&&e.start>=n&&e.start<=s&&(i.setStart(t,e.start-n),l=!0),l&&e.end>=n&&e.end<=s&&(i.setEnd(t,e.end-n),c=!0),n=s}else if("BR"===o.tagName)l||e.start!==n||(i.setStartBefore(o),l=!0),l&&e.end===n&&(i.setEndBefore(o),c=!0),n++;else{const t=o;let e=t.childNodes.length;for(;e--;)s.push(t.childNodes[e])}const d=window.getSelection();d&&(d.removeAllRanges(),d.addRange(i))}(this.container,t)}renderPiece(t){const e=t.text.split("\n");return this.wrapAttributes(e,t.attributes)}wrapAttributes(t,e){const n=document.createDocumentFragment();return t.forEach(((i,s)=>{let o=document.createTextNode(i);if(e.underline){const t=document.createElement("u");t.appendChild(o),o=t}if(e.italic){const t=document.createElement("em");t.appendChild(o),o=t}if(e.bold){const t=document.createElement("strong");t.appendChild(o),o=t}console.log(e,"attribute----1",document.getElementById("fontFamily"));const l=document.getElementById("fontFamily"),c=document.getElementById("fontSize");let d="Arial",r="16px";l&&(d=l.value,console.log(d,"Selected Font Family")),c&&(r=c.value,console.log(r,"Selected Font size"));const a=document.createElement("span");a.style.fontFamily=e.fontFamily||d,a.style.fontSize=e.fontSize||r,a.appendChild(o),n.appendChild(a),s<t.length-1&&n.appendChild(document.createElement("br"))})),n}}class o extends t{constructor(t){super(),this.container=t,this.setupButtons()}setupButtons(){this.container.querySelectorAll("button").forEach((t=>{t.addEventListener("mousedown",(t=>{t.preventDefault()}))})),this.container.addEventListener("click",(t=>{const e=t.target.closest("button");if(e){const t=e.getAttribute("data-action");t&&this.emit("toolbarAction",t)}}))}updateActiveStates(t){this.container.querySelectorAll("button").forEach((e=>{const n=e.getAttribute("data-action");let i=!1;"bold"===n&&t.bold&&(i=!0),"italic"===n&&t.italic&&(i=!0),"underline"===n&&t.underline&&(i=!0),"undo"===n&&t.undo&&(i=!0),"redo"===n&&t.redo&&(i=!0),e.classList.toggle("active",i)}))}}function l(t){return c((new DOMParser).parseFromString(t,"text/html").body,{bold:!1,italic:!1,underline:!1})}function c(t,n){let i=Object.assign({},n);const s=[];if(t instanceof HTMLElement)"STRONG"!==t.tagName&&"B"!==t.tagName||(i.bold=!0),"EM"!==t.tagName&&"I"!==t.tagName||(i.italic=!0),"U"===t.tagName&&(i.underline=!0),t.childNodes.forEach((t=>{console.log({child:t}),s.push(...c(t,i))}));else if(t instanceof Text){const n=t.nodeValue||"";""!==n.trim()&&s.push(new e(n,Object.assign({},i)))}return s}window.TextIgniter=class{constructor(t,i){var c,d,r,a,u;this.document=new n,this.editorView=new s(t,this.document),this.toolbarView=new o(i),this.currentAttributes={bold:!1,italic:!1,underline:!1,undo:!1,redo:!1},this.manualOverride=!1,this.lastPiece=null,this.toolbarView.on("toolbarAction",(t=>this.handleToolbarAction(t))),this.document.on("documentChanged",(()=>this.editorView.render())),t.addEventListener("keydown",(t=>this.handleKeydown(t))),t.addEventListener("keyup",(()=>this.syncCurrentAttributesWithCursor())),document.addEventListener("mouseup",(()=>{const t=this.document.getAllSelectedDataIds();console.log("Selected text is inside element with data-id:",t),console.log(this.document.dataIds,"this.document.dataIds")})),null===(c=document.getElementById("fontFamily"))||void 0===c||c.addEventListener("change",(t=>{const e=t.target.value,[n,i]=this.getSelectionRange();this.document.setFontFamily(n,i,e)})),null===(d=document.getElementById("fontSize"))||void 0===d||d.addEventListener("change",(t=>{const e=t.target.value,[n,i]=this.getSelectionRange();this.document.setFontSize(n,i,e)})),null===(r=document.getElementById("alignLeft"))||void 0===r||r.addEventListener("click",(()=>{this.document.setAlignment("left",this.document.selectedBlockId)})),null===(a=document.getElementById("alignCenter"))||void 0===a||a.addEventListener("click",(()=>{this.document.setAlignment("center",this.document.selectedBlockId)})),null===(u=document.getElementById("alignRight"))||void 0===u||u.addEventListener("click",(()=>{this.document.setAlignment("right",this.document.selectedBlockId)})),document.addEventListener("keydown",(t=>{if((t.ctrlKey||t.metaKey)&&!t.altKey){const e=t.key.toLowerCase();if(["b","i","u"].includes(e)){t.preventDefault();const n="b"===e?"bold":"i"===e?"italic":"underline";this.handleToolbarAction(n)}"z"===e?(t.preventDefault(),this.document.undo()):"y"===e&&(t.preventDefault(),this.document.redo()),"l"===t.key?(t.preventDefault(),this.document.setAlignment("left",this.document.selectedBlockId)):"e"===t.key?(t.preventDefault(),this.document.setAlignment("center",this.document.selectedBlockId)):"r"===t.key&&(t.preventDefault(),this.document.setAlignment("right",this.document.selectedBlockId)),console.log("undo",this.document.undoStack,"redo",this.document.redoStack)}})),document.addEventListener("selectionchange",this.handleSelectionChange.bind(this)),this.document.emit("documentChanged",this.document),t.addEventListener("paste",(t=>{var n,i;t.preventDefault();const s=null===(n=t.clipboardData)||void 0===n?void 0:n.getData("text/html"),[o,c]=this.getSelectionRange();c>o&&this.document.deleteRange(o,c);let d=[];if(s)d=l(s);else{const n=(null===(i=t.clipboardData)||void 0===i?void 0:i.getData("text/plain"))||"";d=[new e(n,Object.assign({},this.currentAttributes))]}let r=o;for(const t of d)this.document.insertAt(t.text,Object.assign({},t.attributes),r,this.document.selectedBlockId),r+=t.text.length;this.setCursorPosition(r)})),t.addEventListener("dragover",(t=>{t.preventDefault()})),t.addEventListener("drop",(t=>{var n,i;t.preventDefault();const s=null===(n=t.dataTransfer)||void 0===n?void 0:n.getData("text/html"),[o,c]=this.getSelectionRange();c>o&&this.document.deleteRange(o,c);let d=[];if(s)d=l(s);else{const n=(null===(i=t.dataTransfer)||void 0===i?void 0:i.getData("text/plain"))||"";d=[new e(n,Object.assign({},this.currentAttributes))]}let r=o;for(const t of d)this.document.insertAt(t.text,Object.assign({},t.attributes),r,this.document.selectedBlockId),r+=t.text.length;this.setCursorPosition(r)}))}getSelectionRange(){const t=i(this.editorView.container);return t?[t.start,t.end]:[0,0]}handleToolbarAction(t){const[e,n]=this.getSelectionRange();switch(console.log(t,"action---"),t){case"orderedList":this.document.toggleOrderedList(this.document.selectedBlockId);break;case"unorderedList":this.document.toggleUnorderedList(this.document.selectedBlockId)}if(e<n)switch(t){case"bold":this.document.toggleBoldRange(e,n);break;case"italic":this.document.toggleItalicRange(e,n);break;case"underline":this.document.toggleUnderlineRange(e,n);break;case"undo":this.document.undo();break;case"redo":this.document.redo()}else this.currentAttributes[t]=!this.currentAttributes[t],this.manualOverride=!0;console.log("undo",this.document.undoStack,"redo",this.document.redoStack),this.toolbarView.updateActiveStates(this.currentAttributes)}handleSelectionChange(){var t;const e=window.getSelection();if(!e||0===e.rangeCount)return;const n=null===(t=e.getRangeAt(0).startContainer.parentElement)||void 0===t?void 0:t.closest("[data-id]");n&&n instanceof HTMLElement&&(this.document.selectedBlockId=n.getAttribute("data-id")||null)}handleKeydown(t){var n,i,s,o;const[l,c]=this.getSelectionRange();if("Enter"===t.key){console.log("blocks",this.document.blocks),t.preventDefault();const d=`data-id-${Date.now()}`;if("ol"===(null===(n=this.document.blocks[this.document.blocks.length-1])||void 0===n?void 0:n.listType)||"ul"===(null===(i=this.document.blocks[this.document.blocks.length-1])||void 0===i?void 0:i.listType)){const t=null===(s=this.document.blocks[this.document.blocks.length-1])||void 0===s?void 0:s.listType;let n=1;"ol"===t&&(n=null===(o=this.document.blocks[this.document.blocks.length-1])||void 0===o?void 0:o.listStart,n+=1),this.document.blocks.push({dataId:d,class:"paragraph-block",pieces:[new e(" ")],listType:t,listStart:"ol"===t?n:""})}else this.document.blocks.push({dataId:d,class:"paragraph-block",pieces:[new e(" ")]});this.syncCurrentAttributesWithCursor(),this.editorView.render(),this.setCursorPosition(c+1,d),c>l&&this.document.deleteRange(l,c,this.document.selectedBlockId,this.document.currentOffset)}else"Backspace"===t.key?(t.preventDefault(),l===c&&l>0?(this.document.deleteRange(l-1,l,this.document.selectedBlockId,this.document.currentOffset),this.setCursorPosition(l-1)):c>l&&(this.document.deleteRange(l,c,this.document.selectedBlockId,this.document.currentOffset),this.setCursorPosition(l))):1!==t.key.length||t.ctrlKey||t.metaKey||t.altKey?"Delete"===t.key&&(t.preventDefault(),l===c?(this.document.deleteRange(l,l+1,this.document.selectedBlockId),this.setCursorPosition(l)):c>l&&(this.document.deleteRange(l,c,this.document.selectedBlockId),this.setCursorPosition(l))):(t.preventDefault(),c>l&&this.document.deleteRange(l,c,this.document.selectedBlockId,this.document.currentOffset),this.document.insertAt(t.key,Object.assign({},this.currentAttributes),l,this.document.selectedBlockId,this.document.currentOffset),this.setCursorPosition(l+1))}syncCurrentAttributesWithCursor(){const[t,e]=this.getSelectionRange();if(t===e){const e=this.document.findPieceAtOffset(t,this.document.selectedBlockId);e?(e!==this.lastPiece&&(this.manualOverride=!1,this.lastPiece=e),this.manualOverride||(this.currentAttributes={bold:e.attributes.bold,italic:e.attributes.italic,underline:e.attributes.underline},this.toolbarView.updateActiveStates(this.currentAttributes))):(this.manualOverride||(this.currentAttributes={bold:!1,italic:!1,underline:!1},this.toolbarView.updateActiveStates(this.currentAttributes)),this.lastPiece=null)}}setCursorPosition(t,e=""){if(""===e)this.editorView.container.focus();else{document.querySelector('[data-id="'+e+'"]').focus()}const n=window.getSelection();if(!n)return;const i=document.createRange();let s=0;const o=[this.editorView.container];let l;for(;l=o.pop();)if(3===l.nodeType){const e=l,n=s+e.length;if(t>=s&&t<=n){i.setStart(e,t-s),i.collapse(!0);break}s=n}else if("BR"===l.tagName){if(t===s){i.setStartBefore(l),i.collapse(!0);break}s++}else{const t=l;let e=t.childNodes.length;for(;e--;)o.push(t.childNodes[e])}n.removeAllRanges(),n.addRange(i)}};
