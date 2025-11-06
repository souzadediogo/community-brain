import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { config } from '../config';

class HTTPClient {
  private client: AxiosInstance;

  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async get<T>(path: string, authToken?: string): Promise<T> {
    const response = await this.client.get<T>(path, {
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
    });
    return response.data;
  }

  async post<T>(path: string, data: any, authToken?: string): Promise<T> {
    const response = await this.client.post<T>(path, data, {
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
    });
    return response.data;
  }

  async patch<T>(path: string, data: any, authToken?: string): Promise<T> {
    const response = await this.client.patch<T>(path, data, {
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
    });
    return response.data;
  }

  async delete<T>(path: string, authToken?: string): Promise<T> {
    const response = await this.client.delete<T>(path, {
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
    });
    return response.data;
  }
}

export const communityClient = new HTTPClient(config.services.community);
export const assistantClient = new HTTPClient(config.services.assistant);
