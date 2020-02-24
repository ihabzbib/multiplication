let current;
let content;
const int = [1,2,3,4,5,6,7,8,9];
const imageMax = 10;
const results = {};
let shuffled = true;
let allCorrect = false;
let popup;
let image;
let randoms = [];

const createRow = (n, m) => (
    `<div class="row">
            <input class="box factor1" value=${n} readonly/>
            X
            <input class="box factor2" value=${m} readonly/>
            =
            <input class="box result" name="X" maxlength="3" size="2" min="1" max="100" type="text" onkeyup="enforceMinMax(this)"/>
            <input class="verifyBtn result" type="button" value="Verify" onclick="verify(eval(this.parentElement))"/>
            <div class="notify hide"></div>
        </div>`
);

const enforceMinMax = el => {
    if(el.value != ""){
      if(parseInt(el.value) < parseInt(el.min)){
        el.value = el.min;
      }
      if(parseInt(el.value) > parseInt(el.max)){
        el.value = el.value.slice(0, el.size);
      }
    }
  }

const verifyAll = e => {
    const rows = content.getElementsByClassName('row');
    Array.from(rows).forEach(verify);
}

const verify = row => {
    const factor1 = row.getElementsByClassName('factor1')[0].value;
    const factor2 = row.getElementsByClassName('factor2')[0].value;
    const input = row.getElementsByClassName('result')[0].value;
    const notify = row.getElementsByClassName('notify')[0];

    const result = Number(input) === Number(factor1*factor2);

    notify.innerHTML = result ? 'Correct! &#x2713;' : 'Ooops!!!<br/>Anwser = ' + factor1*factor2;
    notify.className = result ? 'notify correct' : 'notify wrong';
    notify.setAttribute('correct', result);
    checkAll();
}

const shuffle = arr => arr.slice().sort((a, b) =>  0.5 - Math.random());

const checkAll = () => {
    const rows = content.getElementsByClassName('row');
    allCorrect = true;
    Array.from(rows).forEach((row, i) => {
        const notify = row.getElementsByClassName('notify')[0];
        allCorrect = allCorrect && notify.getAttribute('correct') === 'true';
    });

    if (allCorrect) {
        let random;
        while(!random) {
            random  = Math.floor(Math.random() * Math.floor(imageMax)) + 1;
            if (randoms.includes(random) && randoms.length < imageMax) {
                random = false;
            }
        }
        randoms.push(random);
        image.src =`./images/celebration${random}.gif`;
        popup.style.display = 'flex';
        allCorrect = false;
        initTable(current);
        document.documentElement.scrollTop = 0
        document.body.scrollTop = 0
    }
}

const initTable = value => {
    if(!Number.isInteger(parseInt(value))) {
        return;
    }
    current = value;
    content.innerHTML = '';
    content.innerHTML += (shuffled ? shuffle(int) : int).map(m => createRow(current, m)).join('');
}

const setShuffled = value => {
    shuffled = value;
    initTable(current);
}

document.addEventListener('DOMContentLoaded', (event) => {
    content = document.getElementById('content');
    popup = document.getElementById("popup");
    image = document.getElementById('celebrationImg')
    const multTbale = document.getElementById("multTable");
    const shuffle = document.getElementById("shuffle");
    const verifyBtn = document.getElementById("verifyBtn");
    const overlay = document.getElementById('overlay');
    overlay.addEventListener("click", e => popup.style.display = 'none');

    current = multTbale.value;
    initTable(current);
    shuffled = shuffle.checked;
    multTbale.addEventListener("keypress", e => initTable(e.key));
    shuffle.addEventListener("change", e => setShuffled(e.target.checked));
    verifyBtn.addEventListener("click", verifyAll);
  })


