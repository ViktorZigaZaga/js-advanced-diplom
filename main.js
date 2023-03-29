!function(){"use strict";function t(t,e){switch(!0){case 0===t:return"top-left";case t===e-1:return"top-right";case t===e**2-1:return"bottom-right";case t===e**2-e:return"bottom-left";case t%e==0:return"left";case(t+1)%e==0:return"right";case t>e**2-e:return"bottom";case t<e-1:return"top";default:return"center"}}class e{constructor(){this.boardSize=8,this.container=null,this.boardEl=null,this.cells=[],this.cellClickListeners=[],this.cellEnterListeners=[],this.cellLeaveListeners=[],this.newGameListeners=[],this.saveGameListeners=[],this.loadGameListeners=[]}bindToDOM(t){if(!(t instanceof HTMLElement))throw new Error("container is not HTMLElement");this.container=t}drawUi(s){this.checkBinding(),this.container.innerHTML='\n      <div class="controls">\n        <button data-id="action-restart" class="btn">New Game</button>\n        <button data-id="action-save" class="btn">Save Game</button>\n        <button data-id="action-load" class="btn">Load Game</button>\n      </div>\n      </div>\n      <div class="statistics">\n        <span class="stat-value">Уровень: <span class="level"></span>\n        <span class="stat-value">Номер хода: <span class="steps"></span>\n        <span class="stat-value">Кол-во очков: <span class="points"></span>\n        <span class="stat-value">Лучший результат: <span class="best-result"></span>\n      </div>\n      <div class="board-container">\n        <div data-id="board" class="board"></div>\n      </div>\n    ',this.newGameEl=this.container.querySelector("[data-id=action-restart]"),this.saveGameEl=this.container.querySelector("[data-id=action-save]"),this.loadGameEl=this.container.querySelector("[data-id=action-load]"),this.popupCloseBtn=document.querySelector(".popup__button"),this.level=this.container.querySelector(".level"),this.steps=this.container.querySelector(".steps"),this.points=this.container.querySelector(".points"),this.bestResult=this.container.querySelector(".best-result"),this.newGameEl.addEventListener("click",(t=>this.onNewGameClick(t))),this.saveGameEl.addEventListener("click",(t=>this.onSaveGameClick(t))),this.loadGameEl.addEventListener("click",(t=>this.onLoadGameClick(t))),this.popupCloseBtn.addEventListener("click",(()=>e.closePopup())),this.boardEl=this.container.querySelector("[data-id=board]"),this.boardEl.classList.add(s);for(let e=0;e<this.boardSize**2;e+=1){const s=document.createElement("div");s.classList.add("cell","map-tile",`map-tile-${t(e,this.boardSize)}`),s.addEventListener("mouseenter",(t=>this.onCellEnter(t))),s.addEventListener("mouseleave",(t=>this.onCellLeave(t))),s.addEventListener("click",(t=>this.onCellClick(t))),this.boardEl.appendChild(s)}this.cells=Array.from(this.boardEl.children)}redrawStatistics(t,e,s,a){this.level.textContent=t,this.steps.textContent=e,this.points.textContent=s,this.bestResult.textContent=a}redrawPositions(t){for(const t of this.cells)t.innerHTML="";for(const s of t){const t=this.boardEl.children[s.position],a=document.createElement("div");a.classList.add("character",s.character.type);const i=document.createElement("div");i.classList.add("health-level");const l=document.createElement("div");l.classList.add("health-level-indicator","health-level-indicator-"+((e=s.character.health)<15?"critical":e<50?"normal":"high")),l.style.width=`${s.character.health}%`,i.appendChild(l),a.appendChild(i),t.appendChild(a)}var e}addCellEnterListener(t){this.cellEnterListeners.push(t)}addCellLeaveListener(t){this.cellLeaveListeners.push(t)}addCellClickListener(t){this.cellClickListeners.push(t)}addNewGameListener(t){this.newGameListeners.push(t)}addSaveGameListener(t){this.saveGameListeners.push(t)}addLoadGameListener(t){this.loadGameListeners.push(t)}onCellEnter(t){t.preventDefault();const e=this.cells.indexOf(t.currentTarget);this.cellEnterListeners.forEach((t=>t.call(null,e)))}onCellLeave(t){t.preventDefault();const e=this.cells.indexOf(t.currentTarget);this.cellLeaveListeners.forEach((t=>t.call(null,e)))}onCellClick(t){const e=this.cells.indexOf(t.currentTarget);this.cellClickListeners.forEach((t=>t.call(null,e)))}onNewGameClick(t){t.preventDefault(),this.newGameListeners.forEach((t=>t.call(null)))}onSaveGameClick(t){t.preventDefault(),this.saveGameListeners.forEach((t=>t.call(null)))}onLoadGameClick(t){t.preventDefault(),this.loadGameListeners.forEach((t=>t.call(null)))}static closePopup(){document.querySelector(".popup").classList.add("popup_hidden")}static showPopup(t){document.querySelector(".popup__title").textContent=t,document.querySelector(".popup").classList.remove("popup_hidden")}static showError(t){e.showPopup(t)}static showMessage(t){e.showPopup(t)}selectCell(t){let e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"yellow";this.deselectCell(t),this.cells[t].classList.add("selected",`selected-${e}`)}deselectCell(t){const e=this.cells[t];e.classList.remove(...Array.from(e.classList).filter((t=>t.startsWith("selected"))))}showCellTooltip(t,e){this.cells[e].title=t}hideCellTooltip(t){this.cells[t].title=""}showDamage(t,e){return new Promise((s=>{const a=this.cells[t],i=document.createElement("span");i.textContent=e,i.classList.add("damage"),a.appendChild(i),i.addEventListener("animationend",(()=>{a.removeChild(i),s()}))}))}setCursor(t){this.boardEl.style.cursor=t}checkBinding(){if(null===this.container)throw new Error("GamePlay not bind to DOM")}}var s={1:"prairie",2:"desert",3:"arctic",4:"mountain"},a="auto",i="pointer",l="crosshair",r="not-allowed";class o{constructor(t){let e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"generic";if(this.level=t,this.attack=0,this.defence=0,this.health=50,this.type=e,"Character"===new.target.name)throw new Error("You can not create an object of the Character class!")}}class n extends o{constructor(t){super(t,arguments.length>1&&void 0!==arguments[1]?arguments[1]:"bowman"),this.attack=25,this.defence=25,this.radiusMovement=2,this.radiusAttack=2}}class c extends o{constructor(t){super(t,arguments.length>1&&void 0!==arguments[1]?arguments[1]:"daemon"),this.attack=10,this.defence=10,this.radiusMovement=1,this.radiusAttack=4}}class h extends o{constructor(t){super(t,arguments.length>1&&void 0!==arguments[1]?arguments[1]:"magician"),this.attack=10,this.defence=40,this.radiusMovement=1,this.radiusAttack=4}}class d extends o{constructor(t){super(t,arguments.length>1&&void 0!==arguments[1]?arguments[1]:"swordsman"),this.attack=40,this.defence=10,this.radiusMovement=4,this.radiusAttack=1}}class m extends o{constructor(t){super(t,arguments.length>1&&void 0!==arguments[1]?arguments[1]:"undead"),this.attack=40,this.defence=10,this.radiusMovement=4,this.radiusAttack=1}}class p extends o{constructor(t){super(t,arguments.length>1&&void 0!==arguments[1]?arguments[1]:"vampire"),this.attack=25,this.defence=25,this.radiusMovement=2,this.radiusAttack=2}}class u{constructor(t){this.characters=t}}class g{constructor(t,e){if(!(t instanceof o))throw new Error("character must be instance of Character or its children");if("number"!=typeof e)throw new Error("position must be a number");this.character=t,this.position=e}}class v{static from(t){const{level:e,steps:s,points:a,bestResult:i,allTypesPositions:l}=t;return new v(e,s,a,i,l)}constructor(t,e,s,a,i){this.level=t,this.steps=e,this.points=s,this.bestResult=a,this.allTypesPositions=i}saveBestResult(t){t>this.bestResult&&(this.bestResult=t)}}class y{constructor(t,e){this.gamePlay=t,this.stateService=e}init(){this.newGame(),this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this)),this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this)),this.gamePlay.addCellClickListener(this.onCellClick.bind(this)),this.gamePlay.addNewGameListener(this.newGame.bind(this)),this.gamePlay.addSaveGameListener(this.saveGame.bind(this)),this.gamePlay.addLoadGameListener(this.loadGame.bind(this))}newGame(){this.userTypes=[d,n,h],this.computerTypes=[c,m,p],this.gameState=new v(1,1,0,0,[]),this.activeCharacter=null,this.motion=!0,this.userTeamPositions=this.teamLocation(this.userTypes,this.gameState.level,2),this.computerTeamPositions=this.teamLocation(this.computerTypes,this.gameState.level,2),this.gameState.allTypesPositions=[...this.userTeamPositions,...this.computerTeamPositions],this.gamePlay.drawUi(s[this.gameState.level]),this.gamePlay.redrawStatistics(this.gameState.level,this.gameState.steps,this.gameState.points,this.gameState.bestResult),this.gamePlay.redrawPositions(this.gameState.allTypesPositions)}saveGame(){this.stateService.save(this.gameState),e.showPopup("Игра сохранена.")}loadGame(){0===this.gamePlay.cellClickListeners.length&&this.init();try{const t=this.stateService.load();t&&(this.gameState=v.from(t),this.gamePlay.drawUi(s[this.gameState.level]),this.gamePlay.redrawStatistics(this.gameState.level,this.gameState.steps,this.gameState.points,this.gameState.bestResult),this.gamePlay.redrawPositions(this.gameState.allTypesPositions))}catch(t){y.clearLocalStorage("state"),e.showPopup(`Ошибка загрузки: "${t.message}"`),this.newGame()}e.showPopup("Игра загружена.")}onCellClick(t){const s=this.gameState.allTypesPositions.find((e=>e.position===t));this.activeCharacter?s&&s===this.activeCharacter?(this.gamePlay.deselectCell(this.activeCharacter.position),this.activeCharacter=void 0,this.gamePlay.redrawPositions(this.gameState.allTypesPositions)):s&&String(this.userTypes).includes(s.character.type)?(this.gamePlay.deselectCell(this.activeCharacter.position),this.activeCharacter=void 0,this.gameState.steps+=1,this.gamePlay.redrawPositions(this.gameState.allTypesPositions),this.gamePlay.redrawStatistics(this.gameState.level,this.gameState.steps,this.gameState.points,this.gameState.bestResult),this.gamePlay.selectCell(t),this.activeCharacter=s):s&&String(this.computerTypes).includes(s.character.type)&&y.getAllowedAttack(this.activeCharacter.character.radiusAttack,this.activeCharacter.position).includes(t)?(this.attack(s,this.activeCharacter,t),this.gameState.steps+=1,this.gamePlay.redrawStatistics(this.gameState.level,this.gameState.steps,this.gameState.points,this.gameState.bestResult),this.motion=!1):!s&&y.getAllowedMove(this.activeCharacter.character.radiusMovement,this.activeCharacter.position).includes(t)&&(this.gamePlay.deselectCell(this.activeCharacter.position),this.activeCharacter.position=t,this.gamePlay.deselectCell(t),this.gameState.steps+=1,this.gamePlay.redrawStatistics(this.gameState.level,this.gameState.steps,this.gameState.points,this.gameState.bestResult),this.gamePlay.redrawPositions(this.gameState.allTypesPositions),this.motion=!1,this.checkLevel()):s&&String(this.userTypes).includes(s.character.type)?(this.gamePlay.selectCell(t),this.activeCharacter=s):s&&String(this.computerTypes).includes(s.character.type)&&e.showPopup("Этот персонаж не из Вашей команды")}onCellEnter(t){const e=this.gameState.allTypesPositions.find((e=>e.position===t));if(e){const s=`🎖${e.character.level}⚔${e.character.attack}🛡${e.character.defence}❤${e.character.health}`;this.gamePlay.showCellTooltip(s,t)}if(e){const t=String(this.userTypes).includes(e.character.type)?i:r;this.gamePlay.setCursor(t)}else this.gamePlay.setCursor(a);this.activeCharacter&&(!e&&y.getAllowedMove(this.activeCharacter.character.radiusMovement,this.activeCharacter.position).includes(t)?(this.gamePlay.selectCell(t,"green"),this.gamePlay.setCursor(i)):e&&String(this.computerTypes).includes(e.character.type)&&y.getAllowedAttack(this.activeCharacter.character.radiusAttack,this.activeCharacter.position).includes(t)?(this.gamePlay.selectCell(t,"red"),this.gamePlay.setCursor(l)):(!e||e&&String(this.computerTypes).includes(e.character.type))&&this.gamePlay.setCursor(r))}onCellLeave(t){const e=this.gameState.allTypesPositions.find((e=>e.position===t));this.gamePlay.setCursor(a),e&&this.gamePlay.hideCellTooltip(t),this.activeCharacter&&(!e&&y.getAllowedMove(this.activeCharacter.character.radiusMovement,this.activeCharacter.position).includes(t)||e&&String(this.computerTypes).includes(e.character.type)&&y.getAllowedAttack(this.activeCharacter.character.radiusAttack,this.activeCharacter.position).includes(t))&&this.gamePlay.deselectCell(t)}teamLocation(t,e,s){const a=[],i=this.gamePlay.boardSize,l=0!==t.filter((t=>this.userTypes.includes(t))).length?0:i-2;for(let t=l;t<=i**2-1;t+=i)a.push(t,t+1);0===l&&(this.avialibleUserPositions=[...a]);const r=[];for(const i of function(t,e,s){const a=[],i=function*(t,e){for(;;){const s=Math.floor(Math.random()*t.length),a=Math.floor(Math.random()*e+1);yield new t[s](a)}}(t,e);for(let t=0;t<s;t+=1)a.push(i.next().value);return new u(a)}(t,e,s).characters){const t=Math.floor(Math.random()*a.length),e=Number(a[t]);a.splice(t,1),r.push(new g(i,e))}return r}static getAllowedMove(t,e){const s=new Set;let a=e,i=e,l=e,r=e;for(;a>e-8*t&&a-8>=0;)a-=8;for(;i<e+8*t&&i+8<64;)i+=8;for(let t=a;t<=i;t+=8)s.add(t);for(;l>e-t&&l%8!=0;)l-=1;for(;r<e+t&&(r+1)%8!=0;)r+=1;for(let t=l;t<=r;t+=1)s.add(t);for(let a=e;a>=e-9*t&&(s.add(a),!(a%8==0||a-8<0));a-=9);for(let a=e;a>=e-7*t&&(s.add(a),!((a+1)%8==0||a-7<0));a-=7);for(let a=e;a<=e+9*t&&(s.add(a),!((a+1)%8==0||a+8>64));a+=9);for(let a=e;a<=e+7*t&&(s.add(a),!(a%8==0||a+7>=64));a+=7);return[...s].filter((t=>t!==e))}static getAllowedAttack(t,e){const s=new Set;let a=e,i=e,l=null;for(;a>e-t&&a%8!=0;)a-=1;for(;i<e+t&&(i+1)%8!=0;)i+=1;for(l=a;l<=i;){let e=l,a=l;for(s.add(l);e>l-8*t&&e-8>=0;)e-=8,s.add(e);for(;a<l+8*t&&a+8<64;)a+=8,s.add(a);l+=1}return[...s]}async attack(t,e,s){const{attack:a}=e.character,{defence:i}=t.character,l=t.character,r=2*Math.round(Math.max(.1*a));if(l.health-=r,l.health<=0){const t=this.gameState.allTypesPositions.filter((t=>t.position!==s));this.gameState.allTypesPositions=[],this.gameState.allTypesPositions=t}this.activeCharacter.character.health<=0&&(this.activeCharacter=null),this.gamePlay.selectCell(e.position,"yellow"),this.gamePlay.selectCell(t.position,"red"),this.gamePlay.redrawPositions(this.gameState.allTypesPositions),await this.gamePlay.showDamage(s,r),this.gamePlay.deselectCell(e.position),this.gamePlay.deselectCell(t.position),t.character.health>0&&this.gamePlay.selectCell(this.activeCharacter.position,"yellow"),this.checkLevel()}computerLogic(){const t=this.gameState.allTypesPositions.filter((t=>String(this.userTypes).includes(t.character.type))),e=this.gameState.allTypesPositions.filter((t=>String(this.computerTypes).includes(t.character.type)));if(this.motion=!0,!e.some((e=>{const s=t.find((t=>y.getAllowedAttack(e.character.radiusAttack,e.position).includes(t.position)));return!!s&&(this.attack(s,e,s.position),!0)}))&&e.length&&t.length){const t=Math.floor(Math.random()*e.length),s=y.getAllowedMove(e[t].position,e[t].character.radiusMovement),a=Math.floor(Math.random()*s.length);e[t].position=s[a],this.gamePlay.redrawPositions(this.gameState.allTypesPositions),this.checkLevel()}}checkLevel(){const t=this.gameState.allTypesPositions.some((t=>String(this.userTypes).includes(t.character.type))),s=this.gameState.allTypesPositions.some((t=>String(this.computerTypes).includes(t.character.type)));t&&s?this.motion||this.computerLogic():(s||(this.gameState.points=this.gameState.allTypesPositions.reduce(((t,e)=>t+e.character.health),0),this.gameState.saveBestResult(this.gameState.points),this.nextLevel(this.gameState.level)),t||e.showPopup("Вы проиграли! Попробуйте еще раз!"))}nextLevel(t){if(this.gameState.level=t+1,this.gameState.level>=5)this.gamePlay.cellClickListeners.length=0,e.showPopup(`Победа! Игра окончена. Счет: ${this.gameState.points}`);else if(this.gameState.level>1&&this.gameState.level<5){const t=this.gameState.allTypesPositions;for(const e of t)e.character.health=e.character.health+80>=100?100:e.character.health+80,e.character.attack=Math.floor(Math.max(e.character.attack,e.character.attack*(.8+e.character.health/100))),e.position=this.avialibleUserPositions[Math.floor(Math.random()*this.avialibleUserPositions.length)];this.userTeamPositions=[...t,...this.teamLocation(this.userTypes,this.gameState.level,7-t.length)],this.computerTeamPositions=this.teamLocation(this.computerTypes,this.gameState.level,7),this.gameState.allTypesPositions=[],this.gameState.allTypesPositions=[...this.userTeamPositions,...this.computerTeamPositions],this.gamePlay.drawUi(s[this.gameState.level]),this.gamePlay.redrawStatistics(this.gameState.level,this.gameState.steps,this.gameState.points,this.gameState.bestResult),this.gamePlay.redrawPositions(this.gameState.allTypesPositions),e.showPopup(`Уровень ${this.gameState.level} Счет: ${this.gameState.points}`)}}static clearLocalStorage(t){localStorage.removeItem(t)}}const S=new e;S.bindToDOM(document.querySelector("#game-container"));const C=new class{constructor(t){this.storage=t}save(t){this.storage.setItem("state",JSON.stringify(t))}load(){try{return JSON.parse(this.storage.getItem("state"))}catch(t){throw new Error("Invalid state")}}}(localStorage);new y(S,C).init()}();