import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Prepare the response we'll return
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })
  
  // Initialize Supabase client with new SSR approach
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return request.cookies.get(name)?.value
        },
        set(name, value, options) {
          // Set cookie on request for the current execution
          request.cookies.set({
            name,
            value,
            ...options,
          })
          
          // Set cookie on response for the browser
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name, options) {
          // Remove cookie from request for the current execution
          request.cookies.set({
            name,
            value: '',
            ...options,
            maxAge: 0,
          })
          
          // Remove cookie from response for the browser
          response.cookies.set({
            name,
            value: '',
            ...options,
            maxAge: 0,
          })
        },
      },
    }
  )
  
  // Refresh the session
  await supabase.auth.getSession()
  
  // Get the current user - safer than getSession
  const { data: { user }, error } = await supabase.auth.getUser()
  
  // Get current URL and determine the path
  const url = new URL(request.url)
  const path = url.pathname
  
  // Determine if the path is a public route
  const isPublicRoute = 
    path === '/' || 
    path === '/auth/login' || 
    path === '/auth/register' || 
    path === '/auth/reset-password' || 
    path === '/auth/update-password' || 
    path === '/auth/confirm' || 
    path.startsWith('/api/public/')
  
  // User not logged in and private route
  if (!user && !isPublicRoute) {
    // Redirect to homepage instead of /auth/login
    return NextResponse.redirect(new URL('/', request.url))
  }
  
  // User is logged in, check if they have access to the restaurant app
  if (user && !isPublicRoute) {
    // Check global role in user_metadata first
    const userRole = user.user_metadata?.role || 'customer'
    
    // Check if it's an admin route
    const isAdminRoute = 
      path.includes('/settings') || 
      path.includes('/staff') || 
      path.includes('/analytics')
    
    // If it's an admin route, check role-specific access
    if (isAdminRoute) {
      try {
        // Extract restaurant ID from path - e.g. /restaurant/123/settings
        const matches = path.match(/\/restaurant\/([^\/]+)/)
        const restaurantId = matches ? matches[1] : null
        
        if (restaurantId) {
          // Check restaurant role
          const { data: memberData, error: memberError } = await supabase
            .from('restaurant_members')
            .select('role')
            .eq('restaurant_id', restaurantId)
            .eq('user_id', user.id)
            .single()
          
          // If there's no restaurant membership or an error
          if (memberError || !memberData) {
            return NextResponse.redirect(new URL('/auth/unauthorized', request.url))
          }
          
          // If there is a membership, check the role for admin routes
          if (isAdminRoute && !['owner', 'manager'].includes(memberData.role)) {
            return NextResponse.redirect(new URL(`/restaurant/${restaurantId}/dashboard`, request.url))
          }
        }
      } catch (error) {
        console.error('Error in restaurant middleware:', error)
        // When in doubt, redirect to homepage
        return NextResponse.redirect(new URL('/', request.url))
      }
    }
  }
  
  // All good? Continue
  return response
}

// Define which paths the middleware should run on
export const config = {
  matcher: [
    // All paths except static files, images, etc.
    '/((?!_next/static|_next/image|favicon.ico|logo.png|.*\\.svg$).*)',
  ],
} 