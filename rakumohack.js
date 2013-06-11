/*
 * rakumohack.js
 *
 */

function makeCommand ( text, selector ) {
  return { text: text, selector: selector };
}

function commandText ( command ) {
  return command[ "text" ];
}

function commandSelector ( command ) {
  return command[ "selector" ];
}

function createDivCommands ( cls, refNode, pos ) {
  return dojo.create( "DIV", { class: cls }, refNode, pos );
}

function insertCommand ( text, selector, divCommands ) {
  var pCommand = dojo.create( "SPAN", null, divCommands, "last" );
  var aCommand = dojo.create( "A", { href: "javascript:void(0);", innerHTML: text }, pCommand, "first" );
  dojo.connect( aCommand, "onclick", function() {
    dojo.query( selector )[0].click();
  } );
  dojo.create( "SPAN", { innerHTML: "&emsp;" }, divCommands, "last" );
}

function insertCommands ( cls, refNode, pos, commands ) {
  var divCommands = createDivCommands( cls, refNode, pos );
  if ( ! divCommands ) return;
  
  dojo.forEach( commands, function ( command ) {
    var text = commandText( command );
    var selector = commandSelector( command );
    insertCommand( text, selector, divCommands );
  } );
}

function getDivInEventDialog( cls ) {
  var divs = dojo.query( cls );
  var div = divs[ divs.length - 1 ];
  return div;
}

function getDivTitle () {
  return getDivInEventDialog( ".event_dialog_title" );
}

function getDivContent () {
  return getDivInEventDialog( ".event_dialog_content" );
}

function getDivNotification () {
  return getDivInEventDialog( ".event_dialog_notification" );
}

function insertCommandsInDetailDialog () {
  var commands = [ makeCommand( "閉じる", "#editPaneCloseBtn" ),
                   makeCommand( "編集する", "#dijit_form_Button_4_label" ),
                   makeCommand( "削除する", "#dijit_form_Button_3_label" ),
                   makeCommand( "コピー", "#dijit_form_Button_5_label")
                   ];
  
  var divTitle = getDivTitle();
  if ( ! divTitle ) return;  
  insertCommands( "event_dialog_title rakumo_hack_detail",
                  divTitle, "before", commands );
  
  var divContent = getDivContent();
  if ( ! divContent ) return;
  insertCommands( "event_dialog_title rakumo_hack_detail",
                  divContent, "after", commands );
}

function insertCommandsInRegisterDialog () {
  var commands = [ makeCommand( "閉じる", "#editPaneCloseBtn" ),
                   makeCommand( "登録する", "#dialogNewCloseButton_label" )
                   ];
  
  var divTitle = getDivTitle();
  if ( ! divTitle ) return;
  insertCommands( "event_dialog_title rakumo_hack_register",
                  divTitle, "before", commands );
  
  var divNotification = getDivNotification();
  if ( ! divNotification ) return;
  insertCommands( "event_dialog_title rakumo_hack_register",
                  divNotification, "after", commands );
}

function insertCommandsInEditDialog () {
  var commands = [ makeCommand( "閉じる", "#editPaneCloseBtn" ),
                   makeCommand( "保存する", "#dialogCloseButton_label" ),
                   makeCommand( "削除する", "#dialogDeleteButton_label" )
                   ];
  
  var divTitle = getDivTitle();
  if ( ! divTitle ) return;
  insertCommands( "event_dialog_title rakumo_hack_edit",
                  divTitle, "before", commands );
  
  var divNotification = getDivNotification();
  if ( ! divNotification ) return;
  insertCommands( "event_dialog_title rakumo_hack_edit",
                  divNotification, "after", commands );
}

var INVALID_DIALOG  = -1;
var REGISTER_DIALOG = 0;
var EDIT_DIALOG     = 1;
var DETAIL_DIALOG   = 2;

var INTERVAL = 500;

function isDialogVisible () {
  if ( dojo.hasClass( dojo.query("#eventPaneView")[0], "dijitVisible" ) )
    return true;
  if ( dojo.hasClass( dojo.query("#eventPaneView")[0], "dijitHidden" ) )
    return false;
  return false;  // can not be reached
}

function getDisplayedDialog () {
  var title = dojo.query(".dialogTitle")[0].innerHTML;
  if ( title == "予定の登録" )
    return REGISTER_DIALOG;
  if ( title == "予定の編集" )
    return EDIT_DIALOG;
  if ( title == "予定の詳細" )
    return DETAIL_DIALOG;
  return INVALID_DIALOG;  // can not be reached
}

function doesDivCommandsExist ( cls ) {
  return dojo.query( cls )[0] != undefined;
}

function observe () {
  if ( ! isDialogVisible() ) {
    setTimeout( observe, INTERVAL );
    return;
  }
  
  switch ( getDisplayedDialog() ) {
  case REGISTER_DIALOG:
    if ( ! doesDivCommandsExist( ".rakumo_hack_register" ) )
      insertCommandsInRegisterDialog();
    break;
  case EDIT_DIALOG:
    if ( ! doesDivCommandsExist( ".rakumo_hack_edit" ) )
      insertCommandsInEditDialog();
    break;
  case DETAIL_DIALOG:
    if ( ! doesDivCommandsExist( ".rakumo_hack_detail" ) )
      insertCommandsInDetailDialog();
    break;
  }
  
  setTimeout( observe, INTERVAL );
}

observe();
