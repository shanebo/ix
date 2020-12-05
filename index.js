import morph from 'nanomorph';


const uid = () => Math.random().toString(36).substr(2, 9);
const components = {};
const instances = {};

export function register(name, options) {
  components[name] = (el) => {
    options.el = el;
    component(options).render();
  }
}

export function component({ el, data, template, methods }) {
  el = typeof el === 'string'
    ? document.querySelector(el)
    : el;

  let renderTimeout = 0;
  const id = uid();

  el.dataset.ixComponentId = id;

  data = { ...data };
  data = new Proxy(data, {
    set: function(obj, prop, value) {
      obj[prop] = value;
      clearTimeout(renderTimeout);
      renderTimeout = setTimeout(render, 1);
      return true;
    },
    deleteProperty: function (obj, prop) {
      if (prop in obj) {
        return false;
      }
      return obj.removeItem(prop);
    }
  });

  const templateFn = typeof template === 'function';
  function render() {
    const str = templateFn ? template(data) : template;
    const klone = el.cloneNode();
    klone.innerHTML = str;
    morph(el, klone);
  }

  instances[id] = {
    el,
    data,
    template,
    methods,
    render
  };

  return instances[id];
}

function init() {
  [...document.querySelectorAll('[data-ix-component]')].forEach(el => {
    const { ixComponent } = el.dataset;
    components[ixComponent](el);
  });
}

function clickDirective(e) {
  const { ixClick } = e.target.dataset;

  if (ixClick) {
    const { ixComponentId } = e.target.closest('[data-ix-component-id]').dataset;
    const comp = instances[ixComponentId];
    comp.methods[ixClick].call(comp, e);
  }
}

document.addEventListener('DOMContentLoaded', init);
document.addEventListener('click', clickDirective);
