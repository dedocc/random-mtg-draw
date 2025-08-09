class PickScreen extends HTMLElement {
    static get observedAttributes() {
        return ['status'];
    }
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.innerHTML = `
            <style>
                screen {
                    position: fixed;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 10;
                    background-color: rgba(0,0,0,0.5);
                    backdrop-filter: blur(10px);
                }
                #postfetch {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    height: 100%;
                    align-items: center;
                    justify-content: center;
                    margin: 0px 15px;
                }
                #cards_wrapper {
                    display: flex;
                    height: fit-content;
                    max-height: 90%;
                    flex-direction: column;
                    gap: 20px;
                    align-items: center;
                    padding: 15px;
                    overflow: scroll;
                }
                #cards_wrapper img {
                    width: 300px;
                    border-radius:20px;
                }
                #cards_wrapper img.selected {
                    border: 4px solid #f0f;
                    margin: -4px;
                }
                .actions {
                    margin: 15px;
                    display: flex;
                    gap: 15px;
                }
                button {
                    all: unset;
                    box-sizing: border-box;
                    padding: 10px 15px;
                    background: radial-gradient(ellipse farthest-corner at right bottom, #FEDB37 0%, #FDB931 8%, #9f7928 30%, #8A6E2F 40%, transparent 80%),
                                radial-gradient(ellipse farthest-corner at left top, #FFFFFF 0%, #FFFFAC 8%, #D1B464 25%, #5d4a1f 62.5%, #5d4a1f 100%);
                    border: 5px groove #fff;
                    border-radius: 5px;
                }
                .error {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    color: #fff;
                    font-size: 36px;
                }

                .loader {
                  width: 50px;
                  aspect-ratio: 1;
                  border-radius: 50%;
                  border: 8px solid #fff;
                  animation:
                    l20-1 0.8s infinite linear alternate,
                    l20-2 1.6s infinite linear;
                }
                @keyframes l20-1{
                   0%    {clip-path: polygon(50% 50%,0       0,  50%   0%,  50%    0%, 50%    0%, 50%    0%, 50%    0% )}
                   12.5% {clip-path: polygon(50% 50%,0       0,  50%   0%,  100%   0%, 100%   0%, 100%   0%, 100%   0% )}
                   25%   {clip-path: polygon(50% 50%,0       0,  50%   0%,  100%   0%, 100% 100%, 100% 100%, 100% 100% )}
                   50%   {clip-path: polygon(50% 50%,0       0,  50%   0%,  100%   0%, 100% 100%, 50%  100%, 0%   100% )}
                   62.5% {clip-path: polygon(50% 50%,100%    0, 100%   0%,  100%   0%, 100% 100%, 50%  100%, 0%   100% )}
                   75%   {clip-path: polygon(50% 50%,100% 100%, 100% 100%,  100% 100%, 100% 100%, 50%  100%, 0%   100% )}
                   100%  {clip-path: polygon(50% 50%,50%  100%,  50% 100%,   50% 100%,  50% 100%, 50%  100%, 0%   100% )}
                }
                @keyframes l20-2{ 
                  0%    {transform:scaleY(1)  rotate(0deg)}
                  49.99%{transform:scaleY(1)  rotate(135deg)}
                  50%   {transform:scaleY(-1) rotate(0deg)}
                  100%  {transform:scaleY(-1) rotate(-135deg)}
                }
            </style>
            
            <screen>
            </screen>
        `;
        this.screen = this.shadowRoot.querySelector("screen");
        this.loader = document.createElement("div");
        this.loader.setAttribute("class", "loader");
        
        this.postfetch = document.createElement("div");
        this.postfetch.setAttribute("id", "postfetch");
        this.postfetch.innerHTML = `
                    <div id="cards_wrapper"></div>
                    <div class="actions">
                        <button id="printbtn">
                            <img src="src/img/printer.svg">
                        </button>
                        <button id="closebtn">
                            <img src="src/img/xmark.svg">
                        </button>
                    </div>
        `
        this.wrapper = this.postfetch.querySelector("#cards_wrapper");
        this.printbtn = this.postfetch.querySelector("#printbtn");
        this.postfetch.querySelector("#closebtn").onclick = () => {
            this.remove();
        };

        this.errorscreen = document.createElement("div");
        this.errorscreen.setAttribute("class", "error");
        this.errorscreen.innerHTML = `
            <p>ERROR FETCHING CARDS</p>
            <button id="retrybtn">retry</button>
        `
        this.errorscreen.querySelector("#retrybtn").onclick = () => {
            this.remove();
            window.drawCards();
        }
    }

    connectedCallback() {
        this.screen.appendChild(this.loader); 
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "status") {
            switch (newValue) {
                case "fetched":
                    this.loader.remove();
                    this.screen.appendChild(this.postfetch);
                    break;
                case "error":
                    this.loader.remove();
                    this.screen.appendChild(this.errorscreen);
                    break;
            }
        }
    }
}

customElements.define("pick-screen", PickScreen);
