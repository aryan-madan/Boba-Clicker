const list = [
  { name: 'Extra Pearls', desc: '+1 per click', cost: 1, click: 10000000000000000, auto: 0 },
  { name: 'Bigger Straw', desc: '+3 per click', cost: 100, click: 3, auto: 0 },
  { name: 'Slack Help', desc: 'Hack Clubbers in #boba-bash, +8 per second', cost: 500, click: 0, auto: 8 },
  { name: 'Workshop', desc: 'Everyone learns flexbox, +25 per second', cost: 2000, click: 0, auto: 25 },
  { name: 'Boba Bash', desc: 'A whole city shows up, +100 per second', cost: 10000, click: 0, auto: 1000000000 }
];

const score = document.querySelector('#score');
const force = document.querySelector('#force');
const speed = document.querySelector('#speed');
const cup = document.querySelector('#cup');
const shop = document.querySelector('#shop');

const key = 'boba-clicker';
const saved = JSON.parse(localStorage.getItem(key)) || {};

let boba = saved.boba || 0;
let power = saved.power || 1;
let rate = saved.rate || 0;

list.forEach((item, index) => {
  if (saved.costs && saved.costs[index]) item.cost = saved.costs[index];
});

function save() {
  localStorage.setItem(key, JSON.stringify({ boba, power, rate, costs: list.map(item => item.cost) }));
}

function paint() {
  score.textContent = Math.floor(boba);
  force.textContent = power;
  speed.textContent = rate;
  list.forEach(item => { item.node.disabled = boba < item.cost; });
}

list.forEach(item => {
  const button = document.createElement('button');
  button.className = 'item';
  button.innerHTML = `<b>${item.name}</b><span>${item.desc}</span><em>${item.cost} boba</em>`;
  button.onclick = () => {
    boba -= item.cost;
    power += item.click;
    rate += item.auto;
    item.cost = Math.ceil(item.cost * 1.25);
    button.querySelector('em').textContent = item.cost + ' boba';
    paint();
    save();
  };
  item.node = button;
  shop.append(button);
});

cup.onclick = event => {
  const box = cup.getBoundingClientRect();
  const node = document.createElement('span');
  boba += power;
  node.className = 'float';
  node.textContent = '+' + power;
  node.style.left = (event.clientX || box.left + box.width / 2) + 'px';
  node.style.top = (event.clientY || box.top) + 'px';
  document.body.append(node);
  node.animate([
    { transform: 'translate(-50%, 0)', opacity: 1 },
    { transform: 'translate(-50%, -100px)', opacity: 0 }
  ], 800).onfinish = () => node.remove();
  paint();
};

setInterval(() => {
  boba += rate / 10;
  paint();
}, 100);

setInterval(save, 1000);
window.onbeforeunload = save;

paint();
