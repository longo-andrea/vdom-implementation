import createElement from './vdom/createElement';
import render from './vdom/render';
import mount from './vdom/mount';
import diff from './vdom/diff';

const createVApp = (count) =>
  createElement("div", {
    attrs: {
      id: "app",
      datacount: count,
    },
    children: [
      createElement("p", {
        children: ["The current count is: ", String(count)],
      }),
      createElement("img", {
        attrs: {
          src: "https://via.placeholder.com/150",
          alt: "placeholder image",
        },
      }),
    ],
  });

let count = 0;
let vApp = createVApp(count);
const $app = render(vApp);
let $rootEl = mount($app, document.getElementById("app"));

setInterval(() => {
  const vNewApp = createVApp(Math.random() * 10);
  const patch = diff(vApp, vNewApp);

  $rootEl = patch($rootEl);
  vApp = vNewApp;
}, 1000);