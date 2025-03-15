export class ApiError extends Error {
  status: number;
  data?: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }

  static fromResponse(response: Response, data?: { message?: string } | unknown): ApiError {
    const message = (data as { message?: string })?.message || response.statusText || 'API Error';
    return new ApiError(message, response.status, data);
  }

  get isUnauthorized() {
    return this.status === 401;
  }

  get isForbidden() {
    return this.status === 403;
  }

  get isNotFound() {
    return this.status === 404;
  }

  get isServerError() {
    return this.status >= 500;
  }
}

export async function handleApiResponse(response: Response) {
  const data = await response.json().catch(() => ({}));
  
  if (!response.ok) {
    throw ApiError.fromResponse(response, data);
  }
  
  return data;
}