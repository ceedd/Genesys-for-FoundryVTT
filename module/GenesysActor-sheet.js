import {genesysUtil} from "./genesysUtil.js";
import { dicePopout } from "./dicePopout.js";


/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
export class GenesysActorSheet extends ActorSheet {

    


/*--------------------------------------*/
/*Saves scroll position of a div        */
/*Big thanks to  Moo Man on the discord*/
async _render(force = false, options = {}) {
    this._saveScrollPos(); // Save scroll positions
    await super._render(force, options);
    this._setScrollPos();  // Set scroll positions
}

_saveScrollPos()
    {
      if (this.form === null)
        return;

      const html = $(this.form).parent();
      this.scrollPos = [];
      let lists = $(html.find(".sheet-body"));
      for (let list of lists)
      {
        this.scrollPos.push($(list).scrollTop());
      }
    }

    _setScrollPos()
    {
      if (this.scrollPos)
      {
        const html = $(this.form).parent();
        let lists = $(html.find(".sheet-body"));
        for (let i = 0; i < lists.length; i++)
        {
          $(lists[i]).scrollTop(this.scrollPos[i]);
        }
      }
    }










/** @override */
_updateObject(event, formData) {

    return this.object.update(formData);
}

}
