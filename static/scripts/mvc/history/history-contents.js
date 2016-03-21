define(["mvc/history/history-content-model","mvc/base/controlled-fetch-collection","mvc/history/hda-model","mvc/history/hdca-model","mvc/history/history-preferences","mvc/base-mvc"],function(a,b,c,d,e,f){"use strict";var g=b.ControlledFetchCollection,h=g.extend(f.LoggableMixin).extend({_logNamespace:"history",model:function(a,b){if("dataset"===a.history_content_type)return new c.HistoryDatasetAssociation(a,b);if("dataset_collection"===a.history_content_type){switch(a.collection_type){case"list":return new d.HistoryListDatasetCollection(a,b);case"paired":return new d.HistoryPairDatasetCollection(a,b);case"list:paired":return new d.HistoryListPairedDatasetCollection(a,b)}return{validationError:"Unknown collection_type: "+a.history_content_type}}return{validationError:"Unknown history_content_type: "+a.history_content_type}},initialize:function(a,b){b=b||{},this.historyId=b.historyId||null,this.model.prototype.idAttribute="type_id",this.includeDeleted=b.includeDeleted||!1,this.includeHidden=b.includeHidden||!1,this.on("all",function(){console.debug(arguments)})},urlRoot:Galaxy.root+"api/histories",url:function(){return this.urlRoot+"/"+this.historyId+"/contents"},order:"create_time",comparator:f.buildComparator("create_time",{ascending:!1}),running:function(){function a(a){return!a.inReadyState()}return new h(this.filter(a))},getByHid:function(a){return _.first(this.filter(function(b){return b.get("hid")===a}))},haveDetails:function(){return this.all(function(a){return a.hasDetails()})},hidden:function(){function a(a){return a.hidden()}return new h(this.filter(a))},deleted:function(){function a(a){return a.get("deleted")}return new h(this.filter(a))},visibleAndUndeleted:function(){function a(a){return a.get("visible")&&!a.get("deleted")}return new h(this.filter(a))},setIncludeDeleted:function(a){_.isBoolean(a)&&a!==this.includeDeleted&&(this.includeDeleted=a,this.trigger("change:include-deleted",a,this))},setIncludeHidden:function(a){_.isBoolean(a)&&a!==this.includeHidden&&(this.includeHidden=a,this.trigger("change:include-hidden",a,this))},fetch:function(a){if(a=a||{},this.historyId&&!a.details){var b=e.HistoryPrefs.get(this.historyId).get("expandedIds");a.details=_.values(b).join(",")}return g.prototype.fetch.call(this,a)},fetchUpdated:function(a,b){return a&&(b=b||{filters:{}},b.filters={"update_time-ge":a.toISOString()}),console.log("fetching updated:",this.historyId),this.fetch(b)},_buildFetchData:function(a){return _.extend(g.prototype._buildFetchData.call(this,a),{v:"dev"})},_fetchParams:g.prototype._fetchParams.concat(["v","details"]),_buildFetchFilters:function(a){var b={};return this.includeDeleted||(b.deleted=!1,b.purged=!1),this.includeHidden||(b.visible=!0),_.defaults(g.prototype._buildFetchFilters(this,a),b)},fetchAllDetails:function(a){a=a||{};var b={details:"all"};return a.data=_.extend(a.data||{},b),this.fetch(a)},ajaxQueue:function(a,b){var c=jQuery.Deferred(),d=this.length,e=[];if(!d)return c.resolve([]),c;var f=this.chain().reverse().map(function(g,h){return function(){var i=a.call(g,b);i.done(function(a){c.notify({curr:h,total:d,response:a,model:g})}),i.always(function(a){e.push(a),f.length?f.shift()():c.resolve(e)})}}).value();return f.shift()(),c},isCopyable:function(a){var b=["HistoryDatasetAssociation","HistoryDatasetCollectionAssociation"];return _.isObject(a)&&a.id&&_.contains(b,a.model_class)},copy:function(a){var b,c,d;_.isString(a)?(b=a,d="hda",c="dataset"):(b=a.id,d={HistoryDatasetAssociation:"hda",LibraryDatasetDatasetAssociation:"ldda",HistoryDatasetCollectionAssociation:"hdca"}[a.model_class]||"hda",c="hdca"===d?"dataset_collection":"dataset");var e=this,f=jQuery.post(this.url(),{content:b,source:d,type:c}).done(function(a){e.add([a])}).fail(function(){e.trigger("error",e,f,{},"Error copying contents",{type:c,id:b,source:d})});return f},createHDCA:function(a,b,c){var e=this,f={list:d.HistoryListDatasetCollection,paired:d.HistoryPairDatasetCollection},g=new f[b]({history_id:this.historyId,name:c,element_identifiers:a});return g.save().done(function(){e.add(g)}).fail(function(a,b,c){e.trigger("error",a,b,c)})},matches:function(a){return this.filter(function(b){return b.matches(a)})},set:function(b,c){b=_.isArray(b)?b:[b],_.each(b,function(b){b.type_id&&b.get&&b.get("type_id")||(b.type_id=a.typeIdStr(b.history_content_type,b.id))}),Backbone.Collection.prototype.set.call(this,b,c)},clone:function(){var a=Backbone.Collection.prototype.clone.call(this);return a.historyId=this.historyId,a},toString:function(){return["HistoryContents(",[this.historyId,this.length].join(),")"].join("")}});return window.HistoryContents=h,{HistoryContents:h}});
//# sourceMappingURL=../../../maps/mvc/history/history-contents.js.map