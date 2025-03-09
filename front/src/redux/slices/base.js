const baseUrl = 'http://localhost:4444';

export const createUrl = (path) => new URL(path, baseUrl);

export const getToken = () => window.localStorage.getItem('token');