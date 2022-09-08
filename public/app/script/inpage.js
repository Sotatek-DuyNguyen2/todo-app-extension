class Listener {
  constructor(name, handler) {
    this.name = name;
    this.handler = handler;
  }

  send(payload) {
    window.postMessage({ action: this.name, ...payload });
  }

  on(responseName) {
    return new Promise((resolve, reject) => {
      window.addEventListener('message', (event) => {
        if (event.data.action === responseName) {
          if (this.handler) {
            this.handler(event.data);
          }

          if (event.data.error) {
            return reject(event.data.error);
          }

          return resolve(event.data);
        }
      });
    });
  }
}

/**
 * Kadena instance
 *
 * Methods:
 * on: params(name: String, callback: Function)
 *
 * request: params(options: Object)
 */
window.kadena = {
  isKadena: true,

  on: async (name, callback) => {
    let listener = new Listener(name, (response) => {
      if (response.action === 'res_requestAccount' && response.target === 'kda.dapps') {
        const domain = window.location.hostname || window.window.location.href;
        if (response.account && response.account.connectedSites && response.account.connectedSites.includes(domain)) {
          callback(response);
        } else {
          callback({});
        }
      } else {
        callback(response);
      }
    });
    return await listener.on(name);
  },

  request: async (options) => {
   
    const { method,  } = options;

    switch (method) {
      case 'test_connect': 
        return testConnect();

      default:
        break;
    }
  },
};

const testConnect = async () => {
  const listener = new Listener('test_connect');
  listener.send({
    target: 'kda.content',
    action: listener.name,
  });
}

