import {genesysUtil} from "./genesysUtil.js";
import { dicePopout } from "./dicePopout.js";
import { GenesysActorSheet } from "./GenesysActor-sheet.js";


/**
 * Extend the base sheet for characters
 * @extends {ActorSheet}
 */
export class CharacterActorSheet extends GenesysActorSheet {

    /** @override */
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["genesys", "sheet", "actor"],
            template: "systems/genesys/templates/character-sheet.html",
            width: 620,
            height: 800,
            tabs: [{ navSelector: ".sheet-tabs",contentSelector: ".sheet-body", initial: "description"  }],
        });
    }
    
/** @override */
getData() {
    const data = super.getData();
    data.dtypes = ["String", "Number", "Boolean"];

    // Prepare items.
    if (this.actor.data.type == 'character') {
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
    if (!this.options.editable)
        return;

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

    html.find(".talents").on("click", ".talent-control", this._onClickTalentControl.bind(this));

    //skill rolls
    html.find('.rollable').click(ev =>{
        event.preventDefault();
        const element = event.currentTarget;
        const dataset = element.dataset;
        const charlabel = dataset.label2;
        const data = this.getData();
        var char =0;
        if(charlabel=="brawn"){
            char= data.data.characteristics.brawn.value;
        }    
        else if(charlabel=="agility"){
            char= data.data.characteristics.agility.value;
        }        
        else if(charlabel=="intellect"){
            char= data.data.characteristics.intellect.value;
        }           
        else if(charlabel=="cunning"){
            char= data.data.characteristics.cunning.value;
        }      
        else if(charlabel=="willpower"){
           char= data.data.characteristics.willpower.value; 
        }     
        else if(charlabel=="presence"){
            char= data.data.characteristics.presence.value;
        } 

           var array= genesysUtil.abilityToArray(char,dataset.label1)


            let f=new dicePopout(array, {
                classes: ["genesys", "sheet", "actor"],
                template: "systems/genesys/templates/dicePopout.html",
                width: 300,
                height: 500,
                title: "Dice Roller",
                popOut: true
            });
            f.render(true,{
                left: 100,
                right: 100
    
            });





          
    });

    html.find('.all-dice').click(ev => {
   
        


        let f=new dicePopout([0,0,0,0,0,0], {
            classes: ["genesys", "sheet", "actor"],
            template: "systems/genesys/templates/dicePopout.html",
            width: 300,
            height: 500,
            title: "Dice Roller",
            popOut: true
        });
        f.render(true,{
            left: 100,
            right: 100

        });
        
    });
    //initiative
    html.find('.int-dice').click(ev =>{
        const data=this.getData();
        const charPres=data.data.characteristics.presence.value;
        const charWill=data.data.characteristics.willpower.value;
        const skillCool=data.data.skills.cool.value;
        const skillVig=data.data.skills.vigilance.value;

        let d = new Dialog({
            title: "INITIATIVE",
            content: "<p>COOL OR VIGILANCE</p>",
            buttons: {
             one: {
              label: "COOL",
              callback: () => ChatMessage.create({
                user: game.user._id,
                speaker: this.getData(),
                flavor: 'rolls Initiative(cool)',
                content: genesysUtil.genesysInitiative(genesysUtil.abilityToArray(charPres,skillCool))
              })
             },
             two: {
              label: "VIGILANCE",
              callback: () => ChatMessage.create({
                user: game.user._id,
                speaker: this.getData(),
                flavor: 'rolls Initiative(vigilance)',
                content: genesysUtil.genesysInitiative(genesysUtil.abilityToArray(charWill,skillVig))
              })
             }
            },
            default: "two",
           });
           d.render(true);



    });


}

/* -------------------------------------------- */

/* -------------------------------------------- */

/**
 * Listen for click events on an talent control to modify the composition of talents in the sheet
 * @param {MouseEvent} event    The originating left click event
 * @private
 */
async _onClickTalentControl(event) {
    event.preventDefault();
    const a = event.currentTarget;
    const action = a.dataset.action;
    const tals = this.object.data.data.talents;
    const form = this.form;

    // Add new talent
    if (action === "createTalent") {
        const nk = Object.keys(tals).length + 1;
        let newKey = document.createElement("div");
        newKey.innerHTML = `<input type="text" name="data.talents.tal${nk}.key" value="tal${nk}"/>`;
        newKey = newKey.children[0];
        form.appendChild(newKey);
        await this._onSubmit(event);
    }

    // Remove existing talent
    else if (action === "deleteTalent") {
        const li = a.closest(".talent");
        li.parentElement.removeChild(li);
        await this._onSubmit(event);
    }

}
/** @override */
_updateObject(event, formData) {
/*
    // Handle the free-form talents list
    const formAttrs = expandObject(formData).data.talents || {};
    const talents = Object.values(formAttrs).reduce((obj, v) => {
            let k = v["key"].trim();
            if (/[\s\.]/.test(k))
                return ui.notifications.error("Attribute keys may not contain spaces or periods");
            delete v["key"];
            obj[k] = v;
            return obj;
        }, {});

    // Remove talents which are no longer used
    for (let k of Object.keys(this.object.data.data.talents)) {
        if (!talents.hasOwnProperty(k))
            talents[`-=${k}`] = null;
    }

    // Re-combine formData
    formData = Object.entries(formData).filter(e => !e[0].startsWith("data.talents")).reduce((obj, e) => {
            obj[e[0]] = e[1];
            return obj;
        }, {
            _id: this.object._id,
            "data.talents": talents
        });

    // Update the Actor*/
    return this.object.update(formData);
}

}
