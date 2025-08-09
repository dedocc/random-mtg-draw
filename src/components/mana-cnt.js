class ManaCnt extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.innerHTML = `
            <style>
                mana {
                    display: flex;
                    width: 100px;
                    height: 100px;
                }
                .wrapper {
                    width: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 5px;
                }
                .rect {
                    all: unset;
                    margin-top:90px;
                    padding: 10px;
                    border-radius: 5px;
                    color: #ffffff;
                    font-weight: bold;
                    background-color: rgba(0,0,0,0.7);
                    backdrop-filter: blur(10px);
                }
            </style>
            
            <mana>
                <div class="wrapper">
                    <button id="minus" class="rect">-</button>
                    <div class="rect">
                        <label id="counter">0</label>
                    </div>
                    <button id="plus" class="rect">+</button>
                </div>
            </mana>
        `;

        this.shadowRoot.getElementById("minus").addEventListener("click", () => this.decreaseMana());
        this.shadowRoot.getElementById("plus").addEventListener("click", () => this.increaseMana());
        this.cnt = this.shadowRoot.getElementById("counter");
    }

    connectedCallback() {
        this.shadowRoot.querySelector("mana").setAttribute("style", `background-image: url(${this.getAttribute('icon')})`)
    }
    decreaseMana() {
        if (this.cnt.textContent > 0) {
            this.cnt.textContent--;
        }
    }
    increaseMana() {
        this.cnt.textContent++;
    }
}

customElements.define("mana-cnt", ManaCnt);
