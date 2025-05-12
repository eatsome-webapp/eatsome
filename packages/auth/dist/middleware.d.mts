import { NextRequest, NextResponse } from 'next/server';

declare function updateSession(request: NextRequest): Promise<NextResponse<unknown>>;
declare function createMiddleware(config?: {
    publicRoutes?: string[];
    authRoutes?: string[];
    defaultRedirectPath?: string;
    loginRedirectPath?: string;
}): (request: NextRequest) => Promise<NextResponse<unknown>>;

export { createMiddleware, updateSession };
