import {genesysUtil} from "./genesysUtil.js";
import { dicePopout } from "./dicePopout.js";
import { GenesysActorSheet } from "./GenesysActor-sheet.js";



/**
 * Extend the base sheet for stuff for vehicle
 * @extends {ActorSheet}
 */
export class VehicleActorSheet extends GenesysActorSheet {

    /** @override */
      static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
          classes: ["genesys", "sheet", "actor"],
          template: "systems/genesys/templates/vehicle-sheet.html",
        width: 600,
        height: 620,
        tabs: [{navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "stats"}],
      });
    }
  
/** @override */
getData() {
  const data = super.getData();
  data.dtypes = ["String", "Number", "Boolean"];
  console.log(data);
  // Prepare items.
  if (this.actor.data.type == 'vehicle') {
      this._prepareCharacterItems(data);
  }
  
  return data;
}

_prepareCharacterItems(sheetData) {
  const actorData = sheetData.actor;

  // Initialize containers.
  const armor = [];
  const weapon = [];
  const gear = [];
  const talent = [];
  const injury = [];


// Iterate through items, allocating to containers
// let totalWeight = 0;
// fow now weapons and armor also gets put into gear will be splitt later
for (let i of sheetData.items) {
  let item = i.data;
  i.img = i.img || DEFAULT_TOKEN;
  if (i.type === 'armor') {
      gear.push(i);
  } else if (i.type === 'weapon') {
      gear.push(i);
  } else if (i.type === 'gear') {
      gear.push(i);
  } else if (i.type === 'talent') {
      talent.push(i);
  } else if (i.type === 'injury') {
      injury.push(i);
  }
}

// Assign and return
actorData.armor = gear;
actorData.weapon = weapon;
actorData.gear = gear;
actorData.talent = talent;
actorData.injury = injury;
}
  

  
    /* -------------------------------------------- */
  
    /** @override */
      activateListeners(html) {
      super.activateListeners(html);
  
      // Everything below here is only needed if the sheet is editable
      if (!this.options.editable) return;
  
      // Update Inventory Item
      html.find('.item-edit').click(ev => {
        const li = $(ev.currentTarget).parents(".item");
        const item = this.actor.getOwnedItem(li.data("itemId"));
        item.sheet.render(true);
      });
  
      // Delete Inventory Item
      html.find('.item-delete').click(ev => {
        const li = $(ev.currentTarget).parents(".item");
        this.actor.deleteOwnedItem(li.data("itemId"));
        li.slideUp(200, () => this.render(false));
      });
  
      // Add or Remove Attribute
      html.find(".attributes").on("click", ".attribute-control", this._onClickAttributeControl.bind(this));
    }
  
    /* -------------------------------------------- */
  
    /** @override */
    setPosition(options={}) {
      const position = super.setPosition(options);
      const sheetBody = this.element.find(".sheet-body");
      const bodyHeight = position.height - 192;
      sheetBody.css("height", bodyHeight);
      return position;
    }
  
    /* -------------------------------------------- */
  
    /**
     * Listen for click events on an attribute control to modify the composition of attributes in the sheet
     * @param {MouseEvent} event    The originating left click event
     * @private
     */
    async _onClickAttributeControl(event) {
      event.preventDefault();
      const a = event.currentTarget;
      const action = a.dataset.action;
      const attrs = this.object.data.data.attributes;
      const form = this.form;
  
      // Add new attribute
      if ( action === "create" ) {
        const nk = Object.keys(attrs).length + 1;
        let newKey = document.createElement("div");
        newKey.innerHTML = `<input type="text" name="data.attributes.attr${nk}.key" value="attr${nk}"/>`;
        newKey = newKey.children[0];
        form.appendChild(newKey);
        await this._onSubmit(event);
      }
  
      // Remove existing attribute
      else if ( action === "delete" ) {
        const li = a.closest(".attribute");
        li.parentElement.removeChild(li);
        await this._onSubmit(event);
      }
    }
  
    /* -------------------------------------------- */
  
    /** @override */
    _updateObject(event, formData) {
  /*
      // Handle the free-form attributes list
      const formAttrs = expandObject(formData).data.attributes || {};
      const attributes = Object.values(formAttrs).reduce((obj, v) => {
        let k = v["key"].trim();
        if ( /[\s\.]/.test(k) )  return ui.notifications.error("Attribute keys may not contain spaces or periods");
        delete v["key"];
        obj[k] = v;
        return obj;
      }, {});
      
      // Remove attributes which are no longer used
      for ( let k of Object.keys(this.object.data.data.attributes) ) {
        if ( !attributes.hasOwnProperty(k) ) attributes[`-=${k}`] = null;
      }
  
      // Re-combine formData
      formData = Object.entries(formData).filter(e => !e[0].startsWith("data.attributes")).reduce((obj, e) => {
        obj[e[0]] = e[1];
        return obj;
      }, {_id: this.object._id, "data.attributes": attributes});
      
      // Update the Actor */
      return this.object.update(formData);
    }
  }
  