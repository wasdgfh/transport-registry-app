import { makeAutoObservable } from 'mobx';
import axios from 'axios'; 
import { jwtDecode } from 'jwt-decode';
import http from '../http';

export default class UserStore { 
  constructor() {
    this._isAuth = false;
    this._user = {};
    makeAutoObservable(this);
  }

  setIsAuth(bool) {
    this._isAuth = bool;
  }

  setUser(user) {
    this._user = user;
  }

  get isAuth() {
    return this._isAuth;
  }

  get user() {
    return this._user;
  }

  async login(email, password) {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      this.setIsAuth(true);
      this.setUser(jwtDecode(response.data.token));
      return { success: true };
    } catch (e) {
      console.error(e);
      return { success: false, message: e.response?.data?.message };
    }
  }

  async checkAuth() {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      const response = await http.get('/auth/check');      
      localStorage.setItem('token', response.data.token);
      this.setIsAuth(true);
      this.setUser(response.data.user);
    } catch (e) {
      localStorage.removeItem('token');
      console.error(e);
    }
  }

  logout() {
    localStorage.removeItem('token');
    this.setIsAuth(false);
    this.setUser({});
  }
}