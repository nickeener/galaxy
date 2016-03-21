define(["mvc/history/history-view","mvc/history/history-contents","mvc/dataset/states","mvc/history/hda-model","mvc/history/hda-li-edit","mvc/history/hdca-li-edit","mvc/tag","mvc/annotation","mvc/collection/list-collection-creator","mvc/collection/pair-collection-creator","mvc/collection/list-of-pairs-collection-creator","ui/fa-icon-button","mvc/ui/popup-menu","utils/localization","ui/editable-text"],function(a,b,c,d,e,f,g,h,i,j,k,l,m,n){"use strict";var o=a.HistoryView,p=o.extend({HDAViewClass:e.HDAListItemEdit,HDCAViewClass:f.HDCAListItemEdit,initialize:function(a){a=a||{},o.prototype.initialize.call(this,a),this.tagsEditor=null,this.annotationEditor=null,this.purgeAllowed=a.purgeAllowed||!1,this.annotationEditorShown=a.annotationEditorShown||!1,this.tagsEditorShown=a.tagsEditorShown||!1},_setUpListeners:function(){var a=this;o.prototype._setUpListeners.call(a),a.on("drop",function(b,c){a.dataDropped(c),a.dropTargetOff()}),a.on("view:attached view:removed",function(){a._renderCounts()})},_setUpCollectionListeners:function(){return o.prototype._setUpCollectionListeners.call(this),this.listenTo(this.collection,{"change:deleted":this._handleHdaDeletionChange,"change:visible":this._handleHdaVisibleChange,"change:purged":function(){this.model.fetch()}}),this},_setUpModelListeners:function(){return o.prototype._setUpModelListeners.call(this),this.listenTo(this.model,"change:size",this.updateHistoryDiskSize),this},_buildNewRender:function(){var a=o.prototype._buildNewRender.call(this);return this.model?(Galaxy&&Galaxy.user&&Galaxy.user.id&&Galaxy.user.id===this.model.get("user_id")&&(this._renderTags(a),this._renderAnnotation(a)),a):a},renderItems:function(a){var b=o.prototype.renderItems.call(this,a);return this._renderCounts(a),b},_renderCounts:function(a){function b(a,b){return['<a class="',a,'" href="javascript:void(0);">',b,"</a>"].join("")}a=a||this.$el;var c=this.collection.where({deleted:!0}),d=this.collection.where({visible:!1}),e=[];return this.views.length&&e.push([this.views.length,n("shown")].join(" ")),c.length&&e.push(this.showDeleted?b("toggle-deleted-link",n("hide deleted")):[c.length,b("toggle-deleted-link",n("deleted"))].join(" ")),d.length&&e.push(this.showHidden?b("toggle-hidden-link",n("hide hidden")):[d.length,b("toggle-hidden-link",n("hidden"))].join(" ")),a.find("> .controls .subtitle").html(e.join(", "))},_renderTags:function(a){var b=this;this.tagsEditor=new g.TagsEditor({model:this.model,el:a.find(".controls .tags-display"),onshowFirstTime:function(){this.render()},onshow:function(){b.toggleHDATagEditors(!0,b.fxSpeed)},onhide:function(){b.toggleHDATagEditors(!1,b.fxSpeed)},$activator:l({title:n("Edit history tags"),classes:"history-tag-btn",faIcon:"fa-tags"}).appendTo(a.find(".controls .actions"))})},_renderAnnotation:function(a){var b=this;this.annotationEditor=new h.AnnotationEditor({model:this.model,el:a.find(".controls .annotation-display"),onshowFirstTime:function(){this.render()},onshow:function(){b.toggleHDAAnnotationEditors(!0,b.fxSpeed)},onhide:function(){b.toggleHDAAnnotationEditors(!1,b.fxSpeed)},$activator:l({title:n("Edit history annotation"),classes:"history-annotate-btn",faIcon:"fa-comment"}).appendTo(a.find(".controls .actions"))})},_setUpBehaviors:function(a){if(a=a||this.$el,o.prototype._setUpBehaviors.call(this,a),this.model&&Galaxy.user&&!Galaxy.user.isAnonymous()&&Galaxy.user.id===this.model.get("user_id")){var b=this,c="> .controls .name";a.find(c).attr("title",n("Click to rename history")).tooltip({placement:"bottom"}).make_text_editable({on_finish:function(a){var d=b.model.get("name");a&&a!==d?(b.$el.find(c).text(a),b.model.save({name:a}).fail(function(){b.$el.find(c).text(b.model.previous("name"))})):b.$el.find(c).text(d)}})}},multiselectActions:function(){var a=this,b=[{html:n("Hide datasets"),func:function(){var b=d.HistoryDatasetAssociation.prototype.hide;a.getSelectedModels().ajaxQueue(b)}},{html:n("Unhide datasets"),func:function(){var b=d.HistoryDatasetAssociation.prototype.unhide;a.getSelectedModels().ajaxQueue(b)}},{html:n("Delete datasets"),func:function(){var b=d.HistoryDatasetAssociation.prototype.delete;a.getSelectedModels().ajaxQueue(b)}},{html:n("Undelete datasets"),func:function(){var b=d.HistoryDatasetAssociation.prototype.undelete;a.getSelectedModels().ajaxQueue(b)}}];return a.purgeAllowed&&b.push({html:n("Permanently delete datasets"),func:function(){if(confirm(n("This will permanently remove the data in your datasets. Are you sure?"))){var b=d.HistoryDatasetAssociation.prototype.purge;a.getSelectedModels().ajaxQueue(b)}}}),b=b.concat(a._collectionActions())},_collectionActions:function(){var a=this;return[{html:n("Build Dataset List"),func:function(){i.createListCollection(a.getSelectedModels()).done(function(){a.model.refresh()})}},{html:n("Build Dataset Pair"),func:function(){j.createPairCollection(a.getSelectedModels()).done(function(){a.model.refresh()})}},{html:n("Build List of Dataset Pairs"),func:function(){k.createListOfPairsCollection(a.getSelectedModels()).done(function(){a.model.refresh()})}}]},_getItemViewOptions:function(a){var b=o.prototype._getItemViewOptions.call(this,a);return _.extend(b,{purgeAllowed:this.purgeAllowed,tagsEditorShown:this.tagsEditor&&!this.tagsEditor.hidden,annotationEditorShown:this.annotationEditor&&!this.annotationEditor.hidden}),b},_handleHdaDeletionChange:function(a){a.get("deleted")&&!this.showDeleted&&this.removeItemView(a),this._renderCounts()},_handleHdaVisibleChange:function(a){a.hidden()&&!this.showHidden&&this.removeItemView(a),this._renderCounts()},toggleHDATagEditors:function(){var a=Array.prototype.slice.call(arguments,1);_.each(this.views,function(b){b.tagsEditor&&b.tagsEditor.toggle.apply(b.tagsEditor,a)})},toggleHDAAnnotationEditors:function(){var a=Array.prototype.slice.call(arguments,1);_.each(this.views,function(b){b.annotationEditor&&b.annotationEditor.toggle.apply(b.annotationEditor,a)})},events:_.extend(_.clone(o.prototype.events),{"click .show-selectors-btn":"toggleSelectors","click .toggle-deleted-link":function(){this.toggleShowDeleted()},"click .toggle-hidden-link":function(){this.toggleShowHidden()}}),updateHistoryDiskSize:function(){this.$(".history-size").text(this.model.get("nice_size"))},dropTargetOn:function(){if(this.dropTarget)return this;this.dropTarget=!0;var a={dragenter:_.bind(this.dragenter,this),dragover:_.bind(this.dragover,this),dragleave:_.bind(this.dragleave,this),drop:_.bind(this.drop,this)},b=this._renderDropTarget();this.$list().before([this._renderDropTargetHelp(),b]);for(var c in a)a.hasOwnProperty(c)&&b.on(c,a[c]);return this},_renderDropTarget:function(){return this.$(".history-drop-target").remove(),$("<div/>").addClass("history-drop-target").css({height:"64px",margin:"0px 10px 10px 10px",border:"1px dashed black","border-radius":"3px"})},_renderDropTargetHelp:function(){return this.$(".history-drop-target-help").remove(),$("<div/>").addClass("history-drop-target-help").css({margin:"10px 10px 4px 10px",color:"grey","font-size":"80%","font-style":"italic"}).text(n("Drag datasets here to copy them to the current history"))},dropTargetOff:function(){if(!this.dropTarget)return this;this.dropTarget=!1;var a=this.$(".history-drop-target").get(0);for(var b in this._dropHandlers)this._dropHandlers.hasOwnProperty(b)&&a.off(b,this._dropHandlers[b]);return this.$(".history-drop-target").remove(),this.$(".history-drop-target-help").remove(),this},dropTargetToggle:function(){return this.dropTarget?this.dropTargetOff():this.dropTargetOn(),this},dragenter:function(a){a.preventDefault(),a.stopPropagation(),this.$(".history-drop-target").css("border","2px solid black")},dragover:function(a){a.preventDefault(),a.stopPropagation()},dragleave:function(a){a.preventDefault(),a.stopPropagation(),this.$(".history-drop-target").css("border","1px dashed black")},drop:function(a){a.preventDefault();var b=a.originalEvent.dataTransfer;b.dropEffect="move";var c=this,d=b.getData("text");try{d=JSON.parse(d)}catch(e){this.warn("error parsing JSON from drop:",d)}return this.trigger("droptarget:drop",a,d,c),!1},dataDropped:function(a){var b=this;return _.isObject(a)&&"HistoryDatasetAssociation"===a.model_class&&a.id?b.model.contents.copy(a.id):jQuery.when()},toString:function(){return"HistoryViewEdit("+(this.model?this.model.get("name"):"")+")"}});return{HistoryViewEdit:p}});
//# sourceMappingURL=../../../maps/mvc/history/history-view-edit.js.map