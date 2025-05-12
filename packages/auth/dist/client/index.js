"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }"use client";

// src/client/index.ts
var _ssr = require('@supabase/ssr');
var _react = require('react');
function AuthProvider({ children }) {
  return children;
}
function useAuth() {
  const [user, setUser] = _react.useState.call(void 0, null);
  const [session, setSession] = _react.useState.call(void 0, null);
  const [isLoading, setIsLoading] = _react.useState.call(void 0, true);
  const supabase = createClient();
  _react.useEffect.call(void 0, () => {
    const getSession2 = async () => {
      setIsLoading(true);
      const { data: { session: sessionData } } = await supabase.auth.getSession();
      if (sessionData) {
        const { data: { user: userData } } = await supabase.auth.getUser();
        setUser(userData);
        setSession(sessionData);
      }
      setIsLoading(false);
    };
    getSession2();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
        setUser(_optionalChain([newSession, 'optionalAccess', _ => _.user]) || null);
      }
    );
    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);
  const signIn = async ({ email, password }) => {
    return await supabase.auth.signInWithPassword({
      email,
      password
    });
  };
  const signUp = async ({ email, password }) => {
    return await supabase.auth.signUp({
      email,
      password
    });
  };
  const signOut = async () => {
    return await supabase.auth.signOut();
  };
  const getSession = async () => {
    const { data: { session: sessionData } } = await supabase.auth.getSession();
    return sessionData;
  };
  return {
    user,
    session,
    supabase,
    isLoading,
    signIn,
    signUp,
    signOut,
    getSession
  };
}
function createClient() {
  return _ssr.createBrowserClient.call(void 0, 
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}




exports.AuthProvider = AuthProvider; exports.createClient = createClient; exports.useAuth = useAuth;
//# sourceMappingURL=index.js.map