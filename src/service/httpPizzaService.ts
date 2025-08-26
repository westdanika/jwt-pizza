import { PizzaService, Franchise, FranchiseList, Store, OrderHistory, User, Menu, Order, Endpoints, OrderResponse, JWTPayload } from './pizzaService';

const pizzaServiceUrl = import.meta.env.VITE_PIZZA_SERVICE_URL;
const pizzaFactoryUrl = import.meta.env.VITE_PIZZA_FACTORY_URL;

class HttpPizzaService implements PizzaService {
  async callEndpoint(path: string, method: string = 'GET', body?: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const options: any = {
          method: method,
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        };

        const authToken = localStorage.getItem('token');
        if (authToken) {
          options.headers['Authorization'] = `Bearer ${authToken}`;
        }

        if (body) {
          options.body = JSON.stringify(body);
        }

        if (!path.startsWith('http')) {
          path = pizzaServiceUrl + path;
        }

        const r = await fetch(path, options);
        const j = await r.json();
        if (r.ok) {
          resolve(j);
        } else {
          reject({ code: r.status, message: j.message });
        }
      } catch (e: any) {
        reject({ code: 500, message: e.message });
      }
    });
  }

  async login(email: string, password: string): Promise<User> {
    const { user, token } = await this.callEndpoint('/api/auth', 'PUT', { email, password });
    localStorage.setItem('token', token);
    return Promise.resolve(user);
  }

  async register(name: string, email: string, password: string): Promise<User> {
    const { user, token } = await this.callEndpoint('/api/auth', 'POST', { name, email, password });
    localStorage.setItem('token', token);
    return Promise.resolve(user);
  }

  logout(): void {
    this.callEndpoint('/api/auth', 'DELETE');
    localStorage.removeItem('token');
  }

  async getUser(): Promise<User | null> {
    let result: User | null = null;
    if (localStorage.getItem('token')) {
      try {
        result = await this.callEndpoint('/api/user/me');
      } catch (e) {
        localStorage.removeItem('token');
      }
    }
    return Promise.resolve(result);
  }

  async getMenu(): Promise<Menu> {
    return this.callEndpoint('/api/order/menu');
  }

  async getOrders(user: User): Promise<OrderHistory> {
    return this.callEndpoint('/api/order');
  }

  async order(order: Order): Promise<OrderResponse> {
    return this.callEndpoint('/api/order', 'POST', order);
  }

  async verifyOrder(jwt: string): Promise<JWTPayload> {
    return this.callEndpoint(pizzaFactoryUrl + '/api/order/verify', 'POST', { jwt });
  }

  async getFranchise(user: User): Promise<Franchise[]> {
    return this.callEndpoint(`/api/franchise/${user.id}`);
  }

  async createFranchise(franchise: Franchise): Promise<Franchise> {
    return this.callEndpoint('/api/franchise', 'POST', franchise);
  }

  async getFranchises(page: number = 0, limit: number = 10, nameFilter: string = '*'): Promise<FranchiseList> {
    return this.callEndpoint(`/api/franchise?page=${page}&limit=${limit}&name=${nameFilter}`);
  }

  async closeFranchise(franchise: Franchise): Promise<void> {
    return this.callEndpoint(`/api/franchise/${franchise.id}`, 'DELETE');
  }

  async createStore(franchise: Franchise, store: Store): Promise<Store> {
    return this.callEndpoint(`/api/franchise/${franchise.id}/store`, 'POST', store);
  }

  async closeStore(franchise: Franchise, store: Store): Promise<null> {
    return this.callEndpoint(`/api/franchise/${franchise.id}/store/${store.id}`, 'DELETE');
  }

  async docs(docType: string): Promise<Endpoints> {
    if (docType === 'factory') {
      return this.callEndpoint(pizzaFactoryUrl + `/api/docs`);
    }
    return this.callEndpoint(`/api/docs`);
  }
}

const httpPizzaService = new HttpPizzaService();
export default httpPizzaService;
