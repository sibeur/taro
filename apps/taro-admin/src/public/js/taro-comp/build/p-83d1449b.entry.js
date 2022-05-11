import{r as t,c as i,h as e,g as a}from"./p-d7752801.js";class s{constructor(t){this.media=[],this.endpoint=new o(t),this.ruleName=t.ruleName}static getInstance(t){return s.instance||(s.instance=new s(t)),s.instance}getValidationHint(){const t=((i=this.rule.validations.maxSize)>=1073741824?i=(i/1073741824).toFixed(2)+" TB":i>=1048576?i=(i/1048576).toFixed(2)+" GB":i>=1024?i=(i/1024).toFixed(2)+" MB":i>1?i+=" KB":i="0 byte",i);var i;return`Allowed file: ${this.rule.validations.allowedMimes.join(",")}, with max size: ${t}`}getMediaRule(){return this.rule}async connect(){if(this.rule=await this.getRule(),!this.rule)throw new Error("Cannot connect to API or rule not found");return this}async upload(t){try{const{data:i}=await this.endpoint.upload(this.rule.name,t),e={serverMedia:{id:i.id,url:i.mediaURL,isCommit:!1},localMedia:t,metadata:{size:t.size/1024,mime:t.type}};return this.media.push(e),e}catch(t){return Promise.reject(t)}}async deleteMedia(t){const i=this.media[t];await this.endpoint.deleteMedia(i.serverMedia.id),this.media=this.media.filter(((i,e)=>e!=t))}async commitMedia(){const t=this.media.filter((t=>!t.serverMedia.isCommit)).map((t=>t.serverMedia.id));await this.endpoint.commitMedia(t),this.media=this.media.map((t=>(t.serverMedia.isCommit||(t.serverMedia.isCommit=!0),t)))}async rollbackMedia(){for(let t=0;t<this.media.length;t++)this.media[t].serverMedia.isCommit||await this.deleteMedia(t)}getMedia(){return this.media}async getRule(){const[t]=await this.endpoint.getRuleByName(this.ruleName);return t}}class o{constructor(t,i="1"){this.serverURL=t.url,this.apiKey=t.apiKey,this.apiVersion=i}async getRuleByName(t){const{data:i}=await this.requestGET("rules",{"filter[name]":t});return i}async upload(t,i,e=!1){const a=new URL(`${this.serverURL}/media`),s=new FormData;s.append(t,i);const o=await fetch(a.toString(),{method:"POST",body:s,headers:{version:this.apiVersion,commit:e.toString(),Authorization:`Basic ${this.apiKey}`}}),n=await o.json();if(!o.ok)throw new Error(n.message);return n}async commitMedia(t){const i=new URL(`${this.serverURL}/media/commit`),e={mediaIds:t};return(await fetch(i.toString(),{method:"POST",body:JSON.stringify(e),headers:{version:this.apiVersion,Authorization:`Basic ${this.apiKey}`,"Content-Type":"application/json"}})).json()}async deleteMedia(t){const i=new URL(`${this.serverURL}/media/drop`),e={mediaIds:[t]};return(await fetch(i.toString(),{method:"DELETE",body:JSON.stringify(e),headers:{version:this.apiVersion,Authorization:`Basic ${this.apiKey}`,"Content-Type":"application/json"}})).json()}async requestGET(t,i){const e=new URL(`${this.serverURL}/${t}`);return e.search=new URLSearchParams(i).toString(),(await fetch(e.toString(),{method:"GET",headers:{version:this.apiVersion,Authorization:`Basic ${this.apiKey}`,"Content-Type":"application/json"}})).json()}}const n=class{constructor(e){t(this,e),this.uploadCompleted=i(this,"uploadCompleted",7),this.media=[]}async commit(){await this.taro.commitMedia()}async rollback(){await this.taro.rollbackMedia(),this.media=this.taro.getMedia()}async connectedCallback(){var t;this.taro=await(t={apiKey:this.apikey,url:this.serverURL,ruleName:this.rule},s.getInstance(t).connect()),this.validationHint=this.taro.getValidationHint()}componentDidLoad(){this.el.shadowRoot.querySelector("#taro-file").addEventListener("input",(t=>this.onFileInputChange(t)))}async mediaDelete(t){await this.taro.deleteMedia(t),this.media=this.media.filter(((i,e)=>e!=t))}isMediaEmpty(){return this.media.length<1}async onFileInputChange(t){try{const i=t.target.files;let e=[];for(let t=0;t<i.length;t++)e.push(this.doUpload(i[t]));await Promise.all(e),this.uploadCompleted.emit(this.media)}catch(t){alert(t.message)}}async doUpload(t){const i=await this.taro.upload(t);this.media=[...this.media,i]}render(){return e("div",{class:{taro__container:!0,center:this.isMediaEmpty()}},e("div",{class:{taro__body:!0,hidden:!this.isMediaEmpty()}},e("input",{class:"hidden",type:"file",name:"taro_files[]",id:"taro-file","data-multiple-caption":"{count} files selected",multiple:!0}),e("label",{htmlFor:"taro-file",class:"taro__instruction_label"},e("strong",null,"Choose a file"),e("br",null),e("span",{class:"box__dragndrop"},this.validationHint))),e("div",{class:{taro__upload_result:!0,hidden:this.isMediaEmpty()}},this.media.map(((t,i)=>e("div",{class:"media"},e("img",{src:t.serverMedia.url}),e("div",{class:"action"},e("button",{onClick:async()=>this.mediaDelete(i)},"Delete"))))),e("div",null,e("label",{htmlFor:"taro-file",class:"upload center flex"},"Upload"))))}get el(){return a(this)}};n.style=':host{display:block;font-family:-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",sans-serif}.center{justify-content:center;align-items:center}.flex{display:flex}.taro__container{padding:5px;outline:2px #303742 dashed;display:flex;background-color:#eee;min-height:200px}.taro__container:hover{outline-color:#5755d9}.taro__body{text-align:center}.taro__instruction_label{font-size:1.2em}.taro__instruction_label>.box__dragndrop{font-size:0.7em}.taro__instruction_label>strong{cursor:pointer}.taro__instruction_label>strong:hover{color:#5755d9}.taro__upload_result{display:flex;flex-wrap:wrap}.taro__upload_result>.media{position:relative}.taro__upload_result>.media>.action{display:none;position:absolute;top:0;width:100%;height:100%}.taro__upload_result>.media>.action button{margin:0 1px;cursor:pointer}.taro__upload_result>.media:hover>.action{display:flex;justify-content:center;align-items:center}.taro__upload_result>div{margin:5px;border:1px #303742 dashed;width:150px;height:150px}.taro__upload_result>div>img{object-fit:cover;width:100%;height:100%}.taro__upload_result>div>label{width:100%;height:100%}.taro__upload_result div>label.upload{cursor:pointer}.hidden{display:none}';export{n as taro_container}