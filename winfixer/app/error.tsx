'use client';

import React from 'react';

const ErrorPage = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-4xl font-bold text-red-600">Ocorreu um erro!</h1>
            <p className="mt-4 text-lg">Desculpe, algo deu errado. Por favor, tente novamente mais tarde.</p>
        </div>
    );
};

export default ErrorPage;