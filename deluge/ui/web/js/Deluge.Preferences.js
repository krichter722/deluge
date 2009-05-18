/*
Script: Deluge.Preferences.js
    Contains the preferences window.

Copyright:
	(C) Damien Churchill 2009 <damoxc@gmail.com>
	This program is free software; you can redistribute it and/or modify
	it under the terms of the GNU General Public License as published by
	the Free Software Foundation; either version 3, or (at your option)
	any later version.

	This program is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU General Public License for more details.

	You should have received a copy of the GNU General Public License
	along with this program.  If not, write to:
		The Free Software Foundation, Inc.,
		51 Franklin Street, Fifth Floor
		Boston, MA  02110-1301, USA.
#
#    In addition, as a special exception, the copyright holders give
#    permission to link the code of portions of this program with the OpenSSL
#    library.
#    You must obey the GNU General Public License in all respects for all of
#    the code used other than OpenSSL. If you modify file(s) with this
#    exception, you may extend this exception to your version of the file(s),
#    but you are not obligated to do so. If you do not wish to do so, delete
#    this exception statement from your version. If you delete this exception
#    statement from all source files in the program, then also delete it here.
#
*/

(function() {	
	Ext.deluge.PreferencesWindow = Ext.extend(Ext.Window, {
		constructor: function(config) {
			config = Ext.apply({
				layout: 'border',
				width: 485,
				height: 500,
				buttonAlign: 'right',
				closeAction: 'hide',
				closable: true,
				iconCls: 'x-deluge-preferences',
				plain: true,
				resizable: true,
				title: _('Preferences'),
				
				buttons: [{
					text: _('Close'),
					handler: this.onCloseButtonClick,
					scope: this
				},{
					text: _('Apply')
				},{
					text: _('Ok')
				}],
				
				currentPage: false,
				items: [{
					xtype: 'grid',
					region: 'west',
					title: _('Categories'),
					store: new Ext.data.SimpleStore({
						fields: [{name: 'name', mapping: 0}]
					}),
					columns: [{id: 'name', renderer: fplain, dataIndex: 'name'}],
					sm: new Ext.grid.RowSelectionModel({
						singleSelect: true,
						listeners: {'rowselect': {fn: this.onPageSelect, scope: this}}
					}),
					hideHeaders: true,
					autoExpandColumn: 'name',
					deferredRender: false,
					autoScroll: true,
					margins: '5 0 5 5',
					cmargins: '5 0 5 5',
					width: 120,
					collapsible: true
				}, {
					region: 'center',
					header: false,
					layout: 'fit',
					height: 400,
					margins: '5 5 5 5',
					cmargins: '5 5 5 5'
				}]
			}, config);
			Ext.deluge.PreferencesWindow.superclass.constructor.call(this, config);
		},
		
		initComponent: function() {
			Ext.deluge.PreferencesWindow.superclass.initComponent.call(this);
			this.categoriesGrid = this.items.get(0);
			this.configPanel = this.items.get(1);
			this.pages = {};
			this.on('show', this.onShow, this);
		},
		
		onCloseButtonClick: function() {
			this.hide();
		},
		
		addPage: function(page) {
			var store = this.categoriesGrid.getStore();
			var name = page.title;
			store.loadData([[name]], true);
			page['bodyStyle'] = 'margin: 5px';
			this.pages[name] = this.configPanel.add(page);
			this.pages[name].hide();
		},
		
		onPageSelect: function(selModel, rowIndex, r) {
			if (this.currentPage) {
				this.currentPage.hide();
			}
			var name = r.get('name');
			
			this.pages[name].show();
			this.currentPage = this.pages[name];
			this.configPanel.doLayout();
		},
		
		onShow: function() {
			if (!this.categoriesGrid.getSelectionModel().hasSelection()) {
				this.categoriesGrid.getSelectionModel().selectFirstRow();
			}
		}
	});

	Deluge.Preferences = new Ext.deluge.PreferencesWindow();
})();