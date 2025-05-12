"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }// src/server/index.ts
var _ssr = require('@supabase/ssr');
var _headers = require('next/headers');
async function createServerComponentClient() {
  const cookieStore = await _headers.cookies.call(void 0, );
  return _ssr.createServerClient.call(void 0, 
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        async get(name) {
          const cookie = await cookieStore.get(name);
          return _optionalChain([cookie, 'optionalAccess', _ => _.value]);
        },
        async set(name, value, options) {
          try {
            await cookieStore.set({ name, value, ...options });
          } catch (error) {
          }
        },
        async remove(name, options) {
          try {
            await cookieStore.set({ name, value: "", ...options, maxAge: 0 });
          } catch (error) {
          }
        }
      }
    }
  );
}
async function getUser() {
  try {
    const supabase = await createServerComponentClient();
    const { data, error } = await supabase.auth.getUser();
    if (error || !_optionalChain([data, 'optionalAccess', _2 => _2.user])) {
      return {
        user: null,
        error: error || new Error("User not found")
      };
    }
    return { user: data.user };
  } catch (error) {
    console.error("Error in getUser:", error);
    return { user: null, error };
  }
}
async function getSession() {
  try {
    const supabase = await createServerComponentClient();
    const { data, error } = await supabase.auth.getSession();
    if (error || !_optionalChain([data, 'optionalAccess', _3 => _3.session])) {
      return {
        session: null,
        error: error || new Error("Session not found")
      };
    }
    return { session: data.session };
  } catch (error) {
    console.error("Error in getSession:", error);
    return { session: null, error };
  }
}
async function hasRestaurantAccess(restaurantId) {
  if (!restaurantId) return false;
  const { user } = await getUser();
  if (!user) return false;
  const supabase = await createServerComponentClient();
  const { data, error } = await supabase.rpc("check_restaurant_membership", {
    p_user_id: user.id,
    p_restaurant_id: restaurantId
  });
  if (error) {
    console.error("Error checking restaurant access:", error);
    return false;
  }
  return !!data;
}
var getUserRestaurants = async () => {
  const supabase = await createServerComponentClient();
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { restaurants: [] };
    }
    const { data, error } = await supabase.rpc("get_user_restaurants_data", {
      p_user_id: user.id
    });
    if (error) {
      throw error;
    }
    if (!data || data.length === 0) {
      return {
        restaurants: [
          {
            id: "mock-id",
            name: "Test Restaurant",
            address: "Teststraat 123, Amsterdam",
            owner_id: user.id,
            created_at: (/* @__PURE__ */ new Date()).toISOString(),
            updated_at: (/* @__PURE__ */ new Date()).toISOString(),
            status: "active",
            cuisine: "italian"
          }
        ]
      };
    }
    return { restaurants: data };
  } catch (error) {
    console.error("Error fetching user restaurants:", error);
    return { restaurants: [] };
  }
};
async function getUserRestaurantsById(userId) {
  const supabase = await createServerComponentClient();
  try {
    const { data, error } = await supabase.rpc("get_user_restaurants_by_id", {
      p_user_id: userId
    });
    if (error) {
      console.error("Error getting user restaurants:", error);
      return [];
    }
    return data || [];
  } catch (error) {
    console.error("Error in getUserRestaurants:", error);
    return [];
  }
}








exports.createServerComponentClient = createServerComponentClient; exports.getUser = getUser; exports.getSession = getSession; exports.hasRestaurantAccess = hasRestaurantAccess; exports.getUserRestaurants = getUserRestaurants; exports.getUserRestaurantsById = getUserRestaurantsById;
//# sourceMappingURL=chunk-IQP4GR6D.js.map