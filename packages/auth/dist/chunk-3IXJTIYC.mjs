var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/utils/roles.ts
var ROLES = {
  CUSTOMER: "customer",
  COURIER: "courier",
  RESTAURANT_STAFF: "restaurant_staff",
  RESTAURANT_ADMIN: "restaurant_admin",
  PLATFORM_ADMIN: "platform_admin"
};
var ROLE_HIERARCHY = {
  customer: ["customer"],
  courier: ["courier"],
  restaurant_staff: ["restaurant_staff"],
  restaurant_admin: ["restaurant_staff", "restaurant_admin"],
  platform_admin: ["restaurant_staff", "restaurant_admin", "platform_admin"]
};
function hasRequiredRole(userRole, requiredRole) {
  return ROLE_HIERARCHY[userRole].includes(requiredRole);
}
var APP_ACCESS = {
  restaurant: ["restaurant_staff", "restaurant_admin", "platform_admin"],
  customer: ["customer", "platform_admin"],
  courier: ["courier", "platform_admin"],
  admin: ["platform_admin"]
};
function hasAppAccess(appName, userRole) {
  var _a;
  if (!userRole) return false;
  return ((_a = APP_ACCESS[appName]) == null ? void 0 : _a.some((role) => hasRequiredRole(userRole, role))) || false;
}

export {
  __spreadValues,
  __spreadProps,
  __async,
  ROLES,
  ROLE_HIERARCHY,
  hasRequiredRole,
  APP_ACCESS,
  hasAppAccess
};
