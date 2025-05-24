/* eslint-disable @typescript-eslint/no-explicit-any */

export interface ApiError {
    message: string;
    code?: string;
    status?: number;
}

export const getErrorMessage = (error: any): string => {
    if (error?.response?.data?.message) {
        return error.response.data.message;
    }

    if (error?.message) {
        return error.message;
    }

    return "Ocorreu um erro inesperado. Tente novamente.";
};

export const isNetworkError = (error: any): boolean => {
    return !error?.response && error?.request;
};

export const isValidationError = (error: any): boolean => {
    return error?.response?.status === 400;
};

export const isAuthError = (error: any): boolean => {
    return error?.response?.status === 401;
};

export const isForbiddenError = (error: any): boolean => {
    return error?.response?.status === 403;
};

export const isNotFoundError = (error: any): boolean => {
    return error?.response?.status === 404;
};

export const isServerError = (error: any): boolean => {
    return error?.response?.status >= 500;
};

export const handleApiError = (error: any): ApiError => {
    const message = getErrorMessage(error);
    const status = error?.response?.status;
    const code = error?.response?.data?.code;

    return {
        message,
        status,
        code,
    };
};