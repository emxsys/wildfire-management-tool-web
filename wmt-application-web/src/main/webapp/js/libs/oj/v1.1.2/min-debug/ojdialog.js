/**
 * Copyright (c) 2014, 2015, Oracle and/or its affiliates.
 * All rights reserved.
 */
"use strict";
/*
 Copyright 2013 jQuery Foundation and other contributors
 Released under the MIT license.
 http://jquery.org/license
 Copyright 2013 jQuery Foundation and other contributors
 Released under the MIT license.
 http://jquery.org/license
*/
define(["ojs/ojcore", "jquery", "ojs/ojcomponentcore", "ojs/ojpopupcore", "jqueryui-amd/draggable"], function($oj$$32$$, $$$$30$$) {
  (function() {
    $oj$$32$$.$__registerWidget$("oj.ojDialog", $$$$30$$.oj.baseComponent, {version:"1.0.0", widgetEventPrefix:"oj", options:{cancelBehavior:"icon", dragAffordance:"title-bar", initialVisibility:"hide", modality:"modal", position:{my:"center", at:"center", of:window, collision:"fit", $using$:function($pos$$9$$) {
      var $topOffset$$ = $$$$30$$(this).css($pos$$9$$).offset().top;
      0 > $topOffset$$ && $$$$30$$(this).css("top", $pos$$9$$.top - $topOffset$$);
    }}, resizeBehavior:"resizable", role:"dialog", title:null, beforeClose:null, beforeOpen:null, close:null, focus:null, open:null, resize:null, resizeStart:null, resizeStop:null}, _ComponentCreate:function() {
      this._super();
      this.$originalCss$ = {display:this.element[0].style.display, width:this.element[0].style.width, height:this.element[0].style.height};
      this.$originalPosition$ = {parent:this.element.parent(), index:this.element.parent().children().index(this.element)};
      this.$originalTitle$ = this.element.attr("title");
      this.options.title = this.options.title || this.$originalTitle$;
      this.$_createWrapper$();
      this.element.show().removeAttr("title").addClass("oj-dialog-content oj-dialog-default-content").appendTo(this.$uiDialog$);
      this.$userDefinedDialogHeader$ = !1;
      if (this.element.find(".oj-dialog").length) {
        var $that$$1$$ = this;
        this.element.find(".oj-dialog-header").each(function($index$$220$$, $li$$1$$) {
          var $dialogHeader$$ = $$$$30$$($li$$1$$);
          if (!$dialogHeader$$.closest(".oj-dialog-body").length) {
            return $that$$1$$.$_userDefinedHeader$ = $dialogHeader$$, $that$$1$$.$userDefinedDialogHeader$ = !0, !1;
          }
        });
      } else {
        this.$_userDefinedHeader$ = this.element.find(".oj-dialog-header"), this.$_userDefinedHeader$.length && (this.$userDefinedDialogHeader$ = !0);
      }
      this.$userDefinedDialogHeader$ ? (this.$_createPlaceHolderHeader$(this.$_userDefinedHeader$), this.$_userDefinedHeader$.prependTo(this.$uiDialog$), "icon" === this.options.cancelBehavior && (this.$_createCloseButton$(this.$_userDefinedHeader$), this.$_userDefinedTitle$ = this.$_userDefinedHeader$.find(".oj-dialog-title"), this.$_userDefinedTitle$.length && this.$_userDefinedTitle$.insertAfter(this.$uiDialogTitlebarCloseWrapper$))) : this.$_createTitlebar$();
      this.$uiDialogFooter$ = this.element.children(".oj-dialog-footer");
      this.$_createPlaceHolderFooter$(this.$uiDialogFooter$);
      this.$uiDialogFooter$.length && (this.$uiDialogFooter$.addClass("oj-helper-clearfix"), this.$uiDialogFooter$.appendTo(this.$uiDialog$));
      "title-bar" === this.options.dragAffordance && $$$$30$$.fn.draggable && this.$_makeDraggable$();
      this.$_hasResizeListener$ = !1;
      this.$_handleResizeFcn$ = this.$_resizeBody$.bind(this);
      this.$uiDialog$.length && ($oj$$32$$.$DomUtils$.$addResizeListener$(this.$uiDialog$[0], this.$_handleResizeFcn$, 30), this.$_hasResizeListener$ = !0);
      this.$_isOpen$ = !1;
    }, $_AfterCreateEvent$:function() {
      "show" === this.options.initialVisibility && this.open();
    }, _destroy:function() {
      this.$_delayId$ && window.clearTimeout(this.$_delayId$);
      this.isOpen() && this.$_closeImplicitly$();
      this.$_hasResizeListener$ && ($oj$$32$$.$DomUtils$.$removeResizeListener$(this.$uiDialog$[0], this.$_handleResizeFcn$), this.$_hasResizeListener$ = !1);
      var $header$$9_isDraggable$$ = this.$uiDialog$.hasClass("oj-draggable");
      this.$uiDialog$.draggable && $header$$9_isDraggable$$ && this.$uiDialog$.draggable("destroy");
      this.$_resizableComponent$ && (this.$_resizableComponent$("destroy"), this.$_resizableComponent$ = null);
      this.$uiDialogFooter$.length && (this.$uiDialogFooter$.removeClass("oj-helper-clearfix"), $$$$30$$("#" + this.$_placeHolderFooterId$).replaceWith(this.$uiDialogFooter$));
      this.$_destroyCloseButton$();
      this.$userDefinedDialogHeader$ && ($header$$9_isDraggable$$ = this.$uiDialog$.find(".oj-dialog-header")) && $$$$30$$("#" + this.$_placeHolderHeaderId$).replaceWith($header$$9_isDraggable$$);
      this.$uiDialogTitle$ && (this.$uiDialogTitle$.remove(), this.$uiDialogTitle$ = null);
      this.element.removeUniqueId().removeClass("oj-dialog-content oj-dialog-default-content").css(this.$originalCss$);
      this.$uiDialog$ && this.$uiDialog$.stop(!0, !0);
      this.element.unwrap();
      this.$originalTitle$ && this.element.attr("title", this.$originalTitle$);
      this.$uiDialogTitlebar$ && (this.$uiDialogTitlebar$.remove(), this.$uiDialogTitlebar$ = null);
      delete this.$_popupServiceEvents$;
      delete this.$_isOpen$;
      this._super();
    }, widget:function() {
      return this.$uiDialog$;
    }, disable:$$$$30$$.noop, enable:$$$$30$$.noop, close:function($event$$365$$) {
      if (this.isOpen() && (!1 !== this._trigger("beforeClose", $event$$365$$) || this.$_ignoreBeforeCloseResultant$)) {
        this.$_isOpen$ = !1;
        this.$_focusedElement$ = null;
        this.opener.filter(":focusable").focus().length || $$$$30$$(this.document[0].activeElement).blur();
        var $psOptions$$2$$ = {};
        $psOptions$$2$$[$oj$$32$$.$PopupService$.$OPTION$.$POPUP$] = this.$uiDialog$;
        $oj$$32$$.$PopupService$.$getInstance$().close($psOptions$$2$$);
        this._trigger("close", $event$$365$$);
      }
    }, isOpen:function() {
      return this.$_isOpen$;
    }, open:function($event$$366_psOptions$$3$$) {
      !1 !== this._trigger("beforeOpen", $event$$366_psOptions$$3$$) && (this.isOpen() || (this.$_isOpen$ = !0, this.opener = $$$$30$$(this.document[0].activeElement), this.$_size$(), "resizable" === this.options.resizeBehavior && this.$_makeResizable$(), $event$$366_psOptions$$3$$ = {}, $event$$366_psOptions$$3$$[$oj$$32$$.$PopupService$.$OPTION$.$POPUP$] = this.$uiDialog$, $event$$366_psOptions$$3$$[$oj$$32$$.$PopupService$.$OPTION$.$LAUNCHER$] = this.opener, $event$$366_psOptions$$3$$[$oj$$32$$.$PopupService$.$OPTION$.$POSITION$] = 
      this.options.position, $event$$366_psOptions$$3$$[$oj$$32$$.$PopupService$.$OPTION$.$MODALITY$] = this.options.modality, $event$$366_psOptions$$3$$[$oj$$32$$.$PopupService$.$OPTION$.$EVENTS$] = this.$_getPopupServiceEvents$(), $event$$366_psOptions$$3$$[$oj$$32$$.$PopupService$.$OPTION$.$LAYER_SELECTORS$] = "oj-dialog-layer", $oj$$32$$.$PopupService$.$getInstance$().open($event$$366_psOptions$$3$$), this._trigger("open")), this.$_focusTabbable$());
    }, refresh:function() {
      this._super();
      this.$_size$();
      this.$_resizeBody$();
    }, $_focusTabbable$:function() {
      var $hasFocus$$ = this.$_focusedElement$;
      $hasFocus$$ && 0 < $hasFocus$$.length && $oj$$32$$.$DomUtils$.$isAncestorOrSelf$(this.$uiDialog$[0], $hasFocus$$[0]) || ($hasFocus$$ || ($hasFocus$$ = this.element.find("[autofocus]")), $hasFocus$$.length || ($hasFocus$$ = this.element.find(":tabbable")), $hasFocus$$.length || this.$uiDialogFooter$.length && ($hasFocus$$ = this.$uiDialogFooter$.find(":tabbable")), $hasFocus$$.length || this.$uiDialogTitlebarClose$ && ($hasFocus$$ = this.$uiDialogTitlebarClose$.filter(":tabbable")), $hasFocus$$.length || 
      ($hasFocus$$ = this.$uiDialog$), $hasFocus$$.eq(0).focus(), this._trigger("focus"));
    }, _keepFocus:function($activeElement$$inline_928_event$$367$$) {
      $activeElement$$inline_928_event$$367$$.preventDefault();
      $activeElement$$inline_928_event$$367$$ = this.document[0].activeElement;
      this.$uiDialog$[0] === $activeElement$$inline_928_event$$367$$ || $$$$30$$.contains(this.$uiDialog$[0], $activeElement$$inline_928_event$$367$$) || this.$_focusTabbable$();
    }, $_isNumber$:function($value$$244$$) {
      return!isNaN(parseInt($value$$244$$, 10));
    }, $_createWrapper$:function() {
      this.$_isResizing$ = !1;
      this.element.uniqueId();
      this.$_elementId$ = this.element.attr("id");
      this.$_wrapperId$ = "ojDialogWrapper-" + this.$_elementId$;
      this.$uiDialog$ = $$$$30$$("\x3cdiv\x3e");
      this.$uiDialog$.addClass("oj-dialog oj-component").hide().attr({tabIndex:-1, role:this.options.role, id:this.$_wrapperId$});
      this.$uiDialog$.insertBefore(this.element);
      this._on(this.$uiDialog$, {keyup:function() {
      }, keydown:function($event$$369$$) {
        if ("none" != this.options.cancelBehavior && !$event$$369$$.isDefaultPrevented() && $event$$369$$.keyCode && $event$$369$$.keyCode === $$$$30$$.ui.keyCode.ESCAPE) {
          $event$$369$$.preventDefault(), $event$$369$$.stopImmediatePropagation(), this.close($event$$369$$);
        } else {
          if ($event$$369$$.keyCode === $$$$30$$.ui.keyCode.TAB && "modeless" !== this.options.modality) {
            var $tabbables$$ = this.$uiDialog$.find(":tabbable"), $first$$9_index$$221$$ = $tabbables$$.filter(":first"), $last$$4$$ = $tabbables$$.filter(":last");
            $event$$369$$.shiftKey ? $event$$369$$.shiftKey && ($event$$369$$.target === $first$$9_index$$221$$[0] || $event$$369$$.target === this.$uiDialog$[0] ? ($last$$4$$.focus(), $event$$369$$.preventDefault()) : ($first$$9_index$$221$$ = $tabbables$$.index(document.activeElement), 1 == $first$$9_index$$221$$ && $tabbables$$[0] && ($tabbables$$[0].focus(), $event$$369$$.preventDefault()))) : $event$$369$$.target === $last$$4$$[0] || $event$$369$$.target === this.$uiDialog$[0] ? ($first$$9_index$$221$$.focus(), 
            $event$$369$$.preventDefault()) : ($first$$9_index$$221$$ = $tabbables$$.index(document.activeElement), 0 == $first$$9_index$$221$$ && $tabbables$$[1] && ($tabbables$$[1].focus(), $event$$369$$.preventDefault()));
          }
        }
      }});
      this.element.find("[aria-describedby]").length || this.$uiDialog$.attr({"aria-describedby":this.element.uniqueId().attr("id")});
    }, $_destroyCloseButton$:function() {
      this.$uiDialogTitlebarCloseWrapper$ && (this.$uiDialogTitlebarCloseWrapper$.remove(), this.$uiDialogTitlebarClose$ = this.$uiDialogTitlebarCloseWrapper$ = null);
    }, $_createCloseButton$:function($domDestination$$) {
      this.$uiDialogTitlebarCloseWrapper$ = $$$$30$$("\x3cdiv\x3e").addClass("oj-dialog-header-close-wrapper").attr("tabindex", "1").attr("aria-label", "close").attr("role", "button").appendTo($domDestination$$);
      this.$uiDialogTitlebarClose$ = $$$$30$$("\x3cspan\x3e").addClass("oj-component-icon oj-clickable-icon oj-dialog-close-icon").attr("alt", "close icon").prependTo(this.$uiDialogTitlebarCloseWrapper$);
      this._on(this.$uiDialogTitlebarCloseWrapper$, {click:function($event$$370$$) {
        $event$$370$$.preventDefault();
        $event$$370$$.stopImmediatePropagation();
        this.close($event$$370$$);
      }, mousedown:function($event$$371$$) {
        $$$$30$$($event$$371$$.currentTarget).addClass("oj-active");
      }, mouseup:function($event$$372$$) {
        $$$$30$$($event$$372$$.currentTarget).removeClass("oj-active");
      }, mouseenter:function($event$$373$$) {
        $$$$30$$($event$$373$$.currentTarget).addClass("oj-hover");
      }, mouseleave:function($currTarget$$7_event$$374$$) {
        $currTarget$$7_event$$374$$ = $currTarget$$7_event$$374$$.currentTarget;
        $$$$30$$($currTarget$$7_event$$374$$).removeClass("oj-hover");
        $$$$30$$($currTarget$$7_event$$374$$).removeClass("oj-active");
      }, keyup:function($event$$375$$) {
        if ($event$$375$$.keyCode && $event$$375$$.keyCode === $$$$30$$.ui.keyCode.SPACE || $event$$375$$.keyCode === $$$$30$$.ui.keyCode.ENTER) {
          $event$$375$$.preventDefault(), $event$$375$$.stopImmediatePropagation(), this.close($event$$375$$);
        }
      }});
    }, $_createTitlebar$:function() {
      var $uiDialogTitle$$;
      this.$uiDialogTitlebar$ = $$$$30$$("\x3cdiv\x3e").addClass("oj-dialog-header oj-helper-clearfix").prependTo(this.$uiDialog$);
      this._on(this.$uiDialogTitlebar$, {mousedown:function($event$$376$$) {
        $$$$30$$($event$$376$$.target).closest(".oj-dialog-close-icon") || this.$uiDialog$.focus();
      }});
      "icon" === this.options.cancelBehavior && this.$_createCloseButton$(this.$uiDialogTitlebar$);
      $uiDialogTitle$$ = $$$$30$$("\x3cspan\x3e").uniqueId().addClass("oj-dialog-title").appendTo(this.$uiDialogTitlebar$);
      this.$_title$($uiDialogTitle$$);
      this.$uiDialog$.attr({"aria-labelledby":$uiDialogTitle$$.attr("id")});
    }, $_title$:function($title$$10$$) {
      this.options.title || $title$$10$$.html("\x26#160;");
      $title$$10$$.text(this.options.title);
    }, $_makeDraggable$:function() {
      function $filteredUi$$($ui$$18$$) {
        return{position:$ui$$18$$.position, offset:$ui$$18$$.offset};
      }
      var $that$$2$$ = this, $options$$320$$ = this.options;
      this.$uiDialog$.draggable({$addClasses$:!1, cancel:".oj-dialog-content, .oj-dialog-header-close", handle:".oj-dialog-header", containment:"document", start:function($event$$377$$, $ui$$19$$) {
        $$$$30$$(this).addClass("oj-dialog-dragging");
        $that$$2$$.$_blockFrames$();
        $that$$2$$._trigger("dragStart", $event$$377$$, $filteredUi$$($ui$$19$$));
      }, drag:function($event$$378$$, $ui$$20$$) {
        $that$$2$$._trigger("drag", $event$$378$$, $filteredUi$$($ui$$20$$));
      }, stop:function($event$$379$$, $ui$$21$$) {
        $options$$320$$.position = [$ui$$21$$.position.left - $that$$2$$.document.scrollLeft(), $ui$$21$$.position.top - $that$$2$$.document.scrollTop()];
        $$$$30$$(this).removeClass("oj-dialog-dragging");
        $that$$2$$.$_unblockFrames$();
        $that$$2$$._trigger("dragStop", $event$$379$$, $filteredUi$$($ui$$21$$));
      }});
      this.$uiDialog$.addClass("oj-draggable");
    }, $_makeResizable$:function() {
      function $filteredUi$$1$$($ui$$22$$) {
        return{originalPosition:$ui$$22$$.$originalPosition$, originalSize:$ui$$22$$.$originalSize$, position:$ui$$22$$.position, size:$ui$$22$$.size};
      }
      var $that$$3$$ = this;
      this.$uiDialog$.css("position");
      this.$_resizableComponent$ = this.$uiDialog$.ojResizable.bind(this.$uiDialog$);
      this.$_resizableComponent$({cancel:".oj-dialog-content", containment:"document", handles:"n,e,s,w,se,sw,ne,nw", start:function($event$$380$$, $ui$$23$$) {
        $that$$3$$.$_isResizing$ = !0;
        $$$$30$$(this).addClass("oj-dialog-resizing");
        $that$$3$$.$_blockFrames$();
        $that$$3$$._trigger("resizeStart", $event$$380$$, $filteredUi$$1$$($ui$$23$$));
      }, resize:function($event$$381$$, $ui$$24$$) {
        $that$$3$$._trigger("resize", $event$$381$$, $filteredUi$$1$$($ui$$24$$));
      }, stop:function($event$$382$$, $ui$$25$$) {
        $that$$3$$.$_isResizing$ = !1;
        $$$$30$$(this).removeClass("oj-dialog-resizing");
        $that$$3$$.$_unblockFrames$();
        $that$$3$$._trigger("resizeStop", $event$$382$$, $filteredUi$$1$$($ui$$25$$));
      }});
    }, $_position$:function() {
      var $isRtl$$2_position$$21$$ = "rtl" === this.$_GetReadingDirection$(), $isRtl$$2_position$$21$$ = $oj$$32$$.$PositionUtils$.$normalizeHorizontalAlignment$(this.options.position, $isRtl$$2_position$$21$$);
      this.$uiDialog$.position($isRtl$$2_position$$21$$);
      this.$_positionDescendents$();
    }, $_positionDescendents$:function() {
      $oj$$32$$.$PopupService$.$getInstance$().$triggerOnDescendents$(this.$uiDialog$, $oj$$32$$.$PopupService$.$EVENT$.$POPUP_REFRESH$);
    }, _setOption:function($isDraggable$$1_key$$144$$, $value$$245$$, $flags$$36$$) {
      var $isResizable_psOptions$$4_uiDialog$$;
      $isResizable_psOptions$$4_uiDialog$$ = this.$uiDialog$;
      if ("disabled" !== $isDraggable$$1_key$$144$$) {
        switch(this._super($isDraggable$$1_key$$144$$, $value$$245$$, $flags$$36$$), $isDraggable$$1_key$$144$$) {
          case "dragAffordance":
            ($isDraggable$$1_key$$144$$ = $isResizable_psOptions$$4_uiDialog$$.hasClass("oj-draggable")) && "none" === $value$$245$$ && ($isResizable_psOptions$$4_uiDialog$$.draggable("destroy"), this.$uiDialog$.removeClass("oj-draggable"));
            $isDraggable$$1_key$$144$$ || "title-bar" !== $value$$245$$ || this.$_makeDraggable$();
            break;
          case "position":
            this.$_position$();
            break;
          case "resizeBehavior":
            $isResizable_psOptions$$4_uiDialog$$ = !1;
            this.$_resizableComponent$ && ($isResizable_psOptions$$4_uiDialog$$ = !0);
            $isResizable_psOptions$$4_uiDialog$$ && "resizable" != $value$$245$$ && (this.$_resizableComponent$("destroy"), this.$_resizableComponent$ = null);
            $isResizable_psOptions$$4_uiDialog$$ || "resizable" !== $value$$245$$ || this.$_makeResizable$();
            break;
          case "title":
            this.$_title$(this.$uiDialogTitlebar$.find(".oj-dialog-title"));
            break;
          case "role":
            $isResizable_psOptions$$4_uiDialog$$.attr("role", $value$$245$$);
            break;
          case "modality":
            this.isOpen() && ($isResizable_psOptions$$4_uiDialog$$ = {}, $isResizable_psOptions$$4_uiDialog$$[$oj$$32$$.$PopupService$.$OPTION$.$POPUP$] = this.$uiDialog$, $isResizable_psOptions$$4_uiDialog$$[$oj$$32$$.$PopupService$.$OPTION$.$MODALITY$] = $value$$245$$, $oj$$32$$.$PopupService$.$getInstance$().$changeOptions$($isResizable_psOptions$$4_uiDialog$$));
            break;
          case "cancelBehavior":
            "none" === $value$$245$$ || "escape" === $value$$245$$ ? this.$_destroyCloseButton$() : "icon" === $value$$245$$ && (this.$userDefinedDialogHeader$ ? (this.$_destroyCloseButton$(), this.$_createCloseButton$(this.$_userDefinedHeader$), this.$_userDefinedTitle$ = this.$_userDefinedHeader$.find(".oj-dialog-title"), this.$_userDefinedTitle$.length && this.$_userDefinedTitle$.insertAfter(this.$uiDialogTitlebarCloseWrapper$)) : (this.$_destroyCloseButton$(), this.$_createCloseButton$(this.$uiDialogTitlebar$), 
            this.$standardTitle$ = this.$uiDialogTitlebar$.find(".oj-dialog-title"), this.$standardTitle$.length && this.$standardTitle$.insertAfter(this.$uiDialogTitlebarCloseWrapper$)));
        }
      }
    }, $_resizeBody$:function() {
      var $bodyHeight_hasPctHeight$$ = !1;
      this.$uiDialog$.length && this.$uiDialog$[0].style.height && ($bodyHeight_hasPctHeight$$ = this.$uiDialog$[0].style.height.indexOf("%"));
      this.$_isResizing$ && $bodyHeight_hasPctHeight$$ && ($bodyHeight_hasPctHeight$$ = this.$_getBodyHeight$(), this.element.css({height:$bodyHeight_hasPctHeight$$}));
    }, $_getBodyHeight$:function() {
      this.$_delayId$ = null;
      var $headerHeight$$ = (this.$userDefinedDialogHeader$ ? this.$_userDefinedHeader$ : this.$uiDialogTitlebar$).outerHeight(), $footerHeight$$ = 0;
      this.$uiDialogFooter$.length && ($footerHeight$$ = this.$uiDialogFooter$.outerHeight());
      return this.$uiDialog$.height() - $headerHeight$$ - $footerHeight$$;
    }, $_measureDialogHeight$:function() {
      var $tempE$$ = $$$$30$$("\x3cdiv\x3e");
      this.$_cssHeight$ = this.$uiDialog$.css("height");
      "auto" != this.$_cssHeight$ ? ($tempE$$.height(this.$_cssHeight$), this.$_cssHeightNumeric$ = $tempE$$.height(), this.$_isNumber$(this.$_cssHeightNumeric$) && (this.$_cssHeightNumeric$ = Math.ceil(this.$_cssHeightNumeric$))) : this.$_cssHeightNumeric$ = "auto";
      $tempE$$.remove();
    }, $_size$:function() {
      this.$_measureDialogHeight$();
      var $heightValue$$ = this.$uiDialog$[0].style.height, $widthValue$$ = this.$uiDialog$[0].style.width, $minHeightValue$$ = this.$uiDialog$[0].style.minHeight, $maxHeightValue$$ = this.$uiDialog$[0].style.maxHeight;
      this.element.css({width:"auto", minHeight:0, maxHeight:"none", height:0});
      var $nonContentHeight$$;
      $nonContentHeight$$ = this.$uiDialog$.css({minHeight:0, maxHeight:"none", height:"auto"}).outerHeight();
      this.element.css({width:"", minHeight:"", maxHeight:"", height:""});
      this.$uiDialog$.css({width:$widthValue$$});
      this.$uiDialog$.css({height:$heightValue$$});
      this.$uiDialog$.css({minHeight:$minHeightValue$$});
      this.$uiDialog$.css({maxHeight:$maxHeightValue$$});
      "auto" != $heightValue$$ && "" != $heightValue$$ && this.element.height(Math.max(0, this.$_cssHeightNumeric$ + 0 - $nonContentHeight$$));
    }, $_blockFrames$:function() {
      this.$iframeBlocks$ = this.document.find("iframe").map(function() {
        var $iframe$$ = $$$$30$$(this), $offset$$24$$ = $iframe$$.offset();
        return $$$$30$$("\x3cdiv\x3e").css({width:$iframe$$.outerWidth(), height:$iframe$$.outerHeight()}).appendTo($iframe$$.parent()).offset($offset$$24$$)[0];
      });
    }, $_unblockFrames$:function() {
      this.$iframeBlocks$ && (this.$iframeBlocks$.remove(), delete this.$iframeBlocks$);
    }, $_createPlaceHolderFooter$:function($domElement$$) {
      this.$_placeHolderFooterId$ = "ojDialogPlaceHolderFooter-" + this.$_elementId$;
      this.$_placeHolderFooter$ = $$$$30$$("\x3cdiv\x3e").hide().attr({id:this.$_placeHolderFooterId$});
      this.$_placeHolderFooter$.insertBefore($domElement$$);
    }, $_createPlaceHolderHeader$:function($domElement$$1$$) {
      this.$_placeHolderHeaderId$ = "ojDialogPlaceHolderHeader-" + this.$_elementId$;
      this.$_placeHolderHeader$ = $$$$30$$("\x3cdiv\x3e").hide().attr({id:this.$_placeHolderHeaderId$});
      this.$_placeHolderHeader$.insertBefore($domElement$$1$$);
    }, getNodeBySubId:function($dotSubId_locator$$38_subId$$38$$) {
      if (null == $dotSubId_locator$$38_subId$$38$$) {
        return this.element ? this.element[0] : null;
      }
      $dotSubId_locator$$38_subId$$38$$ = $dotSubId_locator$$38_subId$$38$$.subId;
      switch($dotSubId_locator$$38_subId$$38$$) {
        case "oj-dialog":
        ;
        case "oj-dialog-header":
        ;
        case "oj-dialog-body":
        ;
        case "oj-dialog-footer":
        ;
        case "oj-dialog-content":
        ;
        case "oj-dialog-header-close-wrapper":
        ;
        case "oj-dialog-close-icon":
        ;
        case "oj-resizable-n":
        ;
        case "oj-resizable-e":
        ;
        case "oj-resizable-s":
        ;
        case "oj-resizable-w":
        ;
        case "oj-resizable-se":
        ;
        case "oj-resizable-sw":
        ;
        case "oj-resizable-ne":
        ;
        case "oj-resizable-nw":
          return $dotSubId_locator$$38_subId$$38$$ = "." + $dotSubId_locator$$38_subId$$38$$, this.widget().find($dotSubId_locator$$38_subId$$38$$)[0];
      }
      return null;
    }, $_surrogateRemoveHandler$:function() {
      this.element.remove();
    }, $_getPopupServiceEvents$:function() {
      if (!this.$_popupServiceEvents$) {
        var $events$$4$$ = this.$_popupServiceEvents$ = {};
        $events$$4$$[$oj$$32$$.$PopupService$.$EVENT$.$POPUP_CLOSE$] = $$$$30$$.proxy(this.$_closeImplicitly$, this);
        $events$$4$$[$oj$$32$$.$PopupService$.$EVENT$.$POPUP_REMOVE$] = $$$$30$$.proxy(this.$_surrogateRemoveHandler$, this);
        $events$$4$$[$oj$$32$$.$PopupService$.$EVENT$.$POPUP_REFRESH$] = $$$$30$$.proxy(this.$_positionDescendents$, this);
      }
      return this.$_popupServiceEvents$;
    }, $_closeImplicitly$:function() {
      this.$_ignoreBeforeCloseResultant$ = !0;
      this.close();
      delete this.$_ignoreBeforeCloseResultant$;
    }});
  })();
  (function() {
    var $mouseHandled$$ = !1;
    $$$$30$$(document).mouseup(function() {
      $mouseHandled$$ = !1;
    });
    $oj$$32$$.$__registerWidget$("oj.ojResizable", $$$$30$$.oj.baseComponent, {version:"1.0.0", widgetEventPrefix:"oj", options:{cancel:"input,textarea,button,select,option", distance:1, delay:0, maxHeight:null, maxWidth:null, minHeight:10, minWidth:10, alsoResize:!1, animate:!1, animateDuration:"slow", animateEasing:"swing", containment:!1, ghost:!1, grid:!1, handles:"e,s,se", helper:!1, resize:null, start:null, stop:null}, $_mouseInit$:function() {
      var $that$$4$$ = this;
      this.element.bind("mousedown." + this.widgetName, function($event$$383$$) {
        return $that$$4$$.$_mouseDown$($event$$383$$);
      }).bind("click." + this.widgetName, function($event$$384$$) {
        if (!0 === $$$$30$$.data($event$$384$$.target, $that$$4$$.widgetName + ".preventClickEvent")) {
          return $$$$30$$.removeData($event$$384$$.target, $that$$4$$.widgetName + ".preventClickEvent"), $event$$384$$.stopImmediatePropagation(), !1;
        }
      });
    }, $_mouseDestroy$:function() {
      this.element.unbind("." + this.widgetName);
      this.$_mouseMoveDelegate$ && this.document.unbind("mousemove." + this.widgetName, this.$_mouseMoveDelegate$).unbind("mouseup." + this.widgetName, this.$_mouseUpDelegate$);
    }, $_mouseDown$:function($event$$385$$) {
      if (!$mouseHandled$$) {
        this.$_mouseStarted$ && this.$_mouseUp$($event$$385$$);
        this.$_mouseDownEvent$ = $event$$385$$;
        var $that$$5$$ = this, $btnIsLeft$$ = 1 === $event$$385$$.which, $elIsCancel$$ = "string" === typeof this.options.cancel && $event$$385$$.target.nodeName ? $$$$30$$($event$$385$$.target).closest(this.options.cancel).length : !1;
        if (!$btnIsLeft$$ || $elIsCancel$$ || !this.$_mouseCapture$($event$$385$$)) {
          return!0;
        }
        (this.$mouseDelayMet$ = !this.options.delay) || setTimeout(function() {
          $that$$5$$.$mouseDelayMet$ = !0;
        }, this.options.delay);
        if (this.$_mouseDistanceMet$($event$$385$$) && this.$mouseDelayMet$ && (this.$_mouseStarted$ = !1 !== this.$_mouseStart$($event$$385$$), !this.$_mouseStarted$)) {
          return $event$$385$$.preventDefault(), !0;
        }
        !0 === $$$$30$$.data($event$$385$$.target, this.widgetName + ".preventClickEvent") && $$$$30$$.removeData($event$$385$$.target, this.widgetName + ".preventClickEvent");
        this.$_mouseMoveDelegate$ = function $this$$_mouseMoveDelegate$$($event$$386$$) {
          return $that$$5$$.$_mouseMove$($event$$386$$);
        };
        this.$_mouseUpDelegate$ = function $this$$_mouseUpDelegate$$($event$$387$$) {
          return $that$$5$$.$_mouseUp$($event$$387$$);
        };
        this.document.bind("mousemove." + this.widgetName, this.$_mouseMoveDelegate$).bind("mouseup." + this.widgetName, this.$_mouseUpDelegate$);
        $event$$385$$.preventDefault();
        return $mouseHandled$$ = !0;
      }
    }, $_mouseMove$:function($event$$388$$) {
      if ($$$$30$$.ui.$ie$ && (!document.documentMode || 9 > document.documentMode) && !$event$$388$$.button || !$event$$388$$.which) {
        return this.$_mouseUp$($event$$388$$);
      }
      if (this.$_mouseStarted$) {
        return this.$_mouseDrag$($event$$388$$), $event$$388$$.preventDefault();
      }
      this.$_mouseDistanceMet$($event$$388$$) && this.$mouseDelayMet$ && ((this.$_mouseStarted$ = !1 !== this.$_mouseStart$(this.$_mouseDownEvent$, $event$$388$$)) ? this.$_mouseDrag$($event$$388$$) : this.$_mouseUp$($event$$388$$));
      return!this.$_mouseStarted$;
    }, $_mouseUp$:function($event$$389$$) {
      this.document.unbind("mousemove." + this.widgetName, this.$_mouseMoveDelegate$).unbind("mouseup." + this.widgetName, this.$_mouseUpDelegate$);
      this.$_mouseStarted$ && (this.$_mouseStarted$ = !1, $event$$389$$.target === this.$_mouseDownEvent$.target && $$$$30$$.data($event$$389$$.target, this.widgetName + ".preventClickEvent", !0), this.$_mouseStop$($event$$389$$));
      return $mouseHandled$$ = !1;
    }, $_mouseDistanceMet$:function($event$$390$$) {
      return Math.max(Math.abs(this.$_mouseDownEvent$.pageX - $event$$390$$.pageX), Math.abs(this.$_mouseDownEvent$.pageY - $event$$390$$.pageY)) >= this.options.distance;
    }, $_mouseDelayMet$:function() {
      return this.$mouseDelayMet$;
    }, $_num$:function($value$$246$$) {
      return parseInt($value$$246$$, 10) || 0;
    }, $_isNumber$:function($value$$247$$) {
      return!isNaN(parseInt($value$$247$$, 10));
    }, $_hasScroll$:function($el$$11$$, $a$$109$$) {
      if ("hidden" === $$$$30$$($el$$11$$).css("overflow")) {
        return!1;
      }
      var $scroll$$13$$ = $a$$109$$ && "left" === $a$$109$$ ? "scrollLeft" : "scrollTop", $has$$ = !1;
      if (0 < $el$$11$$[$scroll$$13$$]) {
        return!0;
      }
      $el$$11$$[$scroll$$13$$] = 1;
      $has$$ = 0 < $el$$11$$[$scroll$$13$$];
      $el$$11$$[$scroll$$13$$] = 0;
      return $has$$;
    }, _ComponentCreate:function() {
      this._super();
      var $n$$22_o$$, $i$$335$$, $handle$$19$$, $axis$$54$$, $hname$$, $that$$6$$ = this;
      $n$$22_o$$ = this.options;
      this.element.addClass("oj-resizable");
      $$$$30$$.extend(this, {$originalElement$:this.element, $_proportionallyResizeElements$:[], $_helper$:null});
      this.handles = $n$$22_o$$.handles || ($$$$30$$(".oj-resizable-handle", this.element).length ? {$n$:".oj-resizable-n", $e$:".oj-resizable-e", $s$:".oj-resizable-s", $w$:".oj-resizable-w", $se$:".oj-resizable-se", $sw$:".oj-resizable-sw", $ne$:".oj-resizable-ne", $nw$:".oj-resizable-nw"} : "e,s,se");
      if (this.handles.constructor === String) {
        for ("all" === this.handles && (this.handles = "n,e,s,w,se,sw,ne,nw"), $n$$22_o$$ = this.handles.split(","), this.handles = {}, $i$$335$$ = 0;$i$$335$$ < $n$$22_o$$.length;$i$$335$$++) {
          $handle$$19$$ = $$$$30$$.trim($n$$22_o$$[$i$$335$$]), $hname$$ = "oj-resizable-" + $handle$$19$$, $axis$$54$$ = $$$$30$$("\x3cdiv class\x3d'oj-resizable-handle " + $hname$$ + "'\x3e\x3c/div\x3e"), this.handles[$handle$$19$$] = ".oj-resizable-" + $handle$$19$$, this.element.append($axis$$54$$);
        }
      }
      this.$_renderAxis$ = function $this$$_renderAxis$$() {
        for (var $i$$336$$ in this.handles) {
          this.handles[$i$$336$$].constructor === String && (this.handles[$i$$336$$] = this.element.children(this.handles[$i$$336$$]).first().show());
        }
      };
      this.$_renderAxis$();
      this.$_handles$ = $$$$30$$(".oj-resizable-handle", this.element);
      this.$_handles$.mouseover(function() {
        $that$$6$$.$resizing$ || (this.className && ($axis$$54$$ = this.className.match(/oj-resizable-(se|sw|ne|nw|n|e|s|w)/i)), $that$$6$$.axis = $axis$$54$$ && $axis$$54$$[1] ? $axis$$54$$[1] : "se");
      });
      this.$_mouseInit$();
    }, _destroy:function() {
      this.$_mouseDestroy$();
      $$$$30$$(this.$originalElement$).removeClass("oj-resizable oj-resizable-disabled oj-resizable-resizing").removeData("resizable").removeData("oj-resizable").unbind(".resizable").find(".oj-resizable-handle").remove();
      return this;
    }, $_mouseCapture$:function($event$$391$$) {
      var $i$$337$$, $handle$$20$$, $capture$$ = !1;
      for ($i$$337$$ in this.handles) {
        if ($handle$$20$$ = $$$$30$$(this.handles[$i$$337$$])[0], $handle$$20$$ === $event$$391$$.target || $$$$30$$.contains($handle$$20$$, $event$$391$$.target)) {
          $capture$$ = !0;
        }
      }
      return!this.options.disabled && $capture$$;
    }, $_mouseStart$:function($event$$392$$) {
      var $curleft_iniPos$$, $curtop$$, $cursor_o$$1$$;
      $cursor_o$$1$$ = this.options;
      $curleft_iniPos$$ = this.element.position();
      var $el$$12$$ = this.element;
      this.$resizing$ = !0;
      /absolute/.test($el$$12$$.css("position")) ? $el$$12$$.css({position:"absolute", top:$el$$12$$.css("top"), left:$el$$12$$.css("left")}) : $el$$12$$.is(".oj-draggable") && $el$$12$$.css({position:"absolute", top:$curleft_iniPos$$.top, left:$curleft_iniPos$$.left});
      this.$_renderProxy$();
      $curleft_iniPos$$ = this.$_num$(this.helper.css("left"));
      $curtop$$ = this.$_num$(this.helper.css("top"));
      $cursor_o$$1$$.containment && ($curleft_iniPos$$ += $$$$30$$($cursor_o$$1$$.containment).scrollLeft() || 0, $curtop$$ += $$$$30$$($cursor_o$$1$$.containment).scrollTop() || 0);
      this.offset = this.helper.offset();
      this.position = {left:$curleft_iniPos$$, top:$curtop$$};
      this.size = {width:$el$$12$$.width(), height:$el$$12$$.height()};
      this.$originalSize$ = {width:$el$$12$$.width(), height:$el$$12$$.height()};
      this.$originalPosition$ = {left:$curleft_iniPos$$, top:$curtop$$};
      this.$sizeDiff$ = {width:$el$$12$$.outerWidth() - $el$$12$$.width(), height:$el$$12$$.outerHeight() - $el$$12$$.height()};
      this.$originalMousePosition$ = {left:$event$$392$$.pageX, top:$event$$392$$.pageY};
      this.$aspectRatio$ = this.$originalSize$.width / this.$originalSize$.height || 1;
      $cursor_o$$1$$ = $$$$30$$(".oj-resizable-" + this.axis).css("cursor");
      $$$$30$$("body").css("cursor", "auto" === $cursor_o$$1$$ ? this.axis + "-resize" : $cursor_o$$1$$);
      $el$$12$$.addClass("oj-resizable-resizing");
      this.$_propagate$("start", $event$$392$$);
      this.$_alsoresize_start$($event$$392$$);
      this.$_containment_start$($event$$392$$);
      return!0;
    }, $_mouseDrag$:function($event$$393$$) {
      var $data$$149_dx$$4$$, $el$$13$$ = this.helper, $props$$17$$ = {}, $dy$$4_smp$$ = this.$originalMousePosition$;
      $data$$149_dx$$4$$ = $event$$393$$.pageX - $dy$$4_smp$$.left || 0;
      var $dy$$4_smp$$ = $event$$393$$.pageY - $dy$$4_smp$$.top || 0, $trigger$$ = this.$_change$[this.axis];
      this.$prevPosition$ = {top:this.position.top, left:this.position.left};
      this.$prevSize$ = {width:this.size.width, height:this.size.height};
      if (!$trigger$$) {
        return!1;
      }
      $data$$149_dx$$4$$ = $trigger$$.apply(this, [$event$$393$$, $data$$149_dx$$4$$, $dy$$4_smp$$]);
      this.$_updateVirtualBoundaries$($event$$393$$.shiftKey);
      $event$$393$$.shiftKey && ($data$$149_dx$$4$$ = this.$_updateRatio$($data$$149_dx$$4$$, $event$$393$$));
      $data$$149_dx$$4$$ = this.$_respectSize$($data$$149_dx$$4$$, $event$$393$$);
      this.$_updateCache$($data$$149_dx$$4$$);
      this.$_propagate$("resize", $event$$393$$);
      this.$_alsoresize_resize$($event$$393$$, this.ui());
      this.$_containment_resize$($event$$393$$, this.ui());
      this.position.top !== this.$prevPosition$.top && ($props$$17$$.top = this.position.top + "px");
      this.position.left !== this.$prevPosition$.left && ($props$$17$$.left = this.position.left + "px");
      this.size.width !== this.$prevSize$.width && ($props$$17$$.width = this.size.width + "px");
      this.size.height !== this.$prevSize$.height && ($props$$17$$.height = this.size.height + "px");
      $el$$13$$.css($props$$17$$);
      !this.$_helper$ && this.$_proportionallyResizeElements$.length && this.$_proportionallyResize$();
      $$$$30$$.isEmptyObject($props$$17$$) || this._trigger("resize", $event$$393$$, this.ui());
      return!1;
    }, $_mouseStop$:function($event$$394$$) {
      this.$resizing$ = !1;
      $$$$30$$("body").css("cursor", "auto");
      this.element.removeClass("oj-resizable-resizing");
      this.$_propagate$("stop", $event$$394$$);
      this.$_alsoresize_stop$($event$$394$$);
      this.$_containment_stop$($event$$394$$);
      return!1;
    }, $_updateVirtualBoundaries$:function($forceAspectRatio_pMinWidth$$) {
      var $pMaxWidth$$, $pMinHeight$$, $pMaxHeight$$, $b$$71_o$$3$$;
      $b$$71_o$$3$$ = this.options;
      $b$$71_o$$3$$ = {minWidth:this.$_isNumber$($b$$71_o$$3$$.minWidth) ? $b$$71_o$$3$$.minWidth : 0, maxWidth:this.$_isNumber$($b$$71_o$$3$$.maxWidth) ? $b$$71_o$$3$$.maxWidth : Infinity, minHeight:this.$_isNumber$($b$$71_o$$3$$.minHeight) ? $b$$71_o$$3$$.minHeight : 0, maxHeight:this.$_isNumber$($b$$71_o$$3$$.maxHeight) ? $b$$71_o$$3$$.maxHeight : Infinity};
      $forceAspectRatio_pMinWidth$$ && ($forceAspectRatio_pMinWidth$$ = $b$$71_o$$3$$.minHeight * this.$aspectRatio$, $pMinHeight$$ = $b$$71_o$$3$$.minWidth / this.$aspectRatio$, $pMaxWidth$$ = $b$$71_o$$3$$.maxHeight * this.$aspectRatio$, $pMaxHeight$$ = $b$$71_o$$3$$.maxWidth / this.$aspectRatio$, $forceAspectRatio_pMinWidth$$ > $b$$71_o$$3$$.minWidth && ($b$$71_o$$3$$.minWidth = $forceAspectRatio_pMinWidth$$), $pMinHeight$$ > $b$$71_o$$3$$.minHeight && ($b$$71_o$$3$$.minHeight = $pMinHeight$$), 
      $pMaxWidth$$ < $b$$71_o$$3$$.maxWidth && ($b$$71_o$$3$$.maxWidth = $pMaxWidth$$), $pMaxHeight$$ < $b$$71_o$$3$$.maxHeight && ($b$$71_o$$3$$.maxHeight = $pMaxHeight$$));
      this.$_vBoundaries$ = $b$$71_o$$3$$;
    }, $_updateCache$:function($data$$150$$) {
      this.offset = this.helper.offset();
      this.$_isNumber$($data$$150$$.left) && (this.position.left = $data$$150$$.left);
      this.$_isNumber$($data$$150$$.top) && (this.position.top = $data$$150$$.top);
      this.$_isNumber$($data$$150$$.height) && (this.size.height = $data$$150$$.height);
      this.$_isNumber$($data$$150$$.width) && (this.size.width = $data$$150$$.width);
    }, $_updateRatio$:function($data$$151$$) {
      var $cpos$$ = this.position, $csize$$ = this.size, $a$$111$$ = this.axis;
      this.$_isNumber$($data$$151$$.height) ? $data$$151$$.width = $data$$151$$.height * this.$aspectRatio$ : this.$_isNumber$($data$$151$$.width) && ($data$$151$$.height = $data$$151$$.width / this.$aspectRatio$);
      "sw" === $a$$111$$ && ($data$$151$$.left = $cpos$$.left + ($csize$$.width - $data$$151$$.width), $data$$151$$.top = null);
      "nw" === $a$$111$$ && ($data$$151$$.top = $cpos$$.top + ($csize$$.height - $data$$151$$.height), $data$$151$$.left = $cpos$$.left + ($csize$$.width - $data$$151$$.width));
      return $data$$151$$;
    }, $_respectSize$:function($data$$152$$) {
      var $o$$4$$ = this.$_vBoundaries$, $a$$112_ch$$2$$ = this.axis, $ismaxw$$ = this.$_isNumber$($data$$152$$.width) && $o$$4$$.maxWidth && $o$$4$$.maxWidth < $data$$152$$.width, $ismaxh$$ = this.$_isNumber$($data$$152$$.height) && $o$$4$$.maxHeight && $o$$4$$.maxHeight < $data$$152$$.height, $isminw$$ = this.$_isNumber$($data$$152$$.width) && $o$$4$$.minWidth && $o$$4$$.minWidth > $data$$152$$.width, $isminh$$ = this.$_isNumber$($data$$152$$.height) && $o$$4$$.minHeight && $o$$4$$.minHeight > 
      $data$$152$$.height, $dw$$ = this.$originalPosition$.left + this.$originalSize$.width, $dh$$ = this.position.top + this.size.height, $cw$$ = /sw|nw|w/.test($a$$112_ch$$2$$), $a$$112_ch$$2$$ = /nw|ne|n/.test($a$$112_ch$$2$$);
      $isminw$$ && ($data$$152$$.width = $o$$4$$.minWidth);
      $isminh$$ && ($data$$152$$.height = $o$$4$$.minHeight);
      $ismaxw$$ && ($data$$152$$.width = $o$$4$$.maxWidth);
      $ismaxh$$ && ($data$$152$$.height = $o$$4$$.maxHeight);
      $isminw$$ && $cw$$ && ($data$$152$$.left = $dw$$ - $o$$4$$.minWidth);
      $ismaxw$$ && $cw$$ && ($data$$152$$.left = $dw$$ - $o$$4$$.maxWidth);
      $isminh$$ && $a$$112_ch$$2$$ && ($data$$152$$.top = $dh$$ - $o$$4$$.minHeight);
      $ismaxh$$ && $a$$112_ch$$2$$ && ($data$$152$$.top = $dh$$ - $o$$4$$.maxHeight);
      $data$$152$$.width || $data$$152$$.height || $data$$152$$.left || !$data$$152$$.top ? $data$$152$$.width || $data$$152$$.height || $data$$152$$.top || !$data$$152$$.left || ($data$$152$$.left = null) : $data$$152$$.top = null;
      return $data$$152$$;
    }, $_proportionallyResize$:function() {
      if (this.$_proportionallyResizeElements$.length) {
        var $i$$338$$, $j$$40$$, $borders$$, $paddings$$, $prel$$, $element$$107$$ = this.helper || this.element;
        for ($i$$338$$ = 0;$i$$338$$ < this.$_proportionallyResizeElements$.length;$i$$338$$++) {
          $prel$$ = this.$_proportionallyResizeElements$[$i$$338$$];
          if (!this.$borderDif$) {
            for (this.$borderDif$ = [], $borders$$ = [$prel$$.css("borderTopWidth"), $prel$$.css("borderRightWidth"), $prel$$.css("borderBottomWidth"), $prel$$.css("borderLeftWidth")], $paddings$$ = [$prel$$.css("paddingTop"), $prel$$.css("paddingRight"), $prel$$.css("paddingBottom"), $prel$$.css("paddingLeft")], $j$$40$$ = 0;$j$$40$$ < $borders$$.length;$j$$40$$++) {
              this.$borderDif$[$j$$40$$] = (parseInt($borders$$[$j$$40$$], 10) || 0) + (parseInt($paddings$$[$j$$40$$], 10) || 0);
            }
          }
          $prel$$.css({height:$element$$107$$.height() - this.$borderDif$[0] - this.$borderDif$[2] || 0, width:$element$$107$$.width() - this.$borderDif$[1] - this.$borderDif$[3] || 0});
        }
      }
    }, $_renderProxy$:function() {
      this.element.offset();
      this.helper = this.element;
    }, $_change$:{e:function($event$$395$$, $dx$$5$$) {
      return{width:this.$originalSize$.width + $dx$$5$$};
    }, w:function($event$$396$$, $dx$$6$$) {
      return{left:this.$originalPosition$.left + $dx$$6$$, width:this.$originalSize$.width - $dx$$6$$};
    }, n:function($event$$397$$, $dx$$7$$, $dy$$5$$) {
      return{top:this.$originalPosition$.top + $dy$$5$$, height:this.$originalSize$.height - $dy$$5$$};
    }, s:function($event$$398$$, $dx$$8$$, $dy$$6$$) {
      return{height:this.$originalSize$.height + $dy$$6$$};
    }, se:function($event$$399$$, $dx$$9$$, $dy$$7$$) {
      return $$$$30$$.extend(this.$_change$.s.apply(this, arguments), this.$_change$.e.apply(this, [$event$$399$$, $dx$$9$$, $dy$$7$$]));
    }, sw:function($event$$400$$, $dx$$10$$, $dy$$8$$) {
      return $$$$30$$.extend(this.$_change$.s.apply(this, arguments), this.$_change$.w.apply(this, [$event$$400$$, $dx$$10$$, $dy$$8$$]));
    }, ne:function($event$$401$$, $dx$$11$$, $dy$$9$$) {
      return $$$$30$$.extend(this.$_change$.n.apply(this, arguments), this.$_change$.e.apply(this, [$event$$401$$, $dx$$11$$, $dy$$9$$]));
    }, nw:function($event$$402$$, $dx$$12$$, $dy$$10$$) {
      return $$$$30$$.extend(this.$_change$.n.apply(this, arguments), this.$_change$.w.apply(this, [$event$$402$$, $dx$$12$$, $dy$$10$$]));
    }}, $_propagate$:function($n$$23$$, $event$$403$$) {
      "resize" !== $n$$23$$ && this._trigger($n$$23$$, $event$$403$$, this.ui());
    }, $_alsoresize_start$:function() {
      function $_store$$($exp$$3$$) {
        $$$$30$$($exp$$3$$).each(function() {
          var $el$$15$$ = $$$$30$$(this);
          $el$$15$$.data("oj-resizable-alsoresize", {width:parseInt($el$$15$$.width(), 10), height:parseInt($el$$15$$.height(), 10), left:parseInt($el$$15$$.css("left"), 10), top:parseInt($el$$15$$.css("top"), 10)});
        });
      }
      var $o$$6$$ = this.options;
      "object" !== typeof $o$$6$$.alsoResize || $o$$6$$.alsoResize.parentNode ? $_store$$($o$$6$$.alsoResize) : $o$$6$$.alsoResize.length ? ($o$$6$$.alsoResize = $o$$6$$.alsoResize[0], $_store$$($o$$6$$.alsoResize)) : $$$$30$$.each($o$$6$$.alsoResize, function($exp$$4$$) {
        $_store$$($exp$$4$$);
      });
    }, $_alsoresize_resize$:function($event$$404$$, $ui$$26$$) {
      function $_alsoResize$$($exp$$5$$, $c$$42$$) {
        $$$$30$$($exp$$5$$).each(function() {
          var $el$$16$$ = $$$$30$$(this), $start$$52$$ = $$$$30$$(this).data("oj-resizable-alsoresize"), $style$$17$$ = {};
          $$$$30$$.each($c$$42$$ && $c$$42$$.length ? $c$$42$$ : $el$$16$$.parents($ui$$26$$.$originalElement$[0]).length ? ["width", "height"] : ["width", "height", "top", "left"], function($i$$339$$, $prop$$65$$) {
            var $sum$$ = ($start$$52$$[$prop$$65$$] || 0) + ($delta$$5$$[$prop$$65$$] || 0);
            $sum$$ && 0 <= $sum$$ && ($style$$17$$[$prop$$65$$] = $sum$$ || null);
          });
          $el$$16$$.css($style$$17$$);
        });
      }
      var $o$$7$$ = this.options, $os$$1$$ = this.$originalSize$, $op$$ = this.$originalPosition$, $delta$$5$$ = {height:this.size.height - $os$$1$$.height || 0, width:this.size.width - $os$$1$$.width || 0, top:this.position.top - $op$$.top || 0, left:this.position.left - $op$$.left || 0};
      "object" !== typeof $o$$7$$.alsoResize || $o$$7$$.alsoResize.nodeType ? $_alsoResize$$($o$$7$$.alsoResize, null) : $$$$30$$.each($o$$7$$.alsoResize, function($exp$$6$$, $c$$43$$) {
        $_alsoResize$$($exp$$6$$, $c$$43$$);
      });
    }, $_alsoresize_stop$:function() {
      $$$$30$$(this).removeData("oj-resizable-alsoresize");
    }, $_containment_start$:function() {
      var $element$$108$$, $p$$7$$, $co_oc$$, $ch$$3_height$$25$$, $cw$$1_width$$27$$, $that$$10$$ = this, $ce_el$$17$$ = $that$$10$$.element;
      $co_oc$$ = $that$$10$$.options.containment;
      if ($ce_el$$17$$ = $co_oc$$ instanceof $$$$30$$ ? $co_oc$$.get(0) : /parent/.test($co_oc$$) ? $ce_el$$17$$.parent().get(0) : $co_oc$$) {
        $that$$10$$.$containerElement$ = $$$$30$$($ce_el$$17$$), /document/.test($co_oc$$) || $co_oc$$ === document ? ($that$$10$$.$containerOffset$ = {left:0, top:0}, $that$$10$$.$containerPosition$ = {left:0, top:0}, $that$$10$$.$parentData$ = {element:$$$$30$$(document), left:0, top:0, width:$$$$30$$(document).width(), height:$$$$30$$(document).height() || document.body.parentNode.scrollHeight}) : ($element$$108$$ = $$$$30$$($ce_el$$17$$), $p$$7$$ = [], $$$$30$$(["Top", "Right", "Left", "Bottom"]).each(function($i$$340$$, 
        $name$$110$$) {
          $p$$7$$[$i$$340$$] = $that$$10$$.$_num$($element$$108$$.css("padding" + $name$$110$$));
        }), $that$$10$$.$containerOffset$ = $element$$108$$.offset(), $that$$10$$.$containerPosition$ = $element$$108$$.position(), $that$$10$$.$containerSize$ = {height:$element$$108$$.innerHeight() - $p$$7$$[3], width:$element$$108$$.innerWidth() - $p$$7$$[1]}, $co_oc$$ = $that$$10$$.$containerOffset$, $ch$$3_height$$25$$ = $that$$10$$.$containerSize$.height, $cw$$1_width$$27$$ = $that$$10$$.$containerSize$.width, $cw$$1_width$$27$$ = $that$$10$$.$_hasScroll$($ce_el$$17$$, "left") ? $ce_el$$17$$.scrollWidth : 
        $cw$$1_width$$27$$, $ch$$3_height$$25$$ = $that$$10$$.$_hasScroll$($ce_el$$17$$) ? $ce_el$$17$$.scrollHeight : $ch$$3_height$$25$$, $that$$10$$.$parentData$ = {element:$ce_el$$17$$, left:$co_oc$$.left, top:$co_oc$$.top, width:$cw$$1_width$$27$$, height:$ch$$3_height$$25$$});
      }
    }, $_containment_resize$:function($event$$405$$, $ui$$27$$) {
      var $o$$9_woset$$, $co$$1_hoset$$, $cop_isParent$$, $cp_isOffsetRelative$$;
      $o$$9_woset$$ = this.options;
      $co$$1_hoset$$ = this.$containerOffset$;
      $cp_isOffsetRelative$$ = this.position;
      var $pRatio$$ = $event$$405$$.shiftKey;
      $cop_isParent$$ = {top:0, left:0};
      var $ce$$1$$ = this.$containerElement$, $continueResize$$ = !0;
      $ce$$1$$[0] !== document && /static/.test($ce$$1$$.css("position")) && ($cop_isParent$$ = $co$$1_hoset$$);
      $cp_isOffsetRelative$$.left < (this.$_helper$ ? $co$$1_hoset$$.left : 0) && (this.size.width += this.$_helper$ ? this.position.left - $co$$1_hoset$$.left : this.position.left - $cop_isParent$$.left, $pRatio$$ && (this.size.height = this.size.width / this.$aspectRatio$, $continueResize$$ = !1), this.position.left = $o$$9_woset$$.helper ? $co$$1_hoset$$.left : 0);
      $cp_isOffsetRelative$$.top < (this.$_helper$ ? $co$$1_hoset$$.top : 0) && (this.size.height += this.$_helper$ ? this.position.top - $co$$1_hoset$$.top : this.position.top, $pRatio$$ && (this.size.width = this.size.height * this.$aspectRatio$, $continueResize$$ = !1), this.position.top = this.$_helper$ ? $co$$1_hoset$$.top : 0);
      this.offset.left = this.$parentData$.left + this.position.left;
      this.offset.top = this.$parentData$.top + this.position.top;
      $o$$9_woset$$ = Math.abs((this.$_helper$ ? this.offset.left - $cop_isParent$$.left : this.offset.left - $co$$1_hoset$$.left) + this.$sizeDiff$.width);
      $co$$1_hoset$$ = Math.abs((this.$_helper$ ? this.offset.top - $cop_isParent$$.top : this.offset.top - $co$$1_hoset$$.top) + this.$sizeDiff$.height);
      $cop_isParent$$ = this.$containerElement$.get(0) === this.element.parent().get(0);
      $cp_isOffsetRelative$$ = /relative|absolute/.test(this.$containerElement$.css("position"));
      $cop_isParent$$ && $cp_isOffsetRelative$$ && ($o$$9_woset$$ -= Math.abs(this.$parentData$.left));
      $o$$9_woset$$ + this.size.width >= this.$parentData$.width && (this.size.width = this.$parentData$.width - $o$$9_woset$$, $pRatio$$ && (this.size.height = this.size.width / this.$aspectRatio$, $continueResize$$ = !1));
      $co$$1_hoset$$ + this.size.height >= this.$parentData$.height && (this.size.height = this.$parentData$.height - $co$$1_hoset$$, $pRatio$$ && (this.size.width = this.size.height * this.$aspectRatio$, $continueResize$$ = !1));
      $continueResize$$ || (this.position.left = $ui$$27$$.$prevPosition$.left, this.position.top = $ui$$27$$.$prevPosition$.top, this.size.width = $ui$$27$$.$prevSize$.width, this.size.height = $ui$$27$$.$prevSize$.height);
    }, $_containment_stop$:function() {
      var $o$$10$$ = this.options, $co$$2$$ = this.$containerOffset$, $cop$$1$$ = this.$containerPosition$, $ce$$2$$ = this.$containerElement$, $h$$7_helper$$ = $$$$30$$(this.helper), $ho$$ = $h$$7_helper$$.offset(), $w$$7$$ = $h$$7_helper$$.outerWidth() - this.$sizeDiff$.width, $h$$7_helper$$ = $h$$7_helper$$.outerHeight() - this.$sizeDiff$.height;
      this.$_helper$ && !$o$$10$$.animate && /relative/.test($ce$$2$$.css("position")) && $$$$30$$(this).css({left:$ho$$.left - $cop$$1$$.left - $co$$2$$.left, width:$w$$7$$, height:$h$$7_helper$$});
      this.$_helper$ && !$o$$10$$.animate && /static/.test($ce$$2$$.css("position")) && $$$$30$$(this).css({left:$ho$$.left - $cop$$1$$.left - $co$$2$$.left, width:$w$$7$$, height:$h$$7_helper$$});
    }, ui:function() {
      return{$originalElement$:this.$originalElement$, element:this.element, helper:this.helper, position:this.position, size:this.size, $originalSize$:this.$originalSize$, $originalPosition$:this.$originalPosition$, $prevSize$:this.$prevSize$, $prevPosition$:this.$prevPosition$};
    }});
  })();
});
