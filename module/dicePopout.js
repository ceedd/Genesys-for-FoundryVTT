import { genesysUtil } from "./genesysUtil.js";
export class dicePopout extends Application {

  constructor(array, options) {
    super(options);
    this.array = array;
  }
  //need a way to put amount of dice in input

  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      template: "systems/genesys/templates/dicePopout.html",
      classes: ["dicePopout", "genesys"],
      width: 400,
      height: 500
    });
  }
  /** @override */
  get title() {
    return "Dice Roller";
  }

  /** @override */
  getData() {
    const data = {
      ability: this.array[0],
      boost: this.array[1],
      proficency: this.array[2],
      setback: this.array[3],
      difficulty: this.array[4],
      challenge: this.array[5]
    };
    console.log(data);
    return data;
  }

  getValues(){
    var array=[];
    array[0]=this._element[0].lastElementChild.children[0][0].value;
    array[1]=this._element[0].lastElementChild.children[0][1].value;
    array[2]=this._element[0].lastElementChild.children[0][2].value;
    array[3]=this._element[0].lastElementChild.children[0][3].value;
    array[4]=this._element[0].lastElementChild.children[0][4].value;
    array[5]=this._element[0].lastElementChild.children[0][5].value;
    return array;
  }

  activateListeners(html) {
    super.activateListeners(html);

    html.find('.roll').click(ev => {

      var msg = genesysUtil.diceArrayToString(this.getValues());

      ChatMessage.create({
        user: game.user._id,
        speaker: this.getData(),
        flavor: 'rolls ',
        content: msg
      });
      this.close();
    });

    //just another way to close the window i guess
    html.find('.close').click(ev => {
      this.close();
    });

    html.find('.boostPlus').click(ev => {
      ++this._element[0].lastElementChild.children[0][0].value;
    });
    html.find('.boostMinus').click(ev => {
      --this._element[0].lastElementChild.children[0][0].value;
    });

    html.find('.abilityPlus').click(ev => {
      ++this._element[0].lastElementChild.children[0][1].value;
    });
    html.find('.abilityMinus').click(ev => {
      --this._element[0].lastElementChild.children[0][1].value;
    });

    html.find('.proficiencyPlus').click(ev => {
      ++this._element[0].lastElementChild.children[0][2].value;
    });
    html.find('.proficiencyMinus').click(ev => {
      --this._element[0].lastElementChild.children[0][2].value;
    });

    html.find('.setbackPlus').click(ev => {
      ++this._element[0].lastElementChild.children[0][3].value;
    });
    html.find('.setbackMinus').click(ev => {
      --this._element[0].lastElementChild.children[0][3].value;
    });

    html.find('.difficultyPlus').click(ev => {
      ++this._element[0].lastElementChild.children[0][4].value;
    });
    html.find('.difficultyMinus').click(ev => {
      --this._element[0].lastElementChild.children[0][4].value;
    });
    html.find('.challengePlus').click(ev => {
      ++this._element[0].lastElementChild.children[0][5].value;
    });
    html.find('.challengeMinus').click(ev => {
      --this._element[0].lastElementChild.children[0][5].value;
    });
  }

}